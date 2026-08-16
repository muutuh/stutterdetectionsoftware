import React, { createContext, useContext, useState } from 'react';

const defaultSettings = {
  account_display_name: '',
  practice_daily_minutes: 15,
  practice_level: 'Beginner',
  practice_preferred_time: '08:00',
  practice_auto_advance: false,
  practice_show_tips: true,
  notif_enabled: true,
  notif_time: '09:00',
  notif_frequency: 'Daily',
  notif_streak: true,
  notif_email: false,
  notif_push: true,
  audio_autosave: false,
  audio_quality: 'Standard',
  audio_playback_speed: '1x',
  appearance_theme: 'light',
  appearance_reduce_motion: false,
  appearance_font_size: 'Default',
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('appSettings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const updateSettings = (key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('appSettings', JSON.stringify(next));
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('appSettings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
