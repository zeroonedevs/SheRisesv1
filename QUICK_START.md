# Quick Start: JWT & MongoDB Setup

## What is JWT?

**JWT (JSON Web Token)** is a secure token system used for user authentication in your SheRises project.

### Simple Explanation:
- When a user logs in, they get a **JWT token** (like a temporary ID card)
- This token contains their user ID
- Every API request includes this token
- The backend verifies the token and fetches user data from MongoDB
- No need to login again for 30 days (configurable)

### Why JWT in Your Project?
- ✅ Secure user authentication
- ✅ No server-side session storage needed
- ✅ Works with MongoDB to identify users
- ✅ Scalable across multiple servers

## Quick Setup (3 Steps)

### Step 1: Generate JWT Secret

```bash
cd server
node scripts/generate-jwt-secret.js
```

Copy the generated secret key.

### Step 2: Create `.env` File

Create `server/.env` file with:

```env
# MongoDB - Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sherises?retryWrites=true&w=majority

# JWT - Use the secret from Step 1
JWT_SECRET=paste-your-generated-secret-here

# Optional
JWT_EXPIRES_IN=30d
PORT=3000
NODE_ENV=development
```

### Step 3: Start Server

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

## How JWT Connects to MongoDB

```
User Login → Backend validates → MongoDB finds user → Generate JWT token
                                                     ↓
User makes request → Backend verifies JWT → Extract user ID → MongoDB fetches user → Return data
```

**The JWT token contains the user's MongoDB document ID**, which is used to quickly look up user information from the database.

## Files Created/Updated

1. **`server/config/jwt.js`** - Centralized JWT configuration
2. **`server/middleware/auth.js`** - Updated to use centralized JWT
3. **`server/routes/auth.js`** - Updated to use centralized JWT
4. **`server/scripts/generate-jwt-secret.js`** - Helper to generate secrets

## Need More Details?

See **[JWT_MONGODB_INTEGRATION.md](./JWT_MONGODB_INTEGRATION.md)** for complete documentation.


