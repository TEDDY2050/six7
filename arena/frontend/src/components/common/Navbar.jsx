import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Bell, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New booking received', time: '5 min ago', unread: true },
    { id: 2, message: 'Payment completed', time: '10 min ago', unread: true },
    { id: 3, message: 'Station #5 available', time: '15 min ago', unread: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-dark-100/95 backdrop-blur-md border-b border-primary-600/20 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-dark-300 transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-neon-blue rounded-lg flex items-center justify-center shadow-neon-purple">
              <span className="text-2xl font-bold font-display">G</span>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-gradient">GAME ARENA</h1>
              <p className="text-xs text-dark-800 uppercase tracking-wider">{user?.role}</p>
            </div>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-dark-300 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-pink rounded-full text-xs flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 glass rounded-xl overflow-hidden shadow-cyber"
                >
                  <div className="p-4 border-b border-primary-600/20">
                    <h3 className="font-display font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-dark-300 hover:bg-dark-200 cursor-pointer transition-colors ${
                          notif.unread ? 'bg-dark-200/50' : ''
                        }`}
                      >
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-dark-700 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-primary-600/20 text-center">
                    <button className="text-sm text-primary-400 hover:text-primary-300">
                      View All
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-300 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-neon-blue flex items-center justify-center">
                <User size={18} />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-dark-800">{user?.email}</p>
              </div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 glass rounded-xl overflow-hidden shadow-cyber"
                >
                  <div className="p-4 border-b border-primary-600/20">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-dark-800">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      to={`/${user?.role}/profile`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-200 transition-colors"
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to={`/${user?.role}/settings`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-200 transition-colors"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </Link>
                  </div>
                  <div className="p-2 border-t border-primary-600/20">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
