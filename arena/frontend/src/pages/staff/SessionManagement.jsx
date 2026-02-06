import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  Gamepad2,
  Zap,
  Play,
  Square,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const SessionManagement = () => {
  // Station configuration based on user's inventory
  const initialStations = [
    // 10 PCs
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `pc-${i + 1}`,
      name: `PC ${i + 1}`,
      type: 'PC Gaming',
      icon: Monitor,
      rate: 100,
      status: 'available',
      currentSession: null,
      color: 'neon-blue',
    })),
    // 2 Simulators
    ...Array.from({ length: 2 }, (_, i) => ({
      id: `sim-${i + 1}`,
      name: `Simulator ${i + 1}`,
      type: 'Racing Simulator',
      icon: Zap,
      rate: 200,
      status: 'available',
      currentSession: null,
      color: 'orange-500',
    })),
    // 4 PS5s
    ...Array.from({ length: 4 }, (_, i) => ({
      id: `ps5-${i + 1}`,
      name: `PS5 ${i + 1}`,
      type: 'Console Gaming',
      icon: Gamepad2,
      rate: 80,
      status: 'available',
      currentSession: null,
      color: 'neon-pink',
    })),
  ];

  const [stations, setStations] = useState(initialStations);
  const [selectedStations, setSelectedStations] = useState([]);
  const [showBilling, setShowBilling] = useState(false);

  // Calculate total billing
  const calculateTotal = () => {
    return selectedStations.reduce((total, stationId) => {
      const station = stations.find(s => s.id === stationId);
      if (station && station.currentSession) {
        const hours = station.currentSession.duration / 60;
        return total + (station.rate * hours);
      }
      return total;
    }, 0);
  };

  // Toggle station selection
  const toggleStationSelection = (stationId) => {
    setSelectedStations(prev => 
      prev.includes(stationId)
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    );
  };

  // Start session for selected stations
  const startSessions = (duration) => {
    if (selectedStations.length === 0) {
      toast.error('Please select at least one station');
      return;
    }

    const now = new Date();
    const updatedStations = stations.map(station => {
      if (selectedStations.includes(station.id)) {
        return {
          ...station,
          status: 'in-use',
          currentSession: {
            startTime: now,
            duration: duration,
            customerName: 'Walk-in Customer',
            endTime: new Date(now.getTime() + duration * 60000),
          }
        };
      }
      return station;
    });

    setStations(updatedStations);
    setShowBilling(true);
    toast.success(`${selectedStations.length} session(s) started!`);
  };

  // End session
  const endSession = (stationId) => {
    const updatedStations = stations.map(station => {
      if (station.id === stationId) {
        return {
          ...station,
          status: 'available',
          currentSession: null,
        };
      }
      return station;
    });

    setStations(updatedStations);
    setSelectedStations(prev => prev.filter(id => id !== stationId));
    toast.success('Session ended!');
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      available: {
        icon: CheckCircle2,
        color: 'text-neon-green',
        bg: 'bg-neon-green/10',
        border: 'border-neon-green/30',
        label: 'Available',
      },
      'in-use': {
        icon: AlertCircle,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        label: 'In Use',
      },
      offline: {
        icon: XCircle,
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        label: 'Offline',
      },
    };

    const badge = badges[status];
    const Icon = badge.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badge.bg} ${badge.color} border ${badge.border}`}>
        <Icon size={14} />
        <span className="text-xs font-semibold">{badge.label}</span>
      </div>
    );
  };

  // Stats
  const stats = {
    total: stations.length,
    available: stations.filter(s => s.status === 'available').length,
    inUse: stations.filter(s => s.status === 'in-use').length,
    offline: stations.filter(s => s.status === 'offline').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">
            Session <span className="text-gradient">Management</span>
          </h1>
          <p className="text-dark-800">Manage all gaming stations and active sessions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-primary-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-800 text-sm mb-1">Total Stations</p>
              <h3 className="text-3xl font-display font-bold">{stats.total}</h3>
            </div>
            <div className="p-3 rounded-lg bg-primary-500/10">
              <Monitor size={24} className="text-primary-400" />
            </div>
          </div>
        </Card>

        <Card className="border border-neon-green/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-800 text-sm mb-1">Available</p>
              <h3 className="text-3xl font-display font-bold text-neon-green">{stats.available}</h3>
            </div>
            <div className="p-3 rounded-lg bg-neon-green/10">
              <CheckCircle2 size={24} className="text-neon-green" />
            </div>
          </div>
        </Card>

        <Card className="border border-orange-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-800 text-sm mb-1">In Use</p>
              <h3 className="text-3xl font-display font-bold text-orange-500">{stats.inUse}</h3>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Play size={24} className="text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="border border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-800 text-sm mb-1">Offline</p>
              <h3 className="text-3xl font-display font-bold text-red-500">{stats.offline}</h3>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10">
              <XCircle size={24} className="text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border border-primary-500/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-display font-bold mb-1">Quick Start Sessions</h3>
            <p className="text-dark-800 text-sm">
              {selectedStations.length > 0 
                ? `${selectedStations.length} station(s) selected`
                : 'Select stations to start sessions'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => startSessions(60)}
              disabled={selectedStations.length === 0}
            >
              1 Hour
            </Button>
            <Button
              variant="outline"
              onClick={() => startSessions(120)}
              disabled={selectedStations.length === 0}
            >
              2 Hours
            </Button>
            <Button
              variant="outline"
              onClick={() => startSessions(180)}
              disabled={selectedStations.length === 0}
            >
              3 Hours
            </Button>
            <Button
              onClick={() => startSessions(480)}
              disabled={selectedStations.length === 0}
            >
              Full Day (8h)
            </Button>
          </div>
        </div>
      </Card>

      {/* Stations Grid */}
      <div>
        <h3 className="text-2xl font-display font-bold mb-4">
          All <span className="text-gradient">Stations</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stations.map((station, index) => {
            const Icon = station.icon;
            const isSelected = selectedStations.includes(station.id);

            return (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => station.status === 'available' && toggleStationSelection(station.id)}
                className={`
                  glass rounded-xl p-4 cursor-pointer transition-all relative overflow-hidden
                  ${station.status === 'available' ? 'hover-lift' : 'opacity-60'}
                  ${isSelected ? `border-2 border-${station.color} shadow-neon-purple` : 'border border-white/10'}
                `}
              >
                {/* Top gradient line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-${station.color}`}></div>

                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-${station.color}/10 border border-${station.color}/20`}>
                    <Icon size={20} className={`text-${station.color}`} />
                  </div>
                  {getStatusBadge(station.status)}
                </div>

                {/* Station Info */}
                <h4 className="font-display font-bold text-lg mb-1">{station.name}</h4>
                <p className="text-dark-800 text-sm mb-2">{station.type}</p>
                <p className="text-2xl font-bold text-gradient">₹{station.rate}/hr</p>

                {/* Session Info */}
                {station.currentSession && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-dark-900 mb-2">
                      <Clock size={14} />
                      <span>
                        Started: {station.currentSession.startTime.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-dark-900 mb-3">
                      <Users size={14} />
                      <span>{station.currentSession.customerName}</span>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      icon={Square}
                      onClick={(e) => {
                        e.stopPropagation();
                        endSession(station.id);
                      }}
                    >
                      End Session
                    </Button>
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && station.status === 'available' && (
                  <div className="absolute top-2 right-2">
                    <div className={`w-6 h-6 rounded-full bg-${station.color} flex items-center justify-center`}>
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Billing Summary */}
      {showBilling && selectedStations.length > 0 && (
        <Card className="border-2 border-primary-500/50 shadow-neon-purple">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-display font-bold mb-2">
                Billing <span className="text-gradient">Summary</span>
              </h3>
              <p className="text-dark-800">Active sessions billing details</p>
            </div>
            <div className="text-right">
              <p className="text-dark-800 text-sm mb-1">Total Amount</p>
              <p className="text-5xl font-display font-bold text-gradient">
                ₹{calculateTotal().toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {selectedStations.map(stationId => {
              const station = stations.find(s => s.id === stationId);
              if (!station || !station.currentSession) return null;

              const hours = station.currentSession.duration / 60;
              const amount = station.rate * hours;

              return (
                <div
                  key={stationId}
                  className="flex items-center justify-between p-3 rounded-lg bg-dark-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${station.color}/10`}>
                      <station.icon size={18} className={`text-${station.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold">{station.name}</p>
                      <p className="text-sm text-dark-800">
                        {hours} hour(s) × ₹{station.rate}/hr
                      </p>
                    </div>
                  </div>
                  <p className="text-xl font-bold">₹{amount.toFixed(2)}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" fullWidth>
              Print Bill
            </Button>
            <Button fullWidth icon={DollarSign}>
              Process Payment
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SessionManagement;
