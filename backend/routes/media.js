import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Media from '../models/Media.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// @route   POST /api/media/upload
// @desc    Upload an image
// @access  Private
router.post('/upload', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { type, associatedId, associatedModel, alt, description } = req.body;

    // Validate type
    const validTypes = ['profile_image', 'product_image', 'course_image', 'document', 'other'];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid media type'
      });
    }

    // Create media record
    const media = new Media({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`, // Adjust based on your static file serving
      type: type || 'other',
      uploadedBy: req.user.id,
      associatedId: associatedId || null,
      associatedModel: associatedModel || null,
      metadata: {
        alt: alt || '',
        description: description || ''
      }
    });

    await media.save();

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      media
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
});

// @route   GET /api/media/profile/:userId
// @desc    Get user's profile images
// @access  Private
router.get('/profile/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    // Only allow users to see their own images or admins
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const images = await Media.find({
      type: 'profile_image',
      uploadedBy: userId,
      isActive: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Get profile images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile images'
    });
  }
});

// @route   GET /api/media/product/:productId
// @desc    Get product images
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const images = await Media.find({
      type: 'product_image',
      associatedId: req.params.productId,
      associatedModel: 'Product',
      isActive: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Get product images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product images'
    });
  }
});

// @route   GET /api/media/:id
// @desc    Get single media file
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    // Check access
    if (media.uploadedBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      media
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch media'
    });
  }
});

// @route   DELETE /api/media/:id
// @desc    Delete media file
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    // Only owner or admin can delete
    if (media.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Soft delete
    media.isActive = false;
    await media.save();

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete media'
    });
  }
});

export default router;

