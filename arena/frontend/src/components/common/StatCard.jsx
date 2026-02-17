import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'primary',
  delay = 0 
}) => {
  const colors = {
    primary: 'from-primary-600 to-primary-700',
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    orange: 'from-orange-600 to-orange-700',
    purple: 'from-purple-600 to-purple-700',
  };

  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="glass rounded-xl p-6 hover-lift card-shine relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors[color]} opacity-10 rounded-full blur-2xl`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-dark-800 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-display font-bold text-gradient">
              {value}
            </h3>
          </div>
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colors[color]}`}>
            <Icon size={24} />
          </div>
        </div>

        {trend && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{trendValue}</span>
            </div>
            <span className="text-dark-800 text-sm">vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
