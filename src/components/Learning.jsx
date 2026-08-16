import React, { useState, useRef, useEffect } from 'react';
import { Mic, StopCircle, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../config/supabase';

const Learning = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [stepResults, setStepResults] = useState([null, null, null]);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    const steps = [
        {
            title: 'Free Speech',
            instruction: 'Tell us about your day for up to 30 seconds',
            example: 'Example: "Today I woke up early and had breakfast with my family. We talked about our plans for the weekend..."',
            mockResult: { fluency: 85, confidence: 78 }
        },
        {
            title: 'Reading',
            instruction: 'Read the passage displayed below',
            example: '"The quick brown fox jumps over the lazy dog. Peter Piper picked a peck of pickled peppers."',
            mockResult: { fluency: 92, confidence: 88 }
        },
        {
            title: 'Questions',
            instruction: 'Answer: What is your favorite hobby?',
            example: 'Example: "My favorite hobby is playing basketball because it helps me stay active and make friends."',
            mockResult: { fluency: 88, confidence: 82 }
        }
    ];

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
            }
        };
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = handleRecordingStop;

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => {
                    if (prev >= 30) {
                        stopRecording();
                        return 30;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please allow permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const handleRecordingStop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToBackend(audioBlob);
    };

    const sendAudioToBackend = async (audioBlob) => {
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('mode', 'percentage');

        try {
            const { data, error } = await supabase.functions.invoke('stutter-analyze', { body: formData });

            if (error) {
                throw error;
            }

            // Map backend data to frontend model
            // Backend returns 'stutter_percentage' (0-100), we act as if 100 - p is fluency
            const fluency = Math.max(0, 100 - (data.stutter_percentage || 0));

            // Calculate pseudo-confidence if not provided directly
            // We can take the average probability of non-stutter segments as a proxy or just mock it for now
            // The backend returns standard stutter analysis. Let's assume confidence is related to distinctness of speech?
            // For now, let's map 'confidence' if available, otherwise high confidence for low stutter
            let confidence = 85;
            if (fluency < 50) confidence = 60;
            if (fluency > 90) confidence = 95;

            const result = {
                fluency: Math.round(fluency),
                confidence: confidence
            };

            const newResults = [...stepResults];
            newResults[currentStep] = result;
            setStepResults(newResults);

        } catch (error) {
            console.error("Error uploading audio:", error);
            alert("Failed to analyze audio. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRecordToggle = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            setIsRecording(false);
            setRecordingTime(0);
            setStepResults(prev => {
                const newRes = [...prev];
                // Reset result for next step if re-doing? 
                // Or keep it if we want to allow going back without losing data?
                // The prompt implies sequential flow.
                return newRes;
            });
        } else {
            onComplete();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full">
                {/* Compact Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm mb-1 transition-all relative ${idx <= currentStep
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-200 text-gray-900'
                                        }`}
                                >
                                    {stepResults[idx] ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        idx + 1
                                    )}
                                </div>
                                <span
                                    className={`text-xs font-medium ${idx === currentStep ? 'text-emerald-700' : 'text-gray-900'
                                        }`}
                                >
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Column - Instructions & Recording */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {steps[currentStep].title}
                                </h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    {steps[currentStep].instruction}
                                </p>

                                {/* Example */}
                                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 mb-4">
                                    <p className="text-xs font-semibold text-emerald-800 mb-1">Example:</p>
                                    <p className="text-xs text-gray-900 italic">
                                        {steps[currentStep].example}
                                    </p>
                                </div>
                            </div>

                            {/* Recording Button - Smaller */}
                            <div className="text-center">
                                {/* Recording Visualizer */}
                                {isRecording && (
                                    <div className="flex flex-col items-center mb-3">
                                        <div className="text-2xl font-mono font-bold text-emerald-600 mb-2">
                                            00:{recordingTime.toString().padStart(2, '0')} / 00:30
                                        </div>
                                        <div className="flex justify-center items-center gap-2">
                                            {[...Array(7)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="w-2 bg-emerald-500 rounded-full animate-pulse"
                                                    style={{
                                                        height: `${Math.random() * 30 + 15}px`,
                                                        animationDelay: `${i * 0.1}s`,
                                                        animationDuration: '0.6s'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleRecordToggle}
                                    disabled={isAnalyzing}
                                    className={`rounded-full p-6 shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isRecording
                                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                        }`}
                                >
                                    {isAnalyzing ? (
                                        <Loader className="w-12 h-12 text-white animate-spin" />
                                    ) : isRecording ? (
                                        <StopCircle className="w-12 h-12 text-white" />
                                    ) : (
                                        <Mic className="w-12 h-12 text-white" />
                                    )}
                                </button>
                                <p className="text-xs text-gray-900 font-medium mt-2">
                                    {isAnalyzing
                                        ? 'Analyzing audio...'
                                        : isRecording
                                            ? 'Recording... Tap to stop'
                                            : 'Click to start recording'}
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Results */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Assessment Results</h3>

                            {isAnalyzing ? (
                                <div className="h-full flex flex-col items-center justify-center py-10 opacity-70">
                                    <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                                    <p className="text-sm text-gray-500">Processing your speech...</p>
                                </div>
                            ) : stepResults[currentStep] ? (
                                <div className="space-y-4">
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold text-gray-900">Fluency Score</span>
                                            <span className="text-2xl font-bold text-emerald-700">
                                                {stepResults[currentStep].fluency}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-emerald-600 h-2 rounded-full transition-all"
                                                style={{ width: `${stepResults[currentStep].fluency}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-semibold text-gray-900">Confidence Level</span>
                                            <span className="text-2xl font-bold text-blue-600">
                                                {stepResults[currentStep].confidence}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all"
                                                style={{ width: `${stepResults[currentStep].confidence}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckCircle className="w-4 h-4 text-emerald-700" />
                                            <span className="text-xs font-semibold text-emerald-800">
                                                {stepResults[currentStep].fluency > 80 ? "Great job!" : "Keep practicing"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-900">
                                            {stepResults[currentStep].fluency > 80
                                                ? "You're showing good progress. Keep practicing to maintain your fluency."
                                                : "Try speaking a bit slower to improve your fluency score."}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                                        <Mic className="w-8 h-8 text-gray-900" />
                                    </div>
                                    <p className="text-sm text-gray-900">
                                        Complete the recording to see your results
                                    </p>
                                </div>
                            )}

                            {/* Overall Progress */}
                            {stepResults.some(r => r !== null) && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs font-semibold text-gray-900 mb-2">
                                        Steps Completed: {stepResults.filter(r => r !== null).length} / {steps.length}
                                    </p>
                                    <div className="flex gap-1">
                                        {stepResults.map((result, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex-1 h-1.5 rounded-full ${result ? 'bg-emerald-600' : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 mt-6">
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                disabled={isRecording || isAnalyzing}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl transition-all text-sm disabled:opacity-50"
                            >
                                Previous
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={isRecording || isAnalyzing || !stepResults[currentStep]}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all hover:shadow-xl text-sm disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                        >
                            {currentStep < steps.length - 1 ? 'Next Step' : 'Complete Assessment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Learning;
