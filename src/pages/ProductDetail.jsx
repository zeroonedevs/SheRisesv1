import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productReviews } from '../utils/productReviews';
import { storage } from '../utils/localStorage';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Shield,
  Truck,
  MapPin,
  MessageSquare,
  Send,
  ThumbsUp,
  Edit,
  Trash2
} from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [isInCart, setIsInCart] = useState(false);

  // Mock product data - in real app, fetch from API
  const products = [
    {
      id: 1,
      name: 'Handwoven Silk Saree',
      seller: 'Sunita Devi',
      sellerId: 'seller1',
      location: 'Varanasi, UP',
      category: 'textiles',
      price: 2500,
      originalPrice: 3000,
      rating: 4.9,
      reviews: 127,
      images: [
        '/klu-sac-logo.png',
        '/klu-sac-logo.png',
      ],
      description: 'Beautiful handwoven silk saree with intricate zari work. Perfect for special occasions.',
      detailedDescription: 'This exquisite handwoven silk saree features traditional zari work that has been passed down through generations. Made with premium silk threads and handcrafted patterns, each saree is a unique piece of art. The intricate designs showcase the rich cultural heritage of Varanasi.',
      inStock: true,
      stockQuantity: 15,
      fastDelivery: true,
      verified: true,
      specifications: {
        material: 'Pure Silk',
        color: 'Red & Gold',
        size: '6 Yards',
        weight: '800g',
        care: 'Dry Clean Only'
      }
    },
    // Add more products as needed
  ];

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      const productReviewsData = productReviewsUtil.getByProductId(foundProduct.id);
      setReviews(productReviewsData);
      const avg = productReviewsUtil.getAverageRating(foundProduct.id);
      setAverageRating(parseFloat(avg));
    }

    if (isAuthenticated) {
      const cart = storage.getCart();
      setIsInCart(cart.some(item => item.id === parseInt(id)));
    }
  }, [id, isAuthenticated]);

  const handleAddReview = () => {
    if (!isAuthenticated) {
      alert('Please login to add a review');
      return;
    }
    if (!reviewForm.comment.trim()) {
      alert('Please write a review');
      return;
    }

    productReviewsUtil.add({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });

    const updatedReviews = productReviewsUtil.getByProductId(product.id);
    setReviews(updatedReviews);
    const avg = productReviewsUtil.getAverageRating(product.id);
    setAverageRating(parseFloat(avg));
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    storage.addToCart(product);
    setIsInCart(true);
  };

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container">
          <p>Product not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/marketplace')}>
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/marketplace')}>
          <ArrowLeft size={18} />
          Back to Marketplace
        </button>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.images[0]} alt={product.name} />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-badges">
              {product.verified && (
                <span className="badge verified">
                  <Shield size={14} />
                  Verified Seller
                </span>
              )}
              {product.fastDelivery && (
                <span className="badge delivery">
                  <Truck size={14} />
                  Fast Delivery
                </span>
              )}
            </div>

            <h1>{product.name}</h1>
            
            <div className="product-rating-header">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(averageRating) ? '#ffd700' : 'none'}
                    color="#ffd700"
                  />
                ))}
              </div>
              <span className="rating-text">
                {averageRating > 0 ? averageRating : product.rating} ({reviews.length || product.reviews} reviews)
              </span>
            </div>

            <div className="product-pricing">
              <span className="current-price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="discount">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.detailedDescription || product.description}</p>
            </div>

            <div className="product-specifications">
              <h3>Specifications</h3>
              <div className="specs-grid">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="seller-info">
              <h3>Seller Information</h3>
              <p>
                <MapPin size={16} />
                {product.seller}, {product.location}
              </p>
            </div>

            <div className="stock-info">
              {product.inStock ? (
                <p className="in-stock">✓ In Stock ({product.stockQuantity} available)</p>
              ) : (
                <p className="out-of-stock">Out of Stock</p>
              )}
            </div>

            <div className="product-actions">
              {isInCart ? (
                <button className="btn btn-secondary" onClick={() => navigate('/marketplace')}>
                  View Cart
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              )}
              <button className="btn btn-outline">
                <Heart size={20} />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            {isAuthenticated && (
              <button
                className="btn btn-primary"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                <MessageSquare size={18} />
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="review-form">
              <h3>Write Your Review</h3>
              <div className="rating-selector">
                <label>Rating:</label>
                <div className="stars-selector">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      className={`star-btn ${reviewForm.rating >= rating ? 'active' : ''}`}
                      onClick={() => setReviewForm({ ...reviewForm, rating })}
                    >
                      <Star size={24} fill={reviewForm.rating >= rating ? '#ffd700' : 'none'} color="#ffd700" />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Share your experience with this product..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={5}
              />
              <div className="review-form-actions">
                <button className="btn btn-outline" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddReview}>
                  <Send size={18} />
                  Submit Review
                </button>
              </div>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="no-reviews">
              <MessageSquare size={48} />
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={review.userAvatar} alt={review.userName} />
                      <div>
                        <h4>{review.userName}</h4>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < review.rating ? '#ffd700' : 'none'}
                              color="#ffd700"
                            />
                          ))}
                        </div>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <div className="review-actions">
                    <button className="helpful-btn">
                      <ThumbsUp size={14} />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

