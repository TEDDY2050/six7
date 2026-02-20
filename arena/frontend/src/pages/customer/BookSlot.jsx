import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService, stationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Eye, ShoppingCart } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const BookSlot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // BookingContext may not be available when accessed from public /book route
  let bookingCtx = { createBooking: null, bookingLoading: false, setBookingSession: null };
  try {
    const ctx = require('../../context/BookingContext');
    bookingCtx = ctx.useBooking();
  } catch (e) {
    // Not inside BookingProvider — that's fine for the public route
  }
  const { createBooking, bookingLoading, setBookingSession } = bookingCtx;

  const [games, setGames] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('1');

  useEffect(() => {
    fetchGamesAndStations();
  }, []);

  const fetchGamesAndStations = async () => {
    setLoading(true);
    try {
      const [gamesRes, stationsRes] = await Promise.all([
        gameService.getAll(),
        stationService.getAll(),
      ]);

      setGames(gamesRes.data.games || gamesRes.data || []);
      setStations(stationsRes.data.stations || stationsRes.data || []);
    } catch (error) {
      toast.error('Failed to load games and stations');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (gameId) => {
    // Open game details in a new tab
    window.open(`/game-details/${gameId}`, '_blank');
  };

  const handleBookNow = async (game) => {
    // If user is not logged in, redirect to login with return URL
    if (!user) {
      toast('Please login to book a session', { icon: '🔑' });
      navigate('/login?redirect=/book');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }

    if (stations.length === 0) {
      toast.error('No stations available');
      return;
    }

    // Use the first available station
    const station = stations[0];

    // Create booking record in database
    if (!createBooking) {
      toast.error('Booking service unavailable');
      return;
    }

    const result = await createBooking({
      gameId: game._id,
      stationId: station._id,
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      duration: parseInt(duration),
      status: 'pending',
    });

    if (result.success) {
      if (setBookingSession) {
        setBookingSession(game._id, station._id, {
          gameName: game.title,
          stationName: station.name,
          date: selectedDate,
          time: selectedTime,
          duration: duration,
        });
      }

      // Redirect to booking details page
      navigate(`/customer/bookings/${result.booking._id}`, {
        state: { booking: result.booking },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-dark-700">Loading games and stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold mb-2">
          Book Your <span className="text-gradient">Gaming Session</span>
        </h1>
        <p className="text-dark-600">Select a game and book your preferred time slot</p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Booking Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:border-primary-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Booking Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Duration (hours)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:border-primary-500"
            >
              <option value="1">1 Hour</option>
              <option value="2">2 Hours</option>
              <option value="3">3 Hours</option>
              <option value="4">4 Hours</option>
              <option value="5">5 Hours</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Games Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Games</h2>
        {games.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-dark-500 mb-4" />
            <p className="text-dark-600">No games available at the moment</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => (
              <Card
                key={game._id}
                className="p-6 hover:border-primary-500 transition-colors duration-300"
              >
                <div className="mb-4">
                  {game.image && (
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                  <p className="text-dark-600 text-sm mb-3">
                    {game.description || 'No description available'}
                  </p>

                  {game.genre && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                        {game.genre}
                      </span>
                    </div>
                  )}

                  {game.pricePerHour && (
                    <p className="text-lg font-bold text-primary-400 mb-4">
                      ₹{game.pricePerHour}/hour
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleViewDetails(game._id)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    disabled={bookingLoading}
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>

                  <Button
                    onClick={() => handleBookNow(game)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                    disabled={bookingLoading || !selectedDate || !selectedTime}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Book Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSlot;
