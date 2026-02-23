import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Monitor, Gamepad2, Zap, Wifi, WifiOff, Clock, User,
    Maximize2, Minimize2, RefreshCw, Volume2,
} from 'lucide-react';
import { stationService, sessionService } from '../../services/api';
import toast from 'react-hot-toast';

const typeIcons = {
    PC: Monitor,
    PS5: Gamepad2,
    Simulator: Zap,
    Xbox: Gamepad2,
    VR: Monitor,
};

const typeColors = {
    PC: { bg: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    PS5: { bg: 'from-indigo-500/20 to-purple-500/20', border: 'border-indigo-500', text: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
    Simulator: { bg: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
    Xbox: { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500', text: 'text-green-400', glow: 'shadow-green-500/20' },
    VR: { bg: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500', text: 'text-pink-400', glow: 'shadow-pink-500/20' },
};

const statusConfig = {
    'Available': { color: 'bg-neon-green', pulse: true, label: 'FREE', textColor: 'text-neon-green' },
    'In Use': { color: 'bg-red-500', pulse: false, label: 'IN USE', textColor: 'text-red-400' },
    'Offline': { color: 'bg-dark-600', pulse: false, label: 'OFFLINE', textColor: 'text-dark-600' },
};

const FloorMap = () => {
    const [stations, setStations] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fullscreen, setFullscreen] = useState(false);
    const [now, setNow] = useState(Date.now());
    const [hoveredStation, setHoveredStation] = useState(null);
    const containerRef = useRef(null);

    // Live clock — updates every second for countdown timers
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch data every 15 seconds
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [sRes, sessRes] = await Promise.all([
                stationService.getAll(),
                sessionService.getActive(),
            ]);
            setStations(sRes.data);
            setSessions(sessRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Map sessions to stations
    const sessionMap = {};
    sessions.forEach(s => {
        const stationId = s.station?._id || s.station;
        sessionMap[stationId] = s;
    });

    // Group by type
    const stationsByType = stations.reduce((acc, s) => {
        if (!acc[s.type]) acc[s.type] = [];
        acc[s.type].push(s);
        return acc;
    }, {});

    const toggleFullscreen = () => {
        if (!fullscreen) {
            containerRef.current?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
        setFullscreen(!fullscreen);
    };

    // Time remaining for a session
    const getTimeRemaining = (session) => {
        if (!session?.startTime || !session?.duration) return null;
        const endTime = new Date(session.startTime).getTime() + session.duration * 3600000;
        const remaining = endTime - now;
        if (remaining <= 0) return { text: 'OVERTIME', overtime: true };
        const hrs = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        if (hrs > 0) return { text: `${hrs}h ${mins}m`, overtime: false };
        return { text: `${mins}:${secs.toString().padStart(2, '0')}`, overtime: false };
    };

    // Stats
    const totalStations = stations.length;
    const available = stations.filter(s => s.status === 'Available').length;
    const inUse = stations.filter(s => s.status === 'In Use').length;
    const offline = stations.filter(s => s.status === 'Offline').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="loading-spinner mx-auto"></div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`space-y-6 ${fullscreen ? 'bg-dark-50 p-8 overflow-auto' : ''}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold">
                        Live <span className="text-gradient">Floor Map</span>
                    </h1>
                    <p className="text-dark-700 text-sm mt-1">Real-time station status • Auto-refreshes every 15s</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchData} className="p-2 rounded-lg hover:bg-dark-300 text-dark-700 transition-all" title="Refresh">
                        <RefreshCw size={18} />
                    </button>
                    <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-dark-300 text-dark-700 transition-all" title="Fullscreen (for TV)">
                        {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                </div>
            </div>

            {/* Live Status Bar */}
            <div className="flex items-center gap-6 bg-dark-200 border border-dark-400 rounded-xl px-5 py-3">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-green"></span>
                    </span>
                    <span className="text-sm font-semibold text-neon-green">{available} Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="text-sm font-semibold text-red-400">{inUse} In Use</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-dark-600"></span>
                    <span className="text-sm font-semibold text-dark-600">{offline} Offline</span>
                </div>
                <div className="ml-auto text-dark-700 text-xs font-mono">
                    {new Date(now).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                </div>
            </div>

            {/* Floor Map Grid */}
            {Object.entries(stationsByType).map(([type, typeStations]) => {
                const Icon = typeIcons[type] || Monitor;
                const colors = typeColors[type] || typeColors.PC;

                return (
                    <div key={type}>
                        <div className="flex items-center gap-2 mb-3">
                            <Icon size={18} className={colors.text} />
                            <h2 className="font-display font-bold text-lg">{type} Zone</h2>
                            <span className="text-dark-700 text-xs ml-1">
                                ({typeStations.filter(s => s.status === 'Available').length}/{typeStations.length} free)
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {typeStations.map((station) => {
                                const session = sessionMap[station._id];
                                const status = statusConfig[station.status] || statusConfig['Offline'];
                                const timeLeft = session ? getTimeRemaining(session) : null;
                                const isInUse = station.status === 'In Use';
                                const isHovered = hoveredStation === station._id;

                                return (
                                    <motion.div
                                        key={station._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        onMouseEnter={() => setHoveredStation(station._id)}
                                        onMouseLeave={() => setHoveredStation(null)}
                                        className={`relative rounded-2xl border-2 transition-all overflow-hidden ${isInUse
                                                ? `border-red-500/50 bg-gradient-to-br ${colors.bg}`
                                                : station.status === 'Available'
                                                    ? 'border-neon-green/30 bg-dark-200 hover:border-neon-green/60'
                                                    : 'border-dark-500 bg-dark-300 opacity-50'
                                            } ${isInUse ? `shadow-lg ${colors.glow}` : ''}`}
                                    >
                                        {/* Status indicator bar */}
                                        <div className={`h-1 ${isInUse ? 'bg-red-500' : station.status === 'Available' ? 'bg-neon-green' : 'bg-dark-600'}`} />

                                        <div className="p-3">
                                            {/* Station Header */}
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-display font-bold text-sm">{station.name}</h3>
                                                <div className="flex items-center gap-1">
                                                    {status.pulse && (
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                                                        </span>
                                                    )}
                                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${status.textColor}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* In-use details */}
                                            {isInUse && session ? (
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <User size={11} className="text-dark-700" />
                                                        <span className="text-xs font-semibold truncate">
                                                            {session.customerName || session.user?.name || 'Walk-in'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Gamepad2 size={11} className="text-dark-700" />
                                                        <span className="text-xs text-dark-800 truncate">
                                                            {session.game?.title || 'Gaming'}
                                                        </span>
                                                    </div>

                                                    {/* Countdown Timer */}
                                                    {timeLeft && (
                                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono font-bold ${timeLeft.overtime
                                                                ? 'bg-red-500/20 text-red-400 animate-pulse'
                                                                : 'bg-dark-200/80 text-white'
                                                            }`}>
                                                            <Clock size={10} />
                                                            {timeLeft.text}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : station.status === 'Available' ? (
                                                <div className="text-center py-2">
                                                    <Icon size={24} className="mx-auto text-neon-green/40 mb-1" />
                                                    <p className="text-[10px] text-dark-700">Ready</p>
                                                </div>
                                            ) : (
                                                <div className="text-center py-2">
                                                    <WifiOff size={20} className="mx-auto text-dark-600 mb-1" />
                                                    <p className="text-[10px] text-dark-600">Offline</p>
                                                </div>
                                            )}

                                            {/* Price tag */}
                                            <div className="mt-2 text-right">
                                                <span className="text-[10px] text-dark-700">₹{station.pricePerHour}/hr</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FloorMap;
