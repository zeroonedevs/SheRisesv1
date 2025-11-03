import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  ShoppingBag, 
  Users, 
  Lightbulb, 
  ArrowRight,
  Star,
  Award,
  Heart
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Skill Development',
      description: 'Access comprehensive courses and tutorials to develop new skills and enhance existing ones.',
      link: '/skills',
      color: '#e91e63'
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Sell your handmade products directly to customers and grow your business.',
      link: '/marketplace',
      color: '#9c27b0'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with mentors, join discussions, and build a supportive network.',
      link: '/community',
      color: '#ff4081'
    },
    {
      icon: Lightbulb,
      title: 'Awareness',
      description: 'Learn about your rights, available resources, and support systems.',
      link: '/awareness',
      color: '#4caf50'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Women Empowered' },
    { number: '500+', label: 'Skills Taught' },
    { number: '2000+', label: 'Products Sold' },
    { number: '50+', label: 'Communities' }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Rural Maharashtra',
      text: 'SheRises helped me learn digital marketing and now I sell my handmade jewelry online. My income has tripled!',
      rating: 5
    },
    {
      name: 'Sunita Devi',
      location: 'Village, Bihar',
      text: 'The community support here is amazing. I found a mentor who helped me start my organic farming business.',
      rating: 5
    },
    {
      name: 'Meera Patel',
      location: 'Gujarat',
      text: 'Through the awareness section, I learned about my rights and got help from local NGOs. Life-changing!',
      rating: 5
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Empowering Women, 
                <span className="text-primary"> Building Futures</span>
              </h1>
              <p className="hero-description">
                Join SheRises to develop new skills, sell your products, connect with mentors, 
                and learn about your rights. Together, we rise stronger.
              </p>
              <div className="hero-buttons">
                <Link to="/skills" className="btn btn-primary">
                  Start Learning
                  <ArrowRight size={20} />
                </Link>
                <Link to="/marketplace" className="btn btn-outline">
                  Explore Marketplace
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop" 
                  alt="Women empowerment and education"
                  className="hero-img"
                />
                <div className="hero-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>How SheRises Empowers You</h2>
            <p>Four powerful modules designed to support your journey to independence and success</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                    <Icon size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <Link to={feature.link} className="feature-link">
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>Real women, real transformations, real impact</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-avatar">
                  <img 
                    src={`https://i.pravatar.cc/150?img=${index + 5}`} 
                    alt={testimonial.name}
                  />
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <div className="cta-text">
              <h2>Ready to Start Your Journey?</h2>
              <p>Join thousands of women who are already building their dreams with SheRises</p>
            </div>
            <div className="cta-buttons">
              <Link to="/skills" className="btn btn-primary">
                <Award size={20} />
                Get Started Today
              </Link>
              <Link to="/community" className="btn btn-outline">
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
