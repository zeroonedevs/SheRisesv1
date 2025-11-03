// Content Management System Utility
// Stores awareness articles and content

export const contentCMS = {
  // Get all articles
  getAll: () => {
    const articles = localStorage.getItem('awarenessArticles');
    return articles ? JSON.parse(articles) : [];
  },

  // Get article by ID
  getById: (id) => {
    return contentCMS.getAll().find(a => a.id === parseInt(id));
  },

  // Create a new article
  create: (articleData) => {
    const articles = contentCMS.getAll();
    const newArticle = {
      id: Date.now(),
      title: articleData.title,
      category: articleData.category,
      content: articleData.content,
      readTime: articleData.readTime || '5 min read',
      author: articleData.author || 'Admin',
      date: new Date().toISOString(),
      image: articleData.image || '',
      featured: articleData.featured || false,
      status: 'published', // published, draft
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    articles.push(newArticle);
    localStorage.setItem('awarenessArticles', JSON.stringify(articles));
    return newArticle;
  },

  // Update an article
  update: (id, updates) => {
    const articles = contentCMS.getAll();
    const article = articles.find(a => a.id === parseInt(id));
    if (article) {
      Object.assign(article, updates);
      article.updatedAt = new Date().toISOString();
      localStorage.setItem('awarenessArticles', JSON.stringify(articles));
      return article;
    }
    return null;
  },

  // Delete an article
  delete: (id) => {
    const articles = contentCMS.getAll();
    const filtered = articles.filter(a => a.id !== parseInt(id));
    localStorage.setItem('awarenessArticles', JSON.stringify(filtered));
    return true;
  },

  // Get by category
  getByCategory: (category) => {
    if (category === 'all') return contentCMS.getAll();
    return contentCMS.getAll().filter(a => a.category === category);
  }
};

