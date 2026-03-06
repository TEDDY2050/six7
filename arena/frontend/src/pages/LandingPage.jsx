import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Monitor,
  Users,
  Clock,
  Trophy,
  Zap,
  ArrowRight,
  Check,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { stationService, gameService } from '../services/api';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, gRes] = await Promise.all([
          stationService.getAvailable(),
          gameService.getAll(),
        ]);
        setStations(sRes.data);
        setGames(gRes.data);
      } catch (e) {
        // silent — landing page still works with static fallback
      }
    };
    fetchData();
  }, []);

  // Smart redirect: logged in → booking, else → login
  const handleBookClick = () => {
    if (user) {
      navigate('/customer/book');
    } else {
      navigate('/login?redirect=/customer/book');
    }
  };

  // Group stations by type for live availability
  const stationTypes = stations.reduce((acc, s) => {
    if (!acc[s.type]) acc[s.type] = { type: s.type, count: 0, available: 0, price: s.pricePerHour };
    acc[s.type].count++;
    if (s.status === 'Available') acc[s.type].available++;
    return acc;
  }, {});

  // Gaming zone data with live station counts merged in
  const gamingZones = [
    {
      name: 'PC Gaming',
      type: 'PC',
      description: 'High-end RTX 4090 rigs with 240Hz monitors',
      tags: ['RTX 4090', '240Hz', 'i9-14900K'],
      color: 'neon-blue',
      icon: Monitor,
      price: stationTypes['PC']?.price || 100,
      available: stationTypes['PC']?.available ?? null,
    },
    {
      name: 'Console Gaming',
      type: 'PS5',
      description: 'PS5, Xbox Series X, Nintendo Switch',
      tags: ['PS5', 'Xbox Series X', 'Switch'],
      color: 'neon-pink',
      icon: Gamepad2,
      price: stationTypes['PS5']?.price || 200,
      available: stationTypes['PS5']?.available ?? null,
    },
    {
      name: 'Racing Simulator',
      type: 'Simulator',
      description: 'Full motion racing rigs with triple screens',
      tags: ['Triple Screen', 'Force Feedback'],
      color: 'orange-500',
      icon: Zap,
      price: stationTypes['Simulator']?.price || 250,
      available: stationTypes['Simulator']?.available ?? null,
    },
  ];

  // Floating particles for hero
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/3 right-1/3 w-64 h-64 bg-neon-pink/10 rounded-full blur-3xl"
          />

          {/* Floating particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-primary-500/30"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            />
          ))}

          {/* Grid overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(139,92,246,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 backdrop-blur-sm mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                </span>
                <span className="text-primary-300 text-sm font-semibold">
                  {stations.length > 0
                    ? `${stations.filter(s => s.status === 'Available').length} stations available now`
                    : 'Now Open — Book Your Spot'}
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-tight">
                Welcome to <br />
                <span className="bg-gradient-to-r from-neon-blue via-primary-400 to-neon-pink bg-clip-text text-transparent">
                  VORTEX ARENA
                </span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                Experience next-level gaming with cutting-edge equipment, immersive environments, and a community of passionate gamers.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="xl"
                  className="bg-gradient-to-r from-neon-blue to-primary-500 hover:from-neon-blue/90 hover:to-primary-500/90 text-white font-bold px-8 shadow-lg shadow-neon-blue/25"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={handleBookClick}
                >
                  Book a Session
                </Button>
                {!user && (
                  <Link to="/register">
                    <Button
                      size="xl"
                      variant="outline"
                      className="border-2 border-white/20 hover:border-white/40 hover:bg-white/5"
                    >
                      Sign Up Free
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
            >
              <div className="glass rounded-2xl p-8 border border-primary-500/20 hover:border-primary-500/40 transition-all">
                <Zap className="text-neon-blue mx-auto mb-4" size={40} />
                <h3 className="text-5xl font-display font-bold text-neon-blue mb-2">
                  {stations.length || '50+'}
                </h3>
                <p className="text-gray-400 text-lg">Gaming Stations</p>
              </div>

              <div className="glass rounded-2xl p-8 border border-primary-500/20 hover:border-primary-500/40 transition-all">
                <Users className="text-neon-pink mx-auto mb-4" size={40} />
                <h3 className="text-5xl font-display font-bold text-neon-pink mb-2">
                  10K+
                </h3>
                <p className="text-gray-400 text-lg">Happy Gamers</p>
              </div>

              <div className="glass rounded-2xl p-8 border border-primary-500/20 hover:border-primary-500/40 transition-all">
                <Clock className="text-neon-green mx-auto mb-4" size={40} />
                <h3 className="text-5xl font-display font-bold text-neon-green mb-2">
                  24/7
                </h3>
                <p className="text-gray-400 text-lg">Open Hours</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary-500 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-primary-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Gaming Zones Section — CLICKABLE CARDS */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-neon-pink/30 bg-neon-pink/10 backdrop-blur-sm mb-6">
              <span className="text-neon-pink font-semibold">Our Gaming Zones</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Choose Your <span className="bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">Battlefield</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Click any zone to start booking. From casual gaming to competitive esports, we have the perfect setup for every gamer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamingZones.map((zone, idx) => (
              <motion.div
                key={zone.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={handleBookClick}
                className={`cursor-pointer glass rounded-2xl p-6 border border-${zone.color}/20 hover:border-${zone.color}/50 transition-all hover-lift relative overflow-hidden group`}
              >
                {/* Top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${zone.color} to-transparent`}></div>

                {/* Hover glow */}
                <div className={`absolute inset-0 bg-${zone.color}/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${zone.color}/10 border border-${zone.color}/20`}>
                      <zone.icon className={`text-${zone.color}`} size={28} />
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-display font-bold text-${zone.color}`}>₹{zone.price}</p>
                      <p className="text-gray-400 text-sm">/hour</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">{zone.name}</h3>
                  <p className="text-gray-400 mb-3">{zone.description}</p>

                  {/* Live availability badge */}
                  {zone.available !== null && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${zone.available > 0 ? 'bg-neon-green' : 'bg-red-500'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${zone.available > 0 ? 'bg-neon-green' : 'bg-red-500'}`}></span>
                      </span>
                      <span className={`text-sm font-semibold ${zone.available > 0 ? 'text-neon-green' : 'text-red-400'}`}>
                        {zone.available > 0 ? `${zone.available} available now` : 'All occupied'}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {zone.tags.map(tag => (
                      <span key={tag} className={`text-xs px-3 py-1 rounded-full bg-${zone.color}/10 text-${zone.color} border border-${zone.color}/20`}>{tag}</span>
                    ))}
                  </div>

                  {/* Book Now CTA */}
                  <div className="flex items-center gap-2 text-primary-400 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Book Now</span> <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-neon-green/30 bg-neon-green/10 backdrop-blur-sm mb-6">
              <span className="text-neon-green font-semibold">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">
              The Ultimate <span className="bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">Gaming Hub</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're not just a gaming cafe — we're a community of passionate gamers with world-class facilities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🛡️', title: 'Secure Environment', description: '24/7 security with CCTV monitoring and secure lockers for your belongings.', gradient: 'from-neon-blue to-cyan-500' },
              { icon: '🕐', title: 'Flexible Hours', description: 'Open 24/7 with convenient booking slots from 1 hour to full day sessions.', gradient: 'from-cyan-500 to-neon-green' },
              { icon: '🎧', title: 'Premium Equipment', description: 'Top-tier gaming peripherals from Razer, Logitech, and SteelSeries.', gradient: 'from-neon-green to-yellow-500' },
              { icon: '🏆', title: 'Weekly Tournaments', description: 'Compete in our weekly esports tournaments with cash prizes.', gradient: 'from-yellow-500 to-orange-500' },
              { icon: '💳', title: 'Easy Payments', description: 'Multiple payment options including UPI, cards, and wallet balance.', gradient: 'from-orange-500 to-neon-pink' },
              { icon: '📶', title: '1Gbps Internet', description: 'Fiber optic internet with <5ms ping for lag-free gaming.', gradient: 'from-neon-pink to-purple-500' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm`}></div>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-t-2xl`}></div>
                <div className="relative glass rounded-2xl p-8 border border-white/10 hover-lift">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-display font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-neon-blue/5 to-neon-pink/5"></div>
            <div className="relative z-10">
              <Trophy size={64} className="mx-auto mb-6 text-primary-400" />
              <h2 className="text-4xl font-display font-bold mb-4">
                Ready to Level Up?
              </h2>
              <p className="text-xl text-dark-800 mb-8">
                Join thousands of gamers already enjoying the ultimate gaming experience
              </p>
              <div className="flex justify-center">
                <Button size="xl" icon={Zap} iconPosition="left" onClick={handleBookClick}>
                  Start Playing Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-600/20 py-8">
        <div className="container mx-auto px-4 text-center text-dark-800">
          <p>&copy; 2024 Vortex Arena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
