import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, level } = req.query;
    
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (level) {
      filter.level = level;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructorId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'name avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already enrolled
    const existingEnrollment = user.enrolledCourses.find(
      e => e.courseId.toString() === course._id.toString()
    );

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add enrollment
    user.enrolledCourses.push({
      courseId: course._id,
      progress: 0,
      completedLessons: []
    });

    course.enrolledCount += 1;
    await course.save();
    await user.save();

    res.json({
      success: true,
      message: 'Enrolled successfully',
      enrollment: user.enrolledCourses[user.enrolledCourses.length - 1]
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course'
    });
  }
});

// @route   GET /api/courses/enrolled
// @desc    Get enrolled courses for user
// @access  Private
router.get('/enrolled', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses.courseId');

    res.json({
      success: true,
      courses: user.enrolledCourses
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrolled courses'
    });
  }
});

// @route   PUT /api/courses/:id/progress
// @desc    Update course progress
// @access  Private
router.put('/:id/progress', authenticate, async (req, res) => {
  try {
    const { lessonId, progress } = req.body;

    const user = await User.findById(req.user.id);
    const enrollment = user.enrolledCourses.find(
      e => e.courseId.toString() === req.params.id
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    if (progress !== undefined) {
      enrollment.progress = Math.min(100, Math.max(0, progress));
    }

    await user.save();

    res.json({
      success: true,
      message: 'Progress updated',
      enrollment
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress'
    });
  }
});

export default router;

