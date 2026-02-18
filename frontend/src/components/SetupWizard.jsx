import React, { useState, useEffect } from 'react';

export default function SetupWizard({ isOpen, onClose, onSave, pin }) {
    const [keys, setKeys] = useState({
        openaiApiKey: '',
        searchApiKey: '',
        elevenLabsApiKey: '',
        elevenLabsVoiceId: '',
        jarvisPin: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setKeys({
                openaiApiKey: '',
                searchApiKey: '',
                elevenLabsApiKey: '',
                elevenLabsVoiceId: '',
                jarvisPin: ''
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
                onSave(keys);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header - Fixed */}
                <div className="p-6 border-b border-gray-800 bg-[#0a0a0a] sticky top-0 z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-wide font-sans">
                            System Configuration
                        </h2>
                        <p className="text-gray-500 text-xs mt-1 font-medium">
                            Manage API Keys & Security
                        </p>
                    </div>
                    {/* Decorative Icon */}
                    <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    {error && (
                        <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form id="config-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Section: Core API */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Core API Required</h3>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-300">
                                    OpenAI API Key <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="openaiApiKey"
                                    required
                                    value={keys.openaiApiKey}
                                    onChange={handleChange}
                                    placeholder="sk-..."
                                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all text-sm font-mono"
                                />
                            </div>
                        </div>

                        {/* Section: Optional Services */}
                        <div className="space-y-4 pt-4 border-t border-gray-800">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Optional Services</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-300">Search API Key</label>
                                    <input
                                        type="password"
                                        name="searchApiKey"
                                        value={keys.searchApiKey}
                                        onChange={handleChange}
                                        placeholder="Optional"
                                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-300">ElevenLabs Key</label>
                                    <input
                                        type="password"
                                        name="elevenLabsApiKey"
                                        value={keys.elevenLabsApiKey}
                                        onChange={handleChange}
                                        placeholder="Optional"
                                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all text-sm font-mono"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-300">ElevenLabs Voice ID</label>
                                <input
                                    type="text"
                                    name="elevenLabsVoiceId"
                                    value={keys.elevenLabsVoiceId}
                                    onChange={handleChange}
                                    placeholder="Optional Voice ID"
                                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all text-sm font-mono"
                                />
                            </div>
                        </div>

                        {/* Section: Security */}
                        <div className="space-y-4 pt-4 border-t border-gray-800">
                            <h3 className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-2">Security</h3>
                            <div className="bg-yellow-900/10 border border-yellow-900/30 rounded-lg p-4 space-y-2">
                                <label className="block text-sm font-medium text-yellow-500">
                                    Change Security PIN
                                </label>
                                <input
                                    type="text"
                                    name="jarvisPin"
                                    value={keys.jarvisPin}
                                    onChange={(e) => {
                                        if (/^\d*$/.test(e.target.value) && e.target.value.length <= 6) {
                                            handleChange(e);
                                        }
                                    }}
                                    placeholder="Enter new 6-digit PIN"
                                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-yellow-400 placeholder-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition-all text-sm font-mono tracking-wider text-center"
                                />
                                <p className="text-xs text-gray-500 text-center">Current PIN used if left empty</p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer - Fixed */}
                <div className="p-6 border-t border-gray-800 bg-[#0a0a0a] flex justify-end gap-3 sticky bottom-0 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="config-form"
                        disabled={loading}
                        className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-sm transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
