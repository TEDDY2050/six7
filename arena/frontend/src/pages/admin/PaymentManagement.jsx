import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Search, CreditCard, Banknote, Smartphone, Globe } from 'lucide-react';
import { paymentService } from '../../services/api';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      const res = await paymentService.getAll();
      setPayments(res.data);
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch = searchTerm === '' ||
      (p.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      refunded: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return `px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending}`;
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'card': return <CreditCard size={16} />;
      case 'cash': return <Banknote size={16} />;
      case 'upi': return <Smartphone size={16} />;
      case 'online': return <Globe size={16} />;
      default: return <DollarSign size={16} />;
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner"></div></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-display font-bold mb-2">Payment <span className="text-gradient">Management</span></h1>
        <p className="text-dark-800">{payments.length} transactions</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
          <p className="text-dark-800 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-display font-bold text-green-400">₹{totalRevenue.toLocaleString()}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/20">
          <p className="text-dark-800 text-sm mb-1">Completed</p>
          <p className="text-3xl font-display font-bold text-primary-400">{payments.filter(p => p.status === 'completed').length}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20">
          <p className="text-dark-800 text-sm mb-1">Pending</p>
          <p className="text-3xl font-display font-bold text-yellow-400">{payments.filter(p => p.status === 'pending').length}</p>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-700" size={18} />
            <input type="text" placeholder="Search by customer or transaction ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-200 border border-dark-400 rounded-lg py-3 pl-10 pr-4 text-white placeholder-dark-700 focus:border-primary-500 focus:outline-none" />
          </div>
          <div className="flex gap-2">
            {['all', 'completed', 'pending', 'refunded', 'failed'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${statusFilter === s ? 'bg-primary-500 text-white' : 'bg-dark-300 text-dark-800 hover:bg-dark-400'}`}>{s}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-400">
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Transaction ID</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Customer</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Amount</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Method</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Status</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, idx) => (
                <motion.tr key={payment._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                  className="border-b border-dark-300 hover:bg-dark-200 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm text-dark-900">{payment.transactionId || '-'}</td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-sm">{payment.user?.name || 'Unknown'}</p>
                    <p className="text-dark-700 text-xs">{payment.user?.email || ''}</p>
                  </td>
                  <td className="py-4 px-6 text-green-400 font-display font-bold">₹{payment.amount}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-dark-900 capitalize">
                      {getMethodIcon(payment.method)} {payment.method}
                    </div>
                  </td>
                  <td className="py-4 px-6"><span className={getStatusBadge(payment.status)}>{payment.status}</span></td>
                  <td className="py-4 px-6 text-dark-800 text-sm">{new Date(payment.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-dark-700">
            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No payments found</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentManagement;
