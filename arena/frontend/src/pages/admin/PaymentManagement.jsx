import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  CreditCard,
  Banknote,
  Smartphone,
  Globe,
  CheckCircle2,
  Calendar,
  Receipt,
  IndianRupee,
  AlertCircle,
  Edit3,
  X,
} from 'lucide-react';
import { paymentService } from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Date filter
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Edit/Collect modal
  const [showModal, setShowModal] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const [editData, setEditData] = useState({ amount: 0, paidAmount: 0, method: 'cash', description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getAll();
      setPayments(res.data);
    } catch (err) {
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  // Open edit/collect modal
  const openModal = (payment) => {
    setEditPayment(payment);
    setEditData({
      amount: payment.amount,
      paidAmount: payment.paidAmount || (payment.status === 'completed' ? payment.amount : 0),
      method: payment.method || 'cash',
      description: payment.description || '',
    });
    setShowModal(true);
  };

  // Save edits + collect
  const handleSave = async (markPaid = false) => {
    setSaving(true);
    try {
      const data = { ...editData };
      if (markPaid) {
        data.paidAmount = data.amount;
        data.status = 'completed';
      } else if (data.paidAmount >= data.amount) {
        data.status = 'completed';
      }

      await paymentService.update(editPayment._id, data);

      // Update locally
      setPayments(prev => prev.map(p =>
        p._id === editPayment._id
          ? { ...p, ...data, status: data.status || p.status }
          : p
      ));

      toast.success(markPaid ? 'Payment collected!' : 'Bill updated!');
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Filter by date
  const filteredPayments = payments.filter(p => {
    const paymentDate = new Date(p.createdAt).toISOString().split('T')[0];
    return paymentDate === selectedDate;
  });

  // Summary
  const totalBilling = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const collected = filteredPayments.reduce((sum, p) => sum + (p.paidAmount || (p.status === 'completed' ? p.amount : 0)), 0);
  const outstanding = totalBilling - collected;

  const formatDisplayDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'card': return <CreditCard size={14} />;
      case 'cash': return <Banknote size={14} />;
      case 'upi': return <Smartphone size={14} />;
      case 'online': return <Globe size={14} />;
      default: return <DollarSign size={14} />;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64"><div className="loading-spinner"></div></div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold mb-2">
          <span className="text-gradient">Billing</span>
        </h1>
      </motion.div>

      {/* Date Picker */}
      <Card className="p-4 border border-primary-500/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-primary-400" />
            <span className="text-dark-900 font-semibold">Select Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-dark-200 border border-dark-400 rounded-lg py-2 px-3 text-white focus:border-primary-500 focus:outline-none cursor-pointer"
            />
          </div>
          <span className="text-dark-700 text-sm">
            Showing {selectedDate === today ? "today's" : formatDisplayDate(selectedDate)} billing records
          </span>
        </div>
      </Card>

      {/* Customer Bills Table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-dark-400">
          <h2 className="text-2xl font-display font-bold">Customer Bills</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-400 bg-dark-200/50">
                <th className="text-left py-4 px-4 text-dark-800 font-semibold text-sm">Sr.No</th>
                <th className="text-left py-4 px-4 text-dark-800 font-semibold text-sm">Name</th>
                <th className="text-left py-4 px-4 text-dark-800 font-semibold text-sm">Description</th>
                <th className="text-left py-4 px-4 text-dark-800 font-semibold text-sm">Time</th>
                <th className="text-right py-4 px-4 text-dark-800 font-semibold text-sm">Total</th>
                <th className="text-left py-4 px-4 text-dark-800 font-semibold text-sm">Payment</th>
                <th className="text-right py-4 px-4 text-dark-800 font-semibold text-sm">Paid</th>
                <th className="text-right py-4 px-4 text-dark-800 font-semibold text-sm">Remaining</th>
                <th className="text-center py-4 px-4 text-dark-800 font-semibold text-sm">Status</th>
                <th className="text-center py-4 px-4 text-dark-800 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, idx) => {
                const paidAmount = payment.paidAmount || (payment.status === 'completed' ? payment.amount : 0);
                const remaining = Math.max(payment.amount - paidAmount, 0);
                const isPaid = payment.status === 'completed' || remaining === 0;
                const createdTime = new Date(payment.createdAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit', minute: '2-digit', hour12: true,
                });

                return (
                  <motion.tr
                    key={payment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-dark-300 hover:bg-dark-200/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-dark-900 text-sm">{idx + 1}</td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-sm text-white">{payment.customerName || payment.user?.name || 'Walk-in'}</p>
                    </td>
                    <td className="py-4 px-4 text-dark-900 text-sm max-w-[220px]">{payment.description || '-'}</td>
                    <td className="py-4 px-4 text-dark-900 text-sm">{createdTime}</td>
                    <td className="py-4 px-4 text-right font-display font-bold text-white">₹{payment.amount}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-dark-900 capitalize text-sm">
                        {getMethodIcon(payment.method)} {payment.method}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-display font-bold text-neon-green">₹{paidAmount}</td>
                    <td className={`py-4 px-4 text-right font-display font-bold ${remaining > 0 ? 'text-red-400' : 'text-neon-green'}`}>₹{remaining}</td>
                    <td className="py-4 px-4 text-center">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold">
                          <CheckCircle2 size={12} /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-semibold">
                          <AlertCircle size={12} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => openModal(payment)}
                        className="px-3 py-1.5 bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded-lg text-xs font-semibold hover:bg-primary-500/30 transition-colors flex items-center gap-1 mx-auto"
                      >
                        <Edit3 size={13} /> {isPaid ? 'View' : 'Edit / Collect'}
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="text-center py-16 text-dark-700">
            <Receipt className="h-14 w-14 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-display">No bills found</p>
            <p className="text-sm mt-1">No billing records for this date</p>
          </div>
        )}
      </Card>



      {/* Edit / Collect Modal */}
      <AnimatePresence>
        {showModal && editPayment && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-100 border border-primary-500/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-dark-400 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-bold">Edit Bill</h2>
                  <p className="text-dark-800 text-sm">{editPayment.customerName || editPayment.user?.name || 'Walk-in'}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-dark-300 text-dark-700">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">Description</label>
                  <input
                    type="text"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full bg-dark-200 border border-dark-400 rounded-xl py-3 px-4 text-white placeholder-dark-700 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })}
                    min="0"
                    className="w-full bg-dark-200 border border-dark-400 rounded-xl py-3 px-4 text-white text-xl font-display font-bold focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Paid Amount */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={editData.paidAmount}
                    onChange={(e) => setEditData({ ...editData, paidAmount: Number(e.target.value) })}
                    min="0"
                    max={editData.amount}
                    className="w-full bg-dark-200 border border-dark-400 rounded-xl py-3 px-4 text-neon-green text-xl font-display font-bold focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Remaining Preview */}
                <div className="bg-dark-200 rounded-xl p-4 border border-dark-400">
                  <div className="flex justify-between items-center">
                    <span className="text-dark-800">Remaining</span>
                    <span className={`text-2xl font-display font-bold ${editData.amount - editData.paidAmount > 0 ? 'text-red-400' : 'text-neon-green'}`}>
                      ₹{Math.max(editData.amount - editData.paidAmount, 0)}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-semibold text-dark-900 mb-2">Payment Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: 'cash', label: 'Cash', icon: Banknote },
                      { key: 'upi', label: 'UPI', icon: Smartphone },
                      { key: 'card', label: 'Card', icon: CreditCard },
                      { key: 'online', label: 'Online', icon: Globe },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setEditData({ ...editData, method: key })}
                        className={`py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-1.5
                          ${editData.method === key
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-dark-300 text-dark-800 hover:bg-dark-400'
                          }`}
                      >
                        <Icon size={16} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-dark-400 flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => handleSave(false)}
                  loading={saving}
                >
                  Save Changes
                </Button>
                <Button
                  fullWidth
                  icon={CheckCircle2}
                  onClick={() => handleSave(true)}
                  loading={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Collect Full Amount
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentManagement;
