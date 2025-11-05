import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communityAPI } from '../utils/api';
import { messaging } from '../utils/messaging';
import { mentorship } from '../utils/mentorship';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus, 
  Search,
  Filter,
  Award,
  Star,
  MapPin,
  Calendar,
  UserPlus,
  Send
} from 'lucide-react';
import './Community.css';

const Community = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('forum');
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [searchTerm, setSearchTerm] = useState('');
  const [forumPostsData, setForumPostsData] = useState([]);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    // Load forum posts from MongoDB
    const loadForumPosts = async () => {
      try {
        const response = await communityAPI.getForumPosts({ sort: 'recent' });
        if (response.success && response.posts) {
          // Transform MongoDB posts to match frontend format
          const transformedPosts = response.posts.map(post => ({
            id: post._id || post.id,
            _id: post._id,
            title: post.title,
            content: post.content,
            author: post.author?.name || post.authorName,
            authorId: post.author?._id || post.author,
            authorAvatar: post.author?.avatar || post.authorAvatar || '/default-user.svg',
            location: post.author?.location || post.location || '',
            category: post.category,
            likes: post.likeCount || post.likes?.length || 0,
            likedBy: post.likes || [],
            comments: post.comments || [],
            commentCount: post.commentCount || post.comments?.length || 0,
            createdAt: post.createdAt,
            timeAgo: getTimeAgo(post.createdAt)
          }));
          setForumPostsData(transformedPosts.length > 0 ? transformedPosts : forumPosts);
        }
      } catch (error) {
        console.error('Error loading forum posts:', error);
        // Fallback to mock data if API fails
        setForumPostsData(forumPosts);
      }
    };
    
    loadForumPosts();
    
    // Load mentorship requests if authenticated
    if (isAuthenticated && user) {
      if (user.isMentor) {
        const requests = mentorship.getRequestsForMentor(user.id);
        setMentorshipRequests(requests);
      } else {
        const requests = mentorship.getRequestsFromMentee(user.id);
        setMentorshipRequests(requests);
      }
    }
  }, [isAuthenticated, user]);

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const tabs = [
    { id: 'forum', name: 'Community Forum', icon: MessageCircle },
    { id: 'mentors', name: 'Find Mentors', icon: Award },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'messages', name: 'Messages', icon: MessageCircle }
  ];

  const forumPosts = [
    {
      id: 1,
      title: 'Tips for Starting a Home-based Business',
      author: 'Priya Sharma',
      location: 'Mumbai, Maharashtra',
      category: 'Business',
      content: 'I started my home-based jewelry business 6 months ago and wanted to share some tips that helped me succeed...',
      likes: 45,
      comments: 12,
      timeAgo: '2 hours ago',
      isLiked: false,
      authorVerified: true,
      authorExpertise: 'Business Coach'
    },
    {
      id: 2,
      title: 'Digital Marketing for Rural Entrepreneurs',
      author: 'Sunita Devi',
      location: 'Village, Bihar',
      category: 'Digital Skills',
      content: 'Many women in rural areas ask me about digital marketing. Here are some simple strategies that work...',
      likes: 38,
      comments: 8,
      timeAgo: '4 hours ago',
      isLiked: true,
      authorVerified: true,
      authorExpertise: 'Digital Marketing Expert'
    },
    {
      id: 3,
      title: 'Traditional Handloom Weaving Techniques',
      author: 'Kavita Joshi',
      location: 'Khurja, UP',
      category: 'Traditional Crafts',
      content: 'Sharing some traditional weaving techniques passed down through generations in my family...',
      likes: 52,
      comments: 15,
      timeAgo: '6 hours ago',
      isLiked: false,
      authorVerified: true,
      authorExpertise: 'Master Artisan'
    }
  ];

  const mentors = [
    {
      id: 1,
      name: 'Dr. Meera Patel',
      location: 'Ahmedabad, Gujarat',
      expertise: ['Business Development', 'Financial Planning'],
      experience: '15+ years',
      rating: 4.9,
      students: 250,
      bio: 'CA with 15 years of experience helping women entrepreneurs with financial planning and business development.',
      available: true,
      verified: true,
      image: '/klu-sac-logo.png'
    },
    {
      id: 2,
      name: 'Anjali Singh',
      location: 'Delhi',
      expertise: ['Digital Marketing', 'E-commerce'],
      experience: '8+ years',
      rating: 4.8,
      students: 180,
      bio: 'Digital marketing expert specializing in helping women start and grow their online businesses.',
      available: true,
      verified: true,
      image: '/klu-sac-logo.png'
    },
    {
      id: 3,
      name: 'Ritu Verma',
      location: 'Kolkata, West Bengal',
      expertise: ['Traditional Crafts', 'Product Development'],
      experience: '12+ years',
      rating: 4.9,
      students: 320,
      bio: 'Master artisan and product development expert helping women commercialize traditional crafts.',
      available: false,
      verified: true,
      image: '/klu-sac-logo.png'
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Women Entrepreneurship Workshop',
      date: '2024-02-15',
      time: '10:00 AM - 4:00 PM',
      location: 'Mumbai, Maharashtra',
      type: 'Workshop',
      attendees: 45,
      maxAttendees: 50,
      description: 'Learn the fundamentals of starting and running a successful business.',
      organizer: 'SheRises Team',
      price: 'Free'
    },
    {
      id: 2,
      title: 'Digital Skills Training Session',
      date: '2024-02-20',
      time: '2:00 PM - 5:00 PM',
      location: 'Online',
      type: 'Webinar',
      attendees: 120,
      maxAttendees: 200,
      description: 'Master essential digital skills for modern business.',
      organizer: 'Tech Trainer Anjali',
      price: 'Free'
    },
    {
      id: 3,
      title: 'Traditional Craft Fair',
      date: '2024-02-25',
      time: '9:00 AM - 6:00 PM',
      location: 'Delhi',
      type: 'Exhibition',
      attendees: 85,
      maxAttendees: 100,
      description: 'Showcase and sell your traditional handicrafts.',
      organizer: 'Craft Association',
      price: '₹500'
    }
  ];

  const postsToDisplay = forumPostsData.length > 0 ? forumPostsData : forumPosts;
  const filteredPosts = postsToDisplay.filter(post =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLike = (postId) => {
    // In a real app, this would update the backend
    console.log('Liked post:', postId);
  };

  const handleNewPost = async () => {
    if (!isAuthenticated) {
      alert('Please login to create a post');
      return;
    }
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    try {
      const response = await communityAPI.createPost({
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        category: newPost.category
      });

      if (response.success && response.post) {
        const post = response.post;
        // Transform MongoDB post to match frontend format
        const transformedPost = {
          id: post._id || post.id,
          _id: post._id,
          title: post.title,
          content: post.content,
          author: post.author?.name || post.authorName,
          authorId: post.author?._id || post.author,
          authorAvatar: post.author?.avatar || post.authorAvatar || '/default-user.svg',
          location: post.author?.location || post.location || '',
          category: post.category,
          likes: post.likeCount || 0,
          likedBy: post.likes || [],
          comments: post.comments || [],
          commentCount: post.commentCount || 0,
          createdAt: post.createdAt,
          timeAgo: 'Just now'
        };
        setForumPostsData([transformedPost, ...forumPostsData]);
        setNewPost({ title: '', content: '', category: 'General' });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleLikePost = async (postId) => {
    if (!isAuthenticated) {
      alert('Please login to like posts');
      return;
    }
    try {
      const response = await communityAPI.likePost(postId);
      if (response.success) {
        // Reload posts to get updated like count
        const refreshResponse = await communityAPI.getForumPosts({ sort: 'recent' });
        if (refreshResponse.success && refreshResponse.posts) {
          const transformedPosts = refreshResponse.posts.map(post => ({
            id: post._id || post.id,
            _id: post._id,
            title: post.title,
            content: post.content,
            author: post.author?.name || post.authorName,
            authorId: post.author?._id || post.author,
            authorAvatar: post.author?.avatar || post.authorAvatar || '/default-user.svg',
            location: post.author?.location || post.location || '',
            category: post.category,
            likes: post.likeCount || post.likes?.length || 0,
            likedBy: post.likes || [],
            comments: post.comments || [],
            commentCount: post.commentCount || post.comments?.length || 0,
            createdAt: post.createdAt,
            timeAgo: getTimeAgo(post.createdAt)
          }));
          setForumPostsData(transformedPosts);
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleConnectMentor = (mentorId, mentorName, mentorAvatar) => {
    if (!isAuthenticated) {
      alert('Please login to connect with mentors');
      return;
    }
    setShowRequestModal({ mentorId, mentorName, mentorAvatar });
  };

  const handleSendMentorshipRequest = () => {
    if (!requestMessage.trim()) {
      alert('Please add a message to your request');
      return;
    }

    const request = mentorship.createRequest({
      menteeId: user.id,
      menteeName: user.name,
      menteeAvatar: user.avatar,
      mentorId: showRequestModal.mentorId,
      mentorName: showRequestModal.mentorName,
      mentorAvatar: showRequestModal.mentorAvatar,
      message: requestMessage.trim()
    });

    if (request) {
      alert('Mentorship request sent!');
      setShowRequestModal(null);
      setRequestMessage('');
      const requests = mentorship.getRequestsFromMentee(user.id);
      setMentorshipRequests(requests);
    }
  };

  const handleStartMessage = (userId, userName, userAvatar) => {
    if (!isAuthenticated) {
      alert('Please login to send messages');
      return;
    }
    navigate('/messages', { state: { userId, userName, userAvatar } });
  };

  return (
    <div className="community">
      <div className="container">
        {/* Header */}
        <div className="community-header">
          <h1>Community</h1>
          <p>Connect, learn, and grow together. Join discussions, find mentors, and participate in events.</p>
        </div>

        {/* Stats */}
        <div className="community-stats">
          <div className="stat-item">
            <Users className="stat-icon" />
            <div className="stat-content">
              <h3>2,500+</h3>
              <p>Active Members</p>
            </div>
          </div>
          <div className="stat-item">
            <MessageCircle className="stat-icon" />
            <div className="stat-content">
              <h3>150+</h3>
              <p>Discussions</p>
            </div>
          </div>
          <div className="stat-item">
            <Award className="stat-icon" />
            <div className="stat-content">
              <h3>25+</h3>
              <p>Expert Mentors</p>
            </div>
          </div>
          <div className="stat-item">
            <Calendar className="stat-icon" />
            <div className="stat-content">
              <h3>12+</h3>
              <p>Upcoming Events</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="community-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div className="forum-section">
            <div className="forum-header">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-primary">
                <Plus size={20} />
                Start Discussion
              </button>
            </div>

            {/* New Post Form */}
            {isAuthenticated && (
              <div className="new-post-form">
                <h3>Share Your Thoughts</h3>
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="post-title-input"
                />
                <textarea
                  placeholder="What's on your mind? Share your experiences, ask questions, or offer advice..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={4}
                />
                <div className="form-actions">
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="category-select"
                  >
                    <option value="General">General</option>
                    <option value="Business">Business</option>
                    <option value="Digital Skills">Digital Skills</option>
                    <option value="Traditional Crafts">Traditional Crafts</option>
                    <option value="Support">Support</option>
                  </select>
                  <button className="btn btn-primary" onClick={handleNewPost}>
                    <Send size={16} />
                    Post
                  </button>
                </div>
              </div>
            )}

            {/* Forum Posts */}
            <div className="forum-posts">
              {filteredPosts.map(post => {
                // Check if user liked the post (handle both string and ObjectId formats)
                const isLiked = post.likedBy && (
                  post.likedBy.some(likeId => 
                    String(likeId) === String(user?.id) || 
                    String(likeId?._id || likeId) === String(user?.id)
                  )
                );
                const postId = post._id || post.id;
                return (
                  <div 
                    key={postId} 
                    className="forum-post"
                    onClick={() => navigate(`/forum/${postId}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="post-header">
                      <div className="author-info">
                        <div className="author-avatar">
                          <img src={post.authorAvatar || '/default-user.svg'} alt={post.author} />
                        </div>
                        <div className="author-details">
                          <h4>{post.author}</h4>
                          <p>
                            <MapPin size={12} />
                            {post.location || 'Location not specified'}
                          </p>
                        </div>
                      </div>
                      <div className="post-meta">
                        <span className="category">{post.category}</span>
                        <span className="time">
                          {post.timeAgo || new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="post-content">
                      <h3>{post.title}</h3>
                      <p>{post.content}</p>
                    </div>
                    <div className="post-actions" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className={`action-btn ${isLiked ? 'liked' : ''}`}
                        onClick={() => handleLikePost(postId)}
                      >
                        <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                        {post.likes || 0}
                      </button>
                      <button className="action-btn">
                        <MessageCircle size={16} />
                        {post.commentCount || post.comments?.length || 0}
                      </button>
                      <button className="action-btn">
                        <Share2 size={16} />
                        Share
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <div className="mentors-section">
            <div className="mentors-header">
              <h2>Find Your Mentor</h2>
              <p>Connect with experienced professionals who can guide you on your journey.</p>
            </div>
            <div className="mentors-grid">
              {mentors.map(mentor => (
                <div key={mentor.id} className="mentor-card">
                  <div className="mentor-header">
                    <div className="mentor-avatar">
                      <img src={mentor.image} alt={mentor.name} />
                      {mentor.verified && <span className="verified-badge">✓</span>}
                    </div>
                    <div className="mentor-info">
                      <h3>{mentor.name}</h3>
                      <p>
                        <MapPin size={14} />
                        {mentor.location}
                      </p>
                      <div className="mentor-rating">
                        <Star size={14} fill="#ffd700" color="#ffd700" />
                        <span>{mentor.rating}</span>
                        <span>({mentor.students} students)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mentor-expertise">
                    {mentor.expertise.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  <p className="mentor-bio">{mentor.bio}</p>
                  <div className="mentor-footer">
                    <div className="experience">{mentor.experience} experience</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className={`btn ${mentor.available ? 'btn-primary' : 'btn-secondary'}`}
                        disabled={!mentor.available}
                        onClick={() => {
                          if (mentor.available && isAuthenticated) {
                            if (mentorship.hasExistingRequest(user.id, mentor.id)) {
                              alert('You already have a pending request with this mentor');
                            } else {
                              handleConnectMentor(mentor.id, mentor.name, mentor.image);
                            }
                          } else if (!isAuthenticated) {
                            alert('Please login to connect with mentors');
                          }
                        }}
                      >
                        <UserPlus size={16} />
                        {mentor.available ? 'Request Mentorship' : 'Unavailable'}
                      </button>
                      {isAuthenticated && (
                        <button
                          className="btn btn-outline"
                          onClick={() => handleStartMessage(mentor.id, mentor.name, mentor.image)}
                        >
                          <MessageCircle size={16} />
                          Message
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="messages-section">
            <div className="messages-header">
              <h2>Private Messages</h2>
              <p>Communicate privately with other members of the community</p>
            </div>
            {isAuthenticated ? (
              <div className="messages-redirect">
                <MessageCircle size={64} />
                <h3>Your Messages</h3>
                <p>Access your private messages and conversations</p>
                <button className="btn btn-primary" onClick={() => navigate('/messages')}>
                  Go to Messages
                </button>
              </div>
            ) : (
              <div className="messages-redirect">
                <MessageCircle size={64} />
                <p>Please login to access messages</p>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  Login
                </button>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="events-section">
            <div className="events-header">
              <h2>Upcoming Events</h2>
              <p>Join workshops, webinars, and networking events designed for women entrepreneurs.</p>
            </div>
            <div className="events-grid">
              {events.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <div className="event-date">
                      <div className="date-day">{new Date(event.date).getDate()}</div>
                      <div className="date-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                    </div>
                    <div className="event-info">
                      <h3>{event.title}</h3>
                      <p className="event-type">{event.type}</p>
                    </div>
                  </div>
                  <div className="event-details">
                    <div className="event-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>{event.date}</span>
                      </div>
                      <div className="meta-item">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                      <div className="meta-item">
                        <Users size={14} />
                        <span>{event.attendees}/{event.maxAttendees} attendees</span>
                      </div>
                    </div>
                    <p className="event-description">{event.description}</p>
                    <div className="event-footer">
                      <div className="event-organizer">by {event.organizer}</div>
                      <div className="event-price">{event.price}</div>
                    </div>
                    <button className="btn btn-primary">Register</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mentorship Request Modal */}
        {showRequestModal && (
          <div className="modal-overlay" onClick={() => setShowRequestModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Request Mentorship</h3>
              <p>Send a mentorship request to {showRequestModal.mentorName}</p>
              <textarea
                placeholder="Tell the mentor why you'd like to connect..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={4}
              />
              <div className="modal-actions">
                <button className="btn btn-outline" onClick={() => setShowRequestModal(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSendMentorshipRequest}>
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
