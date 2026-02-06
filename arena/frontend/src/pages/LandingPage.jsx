import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Monitor, 
  Users, 
  Clock, 
  Trophy, 
  Zap,
  ArrowRight,
  Check
} from 'lucide-react';
import Button from '../components/common/Button';

const LandingPage = () => {
  const features = [
    {
      icon: Gamepad2,
      title: 'Latest Games',
      description: 'Play the hottest AAA titles and indie games',
      color: 'primary',
    },
    {
      icon: Monitor,
      title: 'High-End Stations',
      description: 'RTX 4090, 240Hz monitors, gaming chairs',
      color: 'blue',
    },
    {
      icon: Clock,
      title: 'Flexible Hours',
      description: 'Book by hour or day, 24/7 access',
      color: 'green',
    },
    {
      icon: Users,
      title: 'Multiplayer Setup',
      description: 'LAN parties, tournaments, team events',
      color: 'orange',
    },
  ];

  const pricing = [
    {
      name: 'Casual',
      price: '₹100',
      period: 'per hour',
      features: [
        'Standard Gaming PC',
        '1080p Gaming',
        'Basic Peripherals',
        'WiFi Access',
      ],
    },
    {
      name: 'Pro',
      price: '₹200',
      period: 'per hour',
      popular: true,
      features: [
        'High-End Gaming PC',
        '1440p 144Hz Gaming',
        'Premium Peripherals',
        'Priority Support',
        'Free Refreshments',
      ],
    },
    {
      name: 'Elite',
      price: '₹300',
      period: 'per hour',
      features: [
        'Ultra Gaming Rig',
        '4K 240Hz Gaming',
        'Pro Equipment',
        'VIP Support',
        'Private Booth',
        'Unlimited Drinks',
      ],
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Gamers' },
    { value: '50+', label: 'Gaming Stations' },
    { value: '200+', label: 'Game Titles' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-tight">
                Welcome to <br />
                <span className="bg-gradient-to-r from-neon-blue via-primary-400 to-neon-pink bg-clip-text text-transparent">
                  NEXUS ARENA
                </span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                Experience next-level gaming with cutting-edge equipment, immersive environments, and a community of passionate gamers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button 
                    size="xl" 
                    className="bg-neon-blue hover:bg-neon-blue/80 text-dark-50 font-bold px-8"
                    icon={ArrowRight} 
                    iconPosition="right"
                  >
                    Book a Session
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="xl" 
                    variant="outline" 
                    className="border-2 border-white/20 hover:border-white/40 hover:bg-white/5"
                  >
                    Explore Games
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats with Icons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
            >
              <div className="glass rounded-2xl p-8 border border-primary-500/20">
                <Zap className="text-neon-blue mx-auto mb-4" size={40} />
                <h3 className="text-5xl font-display font-bold text-neon-blue mb-2">
                  50+
                </h3>
                <p className="text-gray-400 text-lg">Gaming Stations</p>
              </div>
              
              <div className="glass rounded-2xl p-8 border border-primary-500/20">
                <Users className="text-neon-pink mx-auto mb-4" size={40} />
                <h3 className="text-5xl font-display font-bold text-neon-pink mb-2">
                  10K+
                </h3>
                <p className="text-gray-400 text-lg">Happy Gamers</p>
              </div>
              
              <div className="glass rounded-2xl p-8 border border-primary-500/20">
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

      {/* Gaming Zones Section */}
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
              From casual gaming to competitive esports, we have the perfect setup for every gamer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* PC Gaming */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="glass rounded-2xl p-6 border border-neon-blue/20 hover:border-neon-blue/50 transition-all hover-lift relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-blue to-transparent"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-neon-blue/10 border border-neon-blue/20">
                  <Monitor className="text-neon-blue" size={28} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-neon-blue">₹100</p>
                  <p className="text-gray-400 text-sm">/hour</p>
                </div>
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">PC Gaming</h3>
              <p className="text-gray-400 mb-4">High-end RTX 4090 rigs with 240Hz monitors</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20">RTX 4090</span>
                <span className="text-xs px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20">240Hz</span>
                <span className="text-xs px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20">i9-14900K</span>
              </div>
            </motion.div>

            {/* Console Gaming */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-neon-pink/20 hover:border-neon-pink/50 transition-all hover-lift relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-pink to-transparent"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-neon-pink/10 border border-neon-pink/20">
                  <Gamepad2 className="text-neon-pink" size={28} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-neon-pink">₹80</p>
                  <p className="text-gray-400 text-sm">/hour</p>
                </div>
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Console Gaming</h3>
              <p className="text-gray-400 mb-4">PS5, Xbox Series X, Nintendo Switch</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-neon-pink/10 text-neon-pink border border-neon-pink/20">PS5</span>
                <span className="text-xs px-3 py-1 rounded-full bg-neon-pink/10 text-neon-pink border border-neon-pink/20">Xbox Series X</span>
                <span className="text-xs px-3 py-1 rounded-full bg-neon-pink/10 text-neon-pink border border-neon-pink/20">Switch</span>
              </div>
            </motion.div>

            {/* VR Experience */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 border border-neon-green/20 hover:border-neon-green/50 transition-all hover-lift relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-green to-transparent"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-neon-green/10 border border-neon-green/20">
                  <svg className="w-7 h-7 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path d="M8 12h8M12 8v8" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-neon-green">₹150</p>
                  <p className="text-gray-400 text-sm">/hour</p>
                </div>
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">VR Experience</h3>
              <p className="text-gray-400 mb-4">Meta Quest 3 & PSVR2 immersive gaming</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">Quest 3</span>
                <span className="text-xs px-3 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">PSVR2</span>
                <span className="text-xs px-3 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">Room-Scale</span>
              </div>
            </motion.div>

            {/* Racing Simulator */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 border border-orange-500/20 hover:border-orange-500/50 transition-all hover-lift relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-transparent"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <Zap className="text-orange-500" size={28} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-orange-500">₹200</p>
                  <p className="text-gray-400 text-sm">/hour</p>
                </div>
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Racing Simulator</h3>
              <p className="text-gray-400 mb-4">Full motion racing rigs with triple screens</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">Triple Screen</span>
                <span className="text-xs px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">Force Feedback</span>
              </div>
            </motion.div>

            {/* Esports Arena */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-all hover-lift relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <Trophy className="text-cyan-500" size={28} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-cyan-500">₹120</p>
                  <p className="text-gray-400 text-sm">/hour</p>
                </div>
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Esports Arena</h3>
              <p className="text-gray-400 mb-4">Tournament-ready setup for competitive play</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">360Hz</span>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">Pro Setup</span>
              </div>
            </motion.div>

            {/* Party Room */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all hover-lift relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-transparent"></div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Users className="text-purple-500" size={28} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-purple-500">₹1500</p>
                  <p className="text-gray-400 text-sm">/hour</p>
                </div>
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Party Room</h3>
              <p className="text-gray-400 mb-4">Private gaming room for groups of 10+</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">Private</span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">10+ Players</span>
              </div>
            </motion.div>
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
              {
                icon: '🛡️',
                title: 'Secure Environment',
                description: '24/7 security with CCTV monitoring and secure lockers for your belongings.',
                gradient: 'from-neon-blue to-cyan-500'
              },
              {
                icon: '🕐',
                title: 'Flexible Hours',
                description: 'Open 24/7 with convenient booking slots from 1 hour to full day sessions.',
                gradient: 'from-cyan-500 to-neon-green'
              },
              {
                icon: '🎧',
                title: 'Premium Equipment',
                description: 'Top-tier gaming peripherals from Razer, Logitech, and SteelSeries.',
                gradient: 'from-neon-green to-yellow-500'
              },
              {
                icon: '🏆',
                title: 'Weekly Tournaments',
                description: 'Compete in our weekly esports tournaments with cash prizes.',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: '💳',
                title: 'Easy Payments',
                description: 'Multiple payment options including UPI, cards, and wallet balance.',
                gradient: 'from-orange-500 to-neon-pink'
              },
              {
                icon: '📶',
                title: '1Gbps Internet',
                description: 'Fiber optic internet with <5ms ping for lag-free gaming.',
                gradient: 'from-neon-pink to-purple-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {/* Gradient Border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity blur-sm`}></div>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-t-2xl`}></div>
                
                {/* Content */}
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

      {/* Pricing Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-neon-blue/30 bg-neon-blue/10 backdrop-blur-sm mb-6">
              <span className="text-neon-blue font-semibold">Pricing Plans</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">
              Level Up Your <span className="bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">Experience</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose the plan that fits your gaming style. All plans include access to our premium gaming equipment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Casual Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="glass rounded-2xl p-8 border border-white/10 hover-lift relative"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">Casual</h3>
                <p className="text-gray-400 mb-4">Perfect for occasional gamers</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-display font-bold text-neon-blue">₹99</span>
                  <span className="text-gray-400">/hour</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Access to all PC stations',
                  'Basic peripherals included',
                  'Standard 144Hz monitors',
                  'Free drinks & snacks',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-neon-blue/20 flex items-center justify-center">
                      <Check size={14} className="text-neon-blue" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register">
                <Button fullWidth variant="outline" className="border-neon-blue/30 hover:bg-neon-blue/10">
                  Get Started
                </Button>
              </Link>
            </motion.div>

            {/* Pro Gamer Plan - Most Popular */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-8 border-2 border-neon-blue shadow-neon relative scale-105"
            >
              {/* Most Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-neon-blue to-neon-pink px-6 py-2 rounded-full text-sm font-bold shadow-neon">
                  ⭐ Most Popular
                </span>
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className="text-2xl font-display font-bold mb-2">Pro Gamer</h3>
                <p className="text-gray-400 mb-4">For dedicated gaming sessions</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-display font-bold text-gradient">₹799</span>
                  <span className="text-gray-400">/day</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'All Casual features',
                  'Premium 240Hz monitors',
                  'Priority station selection',
                  'VR sessions included',
                  'Tournament priority access',
                  'Dedicated gaming chair',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-neon-blue/20 flex items-center justify-center">
                      <Check size={14} className="text-neon-blue" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register">
                <Button fullWidth className="bg-gradient-to-r from-neon-blue to-neon-pink hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </motion.div>

            {/* Elite Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-8 border border-white/10 hover-lift relative"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">Elite</h3>
                <p className="text-gray-400 mb-4">Unlimited gaming experience</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-display font-bold text-neon-pink">₹4,999</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'All Pro Gamer features',
                  'Unlimited gaming hours',
                  'Private gaming room access',
                  'Free tournament entry',
                  'Exclusive merchandise',
                  'Bring 2 friends free/week',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-neon-pink/20 flex items-center justify-center">
                      <Check size={14} className="text-neon-pink" />
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register">
                <Button fullWidth variant="outline" className="border-neon-pink/30 hover:bg-neon-pink/10">
                  Get Started
                </Button>
              </Link>
            </motion.div>
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
            className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto"
          >
            <Trophy size={64} className="mx-auto mb-6 text-primary-400" />
            <h2 className="text-4xl font-display font-bold mb-4">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-dark-800 mb-8">
              Join thousands of gamers already enjoying the ultimate gaming experience
            </p>
            <Link to="/register">
              <Button size="xl" icon={Zap} iconPosition="left">
                Start Playing Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-600/20 py-8">
        <div className="container mx-auto px-4 text-center text-dark-800">
          <p>&copy; 2024 Game Arena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
