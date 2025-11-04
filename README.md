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
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
```

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

## License

MIT License - see LICENSE file for details
