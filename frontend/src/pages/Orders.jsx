import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { marketplaceAPI } from '../utils/api';
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ArrowLeft,
  Eye
} from 'lucide-react';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await marketplaceAPI.getOrders();
        if (response.success) {
          setUserOrders(response.orders || []);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        // Fallback to empty array
        setUserOrders([]);
      }
    };
    
    loadOrders();
  }, [isAuthenticated, user, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'processing':
        return '#2196f3';
      case 'shipped':
        return '#9c27b0';
      case 'delivered':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} />;
      case 'processing':
        return <Package size={18} />;
      case 'shipped':
        return <Truck size={18} />;
      case 'delivered':
        return <CheckCircle size={18} />;
      default:
        return null;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="orders-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ArrowLeft size={18} />
          Back to Profile
        </button>

        <h1>My Orders</h1>

        {userOrders.length === 0 ? (
          <div className="no-orders">
            <ShoppingBag size={64} />
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here</p>
            <button className="btn btn-primary" onClick={() => navigate('/marketplace')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {userOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id || order.id}</h3>
                    <p className="order-date">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.orderStatus?.toLowerCase() || 'pending') }}
                    >
                      {getStatusIcon(order.orderStatus?.toLowerCase() || 'pending')}
                      {(order.orderStatus || 'Pending').charAt(0).toUpperCase() + (order.orderStatus || 'Pending').slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image || item.product?.images?.[0] || '/default-user.svg'} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name || item.product?.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p className="item-price">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="shipping-info">
                    <h4>
                      <MapPin size={16} />
                      Shipping Address
                    </h4>
                    <p>
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.shippingAddress.phone}
                    </p>
                  </div>
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span>Payment Method:</span>
                      <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

