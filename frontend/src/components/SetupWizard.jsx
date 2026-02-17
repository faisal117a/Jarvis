import React, { useState, useEffect } from 'react';

export default function SetupWizard({ isOpen, onClose, onSave, pin }) {
    const [keys, setKeys] = useState({
        openaiApiKey: '',
        searchApiKey: '',
        elevenLabsApiKey: '',
        elevenLabsVoiceId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            // When opening, we start empty as requested for updates
            setKeys({
                openaiApiKey: '',
                searchApiKey: '',
                elevenLabsApiKey: '',
                elevenLabsVoiceId: ''
            });
            setError('');
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setKeys(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/config/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keys, pin })
            });

            const data = await res.json();

            if (data.success) {
                onSave(keys); // Updates local state in App.jsx
                onClose();
            } else {
                setError(data.error || 'Failed to update configuration');
            }
        } catch (err) {
            console.error(err);
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl shadow-cyan-500/20 animate-fade-in">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2 font-mono">
                    System Configuration
                </h2>
                <p className="text-gray-400 mb-6 text-sm">
                    {pin ? 'Authentication verified.' : 'Initial Setup.'} Please enter API keys to configure JARVIS.
                    These will be securely stored in the system backend.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-2 rounded mb-4 text-sm font-mono">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-cyan-500/70 mb-1">OPENAI API KEY (Required)</label>
                        <input
                            type="password"
                            name="openaiApiKey"
                            required
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
                            disabled={loading}
                            className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/50 rounded text-cyan-400 font-mono text-sm transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'SAVING...' : 'UPDATE SYSTEM'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
