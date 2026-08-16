import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, CheckCircle, ArrowRight, Play, Pause, StopCircle, Loader, Sparkles } from 'lucide-react';
import { generateReadingPassage, generateQAPair, generateTongueTwister } from '../utils/aiGenerate';

const ExerciseModal = ({ exercise, onClose, showTips }) => {
    // ── Shared ──────────────────────────────────────────────────────────────
    const [step, setStep] = useState(1);
    const [isRecording, setIsRecording] = useState(false);

    // ── Breath (ID 6) ────────────────────────────────────────────────────────
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [ratings, setRatings] = useState({ ease: 5, naturalness: 5 });

    // ── Free Speech / Reading (ID 1, 2) ─────────────────────────────────────
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [speechEase, setSpeechEase] = useState(5);

    // ── AI-generated content ─────────────────────────────────────────────────
    const [readingPassage, setReadingPassage] = useState(null);
    const [qaContent, setQaContent] = useState(null);   // { question, answer }
    const [tongueTwister, setTongueTwister] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState(null);

    // ── Simple recording (Q&A, Tongue Twister, Generic) ──────────────────────
    const [simpleRecordDone, setSimpleRecordDone] = useState(false);
    const [ttEase, setTtEase] = useState(5);

    // ── Refs ─────────────────────────────────────────────────────────────────
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingTimerRef = useRef(null);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    // ── Breath timer ──────────────────────────────────────────────────────────
    useEffect(() => {
        let t = null;
        if (timerActive && timeLeft > 0) t = setInterval(() => setTimeLeft(p => p - 1), 1000);
        else if (timeLeft === 0) setTimerActive(false);
        return () => clearInterval(t);
    }, [timerActive, timeLeft]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleClose = (completed = false) => onClose(completed, completed ? exercise.xp : 0);

    // AI content generation
    const generateContent = async () => {
        setIsGenerating(true);
        setAiError(null);
        try {
            if (exercise.id === 2)  { setReadingPassage(await generateReadingPassage()); }
            if (exercise.id === 10) { setQaContent(await generateQAPair()); }
            if (exercise.id === 11) { setTongueTwister(await generateTongueTwister()); }
        } catch {
            setAiError('Could not generate content. Please check your connection and try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Recording with stutter analysis (Free Speech + Reading)
    const analyzeAudio = async (blob) => {
        setIsAnalyzing(true);
        const fd = new FormData();
        fd.append('audio', blob, 'recording.webm');
        try {
            const res = await fetch('/api/analyze?mode=segments', { method: 'POST', body: fd });
            if (!res.ok) throw new Error('Analysis failed');
            const data = await res.json();
            const segs = data.segments || [];
            const stutterCount = segs.filter(s => s.label === 'stutter').length;
            const stutterPct = segs.length > 0 ? Math.round((stutterCount / segs.length) * 100) : 0;
            const dur = data.duration || 0;
            setAnalysisResults({
                fluency: 100 - stutterPct,
                stutterPct,
                stutterCount,
                segments: segs,
                durationSecs: dur,
                duration: `${Math.floor(dur / 60)}:${Math.round(dur % 60).toString().padStart(2, '0')}`,
            });
            setStep(3);
        } catch {
            alert('Analysis failed. Please check your connection and try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const startAnalysisRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
            mediaRecorderRef.current.onstop = async () => {
                stream.getTracks().forEach(t => t.stop());
                await analyzeAudio(new Blob(audioChunksRef.current, { type: 'audio/webm' }));
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            recordingTimerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 120) { stopAnalysisRecording(); return 120; }
                    return prev + 1;
                });
            }, 1000);
        } catch {
            alert('Could not access microphone. Please allow microphone permissions and try again.');
        }
    };

    const stopAnalysisRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop();
        clearInterval(recordingTimerRef.current);
        setIsRecording(false);
    };

    // Simple recording — mic access for UX, audio discarded (not stored)
    const startSimpleRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
            mediaRecorderRef.current.onstop = () => {
                stream.getTracks().forEach(t => t.stop());
                audioChunksRef.current = []; // discard — no storage
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch {
            alert('Could not access microphone. Please allow microphone permissions and try again.');
        }
    };

    const stopSimpleRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop();
        setIsRecording(false);
        setSimpleRecordDone(true);
    };

    // ── Shared UI pieces ──────────────────────────────────────────────────────

    const GenerateButton = ({ label }) => (
        <div className="flex flex-col items-center gap-3 py-8">
            {aiError && <p className="text-sm text-red-500 text-center">{aiError}</p>}
            <button
                onClick={generateContent}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
                {isGenerating ? <Loader className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isGenerating ? 'Generating…' : label}
            </button>
        </div>
    );

    const RegenerateLink = ({ label }) => (
        <button
            onClick={generateContent}
            disabled={isGenerating}
            className="w-full text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mt-1 disabled:opacity-50"
        >
            {isGenerating ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {isGenerating ? 'Generating…' : label}
        </button>
    );

    const RecordingUI = ({ canStop, accentColor = 'emerald' }) => {
        const mins = Math.floor(recordingTime / 60).toString().padStart(2, '0');
        const secs = (recordingTime % 60).toString().padStart(2, '0');
        if (isAnalyzing) return (
            <div className="flex flex-col items-center gap-3 py-8">
                <div className="p-8 rounded-full bg-gray-100"><Loader className="w-12 h-12 text-emerald-600 animate-spin" /></div>
                <p className="text-sm text-gray-500">Analyzing your speech…</p>
            </div>
        );
        return (
            <div className="flex flex-col items-center py-4 gap-5">
                <div className="text-center">
                    <span className="text-5xl font-mono font-bold text-gray-900">{mins}:{secs}</span>
                    <span className="text-lg text-gray-400 font-normal"> / 02:00</span>
                </div>
                {isRecording && (
                    <div className="flex items-end gap-1 h-12">
                        {[...Array(14)].map((_, i) => (
                            <div key={i} className="w-2 bg-emerald-500 rounded-full animate-pulse"
                                style={{ height: `${20 + ((i * 7 + 13) % 28)}px`, animationDelay: `${i * 0.07}s`, animationDuration: `${0.5 + (i % 3) * 0.15}s` }}
                            />
                        ))}
                    </div>
                )}
                <button
                    onClick={isRecording ? stopAnalysisRecording : startAnalysisRecording}
                    disabled={isRecording && !canStop}
                    className={`p-8 rounded-full shadow-xl transition-all transform ${
                        isRecording && !canStop ? 'bg-red-400 cursor-not-allowed'
                        : isRecording ? 'bg-red-500 hover:bg-red-600 hover:scale-105 animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105'
                    }`}
                >
                    {isRecording ? <StopCircle className="w-12 h-12 text-white" /> : <Mic className="w-12 h-12 text-white" />}
                </button>
                <p className="text-sm text-gray-500 text-center">
                    {isRecording && !canStop ? `Keep going… (${5 - recordingTime}s minimum)`
                        : isRecording ? 'Recording — tap to stop when done'
                        : 'Tap to start recording'}
                </p>
            </div>
        );
    };

    const AnalysisResults = () => {
        if (!analysisResults) return null;
        const { fluency, stutterPct, stutterCount, segments, duration, durationSecs } = analysisResults;
        const msg = fluency >= 80 ? 'Excellent fluency! Great session.'
            : fluency >= 60 ? 'Good progress. Keep practicing daily.'
            : 'Every session helps — consistency is key.';
        const fmt = s => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
        const tickStep = durationSecs <= 30 ? 5 : durationSecs <= 60 ? 10 : 15;
        const ticks = Array.from({ length: Math.floor(durationSecs / tickStep) + 1 }, (_, i) => i * tickStep);
        const stutterSegs = segments.filter(s => s.label === 'stutter');

        return (
            <div className="space-y-5">
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Fluency Score</p>
                    <p className="text-6xl font-bold text-emerald-600 mb-3">{fluency}%</p>
                    <div className="w-full bg-white/70 rounded-full h-3 mb-3">
                        <div className="bg-emerald-500 h-3 rounded-full transition-all duration-700" style={{ width: `${fluency}%` }} />
                    </div>
                    <p className="text-sm text-gray-600">{msg}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Duration',         val: duration,      cls: 'text-gray-900' },
                        { label: 'Stutter segments', val: stutterCount,  cls: 'text-red-500' },
                        { label: 'Stutter rate',     val: `${stutterPct}%`, cls: 'text-purple-600' },
                    ].map(({ label, val, cls }) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                            <p className={`text-2xl font-bold ${cls}`}>{val}</p>
                            <p className="text-xs text-gray-500 mt-1">{label}</p>
                        </div>
                    ))}
                </div>
                {segments.length > 0 && durationSecs > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">When Stutters Happened</p>
                        <div className="relative w-full h-10 bg-gray-100 rounded-lg overflow-hidden">
                            {segments.map((seg, i) => (
                                <div key={i}
                                    title={`${seg.label === 'stutter' ? 'Stutter' : 'Fluent'}: ${fmt(seg.start_time)} – ${fmt(seg.end_time)}`}
                                    className={`absolute top-0 h-full ${seg.label === 'stutter' ? 'bg-red-400' : 'bg-emerald-400'}`}
                                    style={{ left: `${(seg.start_time / durationSecs) * 100}%`, width: `${Math.max(0.8, ((seg.end_time - seg.start_time) / durationSecs) * 100)}%` }}
                                />
                            ))}
                            {ticks.map(t => (
                                <div key={t} className="absolute top-0 h-full border-l border-white/50 pointer-events-none" style={{ left: `${(t / durationSecs) * 100}%` }} />
                            ))}
                        </div>
                        <div className="relative w-full h-5 mt-0.5">
                            {ticks.map(t => (
                                <span key={t} className="absolute text-[10px] text-gray-400 -translate-x-1/2" style={{ left: `${(t / durationSecs) * 100}%` }}>{fmt(t)}</span>
                            ))}
                        </div>
                        <div className="flex gap-4 text-xs text-gray-400 mt-1">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-400 inline-block" /> Fluent</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-400 inline-block" /> Stutter</span>
                        </div>
                        {stutterSegs.length > 0 && (
                            <div className="mt-3 bg-red-50 rounded-xl p-3 border border-red-100">
                                <p className="text-xs font-semibold text-red-600 mb-2">Stutter moments ({stutterSegs.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    {stutterSegs.map((seg, i) => (
                                        <span key={i} className="text-xs bg-white text-red-500 border border-red-200 px-2.5 py-1 rounded-full font-mono">
                                            {fmt(seg.start_time)} – {fmt(seg.end_time)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How did that feel? (0–10)</label>
                    <input type="range" min="0" max="10" value={speechEase}
                        onChange={e => setSpeechEase(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Very difficult</span>
                        <span className="font-semibold text-emerald-600">{speechEase} / 10</span>
                        <span>Very easy</span>
                    </div>
                </div>
                <button onClick={() => handleClose(true)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700">
                    Save &amp; Complete (+{exercise.xp} XP)
                </button>
            </div>
        );
    };

    // ── Exercise renderers ────────────────────────────────────────────────────

    const renderFreeSpeech = () => {
        const canStop = recordingTime >= 5;
        if (step === 1) return (
            <div className="space-y-6">
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">What to do</h4>
                    <p className="text-gray-700 leading-relaxed">
                        Talk about anything — your day, a memory, a hobby, or whatever comes to mind. There's no script. Speak naturally for up to <strong>2 minutes</strong>.
                    </p>
                    {showTips && (
                        <div className="mt-4 p-3 bg-white border border-emerald-200 rounded-lg text-sm text-emerald-800">
                            <strong>💡 Tip:</strong> Take a gentle breath before you start. Speak at whatever pace feels comfortable.
                        </div>
                    )}
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-sm font-semibold text-blue-700 mb-1">Example prompt</p>
                    <p className="text-sm text-blue-700 italic">"Tell me about something that made you smile recently, or describe what you did this morning."</p>
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2">
                    I'm Ready <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        );
        if (step === 2) return (
            <div className="space-y-6">
                <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-4">
                    <p className="text-sm text-emerald-800 italic">"Tell me about something that made you smile recently, or describe what you did this morning."</p>
                </div>
                <RecordingUI canStop={canStop} />
            </div>
        );
        if (step === 3) return <AnalysisResults />;
        return null;
    };

    const renderReading = () => {
        const canStop = recordingTime >= 5;
        if (step === 1) return (
            <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">What to do</h4>
                    <p className="text-gray-700 leading-relaxed">Read the passage below aloud at a comfortable pace. Focus on smooth, easy onset at the start of each sentence.</p>
                </div>
                {readingPassage ? (
                    <div className="space-y-3">
                        <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                            <p className="text-lg text-gray-800 leading-relaxed">{readingPassage}</p>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2">
                            I'm Ready <ArrowRight className="w-5 h-5" />
                        </button>
                        <RegenerateLink label="Generate a different passage" />
                    </div>
                ) : <GenerateButton label="Generate Reading Passage" />}
            </div>
        );
        if (step === 2) return (
            <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Read aloud</p>
                    <p className="text-base text-gray-800 leading-relaxed">{readingPassage}</p>
                </div>
                <RecordingUI canStop={canStop} />
            </div>
        );
        if (step === 3) return <AnalysisResults />;
        return null;
    };

    const renderBreath = () => {
        if (step === 1) return (
            <div className="space-y-6">
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <h4 className="font-bold text-gray-900 mb-2">Step 1: Reset Tension</h4>
                    <p className="text-gray-900">Sit comfortably. Inhale gently through your nose, then exhale long and slow. Do not hold your breath.</p>
                </div>
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-6xl font-bold text-emerald-600 mb-4 font-mono">
                        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                    </div>
                    {!timerActive && timeLeft > 0 && (
                        <button onClick={() => setTimerActive(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700">
                            <Play className="w-5 h-5" /> Start Timer
                        </button>
                    )}
                    {timerActive && (
                        <button onClick={() => setTimerActive(false)} className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-full hover:bg-amber-600">
                            <Pause className="w-5 h-5" /> Pause
                        </button>
                    )}
                    {timeLeft === 0 && (
                        <button onClick={() => setStep(2)} className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 animate-bounce">
                            Next Step <ArrowRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        );
        if (step === 2) return (
            <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-2">Step 2: Speak on Exhale</h4>
                    <p className="text-gray-900">Read the text below aloud. <strong>Speak ONLY on the exhale.</strong> If you feel tension, stop, reset your breath, and try again.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300">
                    <p className="text-lg text-gray-800 leading-loose">
                        "The morning sun cast a warm glow over the quiet hills. Birds began to sing, welcoming the new day with joy. A gentle breeze rustled the leaves, whispering secrets to the trees."
                    </p>
                </div>
                <button onClick={() => setStep(3)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700">
                    I'm Ready for the Next Step
                </button>
            </div>
        );
        if (step === 3) return (
            <div className="space-y-6">
                <h4 className="font-bold text-gray-900 text-center text-xl">Step 3: Short Monologue</h4>
                <p className="text-center text-gray-600">Record a note about your day (2–3 mins). Use the same easy start on the exhale.</p>
                <div className="flex flex-col items-center gap-4 py-8">
                    <button
                        onClick={isRecording ? () => { stopSimpleRecording(); setTimeout(() => setStep(4), 300); } : startSimpleRecording}
                        className={`p-10 rounded-full transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:scale-110'}`}
                    >
                        <Mic className="w-12 h-12 text-white" />
                    </button>
                    <p className="text-center font-medium text-emerald-700">{isRecording ? 'Recording… Tap to Stop' : 'Tap to Start Recording'}</p>
                </div>
            </div>
        );
        if (step === 4) return (
            <div className="space-y-8">
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900">Great job!</h3>
                    <p className="text-gray-600">How did it feel?</p>
                </div>
                <div className="space-y-6">
                    {[{ key: 'ease', label: 'Speech Ease (0–10)', lo: 'Hard', hi: 'Easy' },
                      { key: 'naturalness', label: 'Naturalness (0–10)', lo: 'Unnatural', hi: 'Natural' }].map(({ key, label, lo, hi }) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                            <input type="range" min="0" max="10" value={ratings[key]}
                                onChange={e => setRatings({ ...ratings, [key]: e.target.value })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>{lo}</span><span>{ratings[key]}</span><span>{hi}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => handleClose(true)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 mt-4">
                    Save &amp; Finish (+{exercise.xp} XP)
                </button>
            </div>
        );
        return null;
    };

    const renderQA = () => {
        if (step === 1) return (
            <div className="space-y-6">
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">What to do</h4>
                    <p className="text-gray-700 leading-relaxed">You'll be given a question. Read it, think for a moment, then record your spoken answer aloud.</p>
                </div>
                {qaContent ? (
                    <div className="space-y-3">
                        <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
                            <p className="text-xs font-bold text-purple-500 uppercase mb-2">Your question</p>
                            <p className="text-xl font-semibold text-gray-900 mb-4">{qaContent.question}</p>
                            {qaContent.answer && (
                                <details>
                                    <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-600">Suggested answer (tap to reveal)</summary>
                                    <p className="text-sm text-gray-600 mt-2 italic">{qaContent.answer}</p>
                                </details>
                            )}
                        </div>
                        <button onClick={() => setStep(2)} className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 flex items-center justify-center gap-2">
                            I'm Ready <ArrowRight className="w-5 h-5" />
                        </button>
                        <RegenerateLink label="Generate a different question" />
                    </div>
                ) : <GenerateButton label="Generate Question" />}
            </div>
        );
        if (step === 2) return (
            <div className="space-y-6">
                <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-xl p-4">
                    <p className="text-lg font-semibold text-purple-900">{qaContent?.question}</p>
                </div>
                <div className="flex flex-col items-center gap-4 py-4">
                    <button
                        onClick={isRecording ? stopSimpleRecording : startSimpleRecording}
                        className={`p-8 rounded-full shadow-xl transition-all transform ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'}`}
                    >
                        {isRecording ? <StopCircle className="w-12 h-12 text-white" /> : <Mic className="w-12 h-12 text-white" />}
                    </button>
                    <p className="text-sm text-gray-500">
                        {isRecording ? 'Recording — tap to stop' : simpleRecordDone ? 'Recording done!' : 'Tap to record your answer'}
                    </p>
                </div>
                {simpleRecordDone && (
                    <button onClick={() => setStep(3)} className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700">
                        Next →
                    </button>
                )}
            </div>
        );
        if (step === 3) return (
            <div className="space-y-6 text-center">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-bold text-gray-900">Great answer!</h3>
                <p className="text-gray-600">You practiced speaking your response clearly and confidently.</p>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-emerald-700 font-bold text-lg">+{exercise.xp} XP Earned</p>
                </div>
                <button onClick={() => handleClose(true)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700">
                    Complete
                </button>
            </div>
        );
        return null;
    };

    const renderTongueTwister = () => {
        if (step === 1) return (
            <div className="space-y-6">
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">What to do</h4>
                    <p className="text-gray-700 leading-relaxed">Practice the tongue twister below. Start slow, then speed up as you get comfortable. Repetition builds fluency.</p>
                </div>
                {tongueTwister ? (
                    <div className="space-y-3">
                        <div className="bg-white border-2 border-amber-200 rounded-xl p-6 text-center">
                            <p className="text-2xl font-bold text-gray-900 leading-relaxed">{tongueTwister}</p>
                        </div>
                        <button onClick={() => setStep(2)} className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold hover:bg-amber-600 flex items-center justify-center gap-2">
                            Start Practicing <ArrowRight className="w-5 h-5" />
                        </button>
                        <RegenerateLink label="Generate a different twister" />
                    </div>
                ) : <GenerateButton label="Generate Tongue Twister" />}
            </div>
        );
        if (step === 2) return (
            <div className="space-y-6">
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center">
                    <p className="text-xl font-bold text-gray-900 leading-relaxed">{tongueTwister}</p>
                </div>
                <div className="flex flex-col items-center gap-4 py-4">
                    <button
                        onClick={isRecording ? stopSimpleRecording : startSimpleRecording}
                        className={`p-8 rounded-full shadow-xl transition-all transform ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-amber-500 hover:bg-amber-600 hover:scale-105'}`}
                    >
                        {isRecording ? <StopCircle className="w-12 h-12 text-white" /> : <Mic className="w-12 h-12 text-white" />}
                    </button>
                    <p className="text-sm text-gray-500">
                        {isRecording ? 'Recording — tap to stop' : simpleRecordDone ? 'Done! Try again or move on.' : 'Tap to practice'}
                    </p>
                </div>
                {simpleRecordDone && (
                    <div className="space-y-3">
                        <button onClick={() => { setSimpleRecordDone(false); }} className="w-full bg-amber-100 text-amber-800 py-3 rounded-xl font-semibold hover:bg-amber-200">
                            Try Again
                        </button>
                        <button onClick={() => setStep(3)} className="w-full bg-amber-500 text-white py-4 rounded-xl font-bold hover:bg-amber-600">
                            That's good enough →
                        </button>
                    </div>
                )}
            </div>
        );
        if (step === 3) return (
            <div className="space-y-6">
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900">Tongue Twister Done!</h3>
                    <p className="text-gray-600">How difficult was it?</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty (0–10)</label>
                    <input type="range" min="0" max="10" value={ttEase}
                        onChange={e => setTtEase(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Easy</span>
                        <span className="font-semibold text-amber-600">{ttEase} / 10</span>
                        <span>Very Hard</span>
                    </div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center">
                    <p className="text-emerald-700 font-bold text-lg">+{exercise.xp} XP Earned</p>
                </div>
                <button onClick={() => handleClose(true)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700">
                    Complete
                </button>
            </div>
        );
        return null;
    };

    const renderGeneric = () => (
        <div className="space-y-8">
            {step === 1 && (
                <div className="space-y-6">
                    <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg">Instructions</h4>
                        <p className="text-gray-900 leading-relaxed">{exercise.description}</p>
                        {showTips && (
                            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800">
                                <strong>💡 Technique Tip:</strong> Take a deep breath before you start. Focus on smooth onset.
                            </div>
                        )}
                    </div>
                    <button onClick={() => setStep(2)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2">
                        Start <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            )}
            {step === 2 && (
                <div className="flex flex-col items-center gap-6 py-8">
                    <button
                        onClick={isRecording ? stopSimpleRecording : startSimpleRecording}
                        className={`rounded-full p-10 shadow-2xl transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-emerald-600 hover:scale-105'}`}
                    >
                        <Mic className="w-16 h-16 text-white" />
                    </button>
                    <p className="font-medium text-gray-900">{isRecording ? 'Recording… Tap to Stop' : simpleRecordDone ? 'Recording done!' : 'Tap to Record'}</p>
                    {simpleRecordDone && (
                        <button onClick={() => setStep(3)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700">
                            Continue
                        </button>
                    )}
                </div>
            )}
            {step === 3 && (
                <div className="space-y-6 text-center">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                    <h3 className="text-2xl font-bold text-gray-900">Good Practice!</h3>
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <p className="text-emerald-600 font-bold text-lg">+{exercise.xp} XP Earned</p>
                    </div>
                    <button onClick={() => handleClose(true)} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700">
                        Complete
                    </button>
                </div>
            )}
        </div>
    );

    // ── Router ────────────────────────────────────────────────────────────────
    const renderContent = () => {
        if (exercise.id === 1)  return renderFreeSpeech();
        if (exercise.id === 2)  return renderReading();
        if (exercise.id === 6)  return renderBreath();
        if (exercise.id === 10) return renderQA();
        if (exercise.id === 11) return renderTongueTwister();
        return renderGeneric();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-3xl z-10">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{exercise.title}</h3>
                        {exercise.subtitle && <p className="text-sm text-gray-500">{exercise.subtitle}</p>}
                    </div>
                    <button onClick={() => onClose(false, 0)} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                        <X className="w-6 h-6 text-gray-900 group-hover:text-red-600 transition-colors" />
                    </button>
                </div>
                <div className="p-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ExerciseModal;
