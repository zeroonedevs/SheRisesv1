import express from 'express';
import { authenticate } from '../middleware/auth.js';
import ForumPost from '../models/ForumPost.js';

const router = express.Router();

// @route   GET /api/forum/posts
// @desc    Get all forum posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    
    const filter = { isDeleted: false };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    if (sort === 'popular') sortOption = { likeCount: -1, commentCount: -1 };
    else if (sort === 'recent') sortOption = { createdAt: -1 };
    else sortOption = { createdAt: -1 };

    const posts = await ForumPost.find(filter)
      .populate('author', 'name avatar location')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar')
      .sort(sortOption)
      .limit(100);

    res.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error('Get forum posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forum posts'
    });
  }
});

// @route   GET /api/forum/posts/:id
// @desc    Get single forum post
// @access  Public
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name avatar location')
      .populate('likes', 'name avatar')
      .populate('comments.user', 'name avatar');

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get forum post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forum post'
    });
  }
});

// @route   POST /api/forum/posts
// @desc    Create new forum post
// @access  Private
router.post('/posts', authenticate, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const post = await ForumPost.create({
      title,
      content,
      category: category || 'General',
      author: req.user.id,
      authorName: req.user.name,
      authorAvatar: req.user.avatar,
      location: req.user.location
    });

    const populatedPost = await ForumPost.findById(post._id)
      .populate('author', 'name avatar location');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    console.error('Create forum post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post'
    });
  }
});

// @route   POST /api/forum/posts/:id/like
// @desc    Like/unlike a forum post
// @access  Private
router.post('/posts/:id/like', authenticate, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    post.likeCount = post.likes.length;
    await post.save();

    res.json({
      success: true,
      liked: likeIndex === -1,
      likeCount: post.likeCount
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like post'
    });
  }
});

// @route   POST /api/forum/posts/:id/replies
// @desc    Add reply/comment to forum post
// @access  Private
router.post('/posts/:id/replies', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.comments.push({
      user: req.user.id,
      userName: req.user.name,
      userAvatar: req.user.avatar,
      content
    });

    post.commentCount = post.comments.length;
    await post.save();

    const updatedPost = await ForumPost.findById(post._id)
      .populate('comments.user', 'name avatar');

    res.json({
      success: true,
      message: 'Reply added successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add reply'
    });
  }
});

export default router;

