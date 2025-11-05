// Private Messaging Management Utility
// Stores private messages between users

export const messaging = {
  // Get all conversations for a user
  getConversations: (userId) => {
    const messages = messaging.getAllMessages();
    const conversations = {};
    
    messages.forEach(msg => {
      if (msg.senderId === userId || msg.recipientId === userId) {
        const otherUserId = msg.senderId === userId ? msg.recipientId : msg.senderId;
        const otherUserName = msg.senderId === userId ? msg.recipientName : msg.senderName;
        const otherUserAvatar = msg.senderId === userId ? msg.recipientAvatar : msg.senderAvatar;
        
        if (!conversations[otherUserId]) {
          conversations[otherUserId] = {
            userId: otherUserId,
            userName: otherUserName,
            userAvatar: otherUserAvatar,
            lastMessage: msg.content,
            lastMessageTime: msg.createdAt,
            unreadCount: msg.recipientId === userId && !msg.read ? 1 : 0,
            messages: []
          };
        } else {
          if (new Date(msg.createdAt) > new Date(conversations[otherUserId].lastMessageTime)) {
            conversations[otherUserId].lastMessage = msg.content;
            conversations[otherUserId].lastMessageTime = msg.createdAt;
          }
          if (msg.recipientId === userId && !msg.read) {
            conversations[otherUserId].unreadCount++;
          }
        }
        
        conversations[otherUserId].messages.push(msg);
      }
    });
    
    return Object.values(conversations).map(conv => ({
      ...conv,
      messages: conv.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }));
  },

  // Get messages between two users
  getMessagesBetween: (userId1, userId2) => {
    const messages = messaging.getAllMessages();
    return messages
      .filter(msg => 
        (msg.senderId === userId1 && msg.recipientId === userId2) ||
        (msg.senderId === userId2 && msg.recipientId === userId1)
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  // Send a message
  sendMessage: (messageData) => {
    const messages = messaging.getAllMessages();
    const newMessage = {
      id: Date.now(),
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      senderAvatar: messageData.senderAvatar || '/default-user.svg',
      recipientId: messageData.recipientId,
      recipientName: messageData.recipientName,
      recipientAvatar: messageData.recipientAvatar || '/default-user.svg',
      content: messageData.content,
      createdAt: new Date().toISOString(),
      read: false
    };
    messages.push(newMessage);
    localStorage.setItem('privateMessages', JSON.stringify(messages));
    return newMessage;
  },

  // Mark messages as read
  markAsRead: (userId, otherUserId) => {
    const messages = messaging.getAllMessages();
    messages.forEach(msg => {
      if (msg.senderId === otherUserId && msg.recipientId === userId && !msg.read) {
        msg.read = true;
        msg.readAt = new Date().toISOString();
      }
    });
    localStorage.setItem('privateMessages', JSON.stringify(messages));
  },

  // Get all messages
  getAllMessages: () => {
    const messages = localStorage.getItem('privateMessages');
    return messages ? JSON.parse(messages) : [];
  },

  // Delete a message
  deleteMessage: (messageId) => {
    const messages = messaging.getAllMessages();
    const filtered = messages.filter(msg => msg.id !== messageId);
    localStorage.setItem('privateMessages', JSON.stringify(filtered));
    return true;
  },

  // Get unread count for a user
  getUnreadCount: (userId) => {
    const messages = messaging.getAllMessages();
    return messages.filter(msg => msg.recipientId === userId && !msg.read).length;
  }
};

