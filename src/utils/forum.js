// Forum Management Utility
// Stores forum posts, comments, and moderation data

export const forum = {
  // Get all posts
  getAllPosts: () => {
    const posts = localStorage.getItem('forumPosts');
    return posts ? JSON.parse(posts) : [];
  },

  // Get post by ID
  getPostById: (postId) => {
    const posts = forum.getAllPosts();
    return posts.find(p => p.id === parseInt(postId));
  },

  // Create a new post
  createPost: (postData) => {
    const posts = forum.getAllPosts();
    const newPost = {
      id: Date.now(),
      authorId: postData.authorId,
      author: postData.author,
      authorAvatar: postData.authorAvatar || '/default-user.svg',
      location: postData.location || '',
      category: postData.category || 'General',
      title: postData.title,
      content: postData.content,
      image: postData.image || null,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
      editedAt: null,
      reports: [],
      isDeleted: false
    };
    posts.unshift(newPost);
    localStorage.setItem('forumPosts', JSON.stringify(posts));
    return newPost;
  },

  // Update a post
  updatePost: (postId, updates) => {
    const posts = forum.getAllPosts();
    const post = posts.find(p => p.id === parseInt(postId));
    if (post) {
      Object.assign(post, updates);
      post.editedAt = new Date().toISOString();
      localStorage.setItem('forumPosts', JSON.stringify(posts));
      return post;
    }
    return null;
  },

  // Delete a post (soft delete)
  deletePost: (postId) => {
    return forum.updatePost(postId, { isDeleted: true });
  },

  // Like/Unlike a post
  toggleLike: (postId, userId) => {
    const posts = forum.getAllPosts();
    const post = posts.find(p => p.id === parseInt(postId));
    if (post) {
      const index = post.likedBy.indexOf(userId);
      if (index > -1) {
        post.likedBy.splice(index, 1);
        post.likes--;
      } else {
        post.likedBy.push(userId);
        post.likes++;
      }
      localStorage.setItem('forumPosts', JSON.stringify(posts));
      return post;
    }
    return null;
  },

  // Add a comment to a post
  addComment: (postId, commentData) => {
    const posts = forum.getAllPosts();
    const post = posts.find(p => p.id === parseInt(postId));
    if (post) {
      const newComment = {
        id: Date.now(),
        authorId: commentData.authorId,
        author: commentData.author,
        authorAvatar: commentData.authorAvatar || '/default-user.svg',
        content: commentData.content,
        createdAt: new Date().toISOString(),
        editedAt: null,
        likes: 0,
        likedBy: [],
        replies: []
      };
      post.comments.push(newComment);
      localStorage.setItem('forumPosts', JSON.stringify(posts));
      return newComment;
    }
    return null;
  },

  // Reply to a comment
  addReply: (postId, commentId, replyData) => {
    const posts = forum.getAllPosts();
    const post = posts.find(p => p.id === parseInt(postId));
    if (post) {
      const comment = post.comments.find(c => c.id === parseInt(commentId));
      if (comment) {
        const newReply = {
          id: Date.now(),
          authorId: replyData.authorId,
          author: replyData.author,
          authorAvatar: replyData.authorAvatar || '/default-user.svg',
          content: replyData.content,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedBy: []
        };
        comment.replies = comment.replies || [];
        comment.replies.push(newReply);
        localStorage.setItem('forumPosts', JSON.stringify(posts));
        return newReply;
      }
    }
    return null;
  },

  // Report a post
  reportPost: (postId, reportData) => {
    const posts = forum.getAllPosts();
    const post = posts.find(p => p.id === parseInt(postId));
    if (post) {
      if (!post.reports) post.reports = [];
      post.reports.push({
        reportedBy: reportData.reportedBy,
        reason: reportData.reason,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('forumPosts', JSON.stringify(posts));
      return post;
    }
    return null;
  },

  // Get reported posts (for admin)
  getReportedPosts: () => {
    const posts = forum.getAllPosts();
    return posts.filter(p => p.reports && p.reports.length > 0);
  }
};

