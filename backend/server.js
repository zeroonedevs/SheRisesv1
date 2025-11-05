import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import courseRoutes from './routes/courses.js';
import forumRoutes from './routes/forum.js';
import mentorRoutes from './routes/mentors.js';
import messageRoutes from './routes/messages.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import awarenessRoutes from './routes/awareness.js';
import sellerApplicationRoutes from './routes/sellerApplications.js';
import mediaRoutes from './routes/media.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env file');
  console.log('💡 Please create server/.env file with your MongoDB connection string');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log(`📊 Database: ${mongoose.connection.name || 'sherises'}`);
  console.log(`🌐 Host: ${mongoose.connection.host}`);
  console.log(`📝 Ready to accept connections\n`);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('\n💡 Troubleshooting:');
  console.log('   1. Check your MONGODB_URI in server/.env file');
  console.log('   2. Verify your IP is whitelisted in MongoDB Atlas');
  console.log('   3. Check username and password are correct');
  console.log('   4. Ensure connection string includes /sherises before the ?\n');
  process.exit(1);
});

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SheRises API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    dbName: mongoose.connection.name,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/awareness', awarenessRoutes);
app.use('/api/seller-applications', sellerApplicationRoutes);
app.use('/api/media', mediaRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler - must be last
app.use((req, res) => {
  console.log(`⚠️  404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/products',
      'GET /api/forum/posts',
      'GET /api/courses'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health\n`);
});

