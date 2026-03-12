import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Plus, Edit2, Trash2, X, Check, Wifi, WifiOff, Search, Gamepad2, Calendar, Clock, Zap } from 'lucide-react';
import { stationService, gameService, bookingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const StationManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({ name: '', type: '', pricePerHour: '', status: 'Available' });

  // Quick Book state
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookingStation, setBookingStation] = useState(null);
  const [games, setGames] = useState([]);
  const [bookingData, setBookingData] = useState({
    gameId: '',
    bookingDate: '',
    bookingTime: '',
    duration: 1,
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => { fetchStations(); }, []);

  const fetchStations = async () => {
    try {
      const res = await stationService.getAll();
      setStations(res.data);
    } catch (err) {
      toast.error('Failed to load stations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, pricePerHour: parseFloat(formData.pricePerHour) };
      if (editingStation) {
        await stationService.update(editingStation._id, data);
        toast.success('Station updated');
      } else {
        await stationService.create(data);
        toast.success('Station added');
      }
      setShowModal(false);
      setEditingStation(null);
      setFormData({ name: '', type: '', pricePerHour: '', status: 'Available' });
      fetchStations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData({ name: station.name, type: station.type, pricePerHour: station.pricePerHour?.toString() || '', status: station.status });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await stationService.delete(id);
      toast.success('Station deleted');
      setDeleteConfirm(null);
      fetchStations();
    } catch (err) {
      toast.error('Failed to delete station');
    }
  };

  const toggleStatus = async (station) => {
    const newStatus = station.status === 'Available' ? 'Offline' : 'Available';
    try {
      await stationService.updateStatus(station._id, newStatus);
      toast.success(`Station set to ${newStatus}`);
      fetchStations();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Quick Book handlers
  const openBookModal = async (station) => {
    setBookingStation(station);
    const today = new Date().toISOString().split('T')[0];
    setBookingData({ gameId: '', bookingDate: today, bookingTime: '', duration: 1 });
    setShowBookModal(true);

    // Fetch games filtered by station type
    try {
      const gRes = await gameService.getAll();
      const allGames = gRes.data;
      // Filter games matching this station's type (platform)
      const filtered = allGames.filter(g => g.platform === station.type);
      setGames(filtered.length > 0 ? filtered : allGames);
    } catch (err) {
      toast.error('Failed to load games');
    }
  };

  const handleQuickBook = async (e) => {
    e.preventDefault();
    if (!bookingData.gameId || !bookingData.bookingDate || !bookingData.bookingTime) {
      toast.error('Please fill in all fields');
      return;
    }
    setBookingLoading(true);
    try {
      await bookingService.create({
        gameId: bookingData.gameId,
        stationId: bookingStation._id,
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        duration: bookingData.duration,
      });
      toast.success('🎉 Booking created! Redirecting to payments...');
      setShowBookModal(false);
      setBookingStation(null);
      fetchStations();
      // Redirect to payments page
      navigate('/admin/payments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const types = [...new Set(stations.map(s => s.type))];
  const filteredStations = filterType === 'all' ? stations : stations.filter(s => s.type === filterType);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Available': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', dot: 'bg-green-400' };
      case 'In Use': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400' };
      case 'Offline': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400' };
      default: return { bg: 'bg-dark-400', text: 'text-dark-800', border: 'border-dark-500', dot: 'bg-dark-700' };
    }
  };

  const statusCounts = {
    Available: stations.filter(s => s.status === 'Available').length,
    'In Use': stations.filter(s => s.status === 'In Use').length,
    Offline: stations.filter(s => s.status === 'Offline').length,
  };

  const totalBookingPrice = bookingStation ? bookingStation.pricePerHour * bookingData.duration : 0;

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM',
    '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
    '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM',
  ];

  // Get next 7 days for date picker
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en', { month: 'short' }),
    };
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-display font-bold mb-2">Station <span className="text-gradient">Management</span></h1>
          <p className="text-dark-800">{stations.length} stations configured</p>
        </motion.div>
        <Button onClick={() => { setEditingStation(null); setFormData({ name: '', type: '', status: 'Available' }); setShowModal(true); }}>
          <Plus size={18} className="mr-2" /> Add Station
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => {
          const styles = getStatusStyles(status);
          return (
            <Card key={status} className={`p-4 ${styles.bg} border ${styles.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-800 text-sm">{status}</p>
                  <p className={`text-3xl font-display font-bold ${styles.text}`}>{count}</p>
                </div>
                <div className={`w-4 h-4 rounded-full ${styles.dot} animate-pulse`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === 'all' ? 'bg-primary-500 text-white' : 'bg-dark-300 text-dark-800 hover:bg-dark-400'}`}>All</button>
        {types.map(type => (
          <button key={type} onClick={() => setFilterType(type)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === type ? 'bg-primary-500 text-white' : 'bg-dark-300 text-dark-800 hover:bg-dark-400'}`}>{type}</button>
        ))}
      </div>

      {/* Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStations.map((station, idx) => {
          const styles = getStatusStyles(station.status);
          return (
            <motion.div key={station._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.03 }}>
              <Card className={`p-5 border ${styles.border} hover:border-primary-500/50 transition-all group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-neon-blue/20 flex items-center justify-center">
                    <Monitor className={styles.text} size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
                    <span className={`text-xs font-semibold ${styles.text}`}>{station.status}</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg mb-1">{station.name}</h3>
                <p className="text-dark-700 text-sm">{station.type}</p>
                <p className="text-primary-400 font-display font-bold text-sm mt-1">₹{station.pricePerHour}<span className="text-dark-700 font-body font-normal">/hr</span></p>
                <div className="flex gap-2 pt-3 border-t border-dark-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Quick Book Button - only for Available stations */}
                  {station.status === 'Available' && (
                    <button onClick={() => openBookModal(station)} className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 text-sm font-semibold transition-colors" title="Quick Book">
                      <Zap size={14} /> Book
                    </button>
                  )}
                  <button onClick={() => toggleStatus(station)} className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg hover:bg-dark-300 text-dark-800 text-sm transition-colors">
                    {station.status === 'Available' ? <WifiOff size={14} /> : <Wifi size={14} />} Toggle
                  </button>
                  <button onClick={() => handleEdit(station)} className="p-2 rounded-lg hover:bg-dark-300 text-neon-blue"><Edit2 size={14} /></button>
                  {deleteConfirm === station._id ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete(station._id)} className="p-2 rounded-lg bg-red-500/20 text-red-400"><Check size={14} /></button>
                      <button onClick={() => setDeleteConfirm(null)} className="p-2 rounded-lg bg-dark-300 text-dark-800"><X size={14} /></button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(station._id)} className="p-2 rounded-lg hover:bg-dark-300 text-red-400"><Trash2 size={14} /></button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredStations.length === 0 && (
        <Card className="text-center py-12 text-dark-700">
          <Monitor className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No stations found. Click "Add Station" to get started.</p>
        </Card>
      )}

      {/* Add/Edit Station Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()} className="bg-dark-200 border border-dark-400 rounded-2xl p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold">{editingStation ? 'Edit Station' : 'Add Station'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark-300 rounded-lg"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Station Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <div>
                  <label className="block text-sm font-semibold mb-2 text-dark-900">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required
                    className="w-full bg-dark-100 border border-dark-400 rounded-lg py-3 px-4 text-white focus:border-primary-500 focus:outline-none">
                    <option value="">Select Type</option>
                    <option value="PC">PC</option>
                    <option value="PS5">PS5</option>
                    <option value="Xbox">Xbox</option>
                    <option value="VR">VR</option>
                    <option value="Racing Sim">Racing Sim</option>
                  </select>
                </div>
                <Input label="Price per Hour (₹)" type="number" min="0" step="1" value={formData.pricePerHour} onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })} required />
                <div>
                  <label className="block text-sm font-semibold mb-2 text-dark-900">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-dark-100 border border-dark-400 rounded-lg py-3 px-4 text-white focus:border-primary-500 focus:outline-none">
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">{editingStation ? 'Update' : 'Add Station'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Book Modal */}
      <AnimatePresence>
        {showBookModal && bookingStation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowBookModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="bg-dark-100 border border-primary-500/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-5 border-b border-dark-400 flex items-center justify-between sticky top-0 bg-dark-100 z-10">
                <div>
                  <h2 className="text-xl font-display font-bold flex items-center gap-2">
                    <Zap size={20} className="text-primary-400" /> Quick Book
                  </h2>
                  <p className="text-dark-800 text-sm mt-0.5">{bookingStation.name} • {bookingStation.type} • ₹{bookingStation.pricePerHour}/hr</p>
                </div>
                <button onClick={() => setShowBookModal(false)} className="p-2 rounded-lg hover:bg-dark-300 text-dark-700"><X size={20} /></button>
              </div>

              <form onSubmit={handleQuickBook} className="p-5 space-y-5">
                {/* Game Select */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2 flex items-center gap-2">
                    <Gamepad2 size={16} className="text-primary-400" /> Select Game
                  </label>
                  <select
                    value={bookingData.gameId}
                    onChange={(e) => setBookingData({ ...bookingData, gameId: e.target.value })}
                    required
                    className="w-full bg-dark-200 border border-dark-400 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">Choose a game...</option>
                    {games.map(g => (
                      <option key={g._id} value={g._id}>{g.title} ({g.platform})</option>
                    ))}
                  </select>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-primary-400" /> Select Date
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {dates.map((d) => (
                      <button
                        type="button"
                        key={d.value}
                        onClick={() => setBookingData({ ...bookingData, bookingDate: d.value })}
                        className={`flex-shrink-0 w-16 py-3 rounded-xl border-2 text-center transition-all active:scale-95 ${bookingData.bookingDate === d.value
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-dark-400 bg-dark-200 hover:border-primary-500/30'
                          }`}
                      >
                        <p className="text-[10px] text-dark-700 font-semibold">{d.day}</p>
                        <p className="font-display font-bold text-lg">{d.date}</p>
                        <p className="text-[10px] text-dark-700">{d.month}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Picker */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2 flex items-center gap-2">
                    <Clock size={16} className="text-primary-400" /> Select Time
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setBookingData({ ...bookingData, bookingTime: t })}
                        className={`py-2 rounded-xl border-2 text-xs font-semibold transition-all active:scale-95 ${bookingData.bookingTime === t
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-dark-400 bg-dark-200 text-dark-900 hover:border-primary-500/30'
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">Duration</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((h) => (
                      <button
                        type="button"
                        key={h}
                        onClick={() => setBookingData({ ...bookingData, duration: h })}
                        className={`flex-1 py-3 rounded-xl border-2 text-center font-display font-bold transition-all active:scale-95 ${bookingData.duration === h
                          ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                          : 'border-dark-400 bg-dark-200 hover:border-primary-500/30'
                          }`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-dark-200 rounded-xl p-4 border border-dark-400">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-dark-800">Station Rate</span>
                    <span>₹{bookingStation.pricePerHour}/hr</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-dark-800">Duration</span>
                    <span>{bookingData.duration} hour{bookingData.duration > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-dark-400">
                    <span className="font-display font-bold text-lg">Total</span>
                    <span className="font-display font-bold text-2xl text-primary-400">₹{totalBookingPrice}</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50 transition-all"
                >
                  {bookingLoading ? (
                    <div className="loading-spinner w-6 h-6"></div>
                  ) : (
                    <><Zap size={20} /> Book & Go to Payments • ₹{totalBookingPrice}</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StationManagement;
