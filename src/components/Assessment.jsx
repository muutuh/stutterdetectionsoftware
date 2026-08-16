import React, { useState } from 'react';
import { Mic, Upload } from 'lucide-react';

const Assessment = ({ onComplete }) => {
    const [hasRecording, setHasRecording] = useState(false);

    const handleRecord = () => {
        setHasRecording(true);
    };

    const handleUpload = () => {
        setHasRecording(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Speech Assessment</h1>
                    <p className="text-gray-500">Analyze your speech patterns and detect stuttering</p>
                </div>

                {/* Upload Section */}
                {!hasRecording ? (
                    <div className="bg-white rounded-2xl p-8 mb-6 shadow-lg">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleRecord}
                                className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105"
                            >
                                <Mic className="w-5 h-5" />
                                Record Audio
                            </button>
                            <button
                                onClick={handleUpload}
                                className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105"
                            >
                                <Upload className="w-5 h-5" />
                                Upload File
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mic className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Recording Received</h2>
                        <p className="text-gray-500 mb-8">Full analysis will appear here once the assessment feature is connected.</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setHasRecording(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-all"
                            >
                                New Recording
                            </button>
                            <button
                                onClick={onComplete}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Assessment;
