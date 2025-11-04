import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// @route   POST /api/orders/checkout
// @desc    Create new order
// @access  Private
router.post('/checkout', authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      if (!product.inStock || product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is out of stock`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]
      });

      totalAmount += product.price * item.quantity;

      // Update stock
      product.stockQuantity -= item.quantity;
      product.inStock = product.stockQuantity > 0;
      await product.save();
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'Online' ? 'Paid' : 'Pending',
      orderStatus: 'Pending'
    });

    // Clear user cart
    const user = await User.findById(req.user.id);
    user.cart = [];
    user.orders.push(order._id);
    await user.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order'
    });
  }
});

export default router;

