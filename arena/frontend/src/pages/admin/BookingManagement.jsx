import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Eye, Play, Square, Filter } from 'lucide-react';
import { bookingService } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getAll();
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async (bookingId) => {
    try {
      await bookingService.startSession(bookingId);
      toast.success('Session started!');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to start session');
    }
  };

  const handleEndSession = async (bookingId) => {
    try {
      await bookingService.endSession(bookingId);
      toast.success('Session ended');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to end session');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancel(bookingId);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch = searchTerm === '' ||
      (b.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.game?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.station?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      completed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return `px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`;
  };

  const statuses = ['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner"></div></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold mb-2">Booking <span className="text-gradient">Management</span></h1>
        <p className="text-dark-800">{bookings.length} total bookings</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="p-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-700" size={18} />
            <input type="text" placeholder="Search by user, game, or station..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-200 border border-dark-400 rounded-lg py-3 pl-10 pr-4 text-white placeholder-dark-700 focus:border-primary-500 focus:outline-none transition-colors" />
          </div>
        </Card>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${statusFilter === s ? 'bg-primary-500 text-white' : 'bg-dark-300 text-dark-800 hover:bg-dark-400'}`}>
            {s}
            {s !== 'all' && <span className="ml-2 text-xs">({bookings.filter(b => b.status === s).length})</span>}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-400">
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Customer</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Game</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Station</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Date/Time</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Duration</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Price</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Status</th>
                <th className="text-right py-4 px-6 text-dark-800 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, idx) => (
                <motion.tr key={booking._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                  className="border-b border-dark-300 hover:bg-dark-200 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-neon-blue flex items-center justify-center">
                        <span className="text-xs font-bold">{booking.user?.name?.[0]?.toUpperCase() || '?'}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{booking.user?.name || 'Unknown'}</p>
                        <p className="text-dark-700 text-xs">{booking.user?.email || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-dark-900 text-sm">{booking.game?.title || 'N/A'}</td>
                  <td className="py-4 px-6 text-dark-900 text-sm">{booking.station?.name || 'N/A'}</td>
                  <td className="py-4 px-6 text-dark-900 text-sm">
                    <div>{booking.bookingDate}</div>
                    <div className="text-dark-700 text-xs">{booking.bookingTime}</div>
                  </td>
                  <td className="py-4 px-6 text-dark-900 text-sm">{booking.duration}h</td>
                  <td className="py-4 px-6 text-primary-400 font-semibold text-sm">₹{booking.totalPrice || 0}</td>
                  <td className="py-4 px-6"><span className={getStatusBadge(booking.status)}>{booking.status}</span></td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-1">
                      {booking.status === 'pending' && (
                        <>
                          <button onClick={() => handleStartSession(booking._id)} className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors" title="Start Session"><Play size={14} /></button>
                          <button onClick={() => handleCancelBooking(booking._id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors" title="Cancel"><Square size={14} /></button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button onClick={() => handleStartSession(booking._id)} className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors" title="Start Session"><Play size={14} /></button>
                      )}
                      {booking.status === 'active' && (
                        <button onClick={() => handleEndSession(booking._id)} className="p-2 rounded-lg hover:bg-yellow-500/20 text-yellow-400 transition-colors" title="End Session"><Square size={14} /></button>
                      )}
                      <button onClick={() => setSelectedBooking(booking)} className="p-2 rounded-lg hover:bg-dark-300 text-neon-blue transition-colors" title="View Details"><Eye size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBookings.length === 0 && (
          <div className="text-center py-12 text-dark-700">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No bookings found</p>
          </div>
        )}
      </Card>

      {/* Booking Detail Slide-over */}
      {selectedBooking && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}>
          <motion.div initial={{ x: 400 }} animate={{ x: 0 }} onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-dark-200 border-l border-dark-400 h-full overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-dark-300 rounded-lg"><Eye size={20} /></button>
            </div>
            <div className="space-y-6">
              <div><label className="text-dark-700 text-sm">Customer</label><p className="font-semibold text-lg">{selectedBooking.user?.name}</p><p className="text-dark-800">{selectedBooking.user?.email}</p></div>
              <div><label className="text-dark-700 text-sm">Game</label><p className="font-semibold">{selectedBooking.game?.title}</p></div>
              <div><label className="text-dark-700 text-sm">Station</label><p className="font-semibold">{selectedBooking.station?.name}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-dark-700 text-sm">Date</label><p className="font-semibold">{selectedBooking.bookingDate}</p></div>
                <div><label className="text-dark-700 text-sm">Time</label><p className="font-semibold">{selectedBooking.bookingTime}</p></div>
                <div><label className="text-dark-700 text-sm">Duration</label><p className="font-semibold">{selectedBooking.duration} hours</p></div>
                <div><label className="text-dark-700 text-sm">Total</label><p className="font-semibold text-primary-400">₹{selectedBooking.totalPrice}</p></div>
              </div>
              <div><label className="text-dark-700 text-sm">Status</label><p className="mt-1"><span className={getStatusBadge(selectedBooking.status)}>{selectedBooking.status}</span></p></div>
              <div><label className="text-dark-700 text-sm">Booked On</label><p className="text-dark-900 text-sm">{new Date(selectedBooking.createdAt).toLocaleString()}</p></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BookingManagement;
