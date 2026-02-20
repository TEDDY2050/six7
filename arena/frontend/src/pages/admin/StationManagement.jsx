import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Plus, Edit2, Trash2, X, Check, Wifi, WifiOff, Search } from 'lucide-react';
import { stationService } from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const StationManagement = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({ name: '', type: '', pricePerHour: '', status: 'Available' });

  useEffect(() => { fetchStations(); }, []);

  const fetchStations = async () => {
    try {
      const res = await stationService.getAll();
      setStations(res.data);
    } catch (err) {
      toast.error('Failed to load stations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, pricePerHour: parseFloat(formData.pricePerHour) };
      if (editingStation) {
        await stationService.update(editingStation._id, data);
        toast.success('Station updated');
      } else {
        await stationService.create(data);
        toast.success('Station added');
      }
      setShowModal(false);
      setEditingStation(null);
      setFormData({ name: '', type: '', pricePerHour: '', status: 'Available' });
      fetchStations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData({ name: station.name, type: station.type, pricePerHour: station.pricePerHour?.toString() || '', status: station.status });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await stationService.delete(id);
      toast.success('Station deleted');
      setDeleteConfirm(null);
      fetchStations();
    } catch (err) {
      toast.error('Failed to delete station');
    }
  };

  const toggleStatus = async (station) => {
    const newStatus = station.status === 'Available' ? 'Offline' : 'Available';
    try {
      await stationService.updateStatus(station._id, newStatus);
      toast.success(`Station set to ${newStatus}`);
      fetchStations();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const types = [...new Set(stations.map(s => s.type))];
  const filteredStations = filterType === 'all' ? stations : stations.filter(s => s.type === filterType);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Available': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', dot: 'bg-green-400' };
      case 'In Use': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400' };
      case 'Offline': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400' };
      default: return { bg: 'bg-dark-400', text: 'text-dark-800', border: 'border-dark-500', dot: 'bg-dark-700' };
    }
  };

  const statusCounts = {
    Available: stations.filter(s => s.status === 'Available').length,
    'In Use': stations.filter(s => s.status === 'In Use').length,
    Offline: stations.filter(s => s.status === 'Offline').length,
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="loading-spinner"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-display font-bold mb-2">Station <span className="text-gradient">Management</span></h1>
          <p className="text-dark-800">{stations.length} stations configured</p>
        </motion.div>
        <Button onClick={() => { setEditingStation(null); setFormData({ name: '', type: '', status: 'Available' }); setShowModal(true); }}>
          <Plus size={18} className="mr-2" /> Add Station
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => {
          const styles = getStatusStyles(status);
          return (
            <Card key={status} className={`p-4 ${styles.bg} border ${styles.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark-800 text-sm">{status}</p>
                  <p className={`text-3xl font-display font-bold ${styles.text}`}>{count}</p>
                </div>
                <div className={`w-4 h-4 rounded-full ${styles.dot} animate-pulse`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === 'all' ? 'bg-primary-500 text-white' : 'bg-dark-300 text-dark-800 hover:bg-dark-400'}`}>All</button>
        {types.map(type => (
          <button key={type} onClick={() => setFilterType(type)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === type ? 'bg-primary-500 text-white' : 'bg-dark-300 text-dark-800 hover:bg-dark-400'}`}>{type}</button>
        ))}
      </div>

      {/* Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStations.map((station, idx) => {
          const styles = getStatusStyles(station.status);
          return (
            <motion.div key={station._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.03 }}>
              <Card className={`p-5 border ${styles.border} hover:border-primary-500/50 transition-all group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-neon-blue/20 flex items-center justify-center">
                    <Monitor className={styles.text} size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
                    <span className={`text-xs font-semibold ${styles.text}`}>{station.status}</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg mb-1">{station.name}</h3>
                <p className="text-dark-700 text-sm">{station.type}</p>
                <p className="text-primary-400 font-display font-bold text-sm mt-1">₹{station.pricePerHour}<span className="text-dark-700 font-body font-normal">/hr</span></p>
                <div className="flex gap-2 pt-3 border-t border-dark-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleStatus(station)} className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg hover:bg-dark-300 text-dark-800 text-sm transition-colors">
                    {station.status === 'Available' ? <WifiOff size={14} /> : <Wifi size={14} />} Toggle
                  </button>
                  <button onClick={() => handleEdit(station)} className="p-2 rounded-lg hover:bg-dark-300 text-neon-blue"><Edit2 size={14} /></button>
                  {deleteConfirm === station._id ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete(station._id)} className="p-2 rounded-lg bg-red-500/20 text-red-400"><Check size={14} /></button>
                      <button onClick={() => setDeleteConfirm(null)} className="p-2 rounded-lg bg-dark-300 text-dark-800"><X size={14} /></button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(station._id)} className="p-2 rounded-lg hover:bg-dark-300 text-red-400"><Trash2 size={14} /></button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredStations.length === 0 && (
        <Card className="text-center py-12 text-dark-700">
          <Monitor className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No stations found. Click "Add Station" to get started.</p>
        </Card>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()} className="bg-dark-200 border border-dark-400 rounded-2xl p-8 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold">{editingStation ? 'Edit Station' : 'Add Station'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark-300 rounded-lg"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Station Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <div>
                  <label className="block text-sm font-semibold mb-2 text-dark-900">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required
                    className="w-full bg-dark-100 border border-dark-400 rounded-lg py-3 px-4 text-white focus:border-primary-500 focus:outline-none">
                    <option value="">Select Type</option>
                    <option value="PC">PC</option>
                    <option value="PS5">PS5</option>
                    <option value="Xbox">Xbox</option>
                    <option value="VR">VR</option>
                    <option value="Racing Sim">Racing Sim</option>
                  </select>
                </div>
                <Input label="Price per Hour (₹)" type="number" min="0" step="1" value={formData.pricePerHour} onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })} required />
                <div>
                  <label className="block text-sm font-semibold mb-2 text-dark-900">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-dark-100 border border-dark-400 rounded-lg py-3 px-4 text-white focus:border-primary-500 focus:outline-none">
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">{editingStation ? 'Update' : 'Add Station'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StationManagement;
