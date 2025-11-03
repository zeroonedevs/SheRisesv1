import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  BookOpen, 
  ShoppingBag, 
  Users, 
  Lightbulb, 
  Lock,
  Menu,
  X,
  Heart,
  User,
  LogOut,
  ShoppingCart,
  Award
} from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const navigation = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/skills', label: 'Skills', icon: BookOpen },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/awareness', label: 'Awareness', icon: Lightbulb },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-wrapper')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <Heart className="logo-icon" />
              <span className="logo-text">SheRises</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* User Menu or Login */}
              {isAuthenticated ? (
                <div className="user-menu-wrapper">
                  <button
                    className="user-menu-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    aria-label="User menu"
                  >
                    <img 
                      src={user?.avatar || '/default-user.svg'} 
                      alt={user?.name || 'User'} 
                      className="user-avatar"
                      onError={(e) => {
                        e.target.src = '/default-user.svg';
                      }}
                    />
                    <span className="user-name">{user?.name?.split(' ')[0] || 'User'}</span>
                  </button>
                  {showUserMenu && (
                    <div className="user-dropdown">
                      <Link 
                        to="/profile" 
                        className="user-dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={18} />
                        <span>My Profile</span>
                      </Link>
                              <Link
                                to="/marketplace"
                                className="user-dropdown-item"
                                onClick={() => setShowUserMenu(false)}
                              >
                                <ShoppingCart size={18} />
                                <span>My Cart</span>
                              </Link>
                              {(user?.isSeller || user?.sellerInfo) && (
                                <Link
                                  to="/seller/dashboard"
                                  className="user-dropdown-item"
                                  onClick={() => setShowUserMenu(false)}
                                >
                                  <Award size={18} />
                                  <span>Seller Dashboard</span>
                                </Link>
                              )}
                      <div className="user-dropdown-divider"></div>
                      <button
                        className="user-dropdown-item"
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate('/');
                        }}
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="nav-link">
                  <User size={20} />
                  <span>Login</span>
                </Link>
              )}
              
              {/* Admin Login Icon */}
              <button
                onClick={() => navigate('/admin')}
                className="admin-login-icon"
                title="Admin Login"
                aria-label="Admin Login"
              >
                <Lock size={18} />
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="mobile-nav">
          <div className="container">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="mobile-nav-link"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={20} />
                <span>Login</span>
              </Link>
            )}
            <button
              onClick={() => {
                navigate('/admin');
                setIsMobileMenuOpen(false);
              }}
              className="mobile-nav-link"
            >
              <Lock size={20} />
              <span>Admin</span>
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>SheRises</h3>
              <p>Empowering women through skill development and economic opportunities.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/skills">Skill Development</Link></li>
                <li><Link to="/marketplace">Marketplace</Link></li>
                <li><Link to="/community">Community</Link></li>
                <li><Link to="/awareness">Awareness</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Connect</h4>
              <div className="social-links">
                <a href="#facebook" aria-label="Facebook">📘</a>
                <a href="#twitter" aria-label="Twitter">🐦</a>
                <a href="#instagram" aria-label="Instagram">📷</a>
                <a href="#linkedin" aria-label="LinkedIn">💼</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 SheRises. All rights reserved. Empowering women, building communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
