# SheRises

A platform that empowers women in rural areas by providing skill development resources and a marketplace to sell their products.

## Features

- **Skill Development**: Learn new skills through courses and tutorials
- **Marketplace**: Sell and buy products directly
- **Community**: Connect with mentors and join discussions
- **Awareness**: Access information about rights and resources

## Technology Stack

### Frontend
- React 18
- Vite
- React Router
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas - Free Tier)
- JWT Authentication

## Project Structure

```
SheRises/
├── frontend/          # React frontend application
│   ├── src/          # Source files
│   ├── public/       # Public assets
│   ├── package.json
│   └── vite.config.js
├── backend/           # Node.js backend API
│   ├── routes/       # API routes
│   ├── models/        # Database models
│   ├── middleware/   # Express middleware
│   ├── config/       # Configuration files
│   ├── server.js     # Main server file
│   └── package.json
├── README.md
└── LICENSE
```

## Installation

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` file:

**Option 1: Generate JWT Secret automatically:**
```bash
node backend/scripts/generate-jwt-secret.js
```

**Option 2: Manual setup:**
```env
# MongoDB Configuration (from MongoDB Atlas)
# ⚠️ NEVER commit your actual MongoDB URI to git!
# Get your connection string from MongoDB Atlas dashboard
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority

# JWT Configuration (generate using: node backend/scripts/generate-jwt-secret.js)
# ⚠️ NEVER commit your JWT secret to git!
JWT_SECRET=your-generated-secret-key-here
JWT_EXPIRES_IN=30d

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**⚠️ SECURITY WARNING:**
- Never commit `.env` files to git
- Never put real credentials in README or documentation
- Always use environment variables for sensitive data
- Rotate any credentials that may have been exposed

**📖 For detailed JWT and MongoDB setup instructions, see [QUICK_START.md](./QUICK_START.md)**

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` file (optional):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Start frontend:
```bash
npm run dev
```

## Available Scripts

### Frontend
```bash
cd frontend
npm run dev      # Start frontend development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
cd backend
npm run dev      # Start backend server
npm start        # Start backend in production mode
```

### Helper Scripts
```bash
# Generate JWT secret
node backend/scripts/generate-jwt-secret.js
```

## License

MIT License - see LICENSE file for details
