import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Plus, Search, Edit2, Trash2, X, Check } from 'lucide-react';
import { gameService } from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const GameManagement = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    title: '', genre: '', platform: '', description: '', image: ''
  });

  useEffect(() => { fetchGames(); }, []);

  const fetchGames = async () => {
    try {
      const res = await gameService.getAll();
      setGames(res.data);
    } catch (err) {
      toast.error('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      if (editingGame) {
        await gameService.update(editingGame._id, data);
        toast.success('Game updated');
      } else {
        await gameService.create(data);
        toast.success('Game added');
      }
      setShowModal(false);
      setEditingGame(null);
      setFormData({ title: '', genre: '', platform: '', description: '', image: '' });
      fetchGames();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (game) => {
    setEditingGame(game);
    setFormData({
      title: game.title, genre: game.genre || '',
      platform: game.platform || '', description: game.description || '', image: game.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await gameService.delete(id);
      toast.success('Game deleted');
      setDeleteConfirm(null);
      fetchGames();
    } catch (err) {
      toast.error('Failed to delete game');
    }
  };

  const filteredGames = games.filter(g =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.genre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlatformBadge = (platform) => {
    const styles = {
      'PC': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'PS5': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      'Xbox': 'bg-green-500/20 text-green-400 border-green-500/30',
      'VR': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return `px-3 py-1 rounded-full text-xs font-semibold border ${styles[platform] || 'bg-dark-400 text-dark-800 border-dark-500'}`;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-display font-bold mb-2">Game <span className="text-gradient">Management</span></h1>
          <p className="text-dark-800">{games.length} games in library</p>
        </motion.div>
        <Button onClick={() => { setEditingGame(null); setFormData({ title: '', genre: '', pricePerHour: '', platform: '', description: '', image: '' }); setShowModal(true); }}>
          <Plus size={18} className="mr-2" /> Add Game
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-700" size={18} />
          <input type="text" placeholder="Search games..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-200 border border-dark-400 rounded-lg py-3 pl-10 pr-4 text-white placeholder-dark-700 focus:border-primary-500 focus:outline-none transition-colors" />
        </div>
      </Card>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game, idx) => (
          <motion.div key={game._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <Card className="p-6 hover:border-primary-500/50 transition-all group">
              {game.image && (
                <img src={game.image} alt={game.title} className="w-full h-40 object-cover rounded-lg mb-4" />
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-display font-bold">{game.title}</h3>
                  <p className="text-dark-800 text-sm">{game.genre || 'Uncategorized'}</p>
                </div>
                <span className={getPlatformBadge(game.platform)}>{game.platform || 'N/A'}</span>
              </div>
              {game.description && <p className="text-dark-700 text-sm mb-4 line-clamp-2">{game.description}</p>}
              <div className="flex items-center justify-end pt-3 border-t border-dark-400">
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(game)} className="p-2 rounded-lg hover:bg-dark-300 text-neon-blue transition-colors"><Edit2 size={16} /></button>
                  {deleteConfirm === game._id ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete(game._id)} className="p-2 rounded-lg bg-red-500/20 text-red-400"><Check size={16} /></button>
                      <button onClick={() => setDeleteConfirm(null)} className="p-2 rounded-lg bg-dark-300 text-dark-800"><X size={16} /></button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(game._id)} className="p-2 rounded-lg hover:bg-dark-300 text-red-400"><Trash2 size={16} /></button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <Card className="text-center py-12 text-dark-700">
          <Gamepad2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No games found. Click "Add Game" to get started.</p>
        </Card>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()} className="bg-dark-200 border border-dark-400 rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold">{editingGame ? 'Edit Game' : 'Add Game'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark-300 rounded-lg"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                <Input label="Genre" value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} />
                <div>
                  <label className="block text-sm font-semibold mb-2 text-dark-900">Platform</label>
                  <select value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full bg-dark-100 border border-dark-400 rounded-lg py-3 px-4 text-white focus:border-primary-500 focus:outline-none">
                    <option value="">Select Platform</option>
                    <option value="PC">PC</option>
                    <option value="PS5">PS5</option>
                    <option value="Xbox">Xbox</option>
                    <option value="VR">VR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-dark-900">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3}
                    className="w-full bg-dark-100 border border-dark-400 rounded-lg py-3 px-4 text-white focus:border-primary-500 focus:outline-none resize-none" />
                </div>
                <Input label="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">{editingGame ? 'Update' : 'Add Game'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameManagement;
