import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/localStorage';
import BecomeSellerModal from '../components/forms/BecomeSellerModal';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  Heart, 
  ShoppingCart,
  MapPin,
  Truck,
  Shield,
  Award,
  TrendingUp
} from 'lucide-react';
import './Marketplace.css';

const Marketplace = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [showSellerModal, setShowSellerModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Products', icon: ShoppingBag },
    { id: 'handicrafts', name: 'Handicrafts', icon: Award },
    { id: 'textiles', name: 'Textiles', icon: Star },
    { id: 'jewelry', name: 'Jewelry', icon: Heart },
    { id: 'food', name: 'Food & Spices', icon: TrendingUp },
    { id: 'beauty', name: 'Beauty & Wellness', icon: Star }
  ];

  const products = [
    {
      id: 1,
      name: 'Handwoven Silk Saree',
      seller: 'Sunita Devi',
      location: 'Varanasi, UP',
      category: 'textiles',
      price: 2500,
      originalPrice: 3000,
      rating: 4.9,
      reviews: 127,
      image: '/klu-sac-logo.png',
      description: 'Beautiful handwoven silk saree with intricate zari work. Perfect for special occasions.',
      inStock: true,
      fastDelivery: true,
      verified: true
    },
    {
      id: 2,
      name: 'Terracotta Pottery Set',
      seller: 'Kavita Joshi',
      location: 'Khurja, UP',
      category: 'handicrafts',
      price: 800,
      originalPrice: 1000,
      rating: 4.8,
      reviews: 89,
      image: '/klu-sac-logo.png',
      description: 'Set of 6 traditional terracotta pots perfect for cooking and serving.',
      inStock: true,
      fastDelivery: false,
      verified: true
    },
    {
      id: 3,
      name: 'Handmade Silver Jewelry',
      seller: 'Meera Patel',
      location: 'Jaipur, Rajasthan',
      category: 'jewelry',
      price: 1800,
      originalPrice: 2200,
      rating: 4.9,
      reviews: 156,
      image: '/klu-sac-logo.png',
      description: 'Elegant silver necklace and earring set with traditional Rajasthani designs.',
      inStock: true,
      fastDelivery: true,
      verified: true
    },
    {
      id: 4,
      name: 'Organic Turmeric Powder',
      seller: 'Priya Sharma',
      location: 'Kerala',
      category: 'food',
      price: 350,
      originalPrice: 400,
      rating: 4.7,
      reviews: 203,
      image: '/klu-sac-logo.png',
      description: 'Pure organic turmeric powder sourced directly from Kerala farms.',
      inStock: true,
      fastDelivery: true,
      verified: true
    },
    {
      id: 5,
      name: 'Handmade Soap Collection',
      seller: 'Anjali Singh',
      location: 'Goa',
      category: 'beauty',
      price: 450,
      originalPrice: 600,
      rating: 4.8,
      reviews: 94,
      image: '/klu-sac-logo.png',
      description: 'Set of 5 natural handmade soaps with different fragrances and benefits.',
      inStock: true,
      fastDelivery: false,
      verified: true
    },
    {
      id: 6,
      name: 'Bamboo Basket Set',
      seller: 'Ritu Verma',
      location: 'Assam',
      category: 'handicrafts',
      price: 650,
      originalPrice: 800,
      rating: 4.6,
      reviews: 67,
      image: '/klu-sac-logo.png',
      description: 'Set of 3 eco-friendly bamboo baskets in different sizes.',
      inStock: true,
      fastDelivery: false,
      verified: true
    }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      const savedCart = storage.getCart();
      setCart(savedCart);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && cart.length > 0) {
      storage.setCart(cart);
    }
  }, [cart, isAuthenticated]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    const updatedCart = storage.addToCart(product);
    setCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = storage.removeFromCart(productId);
    setCart(updatedCart);
  };

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  const totalCartValue = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="marketplace">
      <div className="container">
        {/* Header */}
        <div className="marketplace-header">
          <h1>Marketplace</h1>
          <p>Discover and support women entrepreneurs. Buy authentic handmade products directly from skilled artisans.</p>
        </div>

        {/* Stats */}
        <div className="marketplace-stats">
          <div className="stat-item">
            <ShoppingBag className="stat-icon" />
            <div className="stat-content">
              <h3>{products.length}</h3>
              <p>Products Available</p>
            </div>
          </div>
          <div className="stat-item">
            <Award className="stat-icon" />
            <div className="stat-content">
              <h3>50+</h3>
              <p>Verified Sellers</p>
            </div>
          </div>
          <div className="stat-item">
            <Truck className="stat-icon" />
            <div className="stat-content">
              <h3>25+</h3>
              <p>States Covered</p>
            </div>
          </div>
          <div className="stat-item">
            <Star className="stat-icon" />
            <div className="stat-content">
              <h3>4.8</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-filter">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products or sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-filter">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon size={18} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shopping Cart Summary */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <div className="cart-info">
              <ShoppingCart size={20} />
              <span>{cart.length} items in cart</span>
              <span className="cart-total">₹{totalCartValue.toLocaleString()}</span>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
              Checkout
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
              <div className="product-image">
                <img src={'./test.jpg'} alt={product.name} />
                <div className="product-badges">
                  {product.verified && (
                    <span className="verified-badge">
                      <Shield size={12} />
                      Verified
                    </span>
                  )}
                  {product.fastDelivery && (
                    <span className="delivery-badge">
                      <Truck size={12} />
                      Fast Delivery
                    </span>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="discount-badge">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <button className="wishlist-btn">
                  <Heart size={18} />
                </button>
              </div>
              <div className="product-content">
                <div className="product-meta">
                  <span className="category">{categories.find(c => c.id === product.category)?.name}</span>
                  <span className="in-stock">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="seller-info">
                  <MapPin size={14} />
                  by {product.seller}, {product.location}
                </p>
                <p className="product-description">{product.description}</p>
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < Math.floor(product.rating) ? '#ffd700' : 'none'}
                        color="#ffd700"
                      />
                    ))}
                  </div>
                  <span className="rating-text">{product.rating} ({product.reviews} reviews)</span>
                </div>
                <div className="product-pricing">
                  <div className="price">
                    <span className="current-price">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="product-actions">
                  {isInCart(product.id) ? (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="marketplace-cta">
          <div className="cta-content">
            <h2>Start Selling Your Products</h2>
            <p>Join our marketplace and reach customers across India. We provide support for packaging, shipping, and marketing.</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                if (!isAuthenticated) {
                  alert('Please login to become a seller');
                } else {
                  setShowSellerModal(true);
                }
              }}
            >
              <Award size={20} />
              Become a Seller
            </button>
          </div>
        </div>

        {/* Become Seller Modal */}
        <BecomeSellerModal 
          isOpen={showSellerModal} 
          onClose={() => setShowSellerModal(false)} 
        />
      </div>
    </div>
  );
};

export default Marketplace;
