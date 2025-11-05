import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/localStorage';
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Circle,
  FileText,
  Video,
  BookOpen,
  Award
} from 'lucide-react';
import './CourseContent.css';

const CourseContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Mock course data with lessons
  const courses = [
    {
      id: 1,
      title: 'Digital Marketing for Small Business',
      instructor: 'Dr. Priya Sharma',
      description: 'Learn how to promote your business online using social media, email marketing, and digital advertising.',
      lessons: [
        {
          id: 1,
          title: 'Introduction to Digital Marketing',
          type: 'video',
          duration: '15 min',
          content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Learn the basics of digital marketing and why it matters for small businesses.'
        },
        {
          id: 2,
          title: 'Understanding Your Target Audience',
          type: 'video',
          duration: '12 min',
          content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Identify and understand your ideal customer to create effective marketing campaigns.'
        },
        {
          id: 3,
          title: 'Social Media Marketing Basics',
          type: 'video',
          duration: '20 min',
          content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Master the fundamentals of social media marketing for business growth.'
        },
        {
          id: 4,
          title: 'Email Marketing Strategies',
          type: 'text',
          duration: '10 min',
          content: `Email marketing is one of the most effective digital marketing strategies. Here's how to do it right:

1. Build Your Email List
- Create valuable lead magnets
- Use signup forms on your website
- Offer exclusive content or discounts

2. Segment Your Audience
- Group contacts by interests
- Personalize messages
- Send targeted campaigns

3. Create Compelling Content
- Write attention-grabbing subject lines
- Provide value in every email
- Include clear call-to-actions

4. Test and Optimize
- A/B test subject lines
- Track open and click rates
- Adjust based on performance`,
          description: 'Learn effective email marketing strategies to engage your audience and drive sales.'
        },
        {
          id: 5,
          title: 'Digital Marketing Quiz',
          type: 'quiz',
          duration: '15 min',
          questions: [
            {
              id: 1,
              question: 'What is the primary goal of digital marketing?',
              options: ['To increase online sales', 'To build brand awareness', 'To engage with customers', 'All of the above'],
              correct: 3
            },
            {
              id: 2,
              question: 'Which platform is best for B2B marketing?',
              options: ['Facebook', 'LinkedIn', 'Instagram', 'TikTok'],
              correct: 1
            },
            {
              id: 3,
              question: 'What does CTR stand for?',
              options: ['Click Through Rate', 'Cost To Reach', 'Content Type Ratio', 'Customer Target Reach'],
              correct: 0
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Traditional Handloom Weaving',
      instructor: 'Master Artisan Sunita Devi',
      description: 'Master the ancient art of handloom weaving and create beautiful textiles.',
      lessons: [
        {
          id: 1,
          title: 'Introduction to Handloom Weaving',
          type: 'video',
          duration: '18 min',
          content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Learn about the history and importance of handloom weaving in Indian culture.'
        },
        {
          id: 2,
          title: 'Setting Up Your Loom',
          type: 'video',
          duration: '25 min',
          content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          description: 'Step-by-step guide to setting up your handloom for weaving.'
        }
      ]
    }
  ];

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === parseInt(id));
    if (foundCourse) {
      setCourse(foundCourse);
      if (foundCourse.lessons.length > 0) {
        setSelectedLesson(foundCourse.lessons[0]);
      }
    }

    // Load completed lessons
    if (isAuthenticated && user && user.id) {
      const enrolled = storage.getEnrolledCourses(user.id);
      const courseEnrolled = enrolled.find(c => c.id === parseInt(id));
      if (courseEnrolled && courseEnrolled.completedLessons) {
        setCompletedLessons(courseEnrolled.completedLessons);
      }
    }
  }, [id, isAuthenticated, user]);

  const handleLessonComplete = (lessonId) => {
    if (!isAuthenticated) {
      alert('Please login to track progress');
      return;
    }

    if (!user || !user.id) {
      alert('User information not available. Please login again.');
      return;
    }

    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);

      // Update in storage with user ID
      const enrolled = storage.getEnrolledCourses(user.id);
      const courseIndex = enrolled.findIndex(c => c.id === parseInt(id));
      if (courseIndex > -1) {
        enrolled[courseIndex].completedLessons = updated;
        const progress = Math.round((updated.length / course.lessons.length) * 100);
        enrolled[courseIndex].progress = progress;
        storage.setEnrolledCourses(enrolled, user.id);
      }
    }
  };

  const handleQuizSubmit = () => {
    if (!selectedLesson || selectedLesson.type !== 'quiz') return;

    let correct = 0;
    selectedLesson.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) {
        correct++;
      }
    });

    const score = Math.round((correct / selectedLesson.questions.length) * 100);
    setShowQuizResults(true);

    if (score >= 70) {
      handleLessonComplete(selectedLesson.id);
    }
  };

  const isLessonCompleted = (lessonId) => completedLessons.includes(lessonId);
  const courseProgress = course ? Math.round((completedLessons.length / course.lessons.length) * 100) : 0;

  if (!course) {
    return (
      <div className="course-content">
        <div className="container">
          <p>Course not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/skills')}>
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-content">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/skills')}>
          <ArrowLeft size={18} />
          Back to Courses
        </button>

        <div className="course-content-layout">
          {/* Sidebar - Lessons */}
          <div className="lessons-sidebar">
            <div className="course-header-sidebar">
              <h2>{course.title}</h2>
              <p>by {course.instructor}</p>
              <div className="progress-indicator">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>
                <span>{courseProgress}% Complete</span>
              </div>
            </div>

            <div className="lessons-list">
              <h3>Course Content</h3>
              {course.lessons.map((lesson, index) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isActive = selectedLesson?.id === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    className={`lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setShowQuizResults(false);
                      setQuizAnswers({});
                    }}
                  >
                    <div className="lesson-icon">
                      {isCompleted ? (
                        <CheckCircle size={20} />
                      ) : lesson.type === 'quiz' ? (
                        <FileText size={20} />
                      ) : lesson.type === 'video' ? (
                        <Video size={20} />
                      ) : (
                        <BookOpen size={20} />
                      )}
                    </div>
                    <div className="lesson-info">
                      <span className="lesson-number">{index + 1}</span>
                      <div>
                        <h4>{lesson.title}</h4>
                        <p>{lesson.duration}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lesson-content-area">
            {selectedLesson ? (
              <>
                <div className="lesson-header">
                  <h1>{selectedLesson.title}</h1>
                  <div className="lesson-meta">
                    <span className="lesson-type">
                      {selectedLesson.type === 'video' ? 'Video Lesson' :
                       selectedLesson.type === 'quiz' ? 'Quiz' : 'Reading Material'}
                    </span>
                    <span className="lesson-duration">{selectedLesson.duration}</span>
                  </div>
                </div>

                <div className="lesson-body">
                  {selectedLesson.type === 'video' && (
                    <div className="video-container">
                      <iframe
                        src={selectedLesson.content}
                        title={selectedLesson.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {selectedLesson.type === 'text' && (
                    <div className="text-content">
                      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                        {selectedLesson.content}
                      </pre>
                    </div>
                  )}

                  {selectedLesson.type === 'quiz' && (
                    <div className="quiz-content">
                      {showQuizResults ? (
                        <div className="quiz-results">
                          <Award size={48} />
                          <h2>Quiz Complete!</h2>
                          <p>
                            You scored {Math.round((Object.values(quizAnswers).filter((ans, idx) => 
                              selectedLesson.questions[idx]?.correct === ans
                            ).length / selectedLesson.questions.length) * 100)}%
                          </p>
                          {Object.values(quizAnswers).filter((ans, idx) => 
                            selectedLesson.questions[idx]?.correct === ans
                          ).length / selectedLesson.questions.length >= 0.7 ? (
                            <p className="success">Great job! You passed the quiz.</p>
                          ) : (
                            <p className="retry">You need 70% to pass. Try again!</p>
                          )}
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setShowQuizResults(false);
                              setQuizAnswers({});
                            }}
                          >
                            Retake Quiz
                          </button>
                        </div>
                      ) : (
                        <>
                          {selectedLesson.questions.map((question, qIdx) => (
                            <div key={question.id} className="question-item">
                              <h3>
                                Question {qIdx + 1}: {question.question}
                              </h3>
                              <div className="options-list">
                                {question.options.map((option, optIdx) => (
                                  <label key={optIdx} className="option-label">
                                    <input
                                      type="radio"
                                      name={`question-${question.id}`}
                                      value={optIdx}
                                      checked={quizAnswers[question.id] === optIdx}
                                      onChange={() => setQuizAnswers({
                                        ...quizAnswers,
                                        [question.id]: optIdx
                                      })}
                                    />
                                    <span>{option}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                          <button
                            className="btn btn-primary submit-quiz-btn"
                            onClick={handleQuizSubmit}
                            disabled={Object.keys(quizAnswers).length < selectedLesson.questions.length}
                          >
                            Submit Quiz
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  <div className="lesson-description">
                    <p>{selectedLesson.description}</p>
                  </div>

                  {selectedLesson.type !== 'quiz' && (
                    <button
                      className={`btn ${isLessonCompleted(selectedLesson.id) ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleLessonComplete(selectedLesson.id)}
                    >
                      {isLessonCompleted(selectedLesson.id) ? (
                        <>
                          <CheckCircle size={18} />
                          Completed
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} />
                          Mark as Complete
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="no-lesson-selected">
                <BookOpen size={64} />
                <p>Select a lesson to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;

