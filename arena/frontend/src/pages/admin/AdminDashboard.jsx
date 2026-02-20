import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Gamepad2,
  DollarSign,
  TrendingUp,
  Clock,
  Monitor,
  Calendar,
  AlertCircle
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import { dashboardService } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [stationUsage, setStationUsage] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#d946ef', '#00f3ff', '#39ff14', '#ff6600', '#a855f7'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, revenueRes, usageRes, gamesRes, activitiesRes] = await Promise.allSettled([
        dashboardService.getStats(),
        dashboardService.getRevenue('weekly'),
        dashboardService.getStationUsage(),
        dashboardService.getPopularGames(),
        dashboardService.getRecentActivities(),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (revenueRes.status === 'fulfilled') setRevenueData(revenueRes.value.data);
      if (usageRes.status === 'fulfilled') {
        const usage = usageRes.value.data.map((item, i) => ({
          name: item._id,
          value: item.total,
          inUse: item.inUse,
          color: COLORS[i % COLORS.length],
        }));
        setStationUsage(usage);
      }
      if (gamesRes.status === 'fulfilled') setPopularGames(gamesRes.value.data);
      if (activitiesRes.status === 'fulfilled') setActivities(activitiesRes.value.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto"></div>
          <p className="mt-4 text-dark-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold mb-2">
          Dashboard <span className="text-gradient">Overview</span>
        </h1>
        <p className="text-dark-800">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || '0'}
          icon={Users}
          trend="up"
          trendValue="+12%"
          color="primary"
          delay={0}
        />
        <StatCard
          title="Active Stations"
          value={`${stats?.activeStations || 0}/${stats?.totalStations || 0}`}
          icon={Monitor}
          trend="up"
          trendValue="+5%"
          color="blue"
          delay={0.1}
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${(stats?.todayRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          color="green"
          delay={0.2}
        />
        <StatCard
          title="Total Bookings"
          value={(stats?.totalBookings || 0).toLocaleString()}
          icon={Calendar}
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
          {revenueData.length > 0 ? (
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
                <Line type="monotone" dataKey="revenue" stroke="#d946ef" strokeWidth={3} dot={{ fill: '#d946ef', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-dark-700">
              <p>No revenue data yet. Process some payments to see the chart.</p>
            </div>
          )}
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
          {stationUsage.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stationUsage} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {stationUsage.map((entry, index) => (
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
                {stationUsage.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-dark-900">{item.name}</span>
                    <span className="text-sm text-dark-800 ml-auto">{item.value} total</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-dark-700">
              <p>No station data yet. Add stations to see usage.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Popular Games and Recent Activities */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Popular Games */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-display font-bold">Popular Games</h3>
              <p className="text-dark-800 text-sm">Most booked games</p>
            </div>
            <Gamepad2 className="text-primary-400" size={24} />
          </div>
          {popularGames.length > 0 ? (
            <div className="space-y-4">
              {popularGames.map((game, index) => {
                const maxBookings = popularGames[0]?.bookings || 1;
                const colors = ['from-red-500 to-red-600', 'from-orange-500 to-orange-600', 'from-purple-500 to-purple-600', 'from-green-500 to-green-600', 'from-blue-500 to-blue-600'];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{game.name}</span>
                      <span className="text-dark-800 text-sm">{game.bookings} bookings</span>
                    </div>
                    <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(game.bookings / maxBookings) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-dark-700">
              <Gamepad2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No bookings yet. Games will appear here once customers book sessions.</p>
            </div>
          )}
        </Card>

        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-display font-bold">Recent Activities</h3>
              <p className="text-dark-800 text-sm">Latest actions</p>
            </div>
            <Clock className="text-primary-400" size={24} />
          </div>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-dark-200 hover:bg-dark-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-neon-blue flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold">{activity.user?.[0] || '?'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{activity.user}</p>
                    <p className="text-dark-800 text-sm">
                      {activity.action}
                      {activity.station && ` - ${activity.station}`}
                      {activity.game && ` (${activity.game})`}
                    </p>
                    <p className="text-dark-700 text-xs mt-1">{formatTime(activity.time)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-dark-700">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No activities yet.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
