import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  BookOpen, 
  ShoppingBag, 
  BarChart3, 
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Award,
  MessageCircle,
  FileText,
  LogOut,
  Lock,
  User,
  CheckCircle,
  XCircle,
  Store
} from 'lucide-react';
import { sellerApplicationsAPI, communityAPI } from '../utils/api';
import { contentCMS } from '../utils/contentCMS';
import { forum } from '../utils/forum';
import { sellerApplications } from '../utils/sellerApplications';
import './Admin.css';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sellerApps, setSellerApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [awarenessArticles, setAwarenessArticles] = useState([]);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'rights',
    content: '',
    readTime: '5 min read',
    author: 'Admin',
    featured: false
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      // Try to authenticate with backend first
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginForm.username,
            password: loginForm.password
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Check if user is admin
          if (data.user && data.user.role === 'admin') {
            // Store token for API calls
            localStorage.setItem('token', data.token);
            localStorage.setItem('admin_user', JSON.stringify(data.user));
            setShowSuccess(true);
            setTimeout(() => {
              setIsLoggedIn(true);
              setShowSuccess(false);
            }, 600);
            return;
          } else {
            setLoginError('Access denied. Admin privileges required.');
            setIsLoading(false);
            return;
          }
        }
      } catch (apiError) {
        console.log('Backend auth failed, trying local credentials:', apiError);
        // Fallback to local credentials if backend is not available
      }

      // Fallback: Check local credentials
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || '';
      
      // Demo credentials (for testing/demo purposes)
      const DEMO_CREDENTIALS = {
        email: 'admin@sherises.com',
        password: 'admin123'
      };
      
      // Check if credentials match
      const isCustomAdmin = adminEmail && adminPassword && 
        loginForm.username === adminEmail && 
        loginForm.password === adminPassword;
      
      const isDemoAdmin = loginForm.username === DEMO_CREDENTIALS.email && 
        loginForm.password === DEMO_CREDENTIALS.password;
      
      if (isCustomAdmin || isDemoAdmin) {
        // For local admin, we still need to handle API calls
        // Note: This will work for viewing but may fail for approvals if backend requires auth
        setShowSuccess(true);
        setTimeout(() => {
          setIsLoggedIn(true);
          setShowSuccess(false);
        }, 600);
      } else {
        setLoginError('Invalid username or password');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
    setActiveTab('dashboard');
    // Clear admin token
    localStorage.removeItem('token');
    localStorage.removeItem('admin_user');
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'sellers', name: 'Seller Applications', icon: Store },
    { id: 'moderation', name: 'Content Moderation', icon: MessageCircle },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'products', name: 'Products', icon: ShoppingBag },
    { id: 'content', name: 'Content', icon: FileText },
    { id: 'reports', name: 'Reports', icon: TrendingUp }
  ];

  // Load seller applications when sellers tab is active
  useEffect(() => {
    const loadData = async () => {
      if (activeTab === 'sellers') {
        try {
          const response = await sellerApplicationsAPI.getAll();
          if (response.success && response.applications) {
            // Transform applications to ensure consistent ID format
            const transformedApps = response.applications.map(app => ({
              ...app,
              id: app._id || app.id,
              _id: app._id || app.id
            }));
            setSellerApps(transformedApps);
          } else {
            console.warn('No applications returned from API');
            setSellerApps([]);
          }
        } catch (error) {
          console.error('Error loading seller applications:', error);
          // Check if it's an auth error
          if (error.message?.includes('401') || error.message?.includes('403')) {
            alert('Authentication failed. Please login again as admin.');
            setIsLoggedIn(false);
          }
          // Fallback to localStorage
          const apps = sellerApplications.getAll();
          setSellerApps(apps);
        }
      }
      if (activeTab === 'moderation') {
        // TODO: Implement reported posts API endpoint
        // For now, keep using localStorage
        const reportedPosts = forum.getReportedPosts();
        setReportedPosts(reportedPosts);
      }
      if (activeTab === 'content') {
        setAwarenessArticles(contentCMS.getAll());
      }
    };
    
    loadData();
  }, [activeTab, isLoggedIn]);

  const handleApproveSeller = async (appId) => {
    if (!appId) {
      alert('Invalid application ID');
      return;
    }

    if (window.confirm('Are you sure you want to approve this seller application? The user will become a seller.')) {
      try {
        const response = await sellerApplicationsAPI.approve(appId);
        if (response.success) {
          // Reload applications
          const updatedResponse = await sellerApplicationsAPI.getAll();
          if (updatedResponse.success && updatedResponse.applications) {
            const transformedApps = updatedResponse.applications.map(app => ({
              ...app,
              id: app._id || app.id,
              _id: app._id || app.id
            }));
            setSellerApps(transformedApps);
          }
          setSelectedApp(null);
          alert('✅ Seller application approved successfully! The user is now a seller.');
        } else {
          alert(response.message || 'Failed to approve application');
        }
      } catch (error) {
        console.error('Error approving application:', error);
        const errorMsg = error.message || 'Failed to approve application.';
        if (errorMsg.includes('401') || errorMsg.includes('403')) {
          alert('Authentication failed. Please login again as admin.');
          setIsLoggedIn(false);
        } else {
          alert(`Error: ${errorMsg}`);
        }
      }
    }
  };

  const handleRejectSeller = async (appId) => {
    if (!appId) {
      alert('Invalid application ID');
      return;
    }

    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        const response = await sellerApplicationsAPI.reject(appId, reason);
        if (response.success) {
          // Reload applications
          const updatedResponse = await sellerApplicationsAPI.getAll();
          if (updatedResponse.success && updatedResponse.applications) {
            const transformedApps = updatedResponse.applications.map(app => ({
              ...app,
              id: app._id || app.id,
              _id: app._id || app.id
            }));
            setSellerApps(transformedApps);
          }
          setSelectedApp(null);
          alert('Seller application rejected.');
        } else {
          alert(response.message || 'Failed to reject application');
        }
      } catch (error) {
        console.error('Error rejecting application:', error);
        const errorMsg = error.message || 'Failed to reject application.';
        if (errorMsg.includes('401') || errorMsg.includes('403')) {
          alert('Authentication failed. Please login again as admin.');
          setIsLoggedIn(false);
        } else {
          alert(`Error: ${errorMsg}`);
        }
      }
    }
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      forum.deletePost(postId);
      setReportedPosts(forum.getReportedPosts());
    }
  };

  const handleDismissReport = (postId) => {
    if (window.confirm('Dismiss all reports for this post?')) {
      const posts = forum.getAllPosts();
      const post = posts.find(p => p.id === postId);
      if (post) {
        post.reports = [];
        localStorage.setItem('forumPosts', JSON.stringify(posts));
        setReportedPosts(forum.getReportedPosts());
      }
    }
  };

  const handleSaveArticle = () => {
    if (!articleForm.title.trim() || !articleForm.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    if (editingArticle) {
      contentCMS.update(editingArticle.id, articleForm);
    } else {
      contentCMS.create(articleForm);
    }

    setAwarenessArticles(contentCMS.getAll());
    setShowArticleModal(false);
    setEditingArticle(null);
    setArticleForm({
      title: '',
      category: 'rights',
      content: '',
      readTime: '5 min read',
      author: 'Admin',
      featured: false
    });
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      category: article.category,
      content: article.content,
      readTime: article.readTime,
      author: article.author,
      featured: article.featured || false
    });
    setShowArticleModal(true);
  };

  const handleDeleteArticle = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      contentCMS.delete(id);
      setAwarenessArticles(contentCMS.getAll());
    }
  };

  const stats = [
    { label: 'Total Users', value: '2,547', change: '+12%', icon: Users, color: '#e91e63' },
    { label: 'Pending Seller Apps', value: sellerApps.filter(app => app.status === 'pending').length.toString(), change: 'Review', icon: Store, color: '#ff9800' },
    { label: 'Active Courses', value: '24', change: '+3', icon: BookOpen, color: '#9c27b0' },
    { label: 'Products Listed', value: '156', change: '+8', icon: ShoppingBag, color: '#ff4081' },
    { label: 'Total Revenue', value: '₹2.4L', change: '+18%', icon: TrendingUp, color: '#4caf50' }
  ];

  const recentUsers = [
    { id: 1, name: 'Priya Sharma', email: 'priya@email.com', joinDate: '2024-01-15', status: 'Active', location: 'Mumbai' },
    { id: 2, name: 'Sunita Devi', email: 'sunita@email.com', joinDate: '2024-01-14', status: 'Active', location: 'Bihar' },
    { id: 3, name: 'Kavita Joshi', email: 'kavita@email.com', joinDate: '2024-01-13', status: 'Pending', location: 'UP' },
    { id: 4, name: 'Meera Patel', email: 'meera@email.com', joinDate: '2024-01-12', status: 'Active', location: 'Gujarat' }
  ];

  const courses = [
    { id: 1, title: 'Digital Marketing Basics', instructor: 'Dr. Priya Sharma', students: 1250, status: 'Published', category: 'Digital Skills' },
    { id: 2, title: 'Traditional Handloom Weaving', instructor: 'Master Artisan Sunita', students: 890, status: 'Published', category: 'Traditional Crafts' },
    { id: 3, title: 'Financial Literacy for Women', instructor: 'CA Meera Patel', students: 2100, status: 'Published', category: 'Business' },
    { id: 4, title: 'Basic Computer Skills', instructor: 'Tech Trainer Anjali', students: 3200, status: 'Draft', category: 'Digital Skills' }
  ];

  const products = [
    { id: 1, name: 'Handwoven Silk Saree', seller: 'Sunita Devi', price: 2500, status: 'Active', category: 'Textiles', sales: 45 },
    { id: 2, name: 'Terracotta Pottery Set', seller: 'Kavita Joshi', price: 800, status: 'Active', category: 'Handicrafts', sales: 23 },
    { id: 3, name: 'Handmade Silver Jewelry', seller: 'Meera Patel', price: 1800, status: 'Active', category: 'Jewelry', sales: 67 },
    { id: 4, name: 'Organic Turmeric Powder', seller: 'Priya Sharma', price: 350, status: 'Pending', category: 'Food', sales: 12 }
  ];

  const content = [
    { id: 1, title: 'Understanding Your Legal Rights', category: 'Legal Rights', author: 'Legal Team', status: 'Published', views: 1250 },
    { id: 2, title: 'Women\'s Health Guide', category: 'Health', author: 'Dr. Priya', status: 'Published', views: 890 },
    { id: 3, title: 'Financial Planning Tips', category: 'Education', author: 'CA Meera', status: 'Draft', views: 0 },
    { id: 4, title: 'Domestic Violence Support', category: 'Support', author: 'Support Team', status: 'Published', views: 2100 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'Published':
        return '#4caf50';
      case 'Pending':
      case 'Draft':
        return '#ff9800';
      case 'Inactive':
        return '#f44336';
      default:
        return '#666';
    }
  };

  // Login Page
  if (!isLoggedIn) {
    return (
      <div className="admin-login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="login-logo">
                <Lock className="logo-icon" />
                <h1>Admin</h1>
              </div>
              <p>Enter your credentials to access the admin portal</p>
            </div>
            
            <form onSubmit={handleLogin} className="login-form">
              {showSuccess && (
                <div className="login-success">
                  <span>✓</span> Login successful! Redirecting...
                </div>
              )}
              {loginError && (
                <div className="login-error">
                  {loginError}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="username">
                  <User size={18} />
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <Lock size={18} />
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>

              {/* Demo Credentials Info */}
              <div className="demo-credentials" style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#0369a1'
              }}>
                <strong>Demo Credentials:</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  Email: <code>admin@sherises.com</code>
                </div>
                <div>
                  Password: <code>admin123</code>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard (After Login)
  return (
    <div className="admin">
      <div className="admin-topbar">
        <div className="container">
          <div className="topbar-content">
            <h2>Admin Dashboard</h2>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-main">
        <div className="container">
          {/* Tabs */}
          <div className="admin-tabs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={20} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-section">
              {/* Stats Cards */}
              <div className="stats-grid">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="stat-card">
                      <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                        <Icon size={24} />
                      </div>
                      <div className="stat-content">
                        <h3>{stat.value}</h3>
                        <p>{stat.label}</p>
                        <span className="stat-change">{stat.change}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="activity-section">
                <div className="recent-users">
                  <h3>Recent Users</h3>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Location</th>
                          <th>Join Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map(user => (
                          <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.location}</td>
                            <td>{user.joinDate}</td>
                            <td>
                              <span 
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(user.status) }}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <div className="action-btn-wrapper">
                                  <button 
                                    className="action-btn view"
                                    onClick={() => {
                                      alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nLocation: ${user.location}\nJoin Date: ${user.joinDate}\nStatus: ${user.status}`);
                                    }}
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <span className="action-tooltip">View Details</span>
                                </div>
                                <div className="action-btn-wrapper">
                                  <button 
                                    className="action-btn edit"
                                    onClick={() => {
                                      alert('Edit user feature coming soon!');
                                    }}
                                  >
                                    <Edit size={18} />
                                    <span>Edit</span>
                                  </button>
                                  <span className="action-tooltip">Edit User</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h2>User Management</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    alert('Add user feature coming soon!');
                  }}
                >
                  <Plus size={20} />
                  Add User
                </button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Location</th>
                      <th>Join Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.location}</td>
                        <td>{user.joinDate}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(user.status) }}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td>
                        <div className="action-buttons">
                          <div className="action-btn-wrapper">
                            <button 
                              className="action-btn view"
                              onClick={() => {
                                alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nLocation: ${user.location}\nJoin Date: ${user.joinDate}\nStatus: ${user.status}`);
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <span className="action-tooltip">View Details</span>
                          </div>
                          <div className="action-btn-wrapper">
                            <button 
                              className="action-btn edit"
                              onClick={() => {
                                alert('Edit user feature coming soon!');
                              }}
                            >
                              <Edit size={18} />
                              <span>Edit</span>
                            </button>
                            <span className="action-tooltip">Edit User</span>
                          </div>
                          <div className="action-btn-wrapper">
                            <button 
                              className="action-btn delete"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
                                  alert('Delete user feature coming soon!');
                                }
                              }}
                            >
                              <Trash2 size={18} />
                              <span>Delete</span>
                            </button>
                            <span className="action-tooltip">Delete User</span>
                          </div>
                        </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="courses-section">
              <div className="section-header">
                <h2>Course Management</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    alert('Add course feature coming soon!');
                  }}
                >
                  <Plus size={20} />
                  Add Course
                </button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Instructor</th>
                      <th>Category</th>
                      <th>Students</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course.id}>
                        <td>{course.title}</td>
                        <td>{course.instructor}</td>
                        <td>{course.category}</td>
                        <td>{course.students.toLocaleString()}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(course.status) }}
                          >
                            {course.status}
                          </span>
                        </td>
                        <td>
                        <div className="action-buttons">
                          <div className="action-btn-wrapper">
                            <button 
                              className="action-btn view"
                              onClick={() => {
                                alert(`Course Details:\n\nTitle: ${course.title}\nInstructor: ${course.instructor}\nCategory: ${course.category}\nStudents: ${course.students.toLocaleString()}\nStatus: ${course.status}`);
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <span className="action-tooltip">View Details</span>
                          </div>
                          <div className="action-btn-wrapper">
                            <button 
                              className="action-btn edit"
                              onClick={() => {
                                alert('Edit course feature coming soon!');
                              }}
                            >
                              <Edit size={18} />
                              <span>Edit</span>
                            </button>
                            <span className="action-tooltip">Edit Course</span>
                          </div>
                          <div className="action-btn-wrapper">
                            <button 
                              className="action-btn delete"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete course "${course.title}"?`)) {
                                  alert('Delete course feature coming soon!');
                                }
                              }}
                            >
                              <Trash2 size={18} />
                              <span>Delete</span>
                            </button>
                            <span className="action-tooltip">Delete Course</span>
                          </div>
                        </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Content Moderation Tab */}
          {activeTab === 'moderation' && (
            <div className="moderation-section">
              <div className="section-header">
                <h2>Content Moderation</h2>
                <p>Review and manage reported forum posts</p>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Post Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Reports</th>
                      <th>Reported On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportedPosts.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                          <MessageCircle size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                          <p>No reported posts</p>
                        </td>
                      </tr>
                    ) : (
                      reportedPosts.map(post => (
                        <tr key={post.id}>
                          <td>
                            <strong>{post.title}</strong>
                            <div style={{ fontSize: '0.85rem', color: 'var(--medium-text)', marginTop: '0.25rem' }}>
                              {post.content.substring(0, 50)}...
                            </div>
                          </td>
                          <td>{post.author}</td>
                          <td>{post.category}</td>
                          <td>
                            <span className="status-badge" style={{ backgroundColor: '#f44336' }}>
                              {post.reports.length} Report{post.reports.length > 1 ? 's' : ''}
                            </span>
                          </td>
                          <td>
                            {new Date(post.reports[post.reports.length - 1]?.createdAt || post.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <div className="action-btn-wrapper">
                                <button
                                  className="action-btn view"
                                  onClick={() => {
                                    const reasons = post.reports.map(r => `- ${r.reason}`).join('\n');
                                    alert(`Post: ${post.title}\n\nReport Reasons:\n${reasons}`);
                                  }}
                                >
                                  <Eye size={16} />
                                </button>
                                <span className="action-tooltip">View Reports</span>
                              </div>
                              <div className="action-btn-wrapper">
                                <button
                                  className="action-btn approve"
                                  onClick={() => handleDismissReport(post.id)}
                                >
                                  <CheckCircle size={18} />
                                  <span>Dismiss</span>
                                </button>
                                <span className="action-tooltip">Dismiss Reports</span>
                              </div>
                              <div className="action-btn-wrapper">
                                <button
                                  className="action-btn delete"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Trash2 size={18} />
                                  <span>Delete</span>
                                </button>
                                <span className="action-tooltip">Delete Post</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Seller Applications Tab */}
          {activeTab === 'sellers' && (
            <div className="sellers-section">
              <div className="section-header">
                <h2>Seller Applications</h2>
                <div className="filter-buttons">
                  <button 
                    className={`filter-btn ${selectedApp === null ? 'active' : ''}`}
                    onClick={() => setSelectedApp(null)}
                  >
                    All ({sellerApps.length})
                  </button>
                  <button 
                    className={`filter-btn ${selectedApp === 'pending' ? 'active' : ''}`}
                    onClick={() => setSelectedApp('pending')}
                  >
                    Pending ({sellerApps.filter(app => app.status === 'pending').length})
                  </button>
                  <button 
                    className={`filter-btn ${selectedApp === 'approved' ? 'active' : ''}`}
                    onClick={() => setSelectedApp('approved')}
                  >
                    Approved ({sellerApps.filter(app => app.status === 'approved').length})
                  </button>
                  <button 
                    className={`filter-btn ${selectedApp === 'rejected' ? 'active' : ''}`}
                    onClick={() => setSelectedApp('rejected')}
                  >
                    Rejected ({sellerApps.filter(app => app.status === 'rejected').length})
                  </button>
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Business Name</th>
                      <th>Applicant</th>
                      <th>Business Type</th>
                      <th>Address</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let filteredApps = sellerApps;
                      if (selectedApp === 'pending') {
                        filteredApps = sellerApps.filter(app => app.status === 'pending');
                      } else if (selectedApp === 'approved') {
                        filteredApps = sellerApps.filter(app => app.status === 'approved');
                      } else if (selectedApp === 'rejected') {
                        filteredApps = sellerApps.filter(app => app.status === 'rejected');
                      }
                      
                      if (filteredApps.length === 0) {
                        return (
                          <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                              <Store size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                              <p>No seller applications found</p>
                            </td>
                          </tr>
                        );
                      }
                      
                      return filteredApps.map(app => {
                        const appId = app._id || app.id;
                        return (
                        <tr key={appId}>
                          <td><strong>{app.businessName}</strong></td>
                          <td>
                            <div>
                              <div>{app.userName}</div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--light-text)' }}>
                                {app.userEmail}
                              </div>
                            </div>
                          </td>
                          <td style={{ textTransform: 'capitalize' }}>{app.businessType}</td>
                          <td style={{ maxWidth: '200px', fontSize: '0.9rem' }}>
                            {(app.address || '').length > 50 ? `${app.address.substring(0, 50)}...` : app.address}
                          </td>
                          <td>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}</td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{ 
                                backgroundColor: 
                                  app.status === 'approved' ? '#4caf50' :
                                  app.status === 'rejected' ? '#f44336' : '#ff9800'
                              }}
                            >
                              {(app.status || 'pending').charAt(0).toUpperCase() + (app.status || 'pending').slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <div className="action-btn-wrapper">
                                <button 
                                  className="action-btn view"
                                  onClick={() => {
                                    alert(`Business: ${app.businessName}\n\nApplicant: ${app.userName} (${app.userEmail})\nBusiness Type: ${app.businessType}\nAddress: ${app.address || 'N/A'}\nGST: ${app.gstNumber || 'Not provided'}\nBank: ${app.bankAccount || 'Not provided'}\nIFSC: ${app.ifscCode || 'Not provided'}\nDescription: ${app.description || 'Not provided'}`);
                                  }}
                                >
                                  <Eye size={16} />
                                </button>
                                <span className="action-tooltip">View Details</span>
                              </div>
                              {(!app.status || app.status === 'pending') && (
                                <>
                                  <div className="action-btn-wrapper">
                                    <button 
                                      className="action-btn approve"
                                      onClick={() => handleApproveSeller(appId)}
                                    >
                                      <CheckCircle size={18} />
                                    </button>
                                    <span className="action-tooltip">Approve Application</span>
                                  </div>
                                  <div className="action-btn-wrapper">
                                    <button 
                                      className="action-btn reject"
                                      onClick={() => handleRejectSeller(appId)}
                                    >
                                      <XCircle size={18} />
                                    </button>
                                    <span className="action-tooltip">Reject Application</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="products-section">
              <div className="section-header">
                <h2>Product Management</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    alert('Add product feature coming soon!');
                  }}
                >
                  <Plus size={20} />
                  Add Product
                </button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Seller</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Sales</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.seller}</td>
                        <td>{product.category}</td>
                        <td>₹{product.price.toLocaleString()}</td>
                        <td>{product.sales}</td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(product.status) }}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td>
                        <div className="action-buttons">
                          <div className="action-btn-wrapper">
                            <button 
                              className="action-btn view"
                              onClick={() => {
                                alert(`Product Details:\n\nName: ${product.name}\nSeller: ${product.seller}\nCategory: ${product.category}\nPrice: ₹${product.price.toLocaleString()}\nSales: ${product.sales}\nStatus: ${product.status}`);
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <span className="action-tooltip">View Details</span>
                          </div>
                          <div className="action-btn-wrapper">
                            <button 
                              className="action-btn edit"
                              onClick={() => {
                                alert('Edit product feature coming soon!');
                              }}
                            >
                              <Edit size={18} />
                              <span>Edit</span>
                            </button>
                            <span className="action-tooltip">Edit Product</span>
                          </div>
                          <div className="action-btn-wrapper">
                            <button 
                              className="action-btn delete"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete product "${product.name}"?`)) {
                                  alert('Delete product feature coming soon!');
                                }
                              }}
                            >
                              <Trash2 size={18} />
                              <span>Delete</span>
                            </button>
                            <span className="action-tooltip">Delete Product</span>
                          </div>
                        </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Content Management (Awareness Articles)</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingArticle(null);
                    setArticleForm({
                      title: '',
                      category: 'rights',
                      content: '',
                      readTime: '5 min read',
                      author: 'Admin',
                      featured: false
                    });
                    setShowArticleModal(true);
                  }}
                >
                  <Plus size={20} />
                  Add Article
                </button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {awarenessArticles.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                          <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                          <p>No articles yet. Create your first awareness article!</p>
                        </td>
                      </tr>
                    ) : (
                      awarenessArticles.map(item => (
                        <tr key={item.id}>
                          <td><strong>{item.title}</strong></td>
                          <td>{item.category}</td>
                          <td>{item.author}</td>
                          <td>{new Date(item.date || item.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(item.status || 'Published') }}
                            >
                              {item.status || 'Published'}
                            </span>
                          </td>
                          <td>
                          <div className="action-buttons">
                            <div className="action-btn-wrapper">
                              <button 
                                className="action-btn view"
                                onClick={() => {
                                  alert(`Title: ${item.title}\n\nCategory: ${item.category}\n\nContent:\n${item.content.substring(0, 200)}...`);
                                }}
                              >
                                <Eye size={16} />
                              </button>
                              <span className="action-tooltip">View Details</span>
                            </div>
                            <div className="action-btn-wrapper">
                              <button 
                                className="action-btn edit"
                                onClick={() => handleEditArticle(item)}
                              >
                                <Edit size={18} />
                                <span>Edit</span>
                              </button>
                              <span className="action-tooltip">Edit Article</span>
                            </div>
                            <div className="action-btn-wrapper">
                              <button 
                                className="action-btn delete"
                                onClick={() => handleDeleteArticle(item.id)}
                              >
                                <Trash2 size={18} />
                                <span>Delete</span>
                              </button>
                              <span className="action-tooltip">Delete Article</span>
                            </div>
                          </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Article Modal */}
              {showArticleModal && (
                <div className="modal-overlay" onClick={() => setShowArticleModal(false)}>
                  <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
                    <h2>{editingArticle ? 'Edit Article' : 'Create New Article'}</h2>
                    <div className="article-form">
                      <div className="form-group">
                        <label>Title *</label>
                        <input
                          type="text"
                          value={articleForm.title}
                          onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                          placeholder="Article title"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Category *</label>
                          <select
                            value={articleForm.category}
                            onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                          >
                            <option value="rights">Legal Rights</option>
                            <option value="health">Health & Safety</option>
                            <option value="education">Education</option>
                            <option value="support">Support Services</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Read Time</label>
                          <input
                            type="text"
                            value={articleForm.readTime}
                            onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                            placeholder="5 min read"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Author</label>
                        <input
                          type="text"
                          value={articleForm.author}
                          onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                          placeholder="Author name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Content *</label>
                        <textarea
                          value={articleForm.content}
                          onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                          rows={12}
                          placeholder="Write the article content here..."
                        />
                      </div>
                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={articleForm.featured}
                            onChange={(e) => setArticleForm({ ...articleForm, featured: e.target.checked })}
                          />
                          <span>Featured Article</span>
                        </label>
                      </div>
                      <div className="modal-actions">
                        <button className="btn btn-outline" onClick={() => setShowArticleModal(false)}>
                          Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSaveArticle}>
                          {editingArticle ? 'Update Article' : 'Create Article'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="reports-section">
              <h2>Analytics & Reports</h2>
              <div className="reports-grid">
                <div className="report-card">
                  <h3>User Growth</h3>
                  <div className="report-chart">
                    <div className="chart-placeholder">
                      <TrendingUp size={48} />
                      <p>User growth chart would be displayed here</p>
                    </div>
                  </div>
                </div>
                <div className="report-card">
                  <h3>Course Completion</h3>
                  <div className="report-chart">
                    <div className="chart-placeholder">
                      <Award size={48} />
                      <p>Course completion statistics</p>
                    </div>
                  </div>
                </div>
                <div className="report-card">
                  <h3>Sales Performance</h3>
                  <div className="report-chart">
                    <div className="chart-placeholder">
                      <ShoppingBag size={48} />
                      <p>Marketplace sales data</p>
                    </div>
                  </div>
                </div>
                <div className="report-card">
                  <h3>Community Engagement</h3>
                  <div className="report-chart">
                    <div className="chart-placeholder">
                      <MessageCircle size={48} />
                      <p>Forum activity metrics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;