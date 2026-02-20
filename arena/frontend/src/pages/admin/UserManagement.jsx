import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Edit2, Trash2, X, Check, AlertCircle } from 'lucide-react';
import { userService } from '../../services/api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', role: 'customer'
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await userService.getAll();
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userService.update(editingUser._id, updateData);
        toast.success('User updated successfully');
      } else {
        await userService.create(formData);
        toast.success('User created successfully');
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', phone: '', password: '', role: 'customer' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, phone: user.phone || '', password: '', role: user.role });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await userService.delete(id);
      toast.success('User deleted successfully');
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      staff: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      customer: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return `px-3 py-1 rounded-full text-xs font-semibold border ${styles[role] || styles.customer}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-display font-bold mb-2">
            User <span className="text-gradient">Management</span>
          </h1>
          <p className="text-dark-800">{users.length} total users</p>
        </motion.div>
        <Button onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', phone: '', password: '', role: 'customer' }); setShowModal(true); }}>
          <Plus size={18} className="mr-2" /> Add User
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-700" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-200 border border-dark-400 rounded-lg py-3 pl-10 pr-4 text-white placeholder-dark-700 focus:border-primary-500 focus:outline-none transition-colors"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-400">
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Name</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Email</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Phone</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Role</th>
                <th className="text-left py-4 px-6 text-dark-800 font-semibold text-sm">Joined</th>
                <th className="text-right py-4 px-6 text-dark-800 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-dark-300 hover:bg-dark-200 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-neon-blue flex items-center justify-center">
                        <span className="text-sm font-bold">{user.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <span className="font-semibold">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-dark-900">{user.email}</td>
                  <td className="py-4 px-6 text-dark-900">{user.phone || '-'}</td>
                  <td className="py-4 px-6"><span className={getRoleBadge(user.role)}>{user.role}</span></td>
                  <td className="py-4 px-6 text-dark-800 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(user)} className="p-2 rounded-lg hover:bg-dark-300 text-neon-blue transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      {deleteConfirm === user._id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(user._id)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors" title="Confirm"><Check size={16} /></button>
                          <button onClick={() => setDeleteConfirm(null)} className="p-2 rounded-lg bg-dark-300 text-dark-800 hover:bg-dark-400 transition-colors" title="Cancel"><X size={16} /></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(user._id)} className="p-2 rounded-lg hover:bg-dark-300 text-red-400 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-dark-700">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No users found</p>
          </div>
        )}
      </Card>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-200 border border-dark-400 rounded-2xl p-8 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-display font-bold">{editingUser ? 'Edit User' : 'Add User'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-dark-300 rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <Input label={editingUser ? "New Password (leave blank to keep)" : "Password"} type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingUser} />
                <div>
                  <label className="block text-sm font-semibold mb-2 text-dark-900">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-dark-100 border border-dark-400 rounded-lg py-3 px-4 text-white focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">{editingUser ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
