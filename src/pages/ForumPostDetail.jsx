import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { forum } from '../utils/forum';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Trash2,
  Flag,
  Send,
  MapPin
} from 'lucide-react';
import './ForumPostDetail.css';

const ForumPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const postData = forum.getPostById(id);
    if (postData) {
      setPost(postData);
      setEditContent(postData.content);
    } else {
      // Use mock data if not found
      setPost({
        id: parseInt(id),
        author: 'Priya Sharma',
        authorId: 'user1',
        authorAvatar: '/default-user.svg',
        location: 'Mumbai, Maharashtra',
        category: 'Business',
        title: 'Tips for Starting a Home-based Business',
        content: 'I started my home-based jewelry business 6 months ago and wanted to share some tips that helped me succeed...',
        likes: 45,
        likedBy: [],
        comments: [],
        createdAt: new Date().toISOString()
      });
    }
  }, [id]);

  const handleLike = () => {
    if (!isAuthenticated) {
      alert('Please login to like posts');
      return;
    }
    const updated = forum.toggleLike(post.id, user.id);
    if (updated) setPost(updated);
  };

  const handleAddComment = () => {
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    const comment = forum.addComment(post.id, {
      authorId: user.id,
      author: user.name,
      authorAvatar: user.avatar,
      content: newComment.trim()
    });

    if (comment) {
      const updated = forum.getPostById(id);
      setPost(updated);
      setNewComment('');
    }
  };

  const handleAddReply = (commentId) => {
    if (!isAuthenticated) {
      alert('Please login to reply');
      return;
    }
    if (!replyText.trim()) return;

    const reply = forum.addReply(post.id, commentId, {
      authorId: user.id,
      author: user.name,
      authorAvatar: user.avatar,
      content: replyText.trim()
    });

    if (reply) {
      const updated = forum.getPostById(id);
      setPost(updated);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleEditPost = () => {
    if (!isAuthenticated || user.id !== post.authorId) return;
    
    const updated = forum.updatePost(post.id, { content: editContent });
    if (updated) {
      setPost(updated);
      setIsEditing(false);
    }
  };

  const handleDeletePost = () => {
    if (!isAuthenticated || (user.id !== post.authorId && user.role !== 'admin')) {
      alert('You do not have permission to delete this post');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      forum.deletePost(post.id);
      navigate('/community');
    }
  };

  const handleReportPost = () => {
    if (!isAuthenticated) {
      alert('Please login to report posts');
      return;
    }
    if (!reportReason.trim()) {
      alert('Please provide a reason for reporting');
      return;
    }

    forum.reportPost(post.id, {
      reportedBy: user.id,
      reason: reportReason
    });

    alert('Post reported. Thank you for helping keep our community safe.');
    setShowReportModal(false);
    setReportReason('');
  };

  const isLiked = post && post.likedBy && post.likedBy.includes(user?.id);
  const canEdit = post && user && (user.id === post.authorId || user.role === 'admin');
  const canDelete = canEdit;

  if (!post) {
    return (
      <div className="forum-post-detail">
        <div className="container">
          <p>Post not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/community')}>
            Back to Forum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forum-post-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/community')}>
          <ArrowLeft size={18} />
          Back to Forum
        </button>

        <div className="post-detail-card">
          <div className="post-header">
            <div className="author-info">
              <img src={post.authorAvatar || '/default-user.svg'} alt={post.author} />
              <div>
                <h3>{post.author}</h3>
                <p>
                  <MapPin size={14} />
                  {post.location}
                </p>
                <span className="post-category">{post.category}</span>
              </div>
            </div>
            <div className="post-actions-header">
              {canEdit && (
                <button className="action-icon-btn" onClick={() => setIsEditing(!isEditing)}>
                  <Edit size={18} />
                </button>
              )}
              {canDelete && (
                <button className="action-icon-btn" onClick={handleDeletePost}>
                  <Trash2 size={18} />
                </button>
              )}
              {isAuthenticated && (
                <button className="action-icon-btn" onClick={() => setShowReportModal(true)}>
                  <Flag size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="post-content-section">
            <h1>{post.title}</h1>
            {isEditing ? (
              <div className="edit-form">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={6}
                />
                <div className="edit-actions">
                  <button className="btn btn-primary" onClick={handleEditPost}>
                    Save
                  </button>
                  <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p>{post.content}</p>
            )}
          </div>

          <div className="post-footer">
            <button
              className={`action-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              disabled={!isAuthenticated}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              {post.likes || 0}
            </button>
            <button className="action-btn" disabled>
              <MessageCircle size={18} />
              {post.comments?.length || 0} Comments
            </button>
            <button className="action-btn">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h2>Comments ({post.comments?.length || 0})</h2>

          {isAuthenticated && (
            <div className="add-comment-form">
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <button className="btn btn-primary" onClick={handleAddComment}>
                <Send size={16} />
                Post Comment
              </button>
            </div>
          )}

          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <img src={comment.authorAvatar || '/default-user.svg'} alt={comment.author} />
                  <div className="comment-content">
                    <div className="comment-header">
                      <h4>{comment.author}</h4>
                      <span className="comment-time">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                    <div className="comment-actions">
                      <button
                        className="reply-btn"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        Reply
                      </button>
                    </div>
                    {replyingTo === comment.id && (
                      <div className="reply-form">
                        <textarea
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                        />
                        <div className="reply-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAddReply(comment.id)}
                          >
                            Post Reply
                          </button>
                          <button
                            className="btn btn-outline"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="replies-list">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="reply-item">
                            <img src={reply.authorAvatar || '/default-user.svg'} alt={reply.author} />
                            <div className="reply-content">
                              <div className="reply-header">
                                <h5>{reply.author}</h5>
                                <span className="reply-time">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p>{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-comments">
                <MessageCircle size={48} />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>

        {/* Report Modal */}
        {showReportModal && (
          <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Report Post</h3>
              <p>Please provide a reason for reporting this post:</p>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the issue..."
                rows={4}
              />
              <div className="modal-actions">
                <button className="btn btn-outline" onClick={() => setShowReportModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleReportPost}>
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPostDetail;

