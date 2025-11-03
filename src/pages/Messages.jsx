import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messaging } from '../utils/messaging';
import {
  MessageCircle,
  Send,
  Search,
  ArrowLeft,
  User
} from 'lucide-react';
import './Messages.css';

const Messages = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const loadedConvs = messaging.getConversations(user.id);
    setConversations(loadedConvs);

    // Check if we should start a conversation with a specific user
    const locationState = window.history.state?.usr;
    if (locationState?.userId) {
      const existingConv = loadedConvs.find(c => c.userId === locationState.userId);
      if (existingConv) {
        setSelectedConversation(existingConv);
      } else {
        // Create new conversation entry
        setSelectedConversation({
          userId: locationState.userId,
          userName: locationState.userName || 'User',
          userAvatar: locationState.userAvatar || '/default-user.svg',
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          messages: []
        });
      }
    }
  }, [isAuthenticated, navigate, user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.userId);
      messaging.markAsRead(user.id, selectedConversation.userId);
      loadConversations(); // Refresh to update unread count
    }
  }, [selectedConversation, user]);

  const loadConversations = () => {
    const convos = messaging.getConversations(user.id);
    setConversations(convos);
  };

  const loadMessages = (otherUserId) => {
    const msgs = messaging.getMessagesBetween(user.id, otherUserId);
    setMessages(msgs);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    messaging.sendMessage({
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      recipientId: selectedConversation.userId,
      recipientName: selectedConversation.userName,
      recipientAvatar: selectedConversation.userAvatar,
      content: newMessage.trim()
    });

    setNewMessage('');
    loadMessages(selectedConversation.userId);
    loadConversations();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) return null;

  return (
    <div className="messages-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/community')}>
          <ArrowLeft size={18} />
          Back to Community
        </button>

        <h1>Messages</h1>

        <div className="messages-layout">
          {/* Conversations List */}
          <div className="conversations-sidebar">
            <div className="conversations-header">
              <h2>Conversations</h2>
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="conversations-list">
              {filteredConversations.length === 0 && !selectedConversation ? (
                <div className="no-conversations">
                  <MessageCircle size={48} />
                  <p>No conversations yet</p>
                  <p className="hint">Start messaging from mentor profiles or forum posts</p>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <div
                    key={conv.userId}
                    className={`conversation-item ${selectedConversation?.userId === conv.userId ? 'active' : ''}`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <img src={conv.userAvatar} alt={conv.userName} />
                    <div className="conversation-info">
                      <div className="conversation-header-row">
                        <h3>{conv.userName}</h3>
                        <span className="message-time">
                          {new Date(conv.lastMessageTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="conversation-footer-row">
                        <p className="last-message">{conv.lastMessage}</p>
                        {conv.unreadCount > 0 && (
                          <span className="unread-badge">{conv.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="messages-area">
            {selectedConversation ? (
              <>
                <div className="messages-header">
                  <div className="contact-info">
                    <img src={selectedConversation.userAvatar} alt={selectedConversation.userName} />
                    <h3>{selectedConversation.userName}</h3>
                  </div>
                </div>
                <div className="messages-list">
                  {messages.map(msg => {
                    const isOwn = msg.senderId === user.id;
                    return (
                      <div key={msg.id} className={`message ${isOwn ? 'own' : 'other'}`}>
                        {!isOwn && <img src={msg.senderAvatar} alt={msg.senderName} />}
                        <div className="message-content">
                          <div className="message-bubble">
                            <p>{msg.content}</p>
                            <span className="message-time">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        {isOwn && <img src={user.avatar || '/default-user.svg'} alt={user.name} />}
                      </div>
                    );
                  })}
                </div>
                <form className="message-input-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                    <Send size={20} />
                  </button>
                </form>
              </>
            ) : (
              <div className="no-conversation-selected">
                <MessageCircle size={64} />
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

