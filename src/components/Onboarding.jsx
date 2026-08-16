import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Clock, Calendar, Mic, X } from 'lucide-react';
import DashboardTour from './DashboardTour';
import Dashboard from './Dashboard';

const UserOnboarding = ({ status, setStatus, onComplete, onSkip, practiceCards, onCardClick, selectedExercise }) => {
    // Local state for steps inside the onboarding view
    const [step, setStep] = useState(1);

    // Preferences State
    const [preferences, setPreferences] = useState({
        goals: [],
        experience: '',
        dailyMinutes: 10,
        micGranted: false
    });

    // Step 1: Welcome
    const renderWelcome = () => (
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome aboard!</h2>
            <p className="text-gray-600 mb-8 text-lg">
                In just a few minutes, we'll customize your plan and show you how to practice effectively.
            </p>
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => setStep(2)}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all text-lg"
                >
                    Start Tour
                </button>
                <button onClick={onSkip} className="text-gray-400 font-medium hover:text-gray-600">
                    Skip for now
                </button>
            </div>
        </div>
    );

    // Step 2: Goals & Experience
    const renderGoals = () => (
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">What's your main goal?</h2>
                <button onClick={onSkip} className="text-sm text-gray-400 hover:text-gray-600">Skip</button>
            </div>

            <div className="space-y-4 mb-8">
                {['Reduce tension', 'Speak confidently', 'Stop avoiding words', 'All of the above'].map(goal => (
                    <button
                        key={goal}
                        onClick={() => setPreferences({ ...preferences, goals: [goal] })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${preferences.goals.includes(goal)
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                            : 'border-gray-100 hover:border-emerald-200'
                            }`}
                    >
                        <span className="font-medium">{goal}</span>
                        {preferences.goals.includes(goal) && <Check className="w-5 h-5 text-emerald-600" />}
                    </button>
                ))}
            </div>

            <div className="border-t border-gray-100 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Speech Therapy Experience</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['New', 'Some', 'Pro'].map(exp => (
                        <button
                            key={exp}
                            onClick={() => setPreferences({ ...preferences, experience: exp })}
                            className={`p-3 rounded-xl border text-center text-sm font-medium transition-all ${preferences.experience === exp
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                                }`}
                        >
                            {exp}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end mt-8">
                <button
                    onClick={() => setStep(3)}
                    disabled={preferences.goals.length === 0}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    // Step 3: Time & Mic
    const renderSetup = () => (
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Setup Routine</h2>
                <button onClick={onSkip} className="text-sm text-gray-400 hover:text-gray-600">Skip</button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Daily Goal
                    </label>
                    <div className="space-y-3">
                        {[5, 10, 15].map(min => (
                            <button
                                key={min}
                                onClick={() => setPreferences({ ...preferences, dailyMinutes: min })}
                                className={`w-full p-3 rounded-lg border text-left flex justify-between ${preferences.dailyMinutes === min
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-gray-200'
                                    }`}
                            >
                                <span>{min} min / day</span>
                                {preferences.dailyMinutes === min && <Check className="w-4 h-4 text-emerald-600" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Mic className="w-4 h-4" /> Microphone
                    </label>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 h-full flex flex-col justify-between">
                        <p className="text-xs text-gray-600 mb-4">
                            We use your mic to let you record and review your speech. Audio stays on your device.
                        </p>
                        <button
                            onClick={() => {
                                // Request Mic
                                navigator.mediaDevices.getUserMedia({ audio: true })
                                    .then(() => setPreferences({ ...preferences, micGranted: true }))
                                    .catch(() => alert('Microphone access denied. You can enable it later.'));
                            }}
                            className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${preferences.micGranted
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                        >
                            {preferences.micGranted ? 'Access Granted' : 'Enable Microphone'}
                        </button>
                        {!preferences.micGranted && (
                            <button onClick={() => setStep(4)} className="text-xs text-gray-400 mt-2 text-center w-full hover:underline">
                                Not now
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                <button onClick={() => setStep(2)} className="text-gray-500 font-medium">Back</button>
                <button
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700"
                >
                    Start Tour <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    // Step 4: Tour (Wraps Dashboard)
    if (step === 4) {
        return (
            <>
                <Dashboard practiceCards={practiceCards} onCardClick={() => { }} />
                <DashboardTour
                    onFinish={() => setStep(5)}
                    onSkip={() => setStep(5)}
                />
            </>
        );
    }

    // Step 5: Guided Exercise (Simulated or Real)
    if (step === 5) {
        // Should auto-open Reading exercise
        // We reuse Dashboard but trigger the card click logic via generic handler or just simulate it.
        // Actually, since UserOnboarding controls the view, we can just force the modal open.
        // But ExerciseModal is in App.jsx... hmmm. 
        // Strategy: Show Dashboard, and highlight the specific card?
        // Or tell App to open the modal? 
        // Since 'selectedExercise' is passed from App, we can't 'set' it here easily unless we passed 'setSelectedExercise'.
        // Wait, the plan says "First exercise (Reading) opens automatically". 
        // I'll cheat: I'll render the ExerciseModal *here* inside UserOnboarding if I can, or instruct user to click it?
        // Better: Show instructions "Tap the Reading card" with a highlight?
        // Or: call onCardClick with the specific card?

        // Let's Find the Reading card
        const readingCard = practiceCards.find(c => c.title === 'Reading');

        return (
            <div className="relative">
                <Dashboard practiceCards={practiceCards} onCardClick={(card) => {
                    if (card.title === 'Reading') {
                        onCardClick(card); // Open it
                        setStep(6); // Move to tracking/post-exercise
                    }
                }} />

                {/* Instruction Overlay */}
                <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Let's try one!</h3>
                        <p className="text-gray-600 mb-6">
                            Tap the <strong>Reading</strong> card to start a quick 30-second practice.
                        </p>
                        <button
                            onClick={() => {
                                if (readingCard) {
                                    onCardClick(readingCard);
                                    setStep(6);
                                }
                            }}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold w-full"
                        >
                            Open "Reading"
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Step 6: Tracking/WrapUp
    // Note: App.jsx handles the modal. When modal closes, we are back here.
    // So 'step 6' will show *after* the modal closes?
    // Wait, if I call onCardClick, App opens the modal. `UserOnboarding` needs to stay mounted underneath?
    // Yes. `UserOnboarding` renders `Dashboard`.
    // BUT `App.jsx` renders `ExerciseModal` *outside* `UserOnboarding`.
    // So when modal is open, `UserOnboarding` is still there in background.
    // When modal closes, `UserOnboarding` is still there. 
    // I need to detect when the exercise is *completed*. passed via prop?
    // Or just assume when they come back?

    // For now, let's make Step 6 the "You did it!" screen.
    const renderWrapUp = () => (
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">You're all set!</h2>
            <p className="text-gray-600 mb-8">
                You've completed your first step. Aim for one green checkmark every day to see real progress.
            </p>
            <div className="bg-gray-50 p-4 rounded-xl mb-8 text-left">
                <h4 className="font-bold text-gray-900 text-sm mb-2">My Daily Plan:</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" /> {preferences.dailyMinutes} mins/day
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Mic className="w-4 h-4" /> {preferences.micGranted ? 'Recording Enabled' : 'No Recording'}
                </div>
            </div>
            <button
                onClick={onComplete}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all text-lg"
            >
                Go to Dashboard
            </button>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {step === 1 && renderWelcome()}
            {step === 2 && renderGoals()}
            {step === 3 && renderSetup()}
            {step === 6 && renderWrapUp()}
        </div>
    );
};

export default UserOnboarding;
