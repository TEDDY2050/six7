import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Gamepad2, CalendarCheck, User, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CustomerLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { to: '/customer', icon: Home, label: 'Home', end: true },
        { to: '/customer/book', icon: Gamepad2, label: 'Book' },
        { to: '/customer/bookings', icon: CalendarCheck, label: 'Bookings' },
        { to: '/customer/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="min-h-screen bg-dark-50 pb-20 md:pb-0">
            {/* Top Header - Minimal, clean */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-dark-100/90 backdrop-blur-xl border-b border-dark-300">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-neon-blue flex items-center justify-center">
                            <Gamepad2 size={18} className="text-white" />
                        </div>
                        <span className="font-display font-bold text-lg tracking-wide">
                            GAME <span className="text-primary-400">ARENA</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-neon-blue flex items-center justify-center">
                                <span className="text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                            </div>
                            <span className="text-sm font-semibold text-dark-900">Hi, {user?.name?.split(' ')[0]}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-dark-300 text-dark-700 hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-14 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Nav - Mobile & Tablet */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-dark-100/95 backdrop-blur-xl border-t border-dark-300 md:hidden">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${isActive
                                    ? 'text-primary-400'
                                    : 'text-dark-700 hover:text-dark-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary-500/15' : ''}`}>
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-semibold">{label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Desktop Sidebar Navigation */}
            <nav className="hidden md:flex fixed left-0 top-14 bottom-0 w-20 bg-dark-100/80 backdrop-blur-xl border-r border-dark-300 flex-col items-center py-6 gap-2 z-30">
                {navItems.map(({ to, icon: Icon, label, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${isActive
                                ? 'text-primary-400 bg-primary-500/10'
                                : 'text-dark-700 hover:text-dark-900 hover:bg-dark-300'
                            }`
                        }
                    >
                        <Icon size={22} />
                        <span className="text-[10px] font-semibold">{label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default CustomerLayout;
