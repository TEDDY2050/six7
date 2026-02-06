import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Gamepad2,
  Monitor,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  Clock,
  UserCircle,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Gamepad2, label: 'Games', path: '/admin/games' },
    { icon: Monitor, label: 'Stations', path: '/admin/stations' },
    { icon: Clock, label: 'Sessions', path: '/admin/sessions' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const staffLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/staff' },
    { icon: Clock, label: 'Sessions', path: '/staff/sessions' },
    { icon: Calendar, label: 'Bookings', path: '/staff/bookings' },
    { icon: CreditCard, label: 'Payments', path: '/staff/payments' },
  ];

  const customerLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/customer' },
    { icon: BookOpen, label: 'Book Slot', path: '/customer/book' },
    { icon: Calendar, label: 'My Bookings', path: '/customer/bookings' },
    { icon: UserCircle, label: 'Profile', path: '/customer/profile' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'admin':
        return adminLinks;
      case 'staff':
        return staffLinks;
      case 'customer':
        return customerLinks;
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-dark-100/95 backdrop-blur-md border-r border-primary-600/20 transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-4 space-y-2 overflow-y-auto h-full">
        {links.map((link, index) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={link.path}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all group relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600/20 to-neon-blue/20 text-primary-400 shadow-neon-purple'
                    : 'hover:bg-dark-300 text-dark-900'
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-neon-blue"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className={`flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`}>
                  <Icon size={22} />
                </div>

                {/* Label */}
                {isOpen && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {link.label}
                  </span>
                )}

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-neon-blue/0 group-hover:from-primary-500/5 group-hover:to-neon-blue/5 transition-all" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      {isOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-600/20">
          <div className="glass rounded-lg p-3 text-center">
            <p className="text-xs text-dark-800 mb-1">Need Help?</p>
            <button className="text-sm text-primary-400 hover:text-primary-300 font-semibold">
              Support Center
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
