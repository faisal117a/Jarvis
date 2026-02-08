import React, { useState, useEffect } from 'react';

export default function SetupWizard({ isOpen, onClose, onSave }) {
    const [keys, setKeys] = useState({
        openaiApiKey: '',
        searchApiKey: '',
        elevenLabsApiKey: '',
        elevenLabsVoiceId: ''
    });

    useEffect(() => {
        if (isOpen) {
            const stored = localStorage.getItem('jarvis_api_keys');
            if (stored) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                setKeys(JSON.parse(stored));
            }
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setKeys(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('jarvis_api_keys', JSON.stringify(keys));
        onSave(keys);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl shadow-cyan-500/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2 font-mono">
                    System Configuration
                </h2>
                <p className="text-gray-400 mb-6 text-sm">
                    Connection established. Required protocols missing. Please provide access credentials to initialize JARVIS systems.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-cyan-500/70 mb-1">OPENAI API KEY</label>
                        <input
                            type="password"
                            name="openaiApiKey"
                            value={keys.openaiApiKey}
                            onChange={handleChange}
                            placeholder="sk-..."
                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-cyan-500 focus:outline-none transition-colors font-mono text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-cyan-500/70 mb-1">SEARCHAPI.IO KEY (Optional)</label>
                        <input
                            type="password"
                            name="searchApiKey"
                            value={keys.searchApiKey}
                            onChange={handleChange}
                            placeholder="Key for real-time web search"
                            className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-cyan-500 focus:outline-none transition-colors font-mono text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono text-cyan-500/70 mb-1">ELEVENLABS KEY (Optional)</label>
                            <input
                                type="password"
                                name="elevenLabsApiKey"
                                value={keys.elevenLabsApiKey}
                                onChange={handleChange}
                                placeholder="Key for TTS"
                                className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-cyan-500 focus:outline-none transition-colors font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-cyan-500/70 mb-1">VOICE ID (Optional)</label>
                            <input
                                type="text"
                                name="elevenLabsVoiceId"
                                value={keys.elevenLabsVoiceId}
                                onChange={handleChange}
                                placeholder="Voice ID"
                                className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-cyan-500 focus:outline-none transition-colors font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded text-gray-400 hover:text-white transition-colors text-sm font-mono"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/50 rounded text-cyan-400 font-mono text-sm transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        >
                            INITIALIZE SYSTEM
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
