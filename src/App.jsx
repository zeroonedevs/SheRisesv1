import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Skills from './pages/Skills';
import Marketplace from './pages/Marketplace';
import Community from './pages/Community';
import Awareness from './pages/Awareness';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import SellerDashboard from './pages/SellerDashboard';
import Messages from './pages/Messages';
import ForumPostDetail from './pages/ForumPostDetail';
import CourseContent from './pages/CourseContent';
import Orders from './pages/Orders';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Route */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/skills" element={<Layout><Skills /></Layout>} />
          <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
          <Route path="/community" element={<Layout><Community /></Layout>} />
          <Route path="/awareness" element={<Layout><Awareness /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          <Route path="/seller/dashboard" element={<Layout><SellerDashboard /></Layout>} />
          <Route path="/messages" element={<Layout><Messages /></Layout>} />
          <Route path="/forum/:id" element={<Layout><ForumPostDetail /></Layout>} />
          <Route path="/course/:id" element={<Layout><CourseContent /></Layout>} />
          <Route path="/orders" element={<Layout><Orders /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
