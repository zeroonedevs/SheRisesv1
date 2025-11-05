import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/localStorage';
import { marketplaceAPI } from '../utils/api';
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  ArrowLeft,
  User,
  Phone,
  Mail
} from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const savedCart = storage.getCart();
    if (savedCart.length === 0) {
      navigate('/marketplace');
      return;
    }
    setCart(savedCart);
    
    // Pre-fill shipping info from user profile
    if (user) {
      setShippingInfo({
        fullName: user.name || '',
        phone: user.phone || '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || 
        !shippingInfo.city || !shippingInfo.state || !shippingInfo.pincode) {
      alert('Please fill in all required shipping information');
      return;
    }

    try {
      // Create order via API
      const response = await marketplaceAPI.checkout({
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity || 1
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode,
          landmark: shippingInfo.landmark || ''
        },
        paymentMethod: paymentMethod
      });

      if (response.success) {
        // Clear cart
        storage.clearCart();
        
        setOrderId(response.order._id || response.order.id);
        setOrderPlaced(true);
      } else {
        alert(response.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Place order error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout">
        <div className="container">
          <div className="order-success">
            <CheckCircle size={64} className="success-icon" />
            <h1>Order Placed Successfully!</h1>
            <p className="order-id">Order ID: {orderId}</p>
            <p>Thank you for your purchase. Your order has been confirmed and will be shipped soon.</p>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                View Orders
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/marketplace')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="checkout">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/marketplace')}>
          <ArrowLeft size={18} />
          Back to Cart
        </button>

        <h1>Checkout</h1>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity || 1}</p>
                    <p className="item-price">₹{(item.price * (item.quantity || 1)).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Forms */}
          <div className="checkout-forms">
            {/* Shipping Information */}
            <div className="form-section">
              <h2>
                <MapPin size={20} />
                Shipping Information
              </h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <User size={16} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <Phone size={16} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingInfo.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={shippingInfo.landmark}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h2>
                <CreditCard size={20} />
                Payment Method
              </h2>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <Truck size={20} />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <p>Pay when you receive the order</p>
                    </div>
                  </div>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <CreditCard size={20} />
                    <div>
                      <strong>Online Payment</strong>
                      <p>Pay securely with UPI, Card, or Net Banking</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button className="btn btn-primary place-order-btn" onClick={handlePlaceOrder}>
              <CheckCircle size={20} />
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

