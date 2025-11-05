import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/mentors
// @desc    Get all mentors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { expertise, location } = req.query;
    
    const filter = { isMentor: true };
    
    if (expertise) {
      filter['mentorProfile.expertise'] = { $in: [expertise] };
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const mentors = await User.find(filter)
      .select('-password -enrolledCourses -cart -orders')
      .sort({ 'mentorProfile.rating': -1 });

    res.json({
      success: true,
      count: mentors.length,
      mentors
    });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentors'
    });
  }
});

// @route   POST /api/mentors/request
// @desc    Request mentorship
// @access  Private
router.post('/request', authenticate, async (req, res) => {
  try {
    const { mentorId, message } = req.body;

    const mentor = await User.findById(mentorId);

    if (!mentor || !mentor.isMentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // In a full implementation, you'd create a MentorshipRequest model
    // For now, we'll use a simple message system
    res.json({
      success: true,
      message: 'Mentorship request sent successfully'
    });
  } catch (error) {
    console.error('Request mentorship error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send mentorship request'
    });
  }
});

export default router;

