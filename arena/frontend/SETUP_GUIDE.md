# 🚀 Complete Setup Guide - Game Arena Frontend

## Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd game-arena-frontend
npm install
```

### Step 2: Environment Setup
```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 📋 Detailed Setup Instructions

### Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18 or higher (`node --version`)
- ✅ npm 9 or higher (`npm --version`)
- ✅ Git (optional, for version control)

### Installation Methods

#### Method 1: NPM (Recommended)
```bash
npm install
```

#### Method 2: Yarn
```bash
yarn install
```

#### Method 3: PNPM
```bash
pnpm install
```

---

## 🎨 Theme Customization Guide

### Changing Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR', // Change main color
      },
      neon: {
        blue: '#YOUR_NEON_BLUE',
        pink: '#YOUR_NEON_PINK',
      }
    }
  }
}
```

### Changing Fonts

1. Add fonts to `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap');
```

2. Update `tailwind.config.js`:
```javascript
fontFamily: {
  display: ['YourFont', 'sans-serif'],
}
```

---

## 🔧 Configuration Files Explained

### package.json
Contains all dependencies and scripts. Don't modify unless adding new packages.

### vite.config.js
Vite build configuration. The `@` alias is set up for easier imports:
```javascript
import Component from '@/components/Component'
// Instead of: import Component from '../../components/Component'
```

### tailwind.config.js
All theme customization happens here. Contains colors, fonts, animations, and custom utilities.

### postcss.config.js
Required for Tailwind CSS processing. Usually doesn't need changes.

---

## 📁 File Structure Deep Dive

### Components Organization

```
components/
├── common/           # Shared across all pages
│   ├── Button.jsx   # Reusable button with variants
│   ├── Card.jsx     # Container component
│   ├── Input.jsx    # Form input with validation
│   └── ...
├── admin/            # Admin-only components
├── staff/            # Staff-only components
└── customer/         # Customer-only components
```

### Pages Organization

```
pages/
├── auth/            # Login, Register
├── admin/           # Admin dashboard & management
├── staff/           # Staff operations
└── customer/        # Customer booking & profile
```

### Services Layer

`services/api.js` contains all API calls organized by feature:
- authService
- userService
- gameService
- bookingService
- etc.

---

## 🔐 Authentication Setup

### How It Works

1. **User logs in** → Credentials sent to backend
2. **Backend returns JWT** → Token stored in localStorage
3. **Token attached to requests** → Axios interceptor adds it
4. **Context tracks state** → AuthContext manages user data
5. **Routes protected** → ProtectedRoute checks authentication

### Adding New Protected Routes

```jsx
<Route path="/new-page" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <YourNewPage />
  </ProtectedRoute>
} />
```

---

## 🎯 Building New Features

### Adding a New Page

1. **Create page file**:
```jsx
// src/pages/admin/NewFeature.jsx
import React from 'react';

const NewFeature = () => {
  return (
    <div>
      <h1 className="text-4xl font-display font-bold mb-6">
        New <span className="text-gradient">Feature</span>
      </h1>
      {/* Your content */}
    </div>
  );
};

export default NewFeature;
```

2. **Add route in App.jsx**:
```jsx
import NewFeature from './pages/admin/NewFeature';

// Inside admin routes:
<Route path="new-feature" element={<NewFeature />} />
```

3. **Add navigation in Sidebar.jsx**:
```jsx
{ icon: YourIcon, label: 'New Feature', path: '/admin/new-feature' }
```

### Adding a New API Service

```javascript
// In src/services/api.js
export const newFeatureService = {
  getAll: () => api.get('/new-feature'),
  create: (data) => api.post('/new-feature', data),
  update: (id, data) => api.put(`/new-feature/${id}`, data),
  delete: (id) => api.delete(`/new-feature/${id}`),
};
```

### Creating Reusable Components

```jsx
// src/components/common/YourComponent.jsx
import React from 'react';

const YourComponent = ({ prop1, prop2, children }) => {
  return (
    <div className="glass rounded-xl p-6">
      {children}
    </div>
  );
};

export default YourComponent;
```

---

## 🚀 Production Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Environment Variables for Production

Create `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Deployment Platforms

#### Vercel (Easiest)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

#### Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy`
3. For production: `netlify deploy --prod`

#### Traditional Hosting (cPanel, FTP)
1. Build: `npm run build`
2. Upload `dist/` folder contents
3. Configure web server for SPA:
   
**Apache (.htaccess)**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 🐛 Common Issues & Solutions

### Issue: Port 3000 Already in Use
```bash
# Kill the process
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

### Issue: Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Tailwind Styles Not Working
```bash
# Restart dev server
# Ensure tailwind.config.js has correct content paths
```

### Issue: API Calls Failing
1. Check `.env` file has correct API URL
2. Verify backend is running
3. Check browser console for CORS errors
4. Verify network tab in DevTools

### Issue: White Screen After Build
1. Check for console errors
2. Verify environment variables are set
3. Check routing configuration
4. Ensure base path is correct in vite.config.js

---

## 📊 Performance Optimization

### Code Splitting
React Router automatically code-splits by route. For manual splitting:

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

### Image Optimization
1. Use WebP format
2. Compress images before upload
3. Use lazy loading
4. Implement responsive images

### Bundle Size
Check bundle size:
```bash
npm run build
```

Analyze bundle:
```bash
npm install --save-dev rollup-plugin-visualizer
```

---

## 🧪 Testing Setup (Optional)

### Install Testing Libraries
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Create Test File
```jsx
// Component.test.jsx
import { render, screen } from '@testing-library/react';
import Component from './Component';

test('renders component', () => {
  render(<Component />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

---

## 📱 Mobile Optimization

The app is responsive by default, but for best mobile experience:

1. **Test on real devices**
2. **Use mobile-first approach**
3. **Optimize touch targets** (min 44x44px)
4. **Test offline functionality**
5. **Optimize for slow networks**

---

## 🔒 Security Best Practices

1. **Never commit .env files**
2. **Use HTTPS in production**
3. **Sanitize user inputs**
4. **Implement rate limiting**
5. **Keep dependencies updated**
6. **Use Content Security Policy**

---

## 📚 Learning Resources

- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Tailwind Docs: https://tailwindcss.com
- Framer Motion: https://www.framer.com/motion

---

## 🎓 Next Steps

After basic setup:

1. ✅ Customize theme colors
2. ✅ Connect to your backend API
3. ✅ Add your branding/logo
4. ✅ Test all user flows
5. ✅ Deploy to production
6. ✅ Set up analytics
7. ✅ Configure error tracking

---

## 💡 Pro Tips

1. **Use VS Code Extensions**:
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier

2. **Hot Module Replacement**:
   Vite automatically reloads on file changes. If it doesn't work, restart dev server.

3. **Development Tools**:
   - React DevTools (Browser extension)
   - Redux DevTools (if using Redux)

4. **Git Workflow**:
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

---

## 📞 Need Help?

- 📖 Check README.md
- 🐛 Check Common Issues section above
- 💬 Create GitHub issue
- 📧 Email: support@gamearena.com

---

Happy Coding! 🚀✨
