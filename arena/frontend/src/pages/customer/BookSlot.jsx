import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Monitor, Clock, Calendar, ChevronLeft, ChevronRight, Check, Zap } from 'lucide-react';
import { gameService, stationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import toast from 'react-hot-toast';

const BookSlot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking, bookingLoading } = useBooking();

  const [step, setStep] = useState(1);
  const [games, setGames] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [platformFilter, setPlatformFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gRes, sRes] = await Promise.all([gameService.getAll(), stationService.getAvailable()]);
        setGames(gRes.data);
        setStations(sRes.data);
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter stations by selected game's platform
  const filteredStations = selectedGame?.platform
    ? stations.filter(s => s.type === selectedGame.platform)
    : stations;

  // Group filtered stations by type
  const stationsByType = filteredStations.reduce((acc, s) => {
    if (!acc[s.type]) acc[s.type] = [];
    acc[s.type].push(s);
    return acc;
  }, {});

  const typeIcons = { PC: '🖥️', PS5: '🎮', Simulator: '🏎️', Xbox: '🎯', VR: '🥽' };

  const handleBook = async () => {
    if (!user) {
      toast('Please login to book a session', { icon: '🔑' });
      navigate('/login?redirect=/customer/book');
      return;
    }
    if (!selectedGame || !selectedStation || !selectedDate || !selectedTime) {
      toast.error('Please complete all steps');
      return;
    }
    if (!createBooking) {
      toast.error('Booking service unavailable');
      return;
    }

    const result = await createBooking({
      gameId: selectedGame._id,
      stationId: selectedStation._id,
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      duration,
      status: 'pending',
    });

    if (result.success) {
      toast.success('🎉 Booking confirmed!');
      navigate('/customer/bookings');
    }
  };

  const totalPrice = selectedStation ? selectedStation.pricePerHour * duration : 0;

  // Get today and next 7 days
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

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM',
    '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
    '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const stepTitles = ['Choose Game', 'Pick Station', 'Select Date & Time', 'Confirm'];

  return (
    <div className="space-y-6 md:ml-20 max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="sticky top-14 z-30 bg-dark-50/90 backdrop-blur-lg py-4 -mx-4 px-4">
        <div className="flex items-center gap-2 mb-2">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="p-1.5 rounded-lg hover:bg-dark-300 text-dark-700 mr-1">
              <ChevronLeft size={20} />
            </button>
          )}
          <h2 className="text-lg font-display font-bold flex-1">{stepTitles[step - 1]}</h2>
          <span className="text-dark-700 text-sm font-semibold">{step}/4</span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-primary-500' : 'bg-dark-400'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Choose Game */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            {/* Platform Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {['All', 'PC', 'PS5', 'Simulator'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-display font-bold transition-all active:scale-95 flex items-center gap-1.5 ${platformFilter === p
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-dark-300 text-dark-800 hover:bg-dark-400'
                    }`}
                >
                  <span>{p === 'All' ? '🎮' : typeIcons[p] || '🎮'}</span> {p}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {games
                .filter(g => platformFilter === 'All' || g.platform === platformFilter)
                .map((game) => (
                  <div
                    key={game._id}
                    onClick={() => { setSelectedGame(game); setSelectedStation(null); setStep(2); }}
                    className={`cursor-pointer group rounded-2xl overflow-hidden border-2 transition-all active:scale-95 ${selectedGame?._id === game._id ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-dark-400 hover:border-primary-500/40'
                      }`}
                  >
                    {game.image ? (
                      <img src={game.image} alt={game.title} className="w-full h-28 md:h-36 object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-28 md:h-36 bg-gradient-to-br from-dark-300 to-dark-400 flex items-center justify-center group-hover:from-dark-400 group-hover:to-dark-500">
                        <Gamepad2 size={36} className="text-dark-600" />
                      </div>
                    )}
                    <div className="p-3 bg-dark-200">
                      <h3 className="font-display font-bold text-sm md:text-base truncate">{game.title}</h3>
                      <div className="flex gap-1.5 mt-1">
                        {game.genre && <span className="px-2 py-0.5 bg-primary-500/15 text-primary-400 rounded-full text-[10px] font-semibold">{game.genre}</span>}
                        {game.platform && <span className="px-2 py-0.5 bg-neon-blue/15 text-neon-blue rounded-full text-[10px] font-semibold">{game.platform}</span>}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Pick Station */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            {selectedGame && (
              <div className="bg-dark-200 border border-dark-400 rounded-xl p-3 mb-4 flex items-center gap-3">
                <Gamepad2 size={18} className="text-primary-400 flex-shrink-0" />
                <span className="text-sm"><span className="text-dark-700">Game:</span> <span className="font-semibold">{selectedGame.title}</span></span>
              </div>
            )}
            <div className="space-y-6">
              {Object.entries(stationsByType).map(([type, typeStations]) => (
                <div key={type}>
                  <h3 className="text-sm font-display font-bold text-dark-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">{typeIcons[type] || '🎮'}</span> {type} Stations
                    <span className="text-primary-400 font-body text-xs ml-auto">₹{typeStations[0]?.pricePerHour}/hr</span>
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {typeStations.map((station) => (
                      <button
                        key={station._id}
                        onClick={() => { setSelectedStation(station); setStep(3); }}
                        className={`p-3 rounded-xl border-2 text-center transition-all active:scale-95 ${selectedStation?._id === station._id
                          ? 'border-primary-500 bg-primary-500/10 ring-2 ring-primary-500/20'
                          : 'border-dark-400 bg-dark-200 hover:border-primary-500/30'
                          }`}
                      >
                        <Monitor size={20} className={`mx-auto mb-1 ${selectedStation?._id === station._id ? 'text-primary-400' : 'text-dark-700'}`} />
                        <p className="font-display font-bold text-xs">{station.name}</p>
                        <p className="text-primary-400 text-[10px] font-semibold mt-0.5">₹{station.pricePerHour}/hr</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
            {/* Summary so far */}
            <div className="bg-dark-200 border border-dark-400 rounded-xl p-3 flex items-center gap-3 text-sm">
              <Gamepad2 size={16} className="text-primary-400" />
              <span className="font-semibold">{selectedGame?.title}</span>
              <span className="text-dark-600">•</span>
              <Monitor size={16} className="text-neon-blue" />
              <span className="font-semibold">{selectedStation?.name}</span>
              <span className="text-primary-400 ml-auto font-display font-bold">₹{selectedStation?.pricePerHour}/hr</span>
            </div>

            {/* Date Picker - Horizontal scroll */}
            <div>
              <h3 className="text-sm font-display font-bold text-dark-800 mb-3 flex items-center gap-2">
                <Calendar size={16} /> Select Date
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-hide">
                {dates.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDate(d.value)}
                    className={`flex-shrink-0 snap-start w-16 py-3 rounded-xl border-2 text-center transition-all active:scale-95 ${selectedDate === d.value
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
              <h3 className="text-sm font-display font-bold text-dark-800 mb-3 flex items-center gap-2">
                <Clock size={16} /> Select Time
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2.5 rounded-xl border-2 text-xs font-semibold transition-all active:scale-95 ${selectedTime === t
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
              <h3 className="text-sm font-display font-bold text-dark-800 mb-3">Duration</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((h) => (
                  <button
                    key={h}
                    onClick={() => setDuration(h)}
                    className={`flex-1 py-3 rounded-xl border-2 text-center font-display font-bold transition-all active:scale-95 ${duration === h
                      ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                      : 'border-dark-400 bg-dark-200 hover:border-primary-500/30'
                      }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            {/* Continue */}
            {selectedDate && selectedTime && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <button
                  onClick={() => setStep(4)}
                  className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 active:scale-[0.98]"
                >
                  Continue <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <div className="bg-dark-200 border border-dark-400 rounded-2xl p-5 space-y-4">
              <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>
              <div className="flex items-center gap-3 pb-3 border-b border-dark-400">
                <div className="w-10 h-10 bg-primary-500/15 rounded-xl flex items-center justify-center"><Gamepad2 size={20} className="text-primary-400" /></div>
                <div className="flex-1"><p className="font-semibold text-sm">{selectedGame?.title}</p><p className="text-dark-700 text-xs">{selectedGame?.genre} • {selectedGame?.platform}</p></div>
              </div>
              <div className="flex items-center gap-3 pb-3 border-b border-dark-400">
                <div className="w-10 h-10 bg-neon-blue/15 rounded-xl flex items-center justify-center"><Monitor size={20} className="text-neon-blue" /></div>
                <div className="flex-1"><p className="font-semibold text-sm">{selectedStation?.name}</p><p className="text-dark-700 text-xs">{selectedStation?.type} • ₹{selectedStation?.pricePerHour}/hr</p></div>
              </div>
              <div className="flex items-center gap-3 pb-3 border-b border-dark-400">
                <div className="w-10 h-10 bg-green-500/15 rounded-xl flex items-center justify-center"><Calendar size={20} className="text-green-400" /></div>
                <div className="flex-1"><p className="font-semibold text-sm">{selectedDate}</p><p className="text-dark-700 text-xs">{selectedTime} • {duration} hour{duration > 1 ? 's' : ''}</p></div>
              </div>
              {/* Price Breakdown */}
              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-dark-800">Station Rate</span><span>₹{selectedStation?.pricePerHour}/hr</span></div>
                <div className="flex justify-between text-sm"><span className="text-dark-800">Duration</span><span>{duration} hour{duration > 1 ? 's' : ''}</span></div>
                <div className="flex justify-between text-lg font-display font-bold pt-2 border-t border-dark-400">
                  <span>Total</span>
                  <span className="text-primary-400">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={bookingLoading}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50 transition-all"
            >
              {bookingLoading ? (
                <div className="loading-spinner w-6 h-6"></div>
              ) : (
                <><Zap size={20} /> Confirm Booking • ₹{totalPrice}</>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookSlot;
