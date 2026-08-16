import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

const TOUR_STEPS = [
    {
        targetId: 'dashboard-practices-title',
        title: "Your Daily Plan",
        content: "This is your personalized practice schedule. We curate exercises for you daily.",
        position: 'bottom'
    },
    {
        targetId: 'dashboard-first-card',
        title: "Practice Cards",
        content: "Each card is a bite-sized exercise. Some involve reading, others are real-world missions. Tap to start!",
        position: 'right'
    },
    {
        targetId: 'dashboard-stats',
        title: "Track Progress",
        content: "Keep your streak alive and watch your XP grow. Consistency is key!",
        position: 'top'
    }
    // Profile/Settings is in Navbar, might be hard to highlight if not in Dashboard. 
    // We'll skip Navbar highlighting for simplicity or add it if strictly needed.
];

const DashboardTour = ({ onFinish, onSkip }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [style, setStyle] = useState({});

    const step = TOUR_STEPS[currentStep];

    useEffect(() => {
        const updatePosition = () => {
            const element = document.getElementById(step.targetId);
            if (element) {
                const rect = element.getBoundingClientRect();
                const padding = 8;

                // Highlight Box Style
                const highlight = {
                    top: rect.top - padding + window.scrollY,
                    left: rect.left - padding + window.scrollX,
                    width: rect.width + (padding * 2),
                    height: rect.height + (padding * 2),
                };

                setStyle(highlight);

                // Scroll to element if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, [currentStep, step.targetId]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onFinish();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Dark Overlay with cutout */}
            <div className="absolute inset-0 bg-black/50 transition-all duration-300" style={{
                clipPath: `polygon(
                    0% 0%, 
                    0% 100%, 
                    ${style.left}px 100%, 
                    ${style.left}px ${style.top}px, 
                    ${style.left + style.width}px ${style.top}px, 
                    ${style.left + style.width}px ${style.top + style.height}px, 
                    ${style.left}px ${style.top + style.height}px, 
                    ${style.left}px 100%, 
                    100% 100%, 
                    100% 0%
                )`
            }}></div>

            {/* Highlight Border */}
            <div
                className="absolute border-2 border-emerald-500 rounded-xl transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                style={{
                    top: style.top,
                    left: style.left,
                    width: style.width,
                    height: style.height,
                }}
            />

            {/* Tooltip Card */}
            <div
                className="absolute bg-white p-6 rounded-2xl shadow-xl w-80 pointer-events-auto transition-all duration-300"
                style={{
                    top: style.top + style.height + 20, // Simple positioning below for now
                    left: Math.max(20, Math.min(window.innerWidth - 340, style.left)), // Keep within bounds
                }}
            >
                <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg text-gray-900">{step.title}</h4>
                    <button onClick={onSkip} className="text-gray-400 hover:text-gray-600 text-sm font-medium">
                        Skip
                    </button>
                </div>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{step.content}</p>

                <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                        {TOUR_STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i === currentStep ? 'bg-emerald-600' : 'bg-gray-200'}`}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {currentStep > 0 && (
                            <button onClick={handleBack} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 text-sm"
                        >
                            {currentStep === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTour;
