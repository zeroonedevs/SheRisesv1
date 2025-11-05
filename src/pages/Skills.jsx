import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/localStorage';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Star, 
  Search, 
  Filter,
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react';
import './Skills.css';

const Skills = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const categories = [
    { id: 'all', name: 'All Courses', icon: BookOpen },
    { id: 'digital', name: 'Digital Skills', icon: TrendingUp },
    { id: 'craft', name: 'Traditional Crafts', icon: Award },
    { id: 'business', name: 'Business & Finance', icon: Users },
    { id: 'health', name: 'Health & Wellness', icon: Star }
  ];

  const courses = [
    {
      id: 1,
      title: 'Digital Marketing for Small Business',
      instructor: 'Dr. Priya Sharma',
      category: 'digital',
      duration: '4 weeks',
      students: 1250,
      rating: 4.8,
      price: 'Free',
      image: '/klu-sac-logo.png',
      description: 'Learn how to promote your business online using social media, email marketing, and digital advertising.',
      level: 'Beginner',
      lessons: 12,
      enrolled: true,
      progress: 65
    },
    {
      id: 2,
      title: 'Traditional Handloom Weaving',
      instructor: 'Master Artisan Sunita Devi',
      category: 'craft',
      duration: '6 weeks',
      students: 890,
      rating: 4.9,
      price: '₹500',
      image: '/klu-sac-logo.png',
      description: 'Master the ancient art of handloom weaving and create beautiful textiles.',
      level: 'Intermediate',
      lessons: 18,
      enrolled: false,
      progress: 0
    },
    {
      id: 3,
      title: 'Financial Literacy for Women',
      instructor: 'CA Meera Patel',
      category: 'business',
      duration: '3 weeks',
      students: 2100,
      rating: 4.7,
      price: 'Free',
      image: '/klu-sac-logo.png',
      description: 'Learn about savings, investments, loans, and financial planning for women.',
      level: 'Beginner',
      lessons: 9,
      enrolled: true,
      progress: 30
    },
    {
      id: 4,
      title: 'Basic Computer Skills',
      instructor: 'Tech Trainer Anjali Singh',
      category: 'digital',
      duration: '2 weeks',
      students: 3200,
      rating: 4.6,
      price: 'Free',
      image: '/klu-sac-logo.png',
      description: 'Essential computer skills including email, internet, and basic software usage.',
      level: 'Beginner',
      lessons: 8,
      enrolled: false,
      progress: 0
    },
    {
      id: 5,
      title: 'Pottery and Ceramics',
      instructor: 'Artisan Kavita Joshi',
      category: 'craft',
      duration: '5 weeks',
      students: 650,
      rating: 4.9,
      price: '₹800',
      image: '/klu-sac-logo.png',
      description: 'Create beautiful pottery and ceramic items using traditional techniques.',
      level: 'Beginner',
      lessons: 15,
      enrolled: false,
      progress: 0
    },
    {
      id: 6,
      title: 'Women\'s Health and Nutrition',
      instructor: 'Dr. Ritu Verma',
      category: 'health',
      duration: '3 weeks',
      students: 1800,
      rating: 4.8,
      price: 'Free',
      image: '/klu-sac-logo.png',
      description: 'Comprehensive guide to women\'s health, nutrition, and wellness practices.',
      level: 'Beginner',
      lessons: 10,
      enrolled: true,
      progress: 80
    }
  ];

  useEffect(() => {
    if (isAuthenticated && user) {
      const enrolled = storage.getEnrolledCourses();
      setEnrolledCourses(enrolled);
    }
  }, [isAuthenticated, user]);

  const handleEnroll = (course) => {
    if (!isAuthenticated) {
      alert('Please login to enroll in courses');
      return;
    }
    storage.enrollInCourse(course);
    setEnrolledCourses(storage.getEnrolledCourses());
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(c => c.id === courseId);
  };

  const getProgress = (courseId) => {
    const enrolled = enrolledCourses.find(c => c.id === courseId);
    return enrolled?.progress || 0;
  };

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const userEnrolledCourses = enrolledCourses.filter(ec => 
    courses.some(c => c.id === ec.id)
  );
  const completedCourses = userEnrolledCourses.filter(course => course.progress === 100);

  return (
    <div className="skills">
      <div className="container">
        {/* Header */}
        <div className="skills-header">
          <h1>Skill Development</h1>
          <p>Empower yourself with new skills and knowledge. Learn at your own pace with expert instructors.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <BookOpen className="stat-icon" />
            <div className="stat-content">
              <h3>{courses.length}</h3>
              <p>Available Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <Users className="stat-icon" />
            <div className="stat-content">
              <h3>{isAuthenticated ? userEnrolledCourses.length : 0}</h3>
              <p>Enrolled Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <Award className="stat-icon" />
            <div className="stat-content">
              <h3>{completedCourses.length}</h3>
              <p>Completed Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <TrendingUp className="stat-icon" />
            <div className="stat-content">
              <h3>85%</h3>
              <p>Average Progress</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-filter">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search courses or instructors..."
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

        {/* My Learning Progress */}
        {isAuthenticated && userEnrolledCourses.length > 0 && (
          <div className="my-learning">
            <h2>My Learning Progress</h2>
            <div className="progress-courses">
              {userEnrolledCourses.map(enrolledCourse => {
                const course = courses.find(c => c.id === enrolledCourse.id);
                if (!course) return null;
                return (
                  <div key={course.id} className="progress-card">
                    <img src={course.image} alt={course.title} />
                    <div className="progress-content">
                      <h3>{course.title}</h3>
                      <p>by {course.instructor}</p>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${enrolledCourse.progress}%` }}
                        ></div>
                      </div>
                      <div className="progress-info">
                        <span>{enrolledCourse.progress}% Complete</span>
                        <span>{course.lessons} lessons</span>
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        {enrolledCourse.progress === 100 ? 'Review Course' : 'Continue Learning'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Courses */}
        <div className="all-courses">
          <h2>All Available Courses</h2>
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-image">
                  <img src={'./test.jpg'} alt={course.title} />
                  <div className="course-overlay">
                    <button className="play-btn">
                      <Play size={24} />
                    </button>
                  </div>
                  {isEnrolled(course.id) && (
                    <div className="enrolled-badge">Enrolled</div>
                  )}
                </div>
                <div className="course-content">
                  <div className="course-meta">
                    <span className="category">{categories.find(c => c.id === course.category)?.name}</span>
                    <span className="level">{course.level}</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p className="instructor">by {course.instructor}</p>
                  <p className="description">{course.description}</p>
                  <div className="course-stats">
                    <div className="stat">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="stat">
                      <Users size={16} />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <Star size={16} />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <div className="course-footer">
                    <div className="price">{course.price}</div>
                    <button 
                      className={`btn ${isEnrolled(course.id) ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => {
                        if (isEnrolled(course.id)) {
                          navigate(`/course/${course.id}`);
                        } else {
                          handleEnroll(course);
                          navigate(`/course/${course.id}`);
                        }
                      }}
                    >
                      {isEnrolled(course.id) ? 'Continue' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="skills-cta">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>Join thousands of women who are already developing new skills and building their futures.</p>
            <button className="btn btn-primary">
              <Calendar size={20} />
              Browse All Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
