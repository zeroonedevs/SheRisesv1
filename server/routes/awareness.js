import express from 'express';

const router = express.Router();

// Placeholder routes for awareness content
// In production, you'd create an Article model

// @route   GET /api/awareness/articles
// @desc    Get awareness articles
// @access  Public
router.get('/articles', async (req, res) => {
  try {
    // Placeholder - implement with Article model
    res.json({
      success: true,
      articles: [],
      message: 'Awareness articles to be implemented'
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch articles'
    });
  }
});

// @route   GET /api/awareness/helplines
// @desc    Get helpline information
// @access  Public
router.get('/helplines', async (req, res) => {
  try {
    const helplines = [
      {
        name: 'Women Helpline',
        number: '1091',
        description: '24/7 helpline for women in distress'
      },
      {
        name: 'National Commission for Women',
        number: '011-26942369',
        description: 'Complaint and support services'
      }
    ];

    res.json({
      success: true,
      helplines
    });
  } catch (error) {
    console.error('Get helplines error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch helplines'
    });
  }
});

// @route   GET /api/awareness/schemes
// @desc    Get government schemes
// @access  Public
router.get('/schemes', async (req, res) => {
  try {
    const schemes = [
      {
        name: 'Pradhan Mantri Mudra Yojana',
        description: 'Microfinance scheme for women entrepreneurs'
      },
      {
        name: 'Stand Up India',
        description: 'Bank loan scheme for SC/ST and women entrepreneurs'
      }
    ];

    res.json({
      success: true,
      schemes
    });
  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schemes'
    });
  }
});

export default router;

