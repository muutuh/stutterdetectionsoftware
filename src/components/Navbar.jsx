import React, { useState } from 'react';
import { Home, BarChart3, Award, User, LogOut, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
const Navbar = ({ activeTab, onTabChange, onRerunTour, onLogout }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { settings } = useSettings();
    const displayName = settings.account_display_name || 'User';

    const navLinks = [
        { id: 'dashboard', label: 'Learn', icon: Home },
        { id: 'assessment', label: 'Assessment', icon: BarChart3 },
        { id: 'statistics', label: 'Statistics', icon: Award }
    ];

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand/Logo - Left */}
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-emerald-600">Clarity</h1>
                    </div>

                    {/* Navigation Links - Center */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const IconComponent = link.icon;
                            const isActive = activeTab === link.id;

                            return (
                                <button
                                    key={link.id}
                                    onClick={() => onTabChange(link.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive
                                        ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-600 font-bold'
                                        : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50 border-b-2 border-transparent'
                                        }`}
                                >
                                    <IconComponent className="w-5 h-5" />
                                    <span>{link.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* User Profile Dropdown - Right */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            aria-label="User menu"
                            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="bg-emerald-100 rounded-full p-2">
                                <User className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="font-semibold text-gray-900 text-sm">{displayName}</p>
                                <p className="text-xs text-gray-500">Member</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-900 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="font-semibold text-gray-900">{displayName}</p>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-900 hover:bg-red-50 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                                <button
                                    onClick={() => {
                                        onTabChange('settings');
                                        setShowUserMenu(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    <SettingsIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">Settings</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Restart onboarding tour?')) {
                                            onRerunTour();
                                            setShowUserMenu(false);
                                        }
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-900 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border-t border-gray-100"
                                >
                                    <span className="text-sm font-medium">Re-run Tour</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden pb-4">
                    <div className="flex justify-around">
                        {navLinks.map((link) => {
                            const IconComponent = link.icon;
                            const isActive = activeTab === link.id;

                            return (
                                <button
                                    key={link.id}
                                    onClick={() => onTabChange(link.id)}
                                    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${isActive ? 'text-emerald-700' : 'text-gray-900'
                                        }`}
                                >
                                    <IconComponent className="w-5 h-5 mb-1" />
                                    <span className="text-xs font-medium">{link.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
