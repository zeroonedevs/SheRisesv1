// API utility functions for making HTTP requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function for making API requests
const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  // Ensure endpoint starts with / and API_BASE_URL doesn't end with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const url = `${cleanBaseUrl}${cleanEndpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      console.error('API Error:', {
        url,
        status: response.status,
        error: error.message || 'Request failed'
      });
      throw new Error(error.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', {
      url,
      error: error.message
    });
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => request('/auth/me'),
};

// Courses API calls
export const coursesAPI = {
  getAll: () => request('/courses'),
  getById: (id) => request(`/courses/${id}`),
  enroll: (courseId) => request(`/courses/${courseId}/enroll`, { method: 'POST' }),
  getEnrolled: () => request('/courses/enrolled'),
  updateProgress: (courseId, lessonId, progress) => 
    request(`/courses/${courseId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ lessonId, progress }),
    }),
};

// Marketplace API calls
export const marketplaceAPI = {
  getProducts: (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return request(`/products?${queryString}`);
  },
  getProductById: (id) => request(`/products/${id}`),
  addToCart: (productId, quantity = 1) => 
    request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  getCart: () => request('/cart'),
  removeFromCart: (productId) => 
    request(`/cart/${productId}`, { method: 'DELETE' }),
  checkout: (checkoutData) => 
    request('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    }),
  getOrders: () => request('/orders'),
};

// Community API calls
export const communityAPI = {
  getForumPosts: (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return request(`/forum/posts?${queryString}`);
  },
  createPost: (postData) => 
    request('/forum/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),
  getPostById: (id) => request(`/forum/posts/${id}`),
  likePost: (postId) => 
    request(`/forum/posts/${postId}/like`, {
      method: 'POST',
    }),
  replyToPost: (postId, replyData) => 
    request(`/forum/posts/${postId}/replies`, {
      method: 'POST',
      body: JSON.stringify(replyData),
    }),
  getMentors: (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return request(`/mentors?${queryString}`);
  },
  requestMentorship: (mentorId, message) => 
    request('/mentors/request', {
      method: 'POST',
      body: JSON.stringify({ mentorId, message }),
    }),
  getMessages: () => request('/messages'),
  sendMessage: (recipientId, message) => 
    request('/messages', {
      method: 'POST',
      body: JSON.stringify({ recipientId, message }),
    }),
};

// Awareness API calls
export const awarenessAPI = {
  getArticles: (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return request(`/awareness/articles?${queryString}`);
  },
  getArticleById: (id) => request(`/awareness/articles/${id}`),
  getHelplines: () => request('/awareness/helplines'),
  getSchemes: () => request('/awareness/schemes'),
};

// User API calls
export const userAPI = {
  getProfile: () => request('/user/profile'),
  updateProfile: (profileData) => 
    request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return request('/user/avatar', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  },
};

export default request;

