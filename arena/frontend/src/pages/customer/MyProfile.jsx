import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import toast from 'react-hot-toast';

const MyProfile = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authService.updateProfile(formData);
      if (res.data) {
        // Update user context
        if (setUser) setUser(res.data);
        toast.success('Profile updated!');
        setEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 md:ml-20 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl md:text-2xl font-display font-bold mb-1">My Profile</h1>
        <p className="text-dark-700 text-sm">Manage your account</p>
      </motion.div>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-neon-blue flex items-center justify-center">
          <span className="text-3xl font-display font-bold">{user?.name?.[0]?.toUpperCase()}</span>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-dark-200 border border-dark-400 rounded-2xl p-5 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold">Account Info</h2>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-primary-400 text-sm font-semibold hover:underline">
              <Edit2 size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => { setEditing(false); setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }); }}
                className="p-2 rounded-lg hover:bg-dark-300 text-dark-700"><X size={16} /></button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-sm font-semibold disabled:opacity-50">
                <Save size={14} /> Save
              </button>
            </div>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-dark-700 text-xs font-semibold mb-1"><User size={12} /> Name</label>
            {editing ? (
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-dark-100 border border-dark-400 rounded-xl py-2.5 px-3 text-white text-sm focus:border-primary-500 focus:outline-none" />
            ) : (
              <p className="font-semibold">{user?.name}</p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-dark-700 text-xs font-semibold mb-1"><Mail size={12} /> Email</label>
            {editing ? (
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-dark-100 border border-dark-400 rounded-xl py-2.5 px-3 text-white text-sm focus:border-primary-500 focus:outline-none" />
            ) : (
              <p className="font-semibold">{user?.email}</p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-2 text-dark-700 text-xs font-semibold mb-1"><Phone size={12} /> Phone</label>
            {editing ? (
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-dark-100 border border-dark-400 rounded-xl py-2.5 px-3 text-white text-sm focus:border-primary-500 focus:outline-none" />
            ) : (
              <p className="font-semibold">{user?.phone || 'Not set'}</p>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;
