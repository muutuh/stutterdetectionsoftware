// Progress tracking — XP, streak, sessions stored in localStorage.
// Swap the localStorage calls here for Supabase upserts when auth is ready.

import { useState } from 'react';

const KEY = 'clarity_progress';

const todayStr = () => new Date().toISOString().slice(0, 10);

const yesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
};

const defaults = {
    xpTotal: 0,
    sessions: 0,
    streak: 0,
    lastPracticeDate: null,
    dailyXP: {},           // { 'YYYY-MM-DD': number }
    dailyCompleted: {},    // { 'YYYY-MM-DD': number[] } — exercise IDs completed each day
};

function load() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
    } catch {
        return { ...defaults };
    }
}

function persist(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function useProgress() {
    const [progress, setProgress] = useState(load);

    const addXP = (amount, exerciseId) => {
        setProgress(prev => {
            const today = todayStr();
            const yesterday = yesterdayStr();

            const dailyXP = { ...prev.dailyXP, [today]: (prev.dailyXP[today] || 0) + amount };

            // Streak: +1 if last practice was yesterday, reset to 1 if gap, keep if same day
            let streak = prev.streak;
            if (prev.lastPracticeDate !== today) {
                streak = prev.lastPracticeDate === yesterday ? streak + 1 : 1;
            }

            // Track completed exercise IDs per day
            const todayDone = prev.dailyCompleted[today] || [];
            const dailyCompleted = {
                ...prev.dailyCompleted,
                [today]: todayDone.includes(exerciseId) ? todayDone : [...todayDone, exerciseId],
            };

            const next = {
                ...prev,
                xpTotal: prev.xpTotal + amount,
                sessions: prev.sessions + 1,
                lastPracticeDate: today,
                streak,
                dailyXP,
                dailyCompleted,
            };
            persist(next);
            return next;
        });
    };

    const xpToday = progress.dailyXP[todayStr()] || 0;
    const completedToday = progress.dailyCompleted[todayStr()] || [];

    // Simple improvement %: caps at 100, grows with total XP
    const improvementPct = Math.min(100, Math.round((progress.xpTotal / 2000) * 100));

    return { progress, xpToday, completedToday, improvementPct, addXP };
}
