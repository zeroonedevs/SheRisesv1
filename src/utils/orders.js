// Orders Management Utility
// Stores order information

export const orders = {
  // Create a new order
  create: (orderData) => {
    const allOrders = orders.getAll();
    const newOrder = {
      id: `ORD${Date.now()}`,
      userId: orderData.userId,
      userName: orderData.userName,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'completed',
      orderStatus: 'pending', // pending, processing, shipped, delivered, cancelled
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    allOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(allOrders));
    return newOrder;
  },

  // Get all orders
  getAll: () => {
    const ordersData = localStorage.getItem('orders');
    return ordersData ? JSON.parse(ordersData) : [];
  },

  // Get orders by user ID
  getByUserId: (userId) => {
    return orders.getAll().filter(o => o.userId === userId);
  },

  // Get orders by seller (from items)
  getBySellerId: (sellerId) => {
    return orders.getAll().filter(order => 
      order.items.some(item => item.sellerId === sellerId)
    );
  },

  // Get order by ID
  getById: (orderId) => {
    return orders.getAll().find(o => o.id === orderId);
  },

  // Update order status
  updateStatus: (orderId, status) => {
    const allOrders = orders.getAll();
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      order.updatedAt = new Date().toISOString();
      localStorage.setItem('orders', JSON.stringify(allOrders));
      return order;
    }
    return null;
  },

  // Delete order (admin only)
  delete: (orderId) => {
    const allOrders = orders.getAll();
    const filtered = allOrders.filter(o => o.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(filtered));
    return true;
  },
};

