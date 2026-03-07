import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Calendar,
  FileSpreadsheet,
  CreditCard,
  Loader2,
  CheckCircle2,
  Database,
  HardDrive,
  ArrowDownToLine,
} from 'lucide-react';
import { reportService } from '../../services/api';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const Settings = () => {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [downloadingBookings, setDownloadingBookings] = useState(false);
  const [downloadingPayments, setDownloadingPayments] = useState(false);

  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type, retryCount = 0) => {
    const setLoading = type === 'bookings' ? setDownloadingBookings : setDownloadingPayments;
    setLoading(true);
    try {
      const res = await reportService.exportReport(type, {
        startDate,
        endDate,
      });

      // Check if the response is actually CSV data (not an error wrapped in blob)
      if (res.data instanceof Blob && res.data.type === 'application/json') {
        const text = await res.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || 'Server returned an error');
      }

      const filename = `${type}_export_${startDate}_to_${endDate}.csv`;
      triggerDownload(res.data, filename);
      toast.success(`${type === 'bookings' ? 'Bookings' : 'Billing'} data downloaded!`);
    } catch (err) {
      console.error(`Export ${type} failed:`, err);

      // Retry once on auth errors (token may have been refreshed)
      if (retryCount === 0 && err.response?.status === 401) {
        const token = localStorage.getItem('token');
        if (token) {
          return handleExport(type, 1);
        }
      }

      const message = err.message || `Failed to download ${type} data`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold mb-2">
          <span className="text-gradient">Settings</span>
        </h1>
        <p className="text-dark-800">Manage your arena preferences and data</p>
      </motion.div>

      {/* Data Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border border-primary-500/20">
          {/* Section Header */}
          <div className="p-6 border-b border-dark-400 bg-gradient-to-r from-primary-500/5 to-neon-blue/5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-neon-blue flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Database size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">Data Export</h2>
                <p className="text-dark-800 text-sm">Download your booking & billing records as CSV files</p>
              </div>
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="p-6 border-b border-dark-400">
            <label className="block text-sm font-semibold text-dark-900 mb-3 flex items-center gap-2">
              <Calendar size={16} className="text-primary-400" />
              Select Date Range
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 w-full">
                <label className="block text-xs text-dark-700 mb-1">From</label>
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-dark-200 border border-dark-400 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:outline-none cursor-pointer transition-colors"
                />
              </div>
              <div className="hidden sm:flex items-center pt-5">
                <div className="w-8 h-px bg-dark-600" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs text-dark-700 mb-1">To</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max={today}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-dark-200 border border-dark-400 rounded-xl py-3 px-4 text-white focus:border-primary-500 focus:outline-none cursor-pointer transition-colors"
                />
              </div>
            </div>
            <p className="text-dark-700 text-xs mt-3">
              Exporting from <span className="text-dark-900 font-medium">{formatDisplayDate(startDate)}</span> to{' '}
              <span className="text-dark-900 font-medium">{formatDisplayDate(endDate)}</span>
            </p>
          </div>

          {/* Export Buttons */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bookings Export Card */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleExport('bookings')}
              disabled={downloadingBookings}
              className="group relative overflow-hidden bg-dark-200 border border-dark-400 hover:border-primary-500/50 rounded-2xl p-6 text-left transition-all duration-300 disabled:opacity-60 disabled:cursor-wait"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-neon-blue/0 group-hover:from-primary-500/5 group-hover:to-neon-blue/5 transition-all duration-300" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <FileSpreadsheet size={22} className="text-blue-400" />
                  </div>
                  {downloadingBookings ? (
                    <Loader2 size={22} className="animate-spin text-primary-400" />
                  ) : (
                    <ArrowDownToLine size={22} className="text-dark-700 group-hover:text-primary-400 transition-colors" />
                  )}
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-1">
                  Booking Data
                </h3>
                <p className="text-dark-800 text-sm">
                  Export all bookings with customer info, game, station, date, time, price & status
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary-400 group-hover:text-primary-300 transition-colors">
                  {downloadingBookings ? 'Preparing file...' : 'Download CSV'}
                  <Download size={14} />
                </div>
              </div>
            </motion.button>

            {/* Billing Export Card */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleExport('payments')}
              disabled={downloadingPayments}
              className="group relative overflow-hidden bg-dark-200 border border-dark-400 hover:border-neon-green/50 rounded-2xl p-6 text-left transition-all duration-300 disabled:opacity-60 disabled:cursor-wait"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-300" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center">
                    <CreditCard size={22} className="text-green-400" />
                  </div>
                  {downloadingPayments ? (
                    <Loader2 size={22} className="animate-spin text-green-400" />
                  ) : (
                    <ArrowDownToLine size={22} className="text-dark-700 group-hover:text-green-400 transition-colors" />
                  )}
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-1">
                  Billing Data
                </h3>
                <p className="text-dark-800 text-sm">
                  Export all billing records with customer, amounts, paid/remaining, method & status
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-400 group-hover:text-green-300 transition-colors">
                  {downloadingPayments ? 'Preparing file...' : 'Download CSV'}
                  <Download size={14} />
                </div>
              </div>
            </motion.button>
          </div>

          {/* Info Footer */}
          <div className="px-6 pb-6">
            <div className="bg-dark-200 rounded-xl p-4 border border-dark-400 flex items-start gap-3">
              <HardDrive size={18} className="text-dark-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-dark-800 text-sm">
                  Files are saved directly to your PC's downloads folder. CSV files can be opened in
                  <span className="text-dark-900 font-medium"> Excel, Google Sheets</span>, or any spreadsheet app.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;
