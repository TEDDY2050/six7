import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Gamepad2,
  TrendingUp,
  Clock,
  Monitor,
  Calendar,
  AlertCircle,
  IndianRupee,
  Zap,
  ArrowRight,
  Activity,
  CheckCircle2,
  XCircle,
  Play,
} from 'lucide-react';
import Card from '../../components/common/Card';
import { dashboardService, paymentService, sessionService } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [stationUsage, setStationUsage] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [activities, setActivities] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, revenueRes, usageRes, gamesRes, activitiesRes, paymentsRes, sessionsRes] = await Promise.allSettled([
        dashboardService.getStats(),
        dashboardService.getRevenue('weekly'),
        dashboardService.getStationUsage(),
        dashboardService.getPopularGames(),
        dashboardService.getRecentActivities(),
        paymentService.getAll(),
        sessionService.getActive(),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (revenueRes.status === 'fulfilled') setRevenueData(revenueRes.value.data);
      if (usageRes.status === 'fulfilled') setStationUsage(usageRes.value.data);
      if (gamesRes.status === 'fulfilled') setPopularGames(gamesRes.value.data);
      if (activitiesRes.status === 'fulfilled') setActivities(activitiesRes.value.data);
      if (paymentsRes.status === 'fulfilled') {
        setPendingPayments(paymentsRes.value.data.filter(p => p.status === 'pending'));
      }
      if (sessionsRes.status === 'fulfilled') setActiveSessions(sessionsRes.value.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const diff = Math.floor((Date.now() - new Date(time)) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return new Date(time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const pendingTotal = pendingPayments.reduce((s, p) => s + p.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold">
            Dashboard <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-dark-800 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </motion.div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin/sessions')} className="px-4 py-2 bg-primary-500/15 text-primary-400 border border-primary-500/30 rounded-xl text-sm font-semibold hover:bg-primary-500/25 transition-all flex items-center gap-2">
            <Play size={14} /> Sessions
          </button>
          <button onClick={() => navigate('/admin/payments')} className="px-4 py-2 bg-green-500/15 text-green-400 border border-green-500/30 rounded-xl text-sm font-semibold hover:bg-green-500/25 transition-all flex items-center gap-2">
            <IndianRupee size={14} /> Billing
          </button>
          <button onClick={() => navigate('/admin/bookings')} className="px-4 py-2 bg-neon-blue/15 text-neon-blue border border-neon-blue/30 rounded-xl text-sm font-semibold hover:bg-neon-blue/25 transition-all flex items-center gap-2">
            <Calendar size={14} /> Bookings
          </button>
        </div>
      </div>

      {/* Stat Cards — real data, no fake trends */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Revenue",
            value: `₹${(stats?.todayRevenue || 0).toLocaleString()}`,
            icon: IndianRupee, color: 'from-green-500 to-emerald-600',
            sub: `${pendingPayments.length} pending`,
          },
          {
            label: 'Active Sessions',
            value: activeSessions.length,
            icon: Activity, color: 'from-primary-500 to-purple-600',
            sub: `${stats?.activeStations || 0}/${stats?.totalStations || 0} stations in use`,
          },
          {
            label: 'Pending Collection',
            value: `₹${pendingTotal.toLocaleString()}`,
            icon: Clock, color: 'from-orange-500 to-red-500',
            sub: `${pendingPayments.length} bills to collect`,
            onClick: () => navigate('/admin/payments'),
          },
          {
            label: 'Total Bookings',
            value: (stats?.totalBookings || 0).toLocaleString(),
            icon: Calendar, color: 'from-neon-blue to-cyan-500',
            sub: `${stats?.totalUsers || 0} registered users`,
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={card.onClick}
            className={`bg-dark-200 border border-dark-400 rounded-2xl p-5 hover:border-primary-500/30 transition-all ${card.onClick ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-800 text-xs font-semibold uppercase tracking-wider">{card.label}</span>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color} bg-opacity-20`}>
                <card.icon size={16} className="text-white" />
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-display font-bold text-white">{card.value}</p>
            <p className="text-dark-700 text-xs mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Two-Column Layout: Live Sessions + Pending Payments */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Sessions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Activity size={18} className="text-neon-green" />
                {activeSessions.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-neon-green rounded-full animate-ping"></span>
                )}
              </div>
              <h3 className="font-display font-bold">Live Sessions</h3>
              <span className="text-dark-700 text-xs">({activeSessions.length})</span>
            </div>
            <button onClick={() => navigate('/admin/sessions')} className="text-primary-400 text-xs font-semibold flex items-center gap-1 hover:underline">
              View All <ArrowRight size={12} />
            </button>
          </div>
          {activeSessions.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {activeSessions.map((session, i) => (
                <div key={session._id} className="flex items-center gap-3 p-3 bg-dark-200 rounded-xl border border-dark-300">
                  <div className="w-8 h-8 rounded-lg bg-neon-green/15 flex items-center justify-center flex-shrink-0">
                    <Monitor size={14} className="text-neon-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{session.station?.name || 'Station'}</p>
                    <p className="text-xs text-dark-700">{session.customerName || session.user?.name || 'Walk-in'} • {session.game?.title || ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-dark-700">{session.duration}hr</p>
                    <p className="text-xs text-neon-green font-semibold">{formatTime(session.startTime)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-dark-700">
              <Monitor size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No active sessions</p>
            </div>
          )}
        </Card>

        {/* Pending Payments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <IndianRupee size={18} className="text-orange-400" />
              <h3 className="font-display font-bold">Pending Collection</h3>
              {pendingPayments.length > 0 && (
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-[10px] font-bold">
                  {pendingPayments.length}
                </span>
              )}
            </div>
            <button onClick={() => navigate('/admin/payments')} className="text-primary-400 text-xs font-semibold flex items-center gap-1 hover:underline">
              Collect <ArrowRight size={12} />
            </button>
          </div>
          {pendingPayments.length > 0 ? (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {pendingPayments.slice(0, 8).map(p => (
                <div key={p._id} onClick={() => navigate('/admin/payments')} className="flex items-center gap-3 p-3 bg-dark-200 rounded-xl border border-dark-300 cursor-pointer hover:border-orange-500/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                    <Clock size={14} className="text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.customerName || p.user?.name || 'Walk-in'}</p>
                    <p className="text-xs text-dark-700 truncate">{p.description || 'Session'}</p>
                  </div>
                  <p className="text-sm font-display font-bold text-orange-400">₹{p.amount}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-dark-700">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500/30" />
              <p className="text-sm text-green-400">All payments collected 🎉</p>
            </div>
          )}
        </Card>
      </div>

      {/* Station Usage + Revenue Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Station Usage — visual bar chart */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Station Usage</h3>
            <Monitor size={18} className="text-primary-400" />
          </div>
          {stationUsage.length > 0 ? (
            <div className="space-y-4">
              {stationUsage.map((item, i) => {
                const colors = ['bg-neon-blue', 'bg-neon-pink', 'bg-orange-500', 'bg-neon-green', 'bg-purple-500'];
                const pct = item.total > 0 ? Math.round((item.inUse / item.total) * 100) : 0;
                return (
                  <div key={item._id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-semibold">{item._id}</span>
                      <span className="text-dark-700">{item.inUse}/{item.total} <span className="text-dark-600">({pct}%)</span></span>
                    </div>
                    <div className="h-2.5 bg-dark-300 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full ${colors[i % colors.length]} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-dark-700 text-sm text-center py-8">No station data</p>
          )}
        </Card>

        {/* Revenue — simple sparkline-style bar chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold">Weekly Revenue</h3>
              <p className="text-dark-700 text-xs mt-0.5">Last 7 days</p>
            </div>
            <TrendingUp size={18} className="text-green-400" />
          </div>
          {revenueData.length > 0 ? (
            <div className="flex items-end gap-2 h-40">
              {revenueData.map((d, i) => {
                const max = Math.max(...revenueData.map(r => r.revenue), 1);
                const pct = (d.revenue / max) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-dark-700 font-semibold">₹{d.revenue}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(pct, 5)}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                      className="w-full bg-gradient-to-t from-primary-500 to-neon-blue rounded-t-lg min-h-[4px]"
                    />
                    <span className="text-[10px] text-dark-700">{d.name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-dark-700">
              <p className="text-sm">Process payments to see revenue chart</p>
            </div>
          )}
        </Card>
      </div>

      {/* Popular Games + Activity Feed */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Popular Games */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Top Games</h3>
            <Gamepad2 size={18} className="text-primary-400" />
          </div>
          {popularGames.length > 0 ? (
            <div className="space-y-3">
              {popularGames.map((game, i) => {
                const max = popularGames[0]?.bookings || 1;
                const pct = Math.round((game.bookings / max) * 100);
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 text-center">{medals[i] || `#${i + 1}`}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold">{game.name}</span>
                        <span className="text-dark-700">{game.bookings}</span>
                      </div>
                      <div className="h-1.5 bg-dark-300 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary-500 to-neon-pink rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-dark-700">
              <Gamepad2 size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No bookings yet</p>
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Recent Activity</h3>
            <Clock size={18} className="text-primary-400" />
          </div>
          {activities.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activities.slice(0, 8).map((a, i) => {
                const icons = {
                  'Started session': <Play size={12} className="text-green-400" />,
                  'Completed session': <CheckCircle2 size={12} className="text-neon-blue" />,
                  'Cancelled booking': <XCircle size={12} className="text-red-400" />,
                  'New booking': <Calendar size={12} className="text-primary-400" />,
                };
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-dark-200 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-dark-300 flex items-center justify-center flex-shrink-0">
                      {icons[a.action] || <Zap size={12} className="text-dark-700" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs">
                        <span className="font-semibold">{a.user}</span>
                        <span className="text-dark-700"> {a.action}</span>
                        {a.station && <span className="text-dark-800"> · {a.station}</span>}
                      </p>
                    </div>
                    <span className="text-[10px] text-dark-600 flex-shrink-0">{formatTime(a.time)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-dark-700">
              <Clock size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No activity yet</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
