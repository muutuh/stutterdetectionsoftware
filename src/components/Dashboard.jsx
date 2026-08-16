import React from 'react';
import { CheckCircle, Flame, Award, Target, TrendingUp } from 'lucide-react';

const Dashboard = ({ onCardClick, practiceCards, xpToday, dailyTargetXP, streak, improvementPct }) => {
    return (
        <div className="py-8">
            {/* Stats Summary Strip */}
            <div id="dashboard-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Daily Goal */}
                <div className="bg-emerald-600 text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center">
                    <div className="flex justify-center mb-3">
                        <Target className="w-10 h-10 opacity-90" />
                    </div>
                    <p className="text-sm font-semibold mb-2">Daily Goal</p>
                    <div className="flex items-baseline gap-2 justify-center mb-4">
                        <span className="text-4xl font-bold">{xpToday}</span>
                        <span className="text-lg font-medium">/ {dailyTargetXP} XP</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2.5">
                        <div
                            className="bg-white h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, dailyTargetXP > 0 ? (xpToday / dailyTargetXP) * 100 : 0)}%` }}
                        />
                    </div>
                </div>

                {/* Streak */}
                <div className="bg-orange-500 text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center">
                    <div className="flex justify-center mb-3">
                        <Flame className="w-10 h-10" />
                    </div>
                    <p className="text-sm font-semibold mb-2">Current Streak</p>
                    <div className="flex items-baseline gap-2 justify-center mb-3">
                        <span className="text-4xl font-bold">{streak}</span>
                        <span className="text-lg font-medium">Days</span>
                    </div>
                    <p className="text-sm font-medium">{streak > 0 ? 'Keep it up!' : 'Start your streak today!'}</p>
                </div>

                {/* Progress */}
                <div className="bg-purple-500 text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center">
                    <div className="flex justify-center mb-3">
                        <TrendingUp className="w-10 h-10" />
                    </div>
                    <p className="text-sm font-semibold mb-2">Overall Progress</p>
                    <div className="flex items-baseline gap-2 justify-center mb-3">
                        <span className="text-4xl font-bold">{improvementPct}%</span>
                        <span className="text-lg font-medium">Better</span>
                    </div>
                    <p className="text-sm font-medium">{improvementPct > 0 ? 'Great improvement!' : 'Start practicing!'}</p>
                </div>
            </div>

            {/* Practice Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 id="dashboard-practices-title" className="text-2xl font-bold text-gray-900">Today's Practice</h2>
                    <span className="text-sm text-gray-500">
                        {practiceCards.filter(c => c.completed).length} of {practiceCards.length} completed
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {practiceCards.map((card, index) => (
                        <div
                            id={index === 0 ? 'dashboard-first-card' : undefined}
                            key={card.id}
                            onClick={() => onCardClick(card)}
                            style={{ minHeight: 'clamp(200px, 15vh, 280px)' }}
                            className={`bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group cursor-pointer border border-gray-100 flex flex-col justify-between p-6 xl:p-8 ${card.completed ? 'opacity-90 grayscale-[0.3]' : ''}`}
                        >
                            {!card.completed && (
                                <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                            )}

                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50/50 flex items-center justify-center group-hover:bg-white/80 transition-colors">
                                    <span className="text-4xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">
                                        {card.icon}
                                    </span>
                                </div>
                                <div>
                                    {card.completed ? (
                                        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wide">Done</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shadow-sm">
                                            <Award className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wide">{card.xp} XP</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center flex-grow flex flex-col justify-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{card.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
                            </div>

                            <div className="mt-auto">
                                <button className={`w-full px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                                    card.completed
                                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg'
                                }`}>
                                    {card.completed ? 'Completed' : 'Start Exercise'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
