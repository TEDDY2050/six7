import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// User Services
export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Game Services
export const gameService = {
  getAll: () => api.get('/games'),
  getById: (id) => api.get(`/games/${id}`),
  create: (data) => api.post('/games', data),
  update: (id, data) => api.put(`/games/${id}`, data),
  delete: (id) => api.delete(`/games/${id}`),
};

// Station Services
export const stationService = {
  getAll: () => api.get('/stations'),
  getById: (id) => api.get(`/stations/${id}`),
  getAvailable: (params) => api.get('/stations/available', { params }),
  create: (data) => api.post('/stations', data),
  update: (id, data) => api.put(`/stations/${id}`, data),
  delete: (id) => api.delete(`/stations/${id}`),
  updateStatus: (id, status) => api.patch(`/stations/${id}/status`, { status }),
};

// Booking Services
export const bookingService = {
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  getMyBookings: () => api.get('/bookings/my'),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  cancel: (id) => api.delete(`/bookings/${id}`),
  startSession: (id) => api.post(`/bookings/${id}/start`),
  endSession: (id) => api.post(`/bookings/${id}/end`),
};

// Session Services
export const sessionService = {
  getActive: () => api.get('/sessions/active'),
  getById: (id) => api.get(`/sessions/${id}`),
  start: (bookingId) => api.post('/sessions/start', { bookingId }),
  end: (sessionId) => api.post(`/sessions/${sessionId}/end`),
  extend: (sessionId, duration) => api.post(`/sessions/${sessionId}/extend`, { duration }),
};

// Payment Services
export const paymentService = {
  getAll: (params) => api.get('/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  processPayment: (bookingId, data) => api.post(`/payments/process/${bookingId}`, data),
};

// Dashboard Services
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRevenue: (period) => api.get('/dashboard/revenue', { params: { period } }),
  getPopularGames: () => api.get('/dashboard/popular-games'),
  getStationUsage: () => api.get('/dashboard/station-usage'),
  getRecentActivities: () => api.get('/dashboard/activities'),
};

// Report Services
export const reportService = {
  getDailyReport: (date) => api.get('/reports/daily', { params: { date } }),
  getMonthlyReport: (month, year) => api.get('/reports/monthly', { params: { month, year } }),
  getCustomReport: (startDate, endDate) => api.get('/reports/custom', { 
    params: { startDate, endDate } 
  }),
  exportReport: (type, params) => api.get(`/reports/export/${type}`, { 
    params,
    responseType: 'blob'
  }),
};

export default api;
