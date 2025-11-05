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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      
      // Try API call first
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData = {
          id: data.user.id,
          ...data.user
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        return { success: true, user: userData };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        return { success: false, error: errorData.message || 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to local storage for offline mode
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = existingUsers.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        localStorage.setItem('token', 'offline-token');
        return { success: true, user: foundUser };
      }
      
      return { success: false, error: 'Failed to login. Please check your connection and try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        const newUser = {
          id: data.user.id,
          ...data.user
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', data.token);
        return { success: true, user: newUser };
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        return { success: false, error: errorData.message || 'Registration failed. Please try again.' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Fallback to local storage for offline mode
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.some(u => u.email === userData.email);
      
      if (userExists) {
        return { success: false, error: 'Email already registered. Please login instead.' };
      }
      
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: 'user',
        avatar: '/default-user.svg',
        location: userData.location || '',
        skills: [],
        isMentor: userData.isMentor || false,
        enrolledCourses: [],
        cart: [],
        orders: []
      };
      
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', 'offline-token');
      
      return { success: true, user: newUser };
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

