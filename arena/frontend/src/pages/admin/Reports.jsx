import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  IndianRupee,
  Users,
  Gamepad2,
  Clock,
  Activity,
  FileSpreadsheet,
  Download,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  CalendarDays,
  CalendarRange,
  Filter,
} from 'lucide-react';
import { reportService, dashboardService } from '../../services/api';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const Reports = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('daily');

  // Date states
  const today = new Date().toISOString().split('T')[0];
  const [dailyDate, setDailyDate] = useState(today);
  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [customStart, setCustomStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [customEnd, setCustomEnd] = useState(today);

  // Data
  const [reportData, setReportData] = useState(null);
  const [dailyBookings, setDailyBookings] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      switch (activeTab) {
        case 'daily':
          res = await reportService.getDailyReport(dailyDate);
          setReportData(res.data);
          setDailyBookings(res.data.bookings || []);
          break;
        case 'monthly': {
          const [y, m] = monthYear.split('-');
          res = await reportService.getMonthlyReport(m, y);
          setReportData(res.data);
          setDailyBookings([]);
          break;
        }
        case 'custom':
          res = await reportService.getCustomReport(customStart, customEnd);
          setReportData(res.data);
          setDailyBookings([]);
          break;
      }
    } catch (err) {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  }, [activeTab, dailyDate, monthYear, customStart, customEnd]);

  // Fetch dashboard extras once
  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const [revRes, gamesRes] = await Promise.allSettled([
          dashboardService.getRevenue('weekly'),
          dashboardService.getPopularGames(),
        ]);
        if (revRes.status === 'fulfilled') setRevenueData(revRes.value.data);
        if (gamesRes.status === 'fulfilled') setPopularGames(gamesRes.value.data);
      } catch (e) { /* silent */ }
    };
    fetchExtras();
  }, []);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  // Export handler
  const handleExport = async (type) => {
    setExporting(type);
    try {
      const params = {};
      if (activeTab === 'daily') {
        params.startDate = dailyDate;
        params.endDate = dailyDate;
      } else if (activeTab === 'monthly') {
        const [y, m] = monthYear.split('-');
        const start = new Date(y, m - 1, 1);
        const end = new Date(y, m, 0);
        params.startDate = start.toISOString().split('T')[0];
        params.endDate = end.toISOString().split('T')[0];
      } else {
        params.startDate = customStart;
        params.endDate = customEnd;
      }
      const res = await reportService.exportReport(type, params);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`${type} data exported!`);
    } catch (err) {
      toast.error(`Failed to export ${type}`);
    } finally {
      setExporting(null);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const tabs = [
    { key: 'daily', label: 'Daily', icon: CalendarDays },
    { key: 'monthly', label: 'Monthly', icon: Calendar },
    { key: 'custom', label: 'Custom Range', icon: CalendarRange },
  ];

  // Stat cards from report data
  const stats = reportData
    ? [
      {
        label: 'Total Revenue',
        value: `₹${(reportData.totalRevenue || 0).toLocaleString()}`,
        icon: IndianRupee,
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
      },
      {
        label: 'Bookings',
        value: reportData.totalBookings || 0,
        icon: Calendar,
        color: 'from-primary-500 to-purple-600',
        bgColor: 'bg-primary-500/10',
        borderColor: 'border-primary-500/20',
      },
      {
        label: 'Sessions',
        value: reportData.totalSessions || 0,
        icon: Activity,
        color: 'from-neon-blue to-cyan-500',
        bgColor: 'bg-neon-blue/10',
        borderColor: 'border-neon-blue/20',
      },
      {
        label: 'Payments',
        value: reportData.totalPayments || 0,
        icon: TrendingUp,
        color: 'from-orange-500 to-amber-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
      },
    ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold mb-1">
            <span className="text-gradient">Reports</span>
          </h1>
          <p className="text-dark-800 text-sm">Analyze your arena performance and revenue</p>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('bookings')}
            disabled={!!exporting}
            className="px-4 py-2.5 bg-primary-500/15 text-primary-400 border border-primary-500/30 rounded-xl text-sm font-semibold hover:bg-primary-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {exporting === 'bookings' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Bookings CSV
          </button>
          <button
            onClick={() => handleExport('payments')}
            disabled={!!exporting}
            className="px-4 py-2.5 bg-green-500/15 text-green-400 border border-green-500/30 rounded-xl text-sm font-semibold hover:bg-green-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {exporting === 'payments' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Billing CSV
          </button>
        </div>
      </motion.div>

      {/* Tab Selector + Date Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="p-5 border border-primary-500/10">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Tabs */}
            <div className="flex bg-dark-200 rounded-xl p-1 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                        : 'text-dark-800 hover:text-white hover:bg-dark-300'
                      }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Date Inputs */}
            <div className="flex items-center gap-3 flex-1">
              <Filter size={16} className="text-dark-700 flex-shrink-0" />
              {activeTab === 'daily' && (
                <input
                  type="date"
                  value={dailyDate}
                  max={today}
                  onChange={(e) => setDailyDate(e.target.value)}
                  className="bg-dark-200 border border-dark-400 rounded-xl py-2.5 px-4 text-white focus:border-primary-500 focus:outline-none cursor-pointer transition-colors"
                />
              )}
              {activeTab === 'monthly' && (
                <input
                  type="month"
                  value={monthYear}
                  onChange={(e) => setMonthYear(e.target.value)}
                  className="bg-dark-200 border border-dark-400 rounded-xl py-2.5 px-4 text-white focus:border-primary-500 focus:outline-none cursor-pointer transition-colors"
                />
              )}
              {activeTab === 'custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customStart}
                    max={customEnd}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="bg-dark-200 border border-dark-400 rounded-xl py-2.5 px-3 text-white text-sm focus:border-primary-500 focus:outline-none cursor-pointer transition-colors"
                  />
                  <span className="text-dark-600">→</span>
                  <input
                    type="date"
                    value={customEnd}
                    min={customStart}
                    max={today}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="bg-dark-200 border border-dark-400 rounded-xl py-2.5 px-3 text-white text-sm focus:border-primary-500 focus:outline-none cursor-pointer transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="loading-spinner" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-5 hover:scale-[1.02] transition-transform`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-dark-800 text-xs font-semibold uppercase tracking-wider">{stat.label}</span>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <Icon size={16} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl lg:text-3xl font-display font-bold text-white">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Weekly Revenue Chart */}
            <Card className="lg:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-primary-400" />
                  <h3 className="font-display font-bold">Weekly Revenue</h3>
                </div>
                <span className="text-dark-700 text-xs">Last 7 days</span>
              </div>
              {revenueData.length > 0 ? (
                <div className="flex items-end gap-3 h-44">
                  {revenueData.map((d, i) => {
                    const max = Math.max(...revenueData.map((r) => r.revenue), 1);
                    const pct = (d.revenue / max) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <span className="text-[10px] text-dark-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          ₹{d.revenue}
                        </span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(pct, 4)}%` }}
                          transition={{ duration: 0.7, delay: i * 0.08 }}
                          className="w-full bg-gradient-to-t from-primary-500 to-neon-blue rounded-t-lg min-h-[4px] hover:shadow-lg hover:shadow-primary-500/20 transition-shadow cursor-pointer relative"
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-dark-100 border border-dark-400 rounded-lg px-2 py-0.5 text-[10px] text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            ₹{d.revenue}
                          </div>
                        </motion.div>
                        <span className="text-[10px] text-dark-700 font-medium">{d.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-44 text-dark-700">
                  <p className="text-sm">No revenue data available</p>
                </div>
              )}
            </Card>

            {/* Top Games */}
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Gamepad2 size={18} className="text-neon-pink" />
                  <h3 className="font-display font-bold">Top Games</h3>
                </div>
                <PieChart size={16} className="text-dark-600" />
              </div>
              {popularGames.length > 0 ? (
                <div className="space-y-3">
                  {popularGames.slice(0, 5).map((game, i) => {
                    const max = popularGames[0]?.bookings || 1;
                    const pct = Math.round((game.bookings / max) * 100);
                    const colors = [
                      'from-primary-500 to-neon-pink',
                      'from-neon-blue to-cyan-400',
                      'from-green-500 to-emerald-400',
                      'from-orange-500 to-amber-400',
                      'from-purple-500 to-violet-400',
                    ];
                    const medals = ['🥇', '🥈', '🥉'];
                    return (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 text-center text-xs">{medals[i] || `#${i + 1}`}</span>
                            <span className="font-semibold group-hover:text-white transition-colors">{game.name}</span>
                          </div>
                          <span className="text-dark-700 text-xs">{game.bookings} bookings</span>
                        </div>
                        <div className="h-2 bg-dark-300 rounded-full overflow-hidden ml-7">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-dark-700">
                  <Gamepad2 size={28} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No game data available</p>
                </div>
              )}
            </Card>
          </div>

          {/* Daily Bookings Table (only for daily report) */}
          {activeTab === 'daily' && dailyBookings.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden">
                <div className="p-5 border-b border-dark-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet size={18} className="text-primary-400" />
                    <h3 className="font-display font-bold">
                      Bookings on {formatDate(dailyDate)}
                    </h3>
                    <span className="ml-2 px-2.5 py-0.5 bg-primary-500/15 text-primary-400 border border-primary-500/30 rounded-full text-xs font-bold">
                      {dailyBookings.length}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-400 bg-dark-200/50">
                        <th className="text-left py-3.5 px-5 text-dark-800 font-semibold text-xs uppercase tracking-wider">#</th>
                        <th className="text-left py-3.5 px-5 text-dark-800 font-semibold text-xs uppercase tracking-wider">Customer</th>
                        <th className="text-left py-3.5 px-5 text-dark-800 font-semibold text-xs uppercase tracking-wider">Game</th>
                        <th className="text-left py-3.5 px-5 text-dark-800 font-semibold text-xs uppercase tracking-wider">Station</th>
                        <th className="text-left py-3.5 px-5 text-dark-800 font-semibold text-xs uppercase tracking-wider">Time</th>
                        <th className="text-left py-3.5 px-5 text-dark-800 font-semibold text-xs uppercase tracking-wider">Duration</th>
                        <th className="text-right py-3.5 px-5 text-dark-800 font-semibold text-xs uppercase tracking-wider">Price</th>
                        <th className="text-center py-3.5 px-5 text-dark-800 font-semibold text-xs uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyBookings.map((b, idx) => {
                        const statusStyles = {
                          pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                          confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                          active: 'bg-green-500/20 text-green-400 border-green-500/30',
                          completed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                          cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
                        };
                        return (
                          <motion.tr
                            key={b._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className="border-b border-dark-300 hover:bg-dark-200/50 transition-colors"
                          >
                            <td className="py-3.5 px-5 text-dark-700 text-sm">{idx + 1}</td>
                            <td className="py-3.5 px-5">
                              <p className="font-semibold text-sm">{b.user?.name || 'Unknown'}</p>
                            </td>
                            <td className="py-3.5 px-5 text-dark-900 text-sm">{b.game?.title || 'N/A'}</td>
                            <td className="py-3.5 px-5 text-dark-900 text-sm">{b.station?.name || 'N/A'}</td>
                            <td className="py-3.5 px-5 text-dark-900 text-sm">{b.bookingTime || '-'}</td>
                            <td className="py-3.5 px-5 text-dark-900 text-sm">{b.duration}h</td>
                            <td className="py-3.5 px-5 text-right font-display font-bold text-primary-400">₹{b.totalPrice || 0}</td>
                            <td className="py-3.5 px-5 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${statusStyles[b.status] || statusStyles.pending}`}>
                                {b.status}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Summary Card for Monthly/Custom */}
          {activeTab !== 'daily' && reportData && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 border border-dark-400">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={18} className="text-primary-400" />
                  <h3 className="font-display font-bold">
                    {activeTab === 'monthly' ? 'Monthly' : 'Custom Range'} Summary
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-dark-700 text-xs font-semibold uppercase mb-1">Revenue</p>
                    <p className="text-2xl font-display font-bold text-green-400">₹{(reportData.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-dark-700 text-xs font-semibold uppercase mb-1">Bookings</p>
                    <p className="text-2xl font-display font-bold text-primary-400">{reportData.totalBookings || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-dark-700 text-xs font-semibold uppercase mb-1">Sessions</p>
                    <p className="text-2xl font-display font-bold text-neon-blue">{reportData.totalSessions || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-dark-700 text-xs font-semibold uppercase mb-1">Payments</p>
                    <p className="text-2xl font-display font-bold text-orange-400">{reportData.totalPayments || 0}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Empty state for daily */}
          {activeTab === 'daily' && dailyBookings.length === 0 && !loading && (
            <Card className="py-16 text-center">
              <Calendar className="h-14 w-14 mx-auto mb-3 text-dark-600 opacity-40" />
              <p className="text-lg font-display text-dark-700">No bookings found</p>
              <p className="text-sm text-dark-600 mt-1">No booking records for {formatDate(dailyDate)}</p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;
