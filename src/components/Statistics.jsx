import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Trophy, Flame, Target, TrendingUp, Calendar } from 'lucide-react';

const todayStr = () => new Date().toISOString().slice(0, 10);

const getLast7Days = (dailyXP = {}) => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days.push({
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            xp: dailyXP[key] || 0,
        });
    }
    return days;
};

const Statistics = ({ progress = {}, xpToday = 0, improvementPct = 0 }) => {
    const { xpTotal = 0, sessions = 0, streak = 0, dailyXP = {}, dailyCompleted = {} } = progress;

    const weekData = getLast7Days(dailyXP);

    const totalCompletedThisWeek = Object.entries(dailyCompleted)
        .filter(([date]) => {
            const d = new Date(date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return d >= weekAgo;
        })
        .reduce((sum, [, ids]) => sum + ids.length, 0);

    const achievements = [
        { id: 1, title: '7 Day Streak',   icon: Flame,      color: 'orange',  unlocked: streak >= 7 },
        { id: 2, title: 'First Session',  icon: Trophy,     color: 'yellow',  unlocked: sessions >= 1 },
        { id: 3, title: '10 Sessions',    icon: Target,     color: 'emerald', unlocked: sessions >= 10 },
        { id: 4, title: '100 XP',         icon: Award,      color: 'purple',  unlocked: xpTotal >= 100 },
        { id: 5, title: 'Perfect Week',   icon: Calendar,   color: 'blue',    unlocked: totalCompletedThisWeek >= 7 },
        { id: 6, title: '25% Better',     icon: TrendingUp, color: 'green',   unlocked: improvementPct >= 25 },
    ];

    const colorClasses = {
        orange:  { bg: 'bg-orange-100',  border: 'border-orange-200',  text: 'text-orange-700' },
        yellow:  { bg: 'bg-yellow-100',  border: 'border-yellow-200',  text: 'text-yellow-700' },
        emerald: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700' },
        purple:  { bg: 'bg-purple-100',  border: 'border-purple-200',  text: 'text-purple-700' },
        blue:    { bg: 'bg-blue-100',    border: 'border-blue-200',    text: 'text-blue-700' },
        green:   { bg: 'bg-green-100',   border: 'border-green-200',   text: 'text-green-700' },
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
                    <p className="text-gray-500">Track your journey to fluent speech</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow text-center">
                        <p className="text-sm text-gray-900 mb-1 font-medium">Total Sessions</p>
                        <p className="text-4xl font-bold text-gray-900">{sessions}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow text-center">
                        <p className="text-sm text-gray-900 mb-1 font-medium">Total XP</p>
                        <p className="text-4xl font-bold text-amber-700">{xpTotal.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow text-center">
                        <p className="text-sm text-gray-900 mb-1 font-medium">Current Streak</p>
                        <p className="text-4xl font-bold text-orange-700">{streak} {streak === 1 ? 'day' : 'days'}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow text-center">
                        <p className="text-sm text-gray-900 mb-1 font-medium">Improvement</p>
                        <p className="text-4xl font-bold text-emerald-700">{improvementPct}%</p>
                    </div>
                </div>

                {/* Chart + Achievements */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">XP Earned This Week</h3>
                        <p className="text-sm text-gray-500 mb-6">Daily XP from completed exercises</p>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={weekData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="day" stroke="#111827" style={{ fontSize: '14px' }} />
                                <YAxis stroke="#111827" style={{ fontSize: '14px' }} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', padding: '12px' }}
                                    formatter={(v) => [`${v} XP`, 'XP Earned']}
                                />
                                <Line type="monotone" dataKey="xp" stroke="#10b981" strokeWidth={4} dot={{ fill: '#10b981', r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Achievements</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {achievements.map((a) => {
                                const Icon = a.icon;
                                const c = colorClasses[a.color];
                                return (
                                    <div
                                        key={a.id}
                                        className={`rounded-xl p-4 border-2 transition-all cursor-pointer hover:scale-105 ${
                                            a.unlocked ? `${c.border} ${c.bg}` : 'border-gray-300 bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className={`p-3 rounded-full ${a.unlocked ? c.bg : 'bg-gray-200'}`}>
                                                <Icon className={`w-6 h-6 ${a.unlocked ? c.text : 'text-gray-400'}`} />
                                            </div>
                                            <p className={`text-xs font-semibold ${a.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {a.title}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
