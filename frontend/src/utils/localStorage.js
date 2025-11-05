// Local storage utility functions
// These help manage local data when API is not available

export const storage = {
  // User data
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearUser: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // Cart data
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  setCart: (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  addToCart: (product) => {
    const cart = storage.getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    storage.setCart(cart);
    return cart;
  },

  removeFromCart: (productId) => {
    const cart = storage.getCart().filter(item => item.id !== productId);
    storage.setCart(cart);
    return cart;
  },

  clearCart: () => {
    localStorage.removeItem('cart');
  },

  // Course enrollment - Per User
  getEnrolledCourses: (userId) => {
    if (!userId) {
      // Fallback: try to get from current user
      const user = storage.getUser();
      if (!user || !user.id) return [];
      userId = user.id;
    }
    const enrolled = localStorage.getItem(`enrolledCourses_${userId}`);
    return enrolled ? JSON.parse(enrolled) : [];
  },

  setEnrolledCourses: (courses, userId) => {
    if (!userId) {
      // Fallback: try to get from current user
      const user = storage.getUser();
      if (!user || !user.id) return;
      userId = user.id;
    }
    localStorage.setItem(`enrolledCourses_${userId}`, JSON.stringify(courses));
  },

  enrollInCourse: (course, userId) => {
    if (!userId) {
      // Fallback: try to get from current user
      const user = storage.getUser();
      if (!user || !user.id) return [];
      userId = user.id;
    }
    const enrolled = storage.getEnrolledCourses(userId);
    if (!enrolled.find(c => c.id === course.id)) {
      enrolled.push({ ...course, enrolledAt: new Date().toISOString(), progress: 0 });
      storage.setEnrolledCourses(enrolled, userId);
    }
    return enrolled;
  },

  updateCourseProgress: (courseId, progress, userId) => {
    if (!userId) {
      // Fallback: try to get from current user
      const user = storage.getUser();
      if (!user || !user.id) return [];
      userId = user.id;
    }
    const enrolled = storage.getEnrolledCourses(userId);
    const course = enrolled.find(c => c.id === courseId);
    if (course) {
      course.progress = progress;
      storage.setEnrolledCourses(enrolled, userId);
    }
    return enrolled;
  },

  // Messages
  getMessages: () => {
    const messages = localStorage.getItem('messages');
    return messages ? JSON.parse(messages) : [];
  },

  setMessages: (messages) => {
    localStorage.setItem('messages', JSON.stringify(messages));
  },

  addMessage: (message) => {
    const messages = storage.getMessages();
    messages.push({
      ...message,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    });
    storage.setMessages(messages);
    return messages;
  },
};

