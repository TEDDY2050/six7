# ⚡ Quick Start Guide

Get your Game Arena frontend running in 3 simple steps!

## 🚀 Installation (2 minutes)

```bash
# 1. Navigate to the project
cd game-arena-frontend

# 2. Install dependencies
npm install

# 3. Start the server
npm run dev
```

That's it! Open `http://localhost:3000` in your browser 🎉

---

## 🎮 What You Get

### ✨ Features
- 🎨 **Dark Cyberpunk Theme** - Stunning neon-accented design
- 🔐 **Role-Based Access** - Admin, Staff, and Customer portals
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Lightning Fast** - Powered by Vite
- 🎭 **Smooth Animations** - Framer Motion effects
- 🛡️ **Secure** - JWT authentication

### 📦 What's Included
- ✅ Complete authentication system
- ✅ Admin dashboard with analytics
- ✅ Staff management interface
- ✅ Customer booking system
- ✅ Reusable component library
- ✅ API integration ready
- ✅ Production-ready build setup

---

## 🎯 Demo Login Credentials

Test the app with these credentials:

**Admin Access:**
```
Email: admin@gamearena.com
Password: admin123
```

**Staff Access:**
```
Email: staff@gamearena.com
Password: staff123
```

**Customer Access:**
```
Email: customer@gamearena.com
Password: customer123
```

---

## 📁 Project Structure

```
game-arena-frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── context/        # React Context (Auth)
│   ├── services/       # API calls
│   └── index.css       # Global styles
├── public/             # Static assets
└── package.json        # Dependencies
```

---

## 🎨 Key Pages

After starting, you'll see:

### Landing Page (`/`)
- Hero section with branding
- Features showcase
- Pricing plans
- Call-to-action

### Login (`/login`)
- Email/password form
- Remember me option
- Demo credentials

### Admin Dashboard (`/admin`)
- Revenue charts
- User statistics
- Station usage
- Recent activities

### Staff Dashboard (`/staff`)
- Active bookings
- Session management
- Payment processing

### Customer Dashboard (`/customer`)
- Browse games
- Book slots
- View bookings
- Profile management

---

## 🔧 Configuration

### Backend API Setup

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Restart dev server:
```bash
npm run dev
```

---

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#d946ef', // Your main color
  },
}
```

### Change Logo/Branding

1. Replace logo in `src/components/common/Navbar.jsx`
2. Update text in `src/pages/LandingPage.jsx`

---

## 📦 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

---

## 🚀 Deploy to Production

### Option 1: Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Option 2: Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

### Option 3: Build and Upload
```bash
npm run build
# Upload 'dist' folder to your hosting
```

---

## 📚 Documentation

- **SETUP_GUIDE.md** - Detailed setup instructions
- **COMPONENTS_GUIDE.md** - Component documentation
- **README.md** - Full project documentation

---

## 🐛 Troubleshooting

### Port 3000 in use?
```bash
npm run dev -- --port 3001
```

### Modules not found?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Styles not working?
```bash
# Restart the dev server
# Check tailwind.config.js content paths
```

---

## 🎯 Next Steps

1. ✅ Test all user roles (Admin, Staff, Customer)
2. ✅ Customize theme colors and branding
3. ✅ Connect to your backend API
4. ✅ Add your business logic
5. ✅ Deploy to production

---

## 💡 Pro Tips

- Use React DevTools extension
- Install Tailwind CSS IntelliSense in VS Code
- Check browser console for errors
- Read COMPONENTS_GUIDE.md for component usage

---

## 🆘 Need Help?

- 📖 Check README.md for detailed docs
- 🔍 Search existing issues
- 💬 Create new issue with details
- 📧 Email: support@gamearena.com

---

## 🎉 You're Ready!

Your Game Arena frontend is now running. Start building amazing features! 🚀

**Helpful Commands:**
```bash
npm run dev      # Development
npm run build    # Production build
npm run preview  # Test production build
```

Happy coding! 🎮✨
