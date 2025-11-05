import express from 'express';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('cart.productId', 'name price images inStock stockQuantity');

    res.json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart'
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add product to cart
// @access  Private
router.post('/add', authenticate, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    const user = await User.findById(req.user.id);
    
    const existingItem = user.cart.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({
        productId,
        quantity
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Product added to cart',
      cart: user.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product to cart'
    });
  }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove product from cart
// @access  Private
router.delete('/:productId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.cart = user.cart.filter(
      item => item.productId.toString() !== req.params.productId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Product removed from cart',
      cart: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove product from cart'
    });
  }
});

export default router;

