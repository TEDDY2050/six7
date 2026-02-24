import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Gamepad2 } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-dark-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-neon-blue/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center max-w-md"
            >
                <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="mb-6"
                >
                    <Gamepad2 size={80} className="mx-auto text-primary-500/30" />
                </motion.div>

                <h1 className="text-8xl font-display font-black text-gradient mb-4">404</h1>
                <h2 className="text-2xl font-display font-bold mb-3">Game Over</h2>
                <p className="text-dark-700 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/">
                        <Button icon={Home} iconPosition="left">
                            Back to Home
                        </Button>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-5 py-2.5 border border-dark-400 rounded-xl text-sm font-semibold text-dark-800 hover:bg-dark-300 transition-all flex items-center gap-2 justify-center"
                    >
                        <ArrowLeft size={16} /> Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
