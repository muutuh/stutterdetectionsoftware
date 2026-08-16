import React, { useState } from 'react';
import {
    Settings as SettingsIcon,
    User,
    Target,
    Bell,
    Mic,
    Lock,
    Moon,
    HelpCircle,
    ChevronRight,
    LogOut,
    Trash2,
    Check
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Settings = ({ onRerunTour }) => {
    const { settings, updateSettings, resetSettings } = useSettings();
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'practice', label: 'Practice', icon: Target },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'audio', label: 'Audio', icon: Mic },
        { id: 'privacy', label: 'Privacy & Data', icon: Lock },
        { id: 'appearance', label: 'Appearance', icon: Moon },
        { id: 'help', label: 'Help', icon: HelpCircle },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return (
                    <div className="space-y-6">
                        <Section title="Profile Information">
                            <div className="grid gap-4">
                                <Input
                                    label="Display Name"
                                    value={settings.account_display_name}
                                    onChange={(e) => updateSettings('account_display_name', e.target.value)}
                                />
                            </div>
                        </Section>
                        <div className="pt-4 border-t border-gray-100">
                            <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                );
            case 'practice':
                return (
                    <div className="space-y-6">
                        <Section title="Goals & Difficulty">
                            <Select
                                label="Daily Goal"
                                value={settings.practice_daily_minutes}
                                onChange={(e) => updateSettings('practice_daily_minutes', Number(e.target.value))}
                                options={[
                                    { value: 5, label: '5 minutes' },
                                    { value: 10, label: '10 minutes' },
                                    { value: 15, label: '15 minutes' },
                                    { value: 20, label: '20 minutes' },
                                    { value: 30, label: '30 minutes' },
                                ]}
                            />
                            <Select
                                label="Difficulty Level"
                                value={settings.practice_level}
                                onChange={(e) => updateSettings('practice_level', e.target.value)}
                                options={[
                                    { value: 'Beginner', label: 'Beginner' },
                                    { value: 'Intermediate', label: 'Intermediate' },
                                    { value: 'Advanced', label: 'Advanced' },
                                ]}
                            />
                        </Section>
                        <Section title="Preferences">
                            <TimePicker
                                label="Preferred Practice Time"
                                value={settings.practice_preferred_time}
                                onChange={(e) => updateSettings('practice_preferred_time', e.target.value)}
                            />
                            <Toggle
                                label="Auto-advance exercises"
                                description="Automatically move to the next exercise when completed"
                                checked={settings.practice_auto_advance}
                                onChange={(v) => updateSettings('practice_auto_advance', v)}
                            />
                            <Toggle
                                label="Show technique tips"
                                description="Display tips during exercises"
                                checked={settings.practice_show_tips}
                                onChange={(v) => updateSettings('practice_show_tips', v)}
                            />
                            <div className="pt-4">
                                <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                                    Reset Today's Progress
                                </button>
                            </div>
                        </Section>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="space-y-6">
                        <Section title="General">
                            <Toggle
                                label="Enable Reminders"
                                checked={settings.notif_enabled}
                                onChange={(v) => updateSettings('notif_enabled', v)}
                            />
                        </Section>
                        {settings.notif_enabled && (
                            <Section title="Schedule">
                                <TimePicker
                                    label="Reminder Time"
                                    value={settings.notif_time}
                                    onChange={(e) => updateSettings('notif_time', e.target.value)}
                                />
                                <Select
                                    label="Frequency"
                                    value={settings.notif_frequency}
                                    onChange={(e) => updateSettings('notif_frequency', e.target.value)}
                                    options={[
                                        { value: 'Daily', label: 'Daily' },
                                        { value: 'Weekdays', label: 'Weekdays (Mon-Fri)' },
                                    ]}
                                />
                            </Section>
                        )}
                        <Section title="Channels">
                            <Toggle
                                label="Streak Reminders"
                                description="Get notified if you're about to break your streak"
                                checked={settings.notif_streak}
                                onChange={(v) => updateSettings('notif_streak', v)}
                            />
                            <Toggle
                                label="Email Notifications"
                                checked={settings.notif_email}
                                onChange={(v) => updateSettings('notif_email', v)}
                            />
                            <Toggle
                                label="Push Notifications"
                                checked={settings.notif_push}
                                onChange={(v) => updateSettings('notif_push', v)}
                            />
                        </Section>
                    </div>
                );
            case 'audio':
                return (
                    <div className="space-y-6">
                        <Section title="Recording">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900">Microphone Access</span>
                                    <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">Granted</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Manage permissions in browser settings</p>
                            </div>
                            <Toggle
                                label="Auto-save recordings"
                                description="Save practice sessions automatically"
                                checked={settings.audio_autosave}
                                onChange={(v) => updateSettings('audio_autosave', v)}
                            />
                            <Select
                                label="Recording Quality"
                                value={settings.audio_quality}
                                onChange={(e) => updateSettings('audio_quality', e.target.value)}
                                options={[
                                    { value: 'Standard', label: 'Standard' },
                                    { value: 'High', label: 'High (Larger files)' },
                                ]}
                            />
                        </Section>
                        <Section title="Playback">
                            <Select
                                label="Default Playback Speed"
                                value={settings.audio_playback_speed}
                                onChange={(e) => updateSettings('audio_playback_speed', e.target.value)}
                                options={[
                                    { value: '0.75x', label: '0.75x' },
                                    { value: '1x', label: '1x (Normal)' },
                                    { value: '1.25x', label: '1.25x' },
                                ]}
                            />
                        </Section>
                    </div>
                );
            case 'privacy':
                return (
                    <div className="space-y-6">
                        <Section title="Your Data">
                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left group">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Export Practice History</h4>
                                        <p className="text-sm text-gray-500">Download a CSV of your progress</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-red-200 hover:bg-red-50 transition-colors text-left group">
                                    <div>
                                        <h4 className="font-medium text-gray-900 group-hover:text-red-700">Delete All Recordings</h4>
                                        <p className="text-sm text-gray-500 group-hover:text-red-500">Permanently remove voice data</p>
                                    </div>
                                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                                </button>
                            </div>
                        </Section>
                        <Section title="Account">
                            <button
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                onClick={() => { if (confirm('Are you definitely sure? This is irreversible.')) alert('Account deletion requested.') }}
                            >
                                Delete Account Permanently
                            </button>
                        </Section>
                        <div className="flex gap-4 pt-4 border-t border-gray-100">
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
                        </div>
                    </div>
                );
            case 'appearance':
                return (
                    <div className="space-y-6">
                        <Section title="Theme">
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'light', label: 'Light', icon: Moon }, // Just using moon as placeholder, icon doesn't matter much here
                                    { id: 'dark', label: 'Dark', icon: Moon },
                                    { id: 'system', label: 'System', icon: Moon },
                                ].map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => updateSettings('appearance_theme', theme.id)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all gap-2 ${settings.appearance_theme === theme.id
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                            : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                                            }`}
                                    >
                                        <span className="text-sm font-medium capitalize">{theme.label}</span>
                                        {settings.appearance_theme === theme.id && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </Section>
                        <Section title="Accessibility">
                            <Toggle
                                label="Reduce Motion"
                                description="Minimize interface animations"
                                checked={settings.appearance_reduce_motion}
                                onChange={(v) => updateSettings('appearance_reduce_motion', v)}
                            />
                            <Select
                                label="Font Size"
                                value={settings.appearance_font_size}
                                onChange={(e) => updateSettings('appearance_font_size', e.target.value)}
                                options={[
                                    { value: 'Default', label: 'Default' },
                                    { value: 'Large', label: 'Large' },
                                ]}
                            />
                        </Section>
                    </div>
                );
            case 'help':
                return (
                    <div className="space-y-6">
                        <div className="grid gap-4">
                            <button className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors group">
                                <h4 className="font-medium text-gray-900 group-hover:text-emerald-700">Help Center & FAQ</h4>
                                <p className="text-sm text-gray-500">Guides, tutorials, and common questions</p>
                            </button>
                            <button className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors group">
                                <h4 className="font-medium text-gray-900 group-hover:text-emerald-700">Report a Bug</h4>
                                <p className="text-sm text-gray-500">Let us know if something isn't working</p>
                            </button>
                            <button
                                onClick={onRerunTour}
                                className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 transition-colors group"
                            >
                                <h4 className="font-medium text-gray-900 group-hover:text-emerald-700">Re-run Onboarding</h4>
                                <p className="text-sm text-gray-500">View the welcome tour again</p>
                            </button>
                        </div>
                        <div className="text-center pt-8 text-xs text-gray-400">
                            Version 1.0.2 (Build 202401)
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-100 rounded-lg">
                    <SettingsIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <nav className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-l-2 ${isActive
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Content Area */}
                <main className="flex-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[500px] p-6 lg:p-8">
                        <div className="max-w-2xl">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 capitalize">{tabs.find(t => t.id === activeTab)?.label}</h2>
                            {renderContent()}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// UI Components
const Section = ({ title, children }) => (
    <div className="mb-0">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{title}</h3>
        {children}
    </div>
);

const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-start justify-between py-3">
        <div>
            <label className="text-base font-medium text-gray-900">{label}</label>
            {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${checked ? 'bg-emerald-600' : 'bg-gray-200'
                }`}
            role="switch"
            aria-checked={checked}
        >
            <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    </div>
);

const Input = ({ label, value, onChange, readOnly, helper }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm ${readOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                }`}
        />
        {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
    </div>
);

const Select = ({ label, value, onChange, options }) => (
    <div className="py-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

const TimePicker = ({ label, value, onChange }) => (
    <div className="py-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type="time"
            value={value}
            onChange={onChange}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        />
    </div>
);

export default Settings;
