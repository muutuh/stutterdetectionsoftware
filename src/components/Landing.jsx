import React from 'react';
import { Mic } from 'lucide-react';
import featureAssessment from '../assets/feature_assessment.png';
import featureProgress from '../assets/feature_progress.png';
import featureStats from '../assets/feature_stats.png';

const Landing = ({ onStart }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            {/* Centered Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 max-w-5xl w-full">
                {/* Welcome Text */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-emerald-600">Welcome to Clarity</h1>
                    <p className="text-base md:text-lg text-gray-900 leading-relaxed max-w-2xl mx-auto">
                        Your personal stuttering therapy companion. Practice daily exercises,
                        track your progress, and build confidence in your speech journey.
                    </p>
                </div>

                {/* Features with Images */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {/* Assessment Feature */}
                    <div className="text-center">
                        <div className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-md overflow-hidden">
                            <img
                                src={featureAssessment}
                                alt="Free Speech Assessment"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Personalized Assessment</h3>
                        <p className="text-sm text-gray-900">
                            Begin with a free speech assessment to understand your baseline and create a customized therapy plan
                        </p>
                    </div>

                    {/* Progress Feature */}
                    <div className="text-center">
                        <div className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-md overflow-hidden">
                            <img
                                src={featureProgress}
                                alt="Track Your Progress"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Track Your Journey</h3>
                        <p className="text-sm text-gray-900">
                            Monitor your improvement with detailed progress charts, streaks, and achievement milestones
                        </p>
                    </div>

                    {/* Stats Feature */}
                    <div className="text-center">
                        <div className="bg-gray-50 rounded-2xl p-4 mb-4 shadow-md overflow-hidden">
                            <img
                                src={featureStats}
                                alt="Daily Exercises"
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Daily Practice</h3>
                        <p className="text-sm text-gray-900">
                            Access engaging exercises designed by speech therapists to improve fluency and build confidence
                        </p>
                    </div>
                </div>

                {/* Single Get Started Button */}
                <div className="flex justify-center">
                    <button
                        onClick={onStart}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 md:py-4 md:px-16 rounded-xl shadow-lg transition-all transform hover:scale-105 hover:shadow-xl w-full md:w-auto"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
