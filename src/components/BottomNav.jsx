import React from 'react';
import { Home, BarChart3, Award } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'dashboard', label: 'Learn', icon: Home },
        { id: 'assessment', label: 'Assess', icon: BarChart3 },
        { id: 'stats', label: 'Stats', icon: Award }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-md mx-auto flex justify-around items-center py-2">
                {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center justify-center w-20 py-2 rounded-lg transition-all ${isActive
                                ? 'text-emerald-700'
                                : 'text-gray-900 hover:text-black'
                                }`}
                        >
                            <IconComponent className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''}`} />
                            <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                                {tab.label}
                            </span>
                            {isActive && (
                                <div className="w-1 h-1 bg-emerald-700 rounded-full mt-1" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
