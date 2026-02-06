import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { Calendar, Clock, Gamepad2, Trash2, Eye } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { bookings, fetchMyBookings, cancelBooking, bookingLoading, currentBooking } =
    useBooking();
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  // If viewing a specific booking from redirect
  useEffect(() => {
    if (id && bookings.length === 0) {
      // If no bookings loaded yet, load them
      loadBookings();
    }
    if (id && bookings.length > 0) {
      const booking = bookings.find((b) => b.id === id);
      if (booking) {
        setSelectedBooking(booking);
      }
    }
  }, [id, bookings]);

  const loadBookings = async () => {
    setLoading(true);
    await fetchMyBookings();
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const result = await cancelBooking(bookingId);
      if (result.success) {
        await loadBookings();
        setSelectedBooking(null);
      }
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const handleOpenInNewTab = (bookingId) => {
    window.open(`/customer/bookings/${bookingId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-dark-700">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold mb-2">
          My <span className="text-gradient">Gaming Bookings</span>
        </h1>
        <p className="text-dark-600">View and manage your gaming session bookings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings List */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">All Bookings</h2>

            {bookings.length === 0 ? (
              <div className="py-8 text-center">
                <Gamepad2 className="h-12 w-12 mx-auto text-dark-500 mb-3" />
                <p className="text-dark-600">No bookings yet</p>
                <Button
                  onClick={() => navigate('/customer/book')}
                  className="mt-4 w-full"
                >
                  Book a Session
                </Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => handleViewDetails(booking)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedBooking?.id === booking.id
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-500 hover:border-primary-400'
                    }`}
                  >
                    <p className="font-semibold text-white mb-1">
                      {booking.game?.name || 'Game'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-dark-400 mb-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <Clock className="h-3 w-3" />
                      {booking.bookingTime} ({booking.duration}h)
                    </div>
                    <span
                      className={`inline-block mt-2 px-2 py-1 text-xs rounded font-medium ${
                        booking.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : booking.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : booking.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {booking.status?.charAt(0).toUpperCase() +
                        booking.status?.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Booking Details */}
        <div className="lg:col-span-2">
          {selectedBooking ? (
            <Card className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Booking Details</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedBooking.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : selectedBooking.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : selectedBooking.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {selectedBooking.status?.charAt(0).toUpperCase() +
                      selectedBooking.status?.slice(1)}
                  </span>
                </div>

                {/* Booking Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-dark-400 text-sm mb-1">Game</p>
                    <p className="text-white font-semibold text-lg">
                      {selectedBooking.game?.name || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-dark-400 text-sm mb-1">Station</p>
                    <p className="text-white font-semibold text-lg">
                      {selectedBooking.station?.name || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-dark-400 text-sm mb-1">Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary-400" />
                      <p className="text-white font-semibold">
                        {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-dark-400 text-sm mb-1">Time</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary-400" />
                      <p className="text-white font-semibold">
                        {selectedBooking.bookingTime}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-dark-400 text-sm mb-1">Duration</p>
                    <p className="text-white font-semibold">
                      {selectedBooking.duration} hour(s)
                    </p>
                  </div>

                  <div>
                    <p className="text-dark-400 text-sm mb-1">Booking ID</p>
                    <p className="text-white font-mono text-sm break-all">
                      {selectedBooking.id}
                    </p>
                  </div>
                </div>

                {/* Price Info */}
                {selectedBooking.totalPrice && (
                  <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 mb-6">
                    <p className="text-dark-400 text-sm mb-1">Total Price</p>
                    <p className="text-primary-400 font-bold text-2xl">
                      ₹{selectedBooking.totalPrice}
                    </p>
                  </div>
                )}

                {/* Booking Metadata */}
                <div className="bg-dark-600 rounded-lg p-4 mb-6">
                  <p className="text-dark-400 text-xs mb-2">Created</p>
                  <p className="text-white text-sm font-mono">
                    {new Date(selectedBooking.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleOpenInNewTab(selectedBooking.id)}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View in New Tab
                </Button>

                {selectedBooking.status !== 'cancelled' &&
                  selectedBooking.status !== 'completed' && (
                    <Button
                      onClick={() => handleCancelBooking(selectedBooking.id)}
                      variant="danger"
                      className="flex-1 flex items-center justify-center gap-2"
                      disabled={bookingLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                      Cancel Booking
                    </Button>
                  )}
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <Gamepad2 className="h-12 w-12 mx-auto text-dark-500 mb-4" />
              <p className="text-dark-600">Select a booking to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
