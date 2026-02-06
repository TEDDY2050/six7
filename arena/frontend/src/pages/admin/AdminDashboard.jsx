import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Gamepad2, 
  DollarSign, 
  TrendingUp,
  Clock,
  Monitor,
  Calendar
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  // Mock data - replace with API calls
  const [stats, setStats] = useState({
    totalUsers: 1234,
    activeStations: 42,
    todayRevenue: 45678,
    totalBookings: 567,
  });

  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 4500 },
    { name: 'Fri', revenue: 6000 },
    { name: 'Sat', revenue: 7500 },
    { name: 'Sun', revenue: 7000 },
  ];

  const stationUsageData = [
    { name: 'PC Gaming', value: 45, color: '#d946ef' },
    { name: 'Console', value: 30, color: '#00f3ff' },
    { name: 'VR', value: 15, color: '#39ff14' },
    { name: 'Others', value: 10, color: '#ff6600' },
  ];

  const popularGames = [
    { name: 'Valorant', hours: 450, color: 'from-red-500 to-red-600' },
    { name: 'CS:GO', hours: 380, color: 'from-orange-500 to-orange-600' },
    { name: 'GTA V', hours: 320, color: 'from-purple-500 to-purple-600' },
    { name: 'FIFA 24', hours: 290, color: 'from-green-500 to-green-600' },
    { name: 'Fortnite', hours: 250, color: 'from-blue-500 to-blue-600' },
  ];

  const recentActivities = [
    { user: 'John Doe', action: 'Started session', station: 'PC-15', time: '2 min ago' },
    { user: 'Jane Smith', action: 'Completed payment', amount: '₹300', time: '5 min ago' },
    { user: 'Mike Wilson', action: 'New booking', station: 'Console-8', time: '10 min ago' },
    { user: 'Sarah Connor', action: 'Extended session', station: 'VR-3', time: '15 min ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-display font-bold mb-2">
          Dashboard <span className="text-gradient">Overview</span>
        </h1>
        <p className="text-dark-800">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="+12%"
          color="primary"
          delay={0}
        />
        <StatCard
          title="Active Stations"
          value={`${stats.activeStations}/50`}
          icon={Monitor}
          trend="up"
          trendValue="+5%"
          color="blue"
          delay={0.1}
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="+18%"
          color="green"
          delay={0.2}
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          icon={Calendar}
          trend="down"
          trendValue="-3%"
          color="orange"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-display font-bold">Revenue Overview</h3>
              <p className="text-dark-800 text-sm">Weekly revenue statistics</p>
            </div>
            <TrendingUp className="text-green-400" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
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
                dataKey="revenue"
                stroke="#d946ef"
                strokeWidth={3}
                dot={{ fill: '#d946ef', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Station Usage Pie Chart */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-display font-bold">Station Usage</h3>
              <p className="text-dark-800 text-sm">Distribution by type</p>
            </div>
            <Monitor className="text-primary-400" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stationUsageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {stationUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e1e26',
                  border: '1px solid rgba(217, 70, 239, 0.3)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {stationUsageData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-dark-900">{item.name}</span>
                <span className="text-sm text-dark-800 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Popular Games and Recent Activities */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Popular Games */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-display font-bold">Popular Games</h3>
              <p className="text-dark-800 text-sm">Most played this week</p>
            </div>
            <Gamepad2 className="text-primary-400" size={24} />
          </div>
          <div className="space-y-4">
            {popularGames.map((game, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{game.name}</span>
                  <span className="text-dark-800 text-sm">{game.hours}h</span>
                </div>
                <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(game.hours / 450) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${game.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-display font-bold">Recent Activities</h3>
              <p className="text-dark-800 text-sm">Latest user actions</p>
            </div>
            <Clock className="text-primary-400" size={24} />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-dark-200 hover:bg-dark-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-neon-blue flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold">{activity.user.split(' ')[0][0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{activity.user}</p>
                  <p className="text-dark-800 text-sm">
                    {activity.action}
                    {activity.station && ` - ${activity.station}`}
                    {activity.amount && ` - ${activity.amount}`}
                  </p>
                  <p className="text-dark-700 text-xs mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
