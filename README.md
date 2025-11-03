# SheRises - Skill Development & Marketplace Platform

## 🌟 Project Overview

SheRises is a comprehensive platform designed to empower women, particularly in rural and underserved areas, by providing access to skill development resources and a direct platform to sell their products. This project aims to bridge the skill gap, create economic opportunities, build community support, and raise awareness about women's rights.

## 🎯 Key Features

### 1. Skill Development Module
- **Course Management**: Comprehensive learning modules with video tutorials, text content, and interactive quizzes
- **Progress Tracking**: Monitor learning progress and completion rates
- **Expert Instructors**: Learn from verified professionals and master artisans
- **Categories**: Digital skills, traditional crafts, business & finance, health & wellness

### 2. Marketplace Module
- **Product Listing**: Direct selling platform for handmade products
- **Seller Verification**: Verified seller system with quality assurance
- **Shopping Cart**: Complete e-commerce functionality
- **Categories**: Handicrafts, textiles, jewelry, food & spices, beauty & wellness

### 3. Community & Mentorship
- **Forum Discussions**: Interactive community forum for knowledge sharing
- **Mentor Matching**: Connect with experienced professionals
- **Events**: Workshops, webinars, and networking events
- **Private Messaging**: Secure communication between users

### 4. Awareness & Rights Information
- **Legal Rights**: Comprehensive information about women's legal rights
- **Health Resources**: Health and wellness information
- **Government Schemes**: Information about available government programs
- **Emergency Helplines**: Quick access to support services

### 5. Admin Dashboard
- **User Management**: Monitor and manage platform users
- **Content Management**: Manage courses, products, and articles
- **Analytics**: Track platform performance and user engagement
- **Reports**: Generate insights and reports

## 🚀 Technology Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: Custom CSS with CSS Variables
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── forms/           # Form components
│   └── layout/          # Layout components (Header, Footer, Navigation)
├── pages/               # Main application pages
│   ├── Home.jsx         # Landing page
│   ├── Skills.jsx       # Skill development module
│   ├── Marketplace.jsx  # E-commerce marketplace
│   ├── Community.jsx    # Community and mentorship
│   ├── Awareness.jsx    # Rights and awareness information
│   └── Admin.jsx        # Admin dashboard
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── data/                # Static data and mock data
├── assets/              # Images, icons, and other assets
├── App.jsx              # Main application component
├── App.css              # Global styles
├── main.jsx             # Application entry point
└── index.css            # Base styles and resets
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SheRises
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🎨 Design Features

### Color Scheme
- **Primary**: #e91e63 (Pink)
- **Secondary**: #9c27b0 (Purple)
- **Accent**: #ff4081 (Light Pink)
- **Success**: #4caf50 (Green)
- **Warning**: #ff9800 (Orange)
- **Error**: #f44336 (Red)

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Flexible grid layouts
- Touch-friendly interface

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios

## 📱 Pages Overview

### Home Page
- Hero section with call-to-action
- Feature highlights
- Success stories and testimonials
- Statistics and impact metrics

### Skills Page
- Course catalog with filtering
- Learning progress tracking
- Instructor profiles
- Course enrollment system

### Marketplace Page
- Product browsing and search
- Shopping cart functionality
- Seller profiles and verification
- Product categories and filtering

### Community Page
- Forum discussions
- Mentor profiles and matching
- Event listings and registration
- User interaction features

### Awareness Page
- Emergency helplines
- Legal rights information
- Government schemes
- Health and wellness resources

### Admin Page
- User management dashboard
- Content management system
- Analytics and reporting
- Platform administration tools

## 🔧 Customization

### Adding New Pages
1. Create a new component in the `src/pages/` directory
2. Add the route in `src/App.jsx`
3. Update navigation in `src/components/layout/Layout.jsx`
4. Add corresponding styles

### Styling
- Global styles are in `src/App.css`
- Component-specific styles are co-located with components
- CSS variables are defined in `:root` for easy theming
- Responsive design utilities are available

### Data Management
- Mock data is currently used for demonstration
- Replace with actual API calls for production
- Consider implementing state management (Redux, Zustand) for complex state

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Design inspiration from modern web applications
- Community feedback and suggestions

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**SheRises** - Empowering women through technology, education, and community support. 🌟
