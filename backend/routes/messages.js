import express from 'express';
import { body, validationResult } from 'express-validator';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get all conversations for the user
// @access  Private
router.get('/conversations', authenticate, async (req, res) => {
  try {
    // Get all unique conversation IDs for this user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { recipient: req.user._id }
          ],
          isDeleted: false
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ['$recipient', req.user._id] },
                  { $eq: ['$isRead', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Populate sender and recipient info
    for (let conv of conversations) {
      const otherUserId = conv.lastMessage.sender.toString() === req.user.id 
        ? conv.lastMessage.recipient 
        : conv.lastMessage.sender;
      
      const otherUser = await User.findById(otherUserId).select('name email avatar');
      conv.otherUser = otherUser;
    }

    res.json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

// @route   GET /api/messages/conversation/:userId
// @desc    Get messages with a specific user
// @access  Private
router.get('/conversation/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Generate conversation ID
    const participants = [req.user.id, userId].sort();
    const conversationId = participants.join('_');

    const messages = await Message.find({
      conversationId,
      isDeleted: false,
      $or: [
        { sender: req.user._id, deletedBy: { $ne: { user: req.user._id } } },
        { recipient: req.user._id, deletedBy: { $ne: { user: req.user._id } } }
      ]
    })
      .populate('sender', 'name email avatar')
      .populate('recipient', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        recipient: req.user._id,
        isRead: false
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );

    res.json({
      success: true,
      count: messages.length,
      messages: messages.reverse(), // Reverse to show oldest first
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation'
    });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', authenticate, [
  body('recipientId').notEmpty().withMessage('Recipient ID is required'),
  body('content').notEmpty().withMessage('Message content is required').trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { recipientId, content, type = 'text', attachments = [] } = req.body;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Don't allow sending message to self
    if (recipientId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message to yourself'
      });
    }

    // Generate conversation ID
    const participants = [req.user.id, recipientId].sort();
    const conversationId = participants.join('_');

    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content,
      type,
      conversationId,
      attachments
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar')
      .populate('recipient', 'name email avatar');

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// @route   PATCH /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.patch('/:id/read', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only recipient can mark as read
    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read'
    });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message (soft delete)
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender or recipient can delete
    if (message.sender.toString() !== req.user.id && message.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Add to deletedBy array
    message.deletedBy.push({
      user: req.user.id,
      deletedAt: new Date()
    });

    // If both users deleted, mark as deleted
    if (message.deletedBy.length >= 2) {
      message.isDeleted = true;
    }

    await message.save();

    res.json({
      success: true,
      message: 'Message deleted'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

// @route   GET /api/messages/unread-count
// @desc    Get count of unread messages
// @access  Private
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      isRead: false,
      isDeleted: false
    });

    res.json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
});

export default router;
