import React, { useState, useEffect } from 'react';
import { contentCMS } from '../utils/contentCMS';
import { 
  Lightbulb, 
  Search, 
  BookOpen, 
  Phone, 
  MapPin, 
  Clock,
  Shield,
  Heart,
  Users,
  Award,
  FileText,
  ExternalLink
} from 'lucide-react';
import './Awareness.css';

const Awareness = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState([]);

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'rights', name: 'Legal Rights', icon: Shield },
    { id: 'health', name: 'Health & Safety', icon: Heart },
    { id: 'education', name: 'Education', icon: Award },
    { id: 'support', name: 'Support Services', icon: Users }
  ];

  useEffect(() => {
    // Load articles from CMS, fallback to mock data if empty
    const cmsArticles = contentCMS.getAll();
    if (cmsArticles.length > 0) {
      setArticles(cmsArticles);
    } else {
      setArticles(mockArticles);
    }
  }, []);

  const mockArticles = [
    {
      id: 1,
      title: 'Understanding Your Legal Rights as a Woman',
      category: 'rights',
      content: 'Every woman has fundamental rights protected by law. This comprehensive guide covers your legal rights in various situations...',
      readTime: '8 min read',
      author: 'Legal Aid Society',
      date: '2024-01-15',
      image: '/klu-sac-logo.png',
      featured: true
    },
    {
      id: 2,
      title: 'Women\'s Health: Essential Check-ups and Screenings',
      category: 'health',
      content: 'Regular health check-ups are crucial for early detection and prevention. Learn about essential screenings for women...',
      readTime: '6 min read',
      author: 'Dr. Priya Sharma',
      date: '2024-01-12',
      image: '/klu-sac-logo.png',
      featured: false
    },
    {
      id: 3,
      title: 'Financial Literacy for Women: Building Your Future',
      category: 'education',
      content: 'Financial independence is key to empowerment. Discover practical tips for managing money, investments, and planning for the future...',
      readTime: '10 min read',
      author: 'Financial Advisor Meera',
      date: '2024-01-10',
      image: '/klu-sac-logo.png',
      featured: true
    },
    {
      id: 4,
      title: 'Domestic Violence: Recognizing Signs and Getting Help',
      category: 'support',
      content: 'Understanding the signs of domestic violence and knowing where to seek help can save lives. Learn about support systems...',
      readTime: '7 min read',
      author: 'Support Center Team',
      date: '2024-01-08',
      image: '/klu-sac-logo.png',
      featured: false
    }
  ];

  const helplines = [
    {
      name: 'National Women Helpline',
      number: '181',
      description: '24/7 helpline for women in distress',
      available: '24/7',
      type: 'Emergency'
    },
    {
      name: 'Domestic Violence Helpline',
      number: '1091',
      description: 'Special helpline for domestic violence cases',
      available: '24/7',
      type: 'Emergency'
    },
    {
      name: 'Child Helpline',
      number: '1098',
      description: 'Support for children and women',
      available: '24/7',
      type: 'Support'
    },
    {
      name: 'Legal Aid Helpline',
      number: '1800-345-6789',
      description: 'Free legal assistance for women',
      available: '9 AM - 6 PM',
      type: 'Legal'
    }
  ];

  const governmentSchemes = [
    {
      name: 'Pradhan Mantri Matru Vandana Yojana',
      description: 'Financial assistance for pregnant and lactating mothers',
      eligibility: 'Pregnant women and lactating mothers',
      benefits: '₹5,000 in three installments',
      contact: 'Anganwadi centers'
    },
    {
      name: 'Beti Bachao Beti Padhao',
      description: 'Scheme to improve child sex ratio and girl child education',
      eligibility: 'Girls from birth to 18 years',
      benefits: 'Educational support and awareness programs',
      contact: 'District administration'
    },
    {
      name: 'Sukanya Samriddhi Yojana',
      description: 'Savings scheme for girl child education and marriage',
      eligibility: 'Girls below 10 years',
      benefits: 'High interest rate savings account',
      contact: 'Post offices and banks'
    },
    {
      name: 'Ujjwala Yojana',
      description: 'Free LPG connections for women below poverty line',
      eligibility: 'Women from BPL families',
      benefits: 'Free LPG connection and stove',
      contact: 'LPG distributors'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter(article => article.featured);

  return (
    <div className="awareness">
      <div className="container">
        {/* Header */}
        <div className="awareness-header">
          <h1>Awareness & Rights</h1>
          <p>Knowledge is power. Learn about your rights, access support services, and discover government schemes designed for women.</p>
        </div>

        {/* Emergency Helplines */}
        <div className="emergency-section">
          <h2>
            <Phone className="section-icon" />
            Emergency Helplines
          </h2>
          <div className="helplines-grid">
            {helplines.map((helpline, index) => (
              <div key={index} className="helpline-card">
                <div className="helpline-header">
                  <div className="helpline-type">{helpline.type}</div>
                  <div className="helpline-available">{helpline.available}</div>
                </div>
                <h3>{helpline.name}</h3>
                <div className="helpline-number">
                  <Phone size={20} />
                  <span>{helpline.number}</span>
                </div>
                <p>{helpline.description}</p>
                <button className="btn btn-primary">
                  <Phone size={16} />
                  Call Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        <div className="featured-section">
          <h2>
            <Lightbulb className="section-icon" />
            Featured Articles
          </h2>
          <div className="featured-grid">
            {featuredArticles.map(article => (
              <div key={article.id} className="featured-card">
                <div className="featured-image">
                  <img src={'./test.jpg'} alt={article.title} />
                  <div className="featured-badge">Featured</div>
                </div>
                <div className="featured-content">
                  <div className="article-meta">
                    <span className="category">{categories.find(c => c.id === article.category)?.name}</span>
                    <span className="read-time">{article.readTime}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.content}</p>
                  <div className="article-footer">
                    <div className="article-author">
                      <span>by {article.author}</span>
                      <span>{article.date}</span>
                    </div>
                    <button className="btn btn-outline">
                      Read More
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-filter">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search articles and resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-filter">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon size={18} />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* All Articles */}
        <div className="articles-section">
          <h2>
            <FileText className="section-icon" />
            Knowledge Base
          </h2>
          <div className="articles-grid">
            {filteredArticles.map(article => (
              <div key={article.id} className="article-card">
                <div className="article-image">
                  <img src={'./test.jpg'} alt={article.title} />
                </div>
                <div className="article-content">
                  <div className="article-meta">
                    <span className="category">{categories.find(c => c.id === article.category)?.name}</span>
                    <span className="read-time">{article.readTime}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.content}</p>
                  <div className="article-footer">
                    <div className="article-author">
                      <span>by {article.author}</span>
                      <span>{article.date}</span>
                    </div>
                    <button className="btn btn-outline">
                      Read More
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Government Schemes */}
        <div className="schemes-section">
          <h2>
            <Award className="section-icon" />
            Government Schemes
          </h2>
          <div className="schemes-grid">
            {governmentSchemes.map((scheme, index) => (
              <div key={index} className="scheme-card">
                <div className="scheme-header">
                  <h3>{scheme.name}</h3>
                </div>
                <div className="scheme-content">
                  <p className="scheme-description">{scheme.description}</p>
                  <div className="scheme-details">
                    <div className="detail-item">
                      <strong>Eligibility:</strong>
                      <span>{scheme.eligibility}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Benefits:</strong>
                      <span>{scheme.benefits}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Contact:</strong>
                      <span>{scheme.contact}</span>
                    </div>
                  </div>
                  <button className="btn btn-primary">
                    <ExternalLink size={16} />
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Resources */}
        <div className="support-section">
          <h2>
            <Users className="section-icon" />
            Support Resources
          </h2>
          <div className="support-grid">
            <div className="support-card">
              <Shield className="support-icon" />
              <h3>Legal Support</h3>
              <p>Free legal aid and counseling services for women facing legal issues.</p>
              <button className="btn btn-outline">Find Legal Help</button>
            </div>
            <div className="support-card">
              <Heart className="support-icon" />
              <h3>Health Services</h3>
              <p>Access to healthcare services, mental health support, and wellness programs.</p>
              <button className="btn btn-outline">Health Resources</button>
            </div>
            <div className="support-card">
              <Award className="support-icon" />
              <h3>Education Support</h3>
              <p>Scholarships, skill development programs, and educational resources.</p>
              <button className="btn btn-outline">Education Programs</button>
            </div>
            <div className="support-card">
              <Users className="support-icon" />
              <h3>Community Support</h3>
              <p>Connect with support groups, counselors, and community organizations.</p>
              <button className="btn btn-outline">Join Community</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Awareness;
