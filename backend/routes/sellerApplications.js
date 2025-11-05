import express from 'express';
import { body, validationResult } from 'express-validator';
import SellerApplication from '../models/SellerApplication.js';
import User from '../models/User.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/seller-applications
// @desc    Submit seller application
// @access  Private
router.post('/', authenticate, [
  body('businessName').notEmpty().withMessage('Business name is required'),
  body('businessType').isIn(['handicrafts', 'textiles', 'food', 'jewelry', 'beauty', 'other']).withMessage('Invalid business type'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('pincode').notEmpty().withMessage('Pincode is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if user already has an application
    const existingApp = await SellerApplication.findOne({ user: req.user.id });
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You already have a seller application. Please wait for review.'
      });
    }

    // Check if user is already a seller
    if (req.user.role === 'seller') {
      return res.status(400).json({
        success: false,
        message: 'You are already a seller'
      });
    }

    const {
      businessName,
      businessType,
      address,
      city,
      state,
      pincode,
      gstNumber,
      bankAccount,
      ifscCode,
      description,
      documents
    } = req.body;

    const fullAddress = `${address}, ${city}, ${state} - ${pincode}`;

    const application = new SellerApplication({
      user: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      businessName,
      businessType,
      address: fullAddress,
      city,
      state,
      pincode,
      gstNumber,
      bankAccount,
      ifscCode,
      description,
      documents: documents || [],
      status: 'pending'
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: 'Seller application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
});

// @route   GET /api/seller-applications/my-application
// @desc    Get user's own application
// @access  Private
router.get('/my-application', authenticate, async (req, res) => {
  try {
    const application = await SellerApplication.findOne({ user: req.user.id })
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No application found'
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application'
    });
  }
});

// @route   GET /api/seller-applications
// @desc    Get all seller applications (Admin only)
// @access  Private (Admin)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const applications = await SellerApplication.find(filter)
      .populate('user', 'name email avatar')
      .populate('reviewedBy', 'name email')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
});

// @route   GET /api/seller-applications/:id
// @desc    Get single application
// @access  Private (Admin or Owner)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const application = await SellerApplication.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is admin or owner
    if (req.user.role !== 'admin' && application.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application'
    });
  }
});

// @route   PATCH /api/seller-applications/:id/approve
// @desc    Approve seller application (Admin only)
// @access  Private (Admin)
router.patch('/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const application = await SellerApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Application is already ${application.status}`
      });
    }

    // Update application status
    application.status = 'approved';
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();
    await application.save();

    // Update user role to seller
    await User.findByIdAndUpdate(application.user, {
      role: 'seller'
    });

    res.json({
      success: true,
      message: 'Application approved successfully',
      application
    });
  } catch (error) {
    console.error('Approve application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve application'
    });
  }
});

// @route   PATCH /api/seller-applications/:id/reject
// @desc    Reject seller application (Admin only)
// @access  Private (Admin)
router.patch('/:id/reject', authenticate, isAdmin, [
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const application = await SellerApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Application is already ${application.status}`
      });
    }

    // Update application status
    application.status = 'rejected';
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();
    application.rejectionReason = req.body.reason || 'Application rejected';
    await application.save();

    res.json({
      success: true,
      message: 'Application rejected',
      application
    });
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject application'
    });
  }
});

export default router;

