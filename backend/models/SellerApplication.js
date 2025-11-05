import mongoose from 'mongoose';

const sellerApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One application per user
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    enum: ['handicrafts', 'textiles', 'food', 'jewelry', 'beauty', 'other'],
    default: 'other'
  },
  address: {
    type: String,
    required: [true, 'Business address is required'],
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  gstNumber: {
    type: String,
    trim: true
  },
  bankAccount: {
    type: String,
    trim: true
  },
  ifscCode: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Business description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  documents: [{
    type: {
      type: String,
      enum: ['id', 'address_proof', 'business_license', 'bank_statement', 'other']
    },
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  submittedAt: {
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

// Index for faster queries
sellerApplicationSchema.index({ user: 1 });
sellerApplicationSchema.index({ status: 1 });
sellerApplicationSchema.index({ submittedAt: -1 });

const SellerApplication = mongoose.model('SellerApplication', sellerApplicationSchema);

export default SellerApplication;

