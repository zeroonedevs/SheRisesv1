// Product Reviews Management Utility
// Stores product reviews and ratings

export const productReviews = {
  // Get all reviews for a product
  getByProductId: (productId) => {
    const reviews = localStorage.getItem('productReviews');
    const allReviews = reviews ? JSON.parse(reviews) : [];
    return allReviews.filter(r => r.productId === productId);
  },

  // Get average rating for a product
  getAverageRating: (productId) => {
    const reviews = productReviews.getByProductId(productId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  },

  // Add a new review
  add: (reviewData) => {
    const reviews = localStorage.getItem('productReviews');
    const allReviews = reviews ? JSON.parse(reviews) : [];
    const newReview = {
      id: Date.now(),
      productId: reviewData.productId,
      userId: reviewData.userId,
      userName: reviewData.userName,
      userAvatar: reviewData.userAvatar || '/default-user.svg',
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };
    allReviews.push(newReview);
    localStorage.setItem('productReviews', JSON.stringify(allReviews));
    return newReview;
  },

  // Get all reviews
  getAll: () => {
    const reviews = localStorage.getItem('productReviews');
    return reviews ? JSON.parse(reviews) : [];
  },

  // Delete a review (admin only)
  delete: (reviewId) => {
    const reviews = productReviews.getAll();
    const filtered = reviews.filter(r => r.id !== reviewId);
    localStorage.setItem('productReviews', JSON.stringify(filtered));
    return true;
  },
};

