import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  MapPin,
  Phone,
  BookOpen,
  ShoppingBag,
  Award,
  Edit2,
  Save,
  X,
  MessageCircle,
  Star,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    isMentor: user?.isMentor || false,
    avatar: user?.avatar || '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        bio: user?.bio || '',
        skills: user?.skills || [],
        isMentor: user?.isMentor || false,
        avatar: user?.avatar || '',
      });
      setAvatarPreview(null);
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setAvatarPreview(imageUrl);
        setFormData({
          ...formData,
          avatar: imageUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    const updatedUser = { 
      ...user, 
      ...formData,
      avatar: avatarPreview || formData.avatar || user.avatar,
    };
    updateUser(updatedUser);
    setIsEditing(false);
    setAvatarPreview(null);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      skills: user?.skills || [],
      isMentor: user?.isMentor || false,
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="profile">
        <div className="container">
          <div className="profile-empty">
            <p>Please login to view your profile</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
              <img 
                src={avatarPreview || user.avatar || '/default-user.svg'} 
                alt={user.name}
                onError={(e) => {
                  e.target.src = '/default-user.svg';
                }}
              />
                {isEditing && (
                  <div className="avatar-overlay" onClick={handleAvatarClick}>
                    <Camera size={24} />
                    <span>Change Photo</span>
                  </div>
                )}
              </div>
              {isEditing && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              )}
            </div>
            {!isEditing && (
              <button 
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>
          <div className="profile-info-header">
            {isEditing ? (
              <div className="edit-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={18} />
                  Save Changes
                </button>
                <button className="btn btn-outline" onClick={handleCancel}>
                  <X size={18} />
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h1>{user.name}</h1>
                <p className="profile-bio">{user.bio || 'No bio added yet'}</p>
                {user.isMentor && (
                  <span className="mentor-badge">
                    <Award size={16} />
                    Mentor
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <BookOpen className="stat-icon" />
            <div className="stat-content">
              <h3>{user.enrolledCourses?.length || 0}</h3>
              <p>Enrolled Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <ShoppingBag className="stat-icon" />
            <div className="stat-content">
              <h3>{user.orders?.length || 0}</h3>
              <p>Orders Placed</p>
            </div>
          </div>
          <div className="stat-card">
            <Star className="stat-icon" />
            <div className="stat-content">
              <h3>{user.skills?.length || 0}</h3>
              <p>Skills Added</p>
            </div>
          </div>
          <div className="stat-card">
            <MessageCircle className="stat-icon" />
            <div className="stat-content">
              <h3>{user.isMentor ? 'Active' : 'Available'}</h3>
              <p>Mentor Status</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>
                  <User size={18} />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{user.name}</p>
                )}
              </div>

              <div className="detail-item">
                <label>
                  <Mail size={18} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                  />
                ) : (
                  <p>{user.email}</p>
                )}
              </div>

              <div className="detail-item">
                <label>
                  <Phone size={18} />
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p>{user.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="detail-item">
                <label>
                  <MapPin size={18} />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                  />
                ) : (
                  <p>{user.location || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="profile-section">
              <h2>About Me</h2>
              <div className="detail-item">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>
              <div className="detail-item checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isMentor"
                    checked={formData.isMentor}
                    onChange={handleChange}
                  />
                  <span>I want to become a mentor</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="profile-actions">
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/skills')}
          >
            <BookOpen size={18} />
            Browse Courses
          </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate('/marketplace')}
                  >
                    <ShoppingBag size={18} />
                    Visit Marketplace
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate('/orders')}
                  >
                    <ShoppingBag size={18} />
                    My Orders
                  </button>
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/community')}
          >
            <MessageCircle size={18} />
            Join Community
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

