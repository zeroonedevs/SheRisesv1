# SheRises Backend

Backend API server for SheRises platform.

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   PORT=3000
   NODE_ENV=development
   ```

3. **Start server:**
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/products` - Get products
- `POST /api/products` - Create product
- `GET /api/forum/posts` - Get forum posts
- `POST /api/forum/posts` - Create post
- `GET /api/courses` - Get courses
- `POST /api/courses/:id/enroll` - Enroll in course

See code for full API documentation.
