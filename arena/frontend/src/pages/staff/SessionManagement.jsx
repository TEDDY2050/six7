import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Gamepad2,
  Zap,
  Play,
  Square,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  X,
  User,
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { stationService, sessionService, gameService } from '../../services/api';
import toast from 'react-hot-toast';

const SessionManagement = () => {
  const [stations, setStations] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [modalData, setModalData] = useState({
    customerName: '',
    gameId: '',
    duration: 60,
  });
  const [startingSession, setStartingSession] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stationsRes, sessionsRes, gamesRes] = await Promise.allSettled([
        stationService.getAll(),
        sessionService.getActive(),
        gameService.getAll(),
      ]);

      if (stationsRes.status === 'fulfilled') setStations(stationsRes.value.data);
      if (sessionsRes.status === 'fulfilled') setActiveSessions(sessionsRes.value.data || []);
      if (gamesRes.status === 'fulfilled') setGames(gamesRes.value.data || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Type-based styling
  const getTypeIcon = (type) => ({ PC: Monitor, PS5: Gamepad2, Xbox: Gamepad2, Console: Gamepad2, Simulator: Zap, VR: Zap }[type] || Monitor);
  const getTypeColor = (type) => ({ PC: 'text-cyan-400', PS5: 'text-pink-400', Xbox: 'text-green-400', Simulator: 'text-orange-400', VR: 'text-purple-400' }[type] || 'text-primary-400');
  const getTypeBg = (type) => ({ PC: 'bg-cyan-400/10 border-cyan-400/20', PS5: 'bg-pink-400/10 border-pink-400/20', Xbox: 'bg-green-400/10 border-green-400/20', Simulator: 'bg-orange-400/10 border-orange-400/20', VR: 'bg-purple-400/10 border-purple-400/20' }[type] || 'bg-primary-400/10 border-primary-400/20');

  const getActiveSession = (stationId) =>
    activeSessions.find((s) => (s.station?._id || s.station) === stationId);

  // Open start modal
  const openStartModal = (station) => {
    setSelectedStation(station);
    setModalData({ customerName: '', gameId: '', duration: 60 });
    setShowModal(true);
  };

  // Start session via API
  const handleStartSession = async () => {
    if (!modalData.customerName.trim()) {
      toast.error('Please enter a customer name');
      return;
    }

    setStartingSession(true);
    try {
      await sessionService.start({
        stationId: selectedStation._id,
        gameId: modalData.gameId || null,
        customerName: modalData.customerName,
        duration: modalData.duration,
      });

      toast.success(`Session started on ${selectedStation.name}!`);
      setShowModal(false);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start session');
    } finally {
      setStartingSession(false);
    }
  };

  // End session via API
  const endSession = async (sessionId) => {
    try {
      const res = await sessionService.end(sessionId);
      const total = res.data?.totalAmount || 0;
      toast.success(`Session ended! Total: ₹${total}`);
      await fetchData();
    } catch (err) {
      toast.error('Failed to end session');
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    const badges = {
      Available: { icon: CheckCircle2, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30', label: 'Available' },
      'In Use': { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', label: 'In Use' },
      Offline: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Offline' },
    };
    const badge = badges[status] || badges.Available;
    const Icon = badge.icon;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badge.bg} ${badge.color} border ${badge.border}`}>
        <Icon size={14} />
        <span className="text-xs font-semibold">{badge.label}</span>
      </div>
    );
  };

  const stats = {
    total: stations.length,
    available: stations.filter((s) => s.status === 'Available').length,
    inUse: stations.filter((s) => s.status === 'In Use').length,
    offline: stations.filter((s) => s.status === 'Offline').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="loading-spinner mx-auto"></div>
          <p className="mt-4 text-dark-700">Loading stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">
            Session <span className="text-gradient">Management</span>
          </h1>
          <p className="text-dark-800">Click an available station to start a session</p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-lg hover:bg-dark-300 transition-colors text-dark-700" title="Refresh">
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-primary-500/20">
          <div className="flex items-center justify-between">
            <div><p className="text-dark-800 text-sm mb-1">Total</p><h3 className="text-3xl font-display font-bold">{stats.total}</h3></div>
            <div className="p-3 rounded-lg bg-primary-500/10"><Monitor size={24} className="text-primary-400" /></div>
          </div>
        </Card>
        <Card className="border border-neon-green/20">
          <div className="flex items-center justify-between">
            <div><p className="text-dark-800 text-sm mb-1">Available</p><h3 className="text-3xl font-display font-bold text-neon-green">{stats.available}</h3></div>
            <div className="p-3 rounded-lg bg-neon-green/10"><CheckCircle2 size={24} className="text-neon-green" /></div>
          </div>
        </Card>
        <Card className="border border-orange-500/20">
          <div className="flex items-center justify-between">
            <div><p className="text-dark-800 text-sm mb-1">In Use</p><h3 className="text-3xl font-display font-bold text-orange-500">{stats.inUse}</h3></div>
            <div className="p-3 rounded-lg bg-orange-500/10"><Play size={24} className="text-orange-500" /></div>
          </div>
        </Card>
        <Card className="border border-red-500/20">
          <div className="flex items-center justify-between">
            <div><p className="text-dark-800 text-sm mb-1">Offline</p><h3 className="text-3xl font-display font-bold text-red-500">{stats.offline}</h3></div>
            <div className="p-3 rounded-lg bg-red-500/10"><XCircle size={24} className="text-red-500" /></div>
          </div>
        </Card>
      </div>

      {/* Stations Grid */}
      <div>
        <h3 className="text-2xl font-display font-bold mb-4">
          All <span className="text-gradient">Stations</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stations.map((station, index) => {
            const Icon = getTypeIcon(station.type);
            const colorClass = getTypeColor(station.type);
            const bgClass = getTypeBg(station.type);
            const activeSession = getActiveSession(station._id);

            return (
              <motion.div
                key={station._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => station.status === 'Available' && openStartModal(station)}
                className={`glass rounded-xl p-4 transition-all relative overflow-hidden
                  ${station.status === 'Available' ? 'cursor-pointer hover-lift' : 'opacity-60'}
                  border border-white/10`}
              >
                {/* Top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${station.status === 'Available' ? 'bg-neon-green' : station.status === 'In Use' ? 'bg-orange-500' : 'bg-red-500'}`} />

                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg border ${bgClass}`}>
                    <Icon size={20} className={colorClass} />
                  </div>
                  {getStatusBadge(station.status)}
                </div>

                <h4 className="font-display font-bold text-lg mb-1">{station.name}</h4>
                <p className="text-dark-800 text-sm mb-2">{station.type}</p>
                <p className="text-2xl font-bold text-gradient">₹{station.pricePerHour}/hr</p>

                {/* Active session info */}
                {activeSession && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-dark-900 mb-1">
                      <User size={14} />
                      <span className="font-semibold">{activeSession.customerName || activeSession.user?.name || 'Walk-in'}</span>
                    </div>
                    {activeSession.game && (
                      <div className="flex items-center gap-2 text-sm text-dark-800 mb-1">
                        <Gamepad2 size={14} />
                        <span>{activeSession.game.title}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-dark-800 mb-3">
                      <Clock size={14} />
                      <span>Started {new Date(activeSession.startTime).toLocaleTimeString()}</span>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      icon={Square}
                      onClick={(e) => {
                        e.stopPropagation();
                        endSession(activeSession._id);
                      }}
                    >
                      End Session
                    </Button>
                  </div>
                )}

                {/* Available indicator */}
                {station.status === 'Available' && (
                  <div className="mt-3 text-center">
                    <span className="text-xs text-neon-green font-semibold animate-pulse">Tap to start session</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Start Session Modal */}
      <AnimatePresence>
        {showModal && selectedStation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-100 border border-primary-500/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-dark-400 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-bold">Start Session</h2>
                  <p className="text-dark-800 text-sm">{selectedStation.name} — {selectedStation.type} — ₹{selectedStation.pricePerHour}/hr</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-dark-300 text-dark-700">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={modalData.customerName}
                    onChange={(e) => setModalData({ ...modalData, customerName: e.target.value })}
                    placeholder="Enter customer name"
                    className="w-full bg-dark-200 border border-dark-400 rounded-xl py-3 px-4 text-white placeholder-dark-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
                    autoFocus
                  />
                </div>

                {/* Game Selection */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">Game (optional)</label>
                  <select
                    value={modalData.gameId}
                    onChange={(e) => setModalData({ ...modalData, gameId: e.target.value })}
                    className="w-full bg-dark-200 border border-dark-400 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
                  >
                    <option value="">General Gaming</option>
                    {games.map((game) => (
                      <option key={game._id} value={game._id}>{game.title} {game.platform ? `(${game.platform})` : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">Duration</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: '1h', value: 60 },
                      { label: '2h', value: 120 },
                      { label: '3h', value: 180 },
                      { label: '5h', value: 300 },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setModalData({ ...modalData, duration: opt.value })}
                        className={`py-2.5 rounded-xl font-display font-bold text-sm transition-all
                          ${modalData.duration === opt.value
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-dark-300 text-dark-800 hover:bg-dark-400'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Preview */}
                <div className="bg-dark-200 rounded-xl p-4 border border-dark-400">
                  <div className="flex justify-between items-center">
                    <span className="text-dark-800">Estimated Total</span>
                    <span className="text-2xl font-display font-bold text-primary-400">
                      ₹{selectedStation.pricePerHour * (modalData.duration / 60)}
                    </span>
                  </div>
                  <p className="text-dark-700 text-xs mt-1">Final amount based on actual session time</p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-dark-400">
                <Button
                  fullWidth
                  icon={Play}
                  onClick={handleStartSession}
                  loading={startingSession}
                >
                  Start Session
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SessionManagement;
