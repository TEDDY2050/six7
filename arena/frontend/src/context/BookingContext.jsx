import React, { createContext, useContext, useState } from 'react';
import { bookingService } from '../services/api';
import toast from 'react-hot-toast';

const BookingContext = createContext(null);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  const createBooking = async (bookingData) => {
    setBookingLoading(true);
    try {
      const response = await bookingService.create(bookingData);
      const newBooking = response.data.booking || response.data;

      setCurrentBooking(newBooking);
      toast.success('Booking created successfully!');

      return { success: true, booking: newBooking };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create booking';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setBookingLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    setBookingLoading(true);
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data.bookings || response.data);
      return { success: true, bookings: response.data.bookings || response.data };
    } catch (error) {
      toast.error('Failed to fetch bookings');
      return { success: false, error: error.message };
    } finally {
      setBookingLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await bookingService.cancel(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      toast.success('Booking cancelled');
      return { success: true };
    } catch (error) {
      toast.error('Failed to cancel booking');
      return { success: false, error: error.message };
    }
  };

  const setBookingSession = (gameId, stationId, gameDetails = null) => {
    setCurrentBooking({
      gameId,
      stationId,
      gameDetails,
      createdAt: new Date().toISOString(),
    });
  };

  const clearBookingSession = () => {
    setCurrentBooking(null);
  };

  const value = {
    currentBooking,
    bookingLoading,
    bookings,
    createBooking,
    fetchMyBookings,
    cancelBooking,
    setBookingSession,
    clearBookingSession,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
