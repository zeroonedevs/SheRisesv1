# Self Learning Project Documentation

## List of Projects

| S.no | Name of the project | Stack | GitHub Link | Deployment |
|------|---------------------|-------|-------------|------------|
| 1. | SheRises | Vite+React, JavaScript, Express.js, Node.js, MongoDB, JWT Authentication, Multer, bcryptjs, express-validator | [SheRises](https://github.com/your-username/SheRises) | Local Host / Vercel + Render |

---

## Technologies & Skills Acquired

### Programming Languages & Frameworks

Through the development of **SheRises**, I gained comprehensive hands-on experience in modern full-stack web development. The project was built using **React 18** powered by **Vite** for fast and efficient frontend development, enabling rapid hot module replacement and optimized build processes. I extensively worked with **JavaScript (ES6+)** for implementing interactive logic, state management, and DOM manipulation across multiple components including user authentication, product management, course enrollment, and real-time messaging features.

The project architecture follows a **component-based design pattern**, where I developed reusable UI components, custom hooks, and context providers for authentication and state management. I implemented **React Router** for client-side routing, creating a seamless single-page application experience with protected routes for admin, seller, and regular user roles. The frontend styling was achieved using **CSS3** with modern features like CSS Grid, Flexbox, and custom properties for responsive design across all device sizes.

On the backend, I utilized **Node.js** with **Express.js** framework to build a RESTful API server with multiple route handlers for authentication, products, courses, forum posts, orders, cart management, seller applications, and media uploads. I implemented **JWT (JSON Web Tokens)** for secure authentication and authorization, with middleware functions to protect routes and verify user roles. The backend also includes file upload capabilities using **Multer** for handling product images and user avatars, with proper validation using **express-validator** for input sanitization and error handling.

### Database Management

**MongoDB** served as the primary database system for SheRises, utilizing **Mongoose ODM** for schema definition and database operations. I designed and implemented flexible document schemas for multiple collections including Users, Products, Courses, Orders, ForumPosts, SellerApplications, and Messages. Each schema includes proper data validation, indexing for performance optimization, and relationships between collections using references and population.

I developed a deep understanding of **NoSQL database principles**, including document-based data modeling, embedded vs referenced documents, and efficient query patterns. The database structure supports complex features such as user enrollment tracking with progress monitoring, shopping cart persistence, order history, seller application workflows, and forum post interactions. I implemented proper data integrity through schema validation, unique constraints (like email uniqueness), and logical organization of nested documents for user profiles, mentor information, and course progress tracking.

The project includes database seeding scripts for initial product data and admin user creation, demonstrating proficiency in database initialization and management. I also implemented proper error handling for database operations, connection management with MongoDB Atlas (cloud database), and efficient data retrieval patterns using Mongoose methods like `find()`, `findById()`, `populate()`, and aggregation pipelines for complex queries.

---

## Key Features Implemented

1. **User Authentication & Authorization**: Registration, login, JWT-based session management, role-based access control (user, admin, seller)
2. **E-Commerce Marketplace**: Product listing, search, filtering, shopping cart, checkout process, order management
3. **Skill Development Platform**: Course enrollment, progress tracking, lesson completion, individual user progress
4. **Community Forum**: Post creation, commenting, upvoting, discussion threads
5. **Mentorship System**: Mentor profiles, messaging system, mentor verification
6. **Seller Management**: Seller application workflow, admin approval/rejection, seller dashboard
7. **Admin Dashboard**: User management, product moderation, seller application review, content management
8. **File Upload System**: Image uploads for products, user avatars, media management
9. **Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes
10. **API Integration**: RESTful API design with proper error handling and response formatting

---

## Project Structure

```
SheRises/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── context/      # React Context (Auth)
│   │   ├── utils/        # API utilities
│   │   └── hooks/        # Custom React hooks
│   └── public/           # Static assets
├── backend/              # Node.js + Express backend
│   ├── routes/           # API route handlers
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # Auth & validation middleware
│   ├── config/           # JWT configuration
│   └── scripts/          # Database seeding scripts
└── README.md
```

