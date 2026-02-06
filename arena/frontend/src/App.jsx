import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/common/MainLayout';
import AuthLayout from './components/common/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Landing Page
import LandingPage from './pages/LandingPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import UserManagement from './pages/admin/UserManagement';
import GameManagement from './pages/admin/GameManagement';
import StationManagement from './pages/admin/StationManagement';
import BookingManagement from './pages/admin/BookingManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffBookings from './pages/staff/StaffBookings';
import StaffSessions from './pages/staff/StaffSessions';
import StaffPayments from './pages/staff/StaffPayments';
import StaffProfile from './pages/staff/StaffProfile';
import StaffSettings from './pages/staff/StaffSettings';
import SessionManagement from './pages/staff/SessionManagement';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BookSlot from './pages/customer/BookSlot';
import MyBookings from './pages/customer/MyBookings';
import MyProfile from './pages/customer/MyProfile';
import CustomerSettings from './pages/customer/CustomerSettings';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="cyber-bg"></div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/login" element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </PublicRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="games" element={<GameManagement />} />
          <Route path="stations" element={<StationManagement />} />
          <Route path="sessions" element={<SessionManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="payments" element={<PaymentManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={
          <ProtectedRoute allowedRoles={['staff']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<StaffDashboard />} />
          <Route path="sessions" element={<SessionManagement />} />
          <Route path="bookings" element={<StaffBookings />} />
          <Route path="sessions-old" element={<StaffSessions />} />
          <Route path="payments" element={<StaffPayments />} />
          <Route path="profile" element={<StaffProfile />} />
          <Route path="settings" element={<StaffSettings />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<CustomerDashboard />} />
          <Route path="book" element={<BookSlot />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="bookings/:id" element={<MyBookings />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="settings" element={<CustomerSettings />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
