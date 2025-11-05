import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  conversationId: {
    // Group messages between two users together
    type: String,
    required: true,
    index: true
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file', 'document']
    },
    url: String,
    filename: String,
    size: Number
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    deletedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate conversation ID (always same for two users regardless of order)
messageSchema.pre('save', function(next) {
  if (!this.conversationId) {
    const participants = [this.sender.toString(), this.recipient.toString()].sort();
    this.conversationId = participants.join('_');
  }
  next();
});

// Indexes for faster queries
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });
messageSchema.index({ createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;

