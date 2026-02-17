# 📦 Components Guide

Complete reference for all reusable components in the Game Arena frontend.

---

## 🎨 Common Components

### Button Component

Location: `src/components/common/Button.jsx`

A fully customizable button with multiple variants, sizes, and states.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'primary' | Button style: `primary`, `secondary`, `outline`, `ghost`, `danger`, `success` |
| size | string | 'md' | Button size: `sm`, `md`, `lg`, `xl` |
| fullWidth | boolean | false | Makes button full width |
| disabled | boolean | false | Disables the button |
| loading | boolean | false | Shows loading spinner |
| icon | Component | null | Icon component to display |
| iconPosition | string | 'left' | Icon position: `left` or `right` |
| onClick | function | - | Click handler |
| type | string | 'button' | Button type: `button`, `submit`, `reset` |

#### Usage Examples

```jsx
import Button from '@/components/common/Button';
import { ArrowRight, Save } from 'lucide-react';

// Primary button
<Button variant="primary">Click Me</Button>

// With icon
<Button icon={ArrowRight} iconPosition="right">
  Continue
</Button>

// Loading state
<Button loading={true}>Processing...</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>

// Full width
<Button fullWidth>Submit Form</Button>

// Large size
<Button size="lg">Get Started</Button>
```

---

### Card Component

Location: `src/components/common/Card.jsx`

A container component with glassmorphism effect and animations.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | node | - | Card content |
| className | string | '' | Additional CSS classes |
| hover | boolean | true | Enable hover lift effect |
| glow | boolean | false | Enable neon glow shadow |
| animate | boolean | true | Enable entrance animation |

#### Usage Examples

```jsx
import Card from '@/components/common/Card';

// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// With glow effect
<Card glow>
  <h3>Important Info</h3>
</Card>

// Without hover effect
<Card hover={false}>
  <p>Static card</p>
</Card>

// Custom classes
<Card className="p-8 md:p-12">
  <p>Custom padding</p>
</Card>
```

---

### Input Component

Location: `src/components/common/Input.jsx`

A styled input field with label, icon, and error message support.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Input label text |
| error | string | - | Error message to display |
| icon | Component | null | Icon component |
| type | string | 'text' | Input type |
| className | string | '' | Additional CSS classes |
| ref | ref | - | Forward ref support |

#### Usage Examples

```jsx
import Input from '@/components/common/Input';
import { Mail, Lock } from 'lucide-react';

// Basic input
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
/>

// With icon
<Input
  label="Password"
  type="password"
  icon={Lock}
/>

// With error
<Input
  label="Username"
  error="Username is required"
/>

// With ref (for forms)
const emailRef = useRef();
<Input ref={emailRef} label="Email" />
```

---

### StatCard Component

Location: `src/components/common/StatCard.jsx`

A card component for displaying statistics with trends.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | Stat title |
| value | string/number | - | Main stat value |
| icon | Component | - | Icon component |
| trend | string | - | Trend direction: `up` or `down` |
| trendValue | string | - | Trend percentage |
| color | string | 'primary' | Color theme |
| delay | number | 0 | Animation delay |

#### Usage Examples

```jsx
import StatCard from '@/components/common/StatCard';
import { Users, DollarSign } from 'lucide-react';

// Basic stat card
<StatCard
  title="Total Users"
  value="1,234"
  icon={Users}
  color="primary"
/>

// With trend
<StatCard
  title="Revenue"
  value="₹45,678"
  icon={DollarSign}
  trend="up"
  trendValue="+12%"
  color="green"
/>

// With animation delay (for staggered entry)
<StatCard
  title="Bookings"
  value="567"
  icon={Calendar}
  delay={0.2}
/>
```

---

## 🏗️ Layout Components

### MainLayout Component

Location: `src/components/common/MainLayout.jsx`

Main layout wrapper with navbar and sidebar.

#### Features
- Responsive sidebar (collapsible)
- Fixed navbar at top
- Content area with proper spacing
- Outlet for nested routes

#### Usage

```jsx
// In App.jsx (already implemented)
<Route path="/admin" element={<MainLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<UserManagement />} />
</Route>
```

---

### AuthLayout Component

Location: `src/components/common/AuthLayout.jsx`

Layout for authentication pages (login/register).

#### Features
- Centered content
- Animated background
- Logo and branding
- Responsive design

#### Usage

```jsx
<AuthLayout>
  <Login />
</AuthLayout>
```

---

### Navbar Component

Location: `src/components/common/Navbar.jsx`

Top navigation bar with notifications and user menu.

#### Features
- Logo and branding
- Notification dropdown
- User profile dropdown
- Sidebar toggle
- Role display

---

### Sidebar Component

Location: `src/components/common/Sidebar.jsx`

Side navigation with role-based menu items.

#### Features
- Collapsible design
- Active route highlighting
- Icon + text layout
- Role-based navigation
- Smooth animations

---

## 🎨 Styling Guidelines

### Using Tailwind Classes

```jsx
// Spacing
<div className="p-4 m-2">      // padding and margin
<div className="px-6 py-4">     // padding x and y axis

// Colors
<div className="bg-dark-200">   // background color
<div className="text-primary-400"> // text color

// Layout
<div className="flex items-center justify-between">
<div className="grid grid-cols-3 gap-4">

// Typography
<h1 className="text-4xl font-display font-bold">
<p className="text-sm text-dark-800">

// Effects
<div className="glass">         // glassmorphism effect
<div className="hover-lift">    // hover lift animation
<div className="shadow-cyber">  // neon shadow
```

### Custom CSS Classes

Available in `src/index.css`:

```css
.cyber-bg          - Animated cyber background
.glow-border       - Glowing border on hover
.neon-text         - Neon text effect with flicker
.glass             - Glassmorphism effect
.hover-lift        - Lift on hover
.btn-cyber         - Cyber button effect
.card-shine        - Shine animation
.text-gradient     - Gradient text
.border-gradient   - Gradient border
```

---

## 🎭 Animation Guidelines

### Framer Motion Animations

```jsx
import { motion } from 'framer-motion';

// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>

// Slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>

// Staggered children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map(item => (
    <motion.div variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>

// Hover effect
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

---

## 📱 Responsive Design

### Breakpoints

```jsx
// Tailwind responsive prefixes
<div className="
  text-sm          // default (mobile)
  md:text-base     // tablet (768px+)
  lg:text-lg       // desktop (1024px+)
  xl:text-xl       // large desktop (1280px+)
">

// Grid responsiveness
<div className="
  grid
  grid-cols-1      // mobile: 1 column
  md:grid-cols-2   // tablet: 2 columns
  lg:grid-cols-4   // desktop: 4 columns
">
```

---

## 🎯 Best Practices

### Component Structure

```jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MyComponent = ({ prop1, prop2 }) => {
  // 1. Hooks
  const [state, setState] = useState(null);
  
  // 2. Effects
  useEffect(() => {
    // side effects
  }, []);
  
  // 3. Handlers
  const handleClick = () => {
    // handler logic
  };
  
  // 4. Render helpers
  const renderItem = (item) => {
    return <div>{item}</div>;
  };
  
  // 5. Return JSX
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### Props Naming

- Use descriptive names: `isLoading` not `loading`
- Boolean props: `isVisible`, `hasError`, `canEdit`
- Handlers: `onClick`, `onSubmit`, `onClose`
- Numbers: `maxLength`, `itemCount`

### State Management

```jsx
// Local state (simple)
const [isOpen, setIsOpen] = useState(false);

// Context (global)
const { user } = useAuth();

// Derived state (computed)
const fullName = `${firstName} ${lastName}`;
const isValid = email && password;
```

---

## 🔧 Custom Hooks

Create reusable logic with custom hooks:

```jsx
// src/hooks/useDebounce.js
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage
const debouncedSearch = useDebounce(searchTerm, 500);
```

---

## 📊 Data Visualization

### Using Recharts

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#27272f" />
    <XAxis dataKey="name" stroke="#a1a1aa" />
    <YAxis stroke="#a1a1aa" />
    <Tooltip
      contentStyle={{
        backgroundColor: '#1e1e26',
        border: '1px solid rgba(217, 70, 239, 0.3)',
        borderRadius: '8px',
      }}
    />
    <Line
      type="monotone"
      dataKey="value"
      stroke="#d946ef"
      strokeWidth={3}
    />
  </LineChart>
</ResponsiveContainer>
```

---

## 🎨 Icon Usage

Using Lucide React icons:

```jsx
import { 
  Home, 
  User, 
  Settings,
  ArrowRight 
} from 'lucide-react';

// Basic usage
<Home size={24} />

// With color
<User size={20} className="text-primary-400" />

// In button
<Button icon={ArrowRight}>
  Continue
</Button>
```

---

## 💡 Tips & Tricks

1. **Component Reusability**: If you use similar code 3+ times, make it a component

2. **Props Destructuring**: Cleaner code
   ```jsx
   const Button = ({ variant, children, ...props }) => {
     // instead of props.variant, props.children
   }
   ```

3. **Conditional Classes**: Use template literals
   ```jsx
   className={`base-class ${isActive ? 'active' : 'inactive'}`}
   ```

4. **Short-circuit Rendering**:
   ```jsx
   {isLoading && <LoadingSpinner />}
   {error && <ErrorMessage />}
   ```

5. **Optional Chaining**:
   ```jsx
   const name = user?.profile?.name || 'Guest';
   ```

---

Need help with a specific component? Check the source code or create an issue!
