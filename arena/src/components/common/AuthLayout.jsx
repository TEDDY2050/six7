import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-neon-blue rounded-xl flex items-center justify-center shadow-neon-purple">
              <span className="text-3xl font-bold font-display">G</span>
            </div>
          </Link>
          <h1 className="text-4xl font-display font-bold text-gradient mb-2">
            GAME ARENA
          </h1>
          <p className="text-dark-800 uppercase tracking-wider text-sm">
            Ultimate Gaming Experience
          </p>
        </motion.div>

        {/* Auth Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 shadow-cyber"
        >
          {children}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-6 text-sm text-dark-800"
        >
          <p>© 2024 Game Arena. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
