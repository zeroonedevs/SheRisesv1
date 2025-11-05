import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number, // Size in bytes
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['profile_image', 'product_image', 'course_image', 'document', 'other'],
    default: 'other'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  associatedId: {
    // For product images, this would be product ID
    // For profile images, this would be user ID
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'associatedModel'
  },
  associatedModel: {
    type: String,
    enum: ['User', 'Product', 'Course', 'SellerApplication', null],
    default: null
  },
  metadata: {
    width: Number,
    height: Number,
    alt: String,
    description: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
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

// Indexes for faster queries
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ type: 1 });
mediaSchema.index({ associatedId: 1, associatedModel: 1 });
mediaSchema.index({ createdAt: -1 });

const Media = mongoose.model('Media', mediaSchema);

export default Media;

