import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orders } from '../utils/orders';
import {
  ShoppingBag,
  TrendingUp,
  Package,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck
} from 'lucide-react';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sellerOrders, setSellerOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user is a seller
    if (!user?.isSeller && !user?.sellerInfo) {
      alert('You need to be a verified seller to access this dashboard. Please apply to become a seller first.');
      navigate('/marketplace');
      return;
    }

    // Load seller's orders
    const allOrders = orders.getAll();
    const myOrders = allOrders.filter(order => 
      order.items.some(item => item.sellerId === user.id || item.seller === user.name)
    );
    setSellerOrders(myOrders);

    // Load seller's products (mock - would come from API)
    const sellerProducts = [
      {
        id: 1,
        name: 'Handwoven Silk Saree',
        category: 'textiles',
        price: 2500,
        stock: 15,
        sales: 45,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=500&fit=crop'
      }
    ];
    setProducts(sellerProducts);
  }, [isAuthenticated, user, navigate]);

  const totalRevenue = sellerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = sellerOrders.length;
  const totalProducts = products.length;
  const pendingOrders = sellerOrders.filter(o => o.orderStatus === 'pending').length;

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
        return <Clock size={16} />;
      case 'processing':
        return <Package size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    if (window.confirm(`Update order status to ${newStatus}?`)) {
      orders.updateStatus(orderId, newStatus);
      const allOrders = orders.getAll();
      const myOrders = allOrders.filter(order => 
        order.items.some(item => item.sellerId === user.id || item.seller === user.name)
      );
      setSellerOrders(myOrders);
    }
  };

  if (!isAuthenticated || (!user?.isSeller && !user?.sellerInfo)) {
    return null;
  }

  return (
    <div className="seller-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Seller Dashboard</h1>
            <p>Manage your products and orders</p>
          </div>
          <button className="btn btn-primary" onClick={() => alert('Add Product feature coming soon')}>
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <DollarSign className="stat-icon" />
            <div className="stat-content">
              <h3>₹{totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="stat-card">
            <Package className="stat-icon" />
            <div className="stat-content">
              <h3>{totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <ShoppingBag className="stat-icon" />
            <div className="stat-content">
              <h3>{totalProducts}</h3>
              <p>Products Listed</p>
            </div>
          </div>
          <div className="stat-card">
            <Clock className="stat-icon" />
            <div className="stat-content">
              <h3>{pendingOrders}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerOrders.slice(0, 5).map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.userName}</td>
                      <td>{order.items.length} item(s)</td>
                      <td>₹{order.totalAmount.toLocaleString()}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                        >
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="action-btn"
                          onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2>My Products</h2>
            </div>
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-price">₹{product.price.toLocaleString()}</p>
                    <div className="product-stats">
                      <span>Stock: {product.stock}</span>
                      <span>Sales: {product.sales}</span>
                    </div>
                    <div className="product-actions">
                      <button className="btn btn-outline">
                        <Edit size={16} />
                        Edit
                      </button>
                      <button className="btn btn-outline">
                        <Eye size={16} />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <div className="section-header">
              <h2>All Orders</h2>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    sellerOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.userName}</td>
                        <td>{order.items.length} item(s)</td>
                        <td>₹{order.totalAmount.toLocaleString()}</td>
                        <td>
                          <span
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                          >
                            {getStatusIcon(order.orderStatus)}
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>Sales Analytics</h2>
            <div className="analytics-placeholder">
              <TrendingUp size={64} />
              <p>Analytics dashboard coming soon</p>
              <p>Track your sales performance, customer insights, and product trends</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;

