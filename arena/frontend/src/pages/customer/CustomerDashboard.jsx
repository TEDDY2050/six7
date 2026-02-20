import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Monitor, Clock, ChevronRight, Zap, Star, ArrowRight, Sparkles } from 'lucide-react';
import { gameService, stationService, bookingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [stations, setStations] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, stationsRes] = await Promise.all([
          gameService.getAll(),
          stationService.getAvailable(),
        ]);
        setGames(gamesRes.data);
        setStations(stationsRes.data);

        try {
          const bookingsRes = await bookingService.getMyBookings();
          setMyBookings(bookingsRes.data.filter(b => b.status === 'pending' || b.status === 'confirmed' || b.status === 'active'));
        } catch (e) { /* no bookings yet */ }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group stations by type and get pricing
  const stationTypes = stations.reduce((acc, s) => {
    if (!acc[s.type]) {
      acc[s.type] = { type: s.type, count: 0, available: 0, price: s.pricePerHour };
    }
    acc[s.type].count++;
    if (s.status === 'Available') acc[s.type].available++;
    return acc;
  }, {});

  const typeIcons = { PC: '🖥️', PS5: '🎮', Simulator: '🏎️', Xbox: '🎯', VR: '🥽' };
  const typeColors = {
    PC: 'from-blue-500 to-cyan-500',
    PS5: 'from-indigo-500 to-purple-500',
    Simulator: 'from-orange-500 to-red-500',
    Xbox: 'from-green-500 to-emerald-500',
    VR: 'from-pink-500 to-rose-500',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="loading-spinner mx-auto"></div>
          <p className="mt-4 text-dark-700">Loading your arena...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:ml-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/20 via-dark-200 to-neon-blue/20 border border-primary-500/20 p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-4xl font-display font-bold mb-2">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-dark-800 md:text-lg mb-6">Ready for your next gaming session?</p>
          <button
            onClick={() => navigate('/customer/book')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-95"
          >
            <Zap size={18} /> Book a Session <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>

      {/* Active Bookings */}
      {myBookings.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-display font-bold flex items-center gap-2">
              <Clock size={20} className="text-primary-400" /> Your Active Bookings
            </h2>
            <button onClick={() => navigate('/customer/bookings')} className="text-primary-400 text-sm font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {myBookings.slice(0, 3).map((booking, idx) => {
              const statusColors = {
                pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                active: 'bg-green-500/20 text-green-400 border-green-500/30',
              };
              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex-shrink-0 w-72 snap-start bg-dark-200 border border-dark-400 rounded-2xl p-4 hover:border-primary-500/30 transition-all cursor-pointer"
                  onClick={() => navigate('/customer/bookings')}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border capitalize ${statusColors[booking.status]}`}>{booking.status}</span>
                    <span className="text-dark-700 text-xs">{booking.bookingDate}</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1">{booking.game?.title || 'Game'}</h3>
                  <p className="text-dark-700 text-xs">{booking.station?.name} • {booking.bookingTime} • {booking.duration}hr</p>
                  <p className="text-primary-400 font-display font-bold text-sm mt-2">₹{booking.totalPrice}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Station Types - Shopping Categories */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-display font-bold flex items-center gap-2">
            <Monitor size={20} className="text-primary-400" /> Choose Your Station
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Object.values(stationTypes).map((st, idx) => (
            <motion.div
              key={st.type}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              onClick={() => navigate('/customer/book')}
              className="cursor-pointer group"
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${typeColors[st.type] || 'from-gray-500 to-gray-600'} p-4 md:p-5 transition-all group-hover:scale-[1.02] group-active:scale-95 shadow-lg`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
                <div className="text-3xl md:text-4xl mb-2">{typeIcons[st.type] || '🎮'}</div>
                <h3 className="font-display font-bold text-base md:text-lg text-white">{st.type}</h3>
                <p className="text-white/70 text-xs mt-1">{st.available} available</p>
                <p className="text-white font-display font-bold text-lg md:text-xl mt-2">
                  ₹{st.price}<span className="text-white/60 text-xs font-body font-normal">/hr</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Games Catalog */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-display font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-primary-400" /> Popular Games
          </h2>
          <button onClick={() => navigate('/customer/book')} className="text-primary-400 text-sm font-semibold flex items-center gap-1 hover:underline">
            Browse All <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {games.map((game, idx) => (
            <motion.div
              key={game._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
              onClick={() => navigate('/customer/book')}
              className="cursor-pointer group"
            >
              <div className="bg-dark-200 border border-dark-400 rounded-2xl overflow-hidden hover:border-primary-500/40 transition-all group-hover:scale-[1.02] group-active:scale-95">
                {game.image ? (
                  <img src={game.image} alt={game.title} className="w-full h-28 md:h-36 object-cover" />
                ) : (
                  <div className="w-full h-28 md:h-36 bg-gradient-to-br from-dark-300 to-dark-400 flex items-center justify-center">
                    <Gamepad2 size={32} className="text-dark-600" />
                  </div>
                )}
                <div className="p-3 md:p-4">
                  <h3 className="font-display font-bold text-sm md:text-base truncate">{game.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    {game.genre && (
                      <span className="px-2 py-0.5 bg-primary-500/15 text-primary-400 rounded-full text-[10px] md:text-xs font-semibold">{game.genre}</span>
                    )}
                    {game.platform && (
                      <span className="px-2 py-0.5 bg-neon-blue/15 text-neon-blue rounded-full text-[10px] md:text-xs font-semibold">{game.platform}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Info Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-3 md:gap-4"
      >
        {[
          { icon: '⚡', title: 'Instant Book', subtitle: 'No waiting' },
          { icon: '🎯', title: 'Premium Setup', subtitle: 'Top hardware' },
          { icon: '🏆', title: 'Pro Gaming', subtitle: 'Tournament ready' },
        ].map((item, idx) => (
          <div key={idx} className="bg-dark-200 border border-dark-400 rounded-xl p-3 md:p-4 text-center">
            <div className="text-2xl mb-1">{item.icon}</div>
            <h4 className="font-display font-bold text-xs md:text-sm">{item.title}</h4>
            <p className="text-dark-700 text-[10px] md:text-xs">{item.subtitle}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default CustomerDashboard;
