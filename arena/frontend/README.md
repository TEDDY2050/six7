# 🎮 Game Arena Management System - Frontend

A modern, production-ready frontend application for managing gaming arenas with a stunning cyberpunk-inspired dark theme.

## ✨ Features

### 🎨 Design
- **Dark Cyberpunk Theme** - Neon accents, glassmorphism, and smooth animations
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Custom Animations** - Framer Motion for smooth, professional transitions
- **Reusable Components** - Built with scalability in mind

### 🔐 Authentication
- JWT-based authentication
- Role-based access control (Admin, Staff, Customer)
- Protected routes
- Persistent sessions

### 👥 User Roles

#### Admin Dashboard
- User management
- Game management
- Station management
- Booking oversight
- Payment tracking
- Revenue reports
- System settings

#### Staff Dashboard
- Manage bookings
- Start/end gaming sessions
- Process payments
- View active stations

#### Customer Dashboard
- Browse games
- Book gaming slots
- View booking history
- Manage profile

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - API integration
- **Recharts** - Data visualization
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps

1. **Clone or extract the project**
```bash
cd game-arena-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start development server**
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 🏗️ Project Structure

```
game-arena-frontend/
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images, fonts
│   ├── components/
│   │   ├── common/         # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MainLayout.jsx
│   │   │   └── AuthLayout.jsx
│   │   ├── admin/          # Admin-specific components
│   │   ├── staff/          # Staff-specific components
│   │   └── customer/       # Customer-specific components
│   ├── context/
│   │   └── AuthContext.jsx # Authentication state
│   ├── hooks/              # Custom React hooks
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── admin/          # Admin pages
│   │   ├── staff/          # Staff pages
│   │   ├── customer/       # Customer pages
│   │   └── LandingPage.jsx
│   ├── services/
│   │   └── api.js          # API service layer
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Theme Customization

The theme uses custom Tailwind configuration. Key colors:

```javascript
// Primary gradient colors
primary: #d946ef (Purple/Magenta)
neon-blue: #00f3ff (Cyan)
neon-pink: #ff00ff (Magenta)
neon-green: #39ff14 (Lime)

// Dark background colors
dark-50: #18181b
dark-100: #1a1a1f
dark-200: #1e1e26
```

### Fonts
- **Display**: Orbitron (Headers, logos)
- **Body**: Rajdhani (Main content)
- **Mono**: JetBrains Mono (Code, numbers)

## 🔌 API Integration

All API calls are centralized in `src/services/api.js`. The service includes:

- Authentication endpoints
- User management
- Game operations
- Station booking
- Payment processing
- Dashboard statistics

### Example Usage
```javascript
import { gameService } from '@/services/api';

// Fetch all games
const games = await gameService.getAll();

// Create a booking
const booking = await bookingService.create(bookingData);
```

## 🛡️ Authentication Flow

1. User logs in via `/login`
2. JWT token stored in localStorage
3. Token attached to all API requests
4. AuthContext manages user state
5. Protected routes check authentication
6. Auto-redirect based on user role

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Demo Credentials

```
Admin:
Email: admin@gamearena.com
Password: admin123

Staff:
Email: staff@gamearena.com
Password: staff123

Customer:
Email: customer@gamearena.com
Password: customer123
```

## 🚀 Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

## 📦 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy!

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Deploy!

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist` folder to hosting
3. Configure environment variables
4. Set up redirects for SPA routing

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 Component Library

### Button Component
```jsx
<Button 
  variant="primary"    // primary, secondary, outline, ghost, danger
  size="md"           // sm, md, lg, xl
  icon={IconComponent}
  loading={false}
  fullWidth={false}
>
  Click Me
</Button>
```

### Card Component
```jsx
<Card 
  hover={true}
  glow={false}
  animate={true}
>
  Card Content
</Card>
```

### Input Component
```jsx
<Input
  label="Email"
  icon={Mail}
  error="Error message"
  required
/>
```

### StatCard Component
```jsx
<StatCard
  title="Total Users"
  value="1,234"
  icon={Users}
  trend="up"
  trendValue="+12%"
  color="primary"
/>
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Best Practices

1. **Component Structure** - Keep components small and focused
2. **State Management** - Use Context for global state, useState for local
3. **API Calls** - Always handle loading and error states
4. **Styling** - Use Tailwind utilities, create custom classes when needed
5. **Performance** - Lazy load routes and components
6. **Accessibility** - Use semantic HTML and ARIA labels

## 🔮 Future Enhancements

- [ ] Socket.io for real-time updates
- [ ] PWA support
- [ ] Dark/Light theme toggle
- [ ] Advanced analytics dashboard
- [ ] QR code session management
- [ ] Wallet system
- [ ] Membership tiers
- [ ] Tournament management
- [ ] In-app chat support

## 📄 License

MIT License - feel free to use this project for your gaming arena!

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@gamearena.com

---

Built with ❤️ for gamers, by gamers
