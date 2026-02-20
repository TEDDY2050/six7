import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Clock, Gamepad2, Monitor, ChevronDown, RefreshCw } from 'lucide-react';
import { bookingService } from '../../services/api';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await bookingService.cancel(id);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const statusConfig = {
    pending: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400', label: 'Pending' },
    confirmed: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-400', label: 'Confirmed' },
    active: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30', dot: 'bg-green-400', label: 'Active' },
    completed: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30', dot: 'bg-purple-400', label: 'Completed' },
    cancelled: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400', label: 'Cancelled' },
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Done' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 md:ml-20 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold">My Bookings</h1>
          <p className="text-dark-700 text-sm">{bookings.length} total bookings</p>
        </div>
        <button onClick={fetchBookings} className="p-2 rounded-xl hover:bg-dark-300 text-dark-700 transition-colors">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${filter === f.key ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-dark-300 text-dark-800 hover:bg-dark-400'
              }`}
          >
            {f.label}
            {f.key !== 'all' && (
              <span className="ml-1.5 opacity-60">({bookings.filter(b => b.status === f.key).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      <div className="space-y-3">
        {filtered.map((booking, idx) => {
          const sc = statusConfig[booking.status] || statusConfig.pending;
          const isExpanded = expandedId === booking._id;

          return (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-dark-200 border ${isExpanded ? 'border-primary-500/30' : 'border-dark-400'} rounded-2xl overflow-hidden transition-all`}
            >
              {/* Card Header */}
              <div
                className="p-4 cursor-pointer flex items-center gap-3"
                onClick={() => setExpandedId(isExpanded ? null : booking._id)}
              >
                <div className={`w-10 h-10 rounded-xl ${sc.bg} flex items-center justify-center flex-shrink-0`}>
                  <Gamepad2 size={18} className={sc.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-sm truncate">{booking.game?.title || 'Game'}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>{sc.label}</span>
                  </div>
                  <p className="text-dark-700 text-xs">
                    {booking.station?.name} • {booking.bookingDate} • {booking.bookingTime}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-primary-400 font-display font-bold text-sm">₹{booking.totalPrice}</p>
                  <ChevronDown size={14} className={`text-dark-700 transition-transform mx-auto mt-0.5 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-dark-400 px-4 py-4 space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-dark-700 text-xs">Game</p>
                      <p className="font-semibold">{booking.game?.title}</p>
                    </div>
                    <div>
                      <p className="text-dark-700 text-xs">Station</p>
                      <p className="font-semibold">{booking.station?.name} ({booking.station?.type})</p>
                    </div>
                    <div>
                      <p className="text-dark-700 text-xs">Date</p>
                      <p className="font-semibold">{booking.bookingDate}</p>
                    </div>
                    <div>
                      <p className="text-dark-700 text-xs">Time</p>
                      <p className="font-semibold">{booking.bookingTime}</p>
                    </div>
                    <div>
                      <p className="text-dark-700 text-xs">Duration</p>
                      <p className="font-semibold">{booking.duration} hour{booking.duration > 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <p className="text-dark-700 text-xs">Total</p>
                      <p className="font-display font-bold text-primary-400">₹{booking.totalPrice}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-dark-700 text-xs mb-0.5">Booked on</p>
                    <p className="text-dark-900 text-xs">{new Date(booking.createdAt).toLocaleString()}</p>
                  </div>
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCancel(booking._id); }}
                      className="w-full py-2.5 border-2 border-red-500/30 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-500/10 active:scale-[0.98] transition-all"
                    >
                      Cancel Booking
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <CalendarCheck className="h-16 w-16 mx-auto text-dark-500 mb-4" />
          <h3 className="font-display font-bold text-lg mb-2">No bookings yet</h3>
          <p className="text-dark-700 text-sm">Book your first gaming session!</p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
