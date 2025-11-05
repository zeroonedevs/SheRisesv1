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

## Installation

### 1. Backend Setup

```bash
cd server
npm install
```

Create `server/.env` file:

**Option 1: Generate JWT Secret automatically:**
```bash
node server/scripts/generate-jwt-secret.js
```

**Option 2: Manual setup:**
```env
# MongoDB Configuration (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sherises?retryWrites=true&w=majority

# JWT Configuration (generate using: node server/scripts/generate-jwt-secret.js)
JWT_SECRET=your-generated-secret-key-here
JWT_EXPIRES_IN=30d

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**📖 For detailed JWT and MongoDB setup instructions, see [JWT_MONGODB_INTEGRATION.md](./JWT_MONGODB_INTEGRATION.md)**

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
npm install
```

Create `.env` file (optional):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Start frontend:
```bash
npm run dev
```

## Available Scripts

### Frontend
- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `cd server && npm run dev` - Start backend server
- `node server/scripts/generate-jwt-secret.js` - Generate secure JWT secret

## License

MIT License - see LICENSE file for details
