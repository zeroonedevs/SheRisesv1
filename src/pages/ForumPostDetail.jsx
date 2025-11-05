import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communityAPI } from '../utils/api';
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
    const loadPost = async () => {
      try {
        const response = await communityAPI.getPostById(id);
        if (response.success && response.post) {
          const postData = response.post;
          // Transform MongoDB post to match frontend format
          const transformedPost = {
            id: postData._id || postData.id,
            _id: postData._id,
            title: postData.title,
            content: postData.content,
            author: postData.author?.name || postData.authorName,
            authorId: postData.author?._id || postData.author,
            authorAvatar: postData.author?.avatar || postData.authorAvatar || '/default-user.svg',
            location: postData.author?.location || postData.location || '',
            category: postData.category,
            likes: postData.likeCount || postData.likes?.length || 0,
            likedBy: postData.likes || [],
            comments: postData.comments || [],
            commentCount: postData.commentCount || postData.comments?.length || 0,
            createdAt: postData.createdAt,
            isDeleted: postData.isDeleted
          };
          setPost(transformedPost);
          setEditContent(transformedPost.content);
        }
      } catch (error) {
        console.error('Error loading post:', error);
        // Fallback to mock data if API fails
        setPost({
          id: id,
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
    };
    
    loadPost();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like posts');
      return;
    }
    try {
      const response = await communityAPI.likePost(post._id || post.id);
      if (response.success) {
        // Reload post to get updated like count
        const refreshResponse = await communityAPI.getPostById(post._id || post.id);
        if (refreshResponse.success && refreshResponse.post) {
          const postData = refreshResponse.post;
          const updatedPost = {
            ...post,
            likes: postData.likeCount || postData.likes?.length || 0,
            likedBy: postData.likes || []
          };
          setPost(updatedPost);
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const response = await communityAPI.replyToPost(post._id || post.id, {
        content: newComment.trim()
      });
      
      if (response.success && response.post) {
        const postData = response.post;
        const updatedPost = {
          ...post,
          comments: postData.comments || [],
          commentCount: postData.commentCount || postData.comments?.length || 0
        };
        setPost(updatedPost);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleAddReply = async (commentId) => {
    if (!isAuthenticated) {
      alert('Please login to reply');
      return;
    }
    if (!replyText.trim()) return;

    // Note: Backend doesn't have nested replies yet, so we'll add it as a regular comment
    // In the future, you can add a nested reply endpoint
    try {
      const response = await communityAPI.replyToPost(post._id || post.id, {
        content: replyText.trim(),
        parentCommentId: commentId
      });
      
      if (response.success && response.post) {
        const postData = response.post;
        const updatedPost = {
          ...post,
          comments: postData.comments || [],
          commentCount: postData.commentCount || postData.comments?.length || 0
        };
        setPost(updatedPost);
        setReplyText('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply. Please try again.');
    }
  };

  const handleEditPost = async () => {
    if (!isAuthenticated || String(user.id) !== String(post.authorId)) return;
    
    // Note: Backend doesn't have update endpoint yet, you can add it later
    // For now, we'll show an alert
    alert('Post editing feature coming soon!');
    setIsEditing(false);
  };

  const handleDeletePost = async () => {
    if (!isAuthenticated || (String(user.id) !== String(post.authorId) && user.role !== 'admin')) {
      alert('You do not have permission to delete this post');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      // Note: Backend doesn't have delete endpoint yet, you can add it later
      // For now, we'll navigate back
      alert('Post deletion feature coming soon!');
      // navigate('/community');
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

    // Note: Backend doesn't have report endpoint yet, you can add it later
    alert('Post reported. Thank you for helping keep our community safe.');
    setShowReportModal(false);
    setReportReason('');
  };

  // Check if user liked the post (handle both string and ObjectId formats)
  const isLiked = post && post.likedBy && (
    post.likedBy.some(likeId => 
      String(likeId) === String(user?.id) || 
      String(likeId?._id || likeId) === String(user?.id)
    )
  );
  const canEdit = post && user && (
    String(user.id) === String(post.authorId) || 
    user.role === 'admin'
  );
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
              post.comments.map((comment, index) => {
                const commentAuthor = comment.user?.name || comment.userName || comment.author || 'Anonymous';
                const commentAvatar = comment.user?.avatar || comment.userAvatar || comment.authorAvatar || '/default-user.svg';
                return (
                <div key={comment._id || comment.id || index} className="comment-item">
                  <img src={commentAvatar} alt={commentAuthor} />
                  <div className="comment-content">
                    <div className="comment-header">
                      <h4>{commentAuthor}</h4>
                      <span className="comment-time">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                    <div className="comment-actions">
                      <button
                        className="reply-btn"
                        onClick={() => setReplyingTo(replyingTo === (comment._id || comment.id) ? null : (comment._id || comment.id))}
                      >
                        Reply
                      </button>
                    </div>
                    {replyingTo === (comment._id || comment.id) && (
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
                            onClick={() => handleAddReply(comment._id || comment.id)}
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
                        {comment.replies.map((reply, replyIndex) => (
                          <div key={reply._id || reply.id || replyIndex} className="reply-item">
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
              );
              })
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

