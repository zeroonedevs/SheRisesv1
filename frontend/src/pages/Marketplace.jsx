import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/localStorage';
import { marketplaceAPI } from '../utils/api';
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

  // Fallback products (original products)
  const fallbackProducts = [
    {
      id: 1,
      name: 'Handwoven Silk Saree',
      seller: 'Sunita Devi',
      sellerName: 'Sunita Devi',
      location: 'Varanasi, UP',
      category: 'textiles',
      price: 2500,
      originalPrice: 3000,
      rating: 4.9,
      reviews: 127,
      reviewCount: 127,
      image: '/test.jpg',
      images: ['/test.jpg'],
      description: 'Beautiful handwoven silk saree with intricate zari work. Perfect for special occasions.',
      inStock: true,
      fastDelivery: true,
      verified: true
    },
    {
      id: 2,
      name: 'Terracotta Pottery Set',
      seller: 'Kavita Joshi',
      sellerName: 'Kavita Joshi',
      location: 'Khurja, UP',
      category: 'handicrafts',
      price: 800,
      originalPrice: 1000,
      rating: 4.8,
      reviews: 89,
      reviewCount: 89,
      image: '/test.jpg',
      images: ['/test.jpg'],
      description: 'Set of 6 traditional terracotta pots perfect for cooking and serving.',
      inStock: true,
      fastDelivery: false,
      verified: true
    },
    {
      id: 3,
      name: 'Handmade Silver Jewelry',
      seller: 'Meera Patel',
      sellerName: 'Meera Patel',
      location: 'Jaipur, Rajasthan',
      category: 'jewelry',
      price: 1800,
      originalPrice: 2200,
      rating: 4.9,
      reviews: 156,
      reviewCount: 156,
      image: '/test.jpg',
      images: ['/test.jpg'],
      description: 'Elegant silver necklace and earring set with traditional Rajasthani designs.',
      inStock: true,
      fastDelivery: true,
      verified: true
    },
    {
      id: 4,
      name: 'Organic Turmeric Powder',
      seller: 'Priya Sharma',
      sellerName: 'Priya Sharma',
      location: 'Kerala',
      category: 'food',
      price: 350,
      originalPrice: 400,
      rating: 4.7,
      reviews: 203,
      reviewCount: 203,
      image: '/test.jpg',
      images: ['/test.jpg'],
      description: 'Pure organic turmeric powder sourced directly from Kerala farms.',
      inStock: true,
      fastDelivery: true,
      verified: true
    },
    {
      id: 5,
      name: 'Handmade Soap Collection',
      seller: 'Anjali Singh',
      sellerName: 'Anjali Singh',
      location: 'Goa',
      category: 'beauty',
      price: 450,
      originalPrice: 600,
      rating: 4.8,
      reviews: 94,
      reviewCount: 94,
      image: '/test.jpg',
      images: ['/test.jpg'],
      description: 'Set of 5 natural handmade soaps with different fragrances and benefits.',
      inStock: true,
      fastDelivery: false,
      verified: true
    },
    {
      id: 6,
      name: 'Bamboo Basket Set',
      seller: 'Ritu Verma',
      sellerName: 'Ritu Verma',
      location: 'Assam',
      category: 'handicrafts',
      price: 650,
      originalPrice: 800,
      rating: 4.6,
      reviews: 67,
      reviewCount: 67,
      image: '/test.jpg',
      images: ['/test.jpg'],
      description: 'Set of 3 eco-friendly bamboo baskets in different sizes.',
      inStock: true,
      fastDelivery: false,
      verified: true
    }
  ];

  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await marketplaceAPI.getProducts({ category: selectedCategory });
        if (response.success && response.products && response.products.length > 0) {
          // Use API products if available
          setProducts(response.products);
        } else {
          // Use fallback products if API returns empty or fails
          setProducts(fallbackProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Use fallback products if API fails
        setProducts(fallbackProducts);
      }
    };
    
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          const response = await marketplaceAPI.getCart();
          if (response.success) {
            // Transform API cart to match local format
            const transformedCart = response.cart?.map(item => ({
              id: item.productId?._id || item.productId,
              name: item.productId?.name || '',
              price: item.productId?.price || 0,
              quantity: item.quantity,
              image: item.productId?.images?.[0] || '/test.jpg'
            })) || [];
            setCart(transformedCart);
            storage.setCart(transformedCart);
          }
        } catch (error) {
          // Fallback to localStorage
          const savedCart = storage.getCart();
          setCart(savedCart);
        }
      }
    };
    
    loadCart();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && cart.length > 0) {
      storage.setCart(cart);
    }
  }, [cart, isAuthenticated]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    // Prepare product data for cart
    const cartProduct = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || product.image || '/test.jpg',
      seller: product.sellerName || product.seller?.name || product.seller || 'Unknown',
      sellerId: product.seller?._id || product.sellerId
    };
    
    try {
      // Try API first if product has _id (from database)
      if (product._id) {
        const response = await marketplaceAPI.addToCart(product._id, 1);
        if (response.success) {
          // Update local cart
          const updatedCart = storage.addToCart(cartProduct);
          setCart(updatedCart);
          alert('Product added to cart!');
          return;
        }
      }
    } catch (error) {
      console.error('Add to cart API error:', error);
      // Continue to localStorage fallback
    }
    
    // Fallback to localStorage (works for both API and fallback products)
    const updatedCart = storage.addToCart(cartProduct);
    setCart(updatedCart);
    alert('Product added to cart!');
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await marketplaceAPI.removeFromCart(productId);
      if (response.success) {
        const updatedCart = storage.removeFromCart(productId);
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      // Fallback to localStorage
      const updatedCart = storage.removeFromCart(productId);
      setCart(updatedCart);
    }
  };

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId || item.id?.toString() === productId?.toString());
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
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <ShoppingBag size={64} />
            <h2>No products found</h2>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const productId = product._id || product.id;
              return (
              <div key={productId} className="product-card" onClick={() => navigate(`/product/${productId}`)} style={{ cursor: 'pointer' }}>
                <div className="product-image">
                  <img src={product.images?.[0] || product.image || '/test.jpg'} alt={product.name} />
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
                <button 
                  className="wishlist-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isAuthenticated) {
                      alert('Please login to add items to wishlist');
                    } else {
                      alert('Added to wishlist!');
                    }
                  }}
                >
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
                  by {product.sellerName || product.seller?.name || 'Unknown'}, {product.location || product.seller?.location || ''}
                </p>
                <p className="product-description">{product.description}</p>
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < Math.floor(product.rating || 0) ? '#ffd700' : 'none'}
                          color="#ffd700"
                        />
                      ))}
                    </div>
                    <span className="rating-text">{product.rating || 0} ({product.reviewCount || product.reviews || 0} reviews)</span>
                  </div>
                <div className="product-pricing">
                  <div className="price">
                    <span className="current-price">₹{(product.price || 0).toLocaleString()}</span>
                    {product.originalPrice && product.originalPrice > (product.price || 0) && (
                      <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="product-actions">
                  {isInCart(productId) ? (
                    <button 
                      className="btn btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(productId);
                      }}
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
          })}
          </div>
        )}

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
