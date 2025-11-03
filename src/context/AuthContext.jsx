import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // For demo purposes, use mock data if API is not available
      let userData;
      if (response.ok) {
        const data = await response.json();
        userData = data.user;
      } else {
        // Mock login for development
        userData = {
          id: Date.now(),
          name: 'Demo User',
          email: email,
          role: 'user',
          avatar: '/default-user.svg',
          location: 'Mumbai, Maharashtra',
          skills: [],
          isMentor: false,
          enrolledCourses: [],
          cart: [],
          orders: []
        };
      }

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'mock-token-' + Date.now());
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Failed to login. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      let newUser;
      if (response.ok) {
        const data = await response.json();
        newUser = data.user;
      } else {
        // Mock registration for development
        newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          role: 'user',
          avatar: '/default-user.svg',
          location: userData.location || '',
          skills: [],
          isMentor: userData.isMentor || false,
          enrolledCourses: [],
          cart: [],
          orders: []
        };
      }

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', 'mock-token-' + Date.now());
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Failed to register. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

