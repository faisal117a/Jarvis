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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] animate-fade-in relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-cyan-400 font-mono tracking-tight">
                                SYSTEM CONFIG
                            </h2>
                            <p className="text-gray-500 text-xs font-mono mt-1">
                                SECURE PARAMETER INITIALIZATION
                            </p>
                        </div>
                        <div className="h-10 w-10 border border-cyan-500/30 rounded flex items-center justify-center text-cyan-500/50">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-xs font-mono flex items-start gap-2">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mt-0.5 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Section: Core API */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-800 pb-1">Core Systems</h3>

                            <div className="group">
                                <label className="block text-xs font-mono text-cyan-500/80 mb-1.5 group-focus-within:text-cyan-400 transition-colors">
                                    OPENAI API KEY <span className="text-red-400/70 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="openaiApiKey"
                                        required
                                        value={keys.openaiApiKey}
                                        onChange={handleChange}
                                        placeholder="sk-..."
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-600 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all font-mono text-sm"
                                    />
                                    <div className="absolute right-3 top-3 text-gray-600">
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z" opacity="0.5" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Optional Services */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-800 pb-1 mt-6">Extensions</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block text-xs font-mono text-gray-400 mb-1.5 group-focus-within:text-cyan-400 transition-colors">SEARCH API KEY</label>
                                    <input
                                        type="password"
                                        name="searchApiKey"
                                        value={keys.searchApiKey}
                                        onChange={handleChange}
                                        placeholder="Optional"
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-600 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-mono text-gray-400 mb-1.5 group-focus-within:text-cyan-400 transition-colors">ELEVENLABS KEY</label>
                                    <input
                                        type="password"
                                        name="elevenLabsApiKey"
                                        value={keys.elevenLabsApiKey}
                                        onChange={handleChange}
                                        placeholder="Optional"
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-600 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-xs font-mono text-gray-400 mb-1.5 group-focus-within:text-cyan-400 transition-colors">VOICE ID</label>
                                <input
                                    type="text"
                                    name="elevenLabsVoiceId"
                                    value={keys.elevenLabsVoiceId}
                                    onChange={handleChange}
                                    placeholder="Optional Voice ID"
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-600 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none transition-all font-mono text-sm"
                                />
                            </div>
                        </div>

                        {/* Section: Security */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-800 pb-1 mt-6">Security</h3>
                            <div className="group">
                                <label className="block text-xs font-mono text-yellow-500/80 mb-1.5 group-focus-within:text-yellow-400 transition-colors">
                                    UPDATE SECURITY PIN
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
                                    placeholder="Enter new 6-digit PIN to change"
                                    className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-yellow-400 placeholder-gray-600 focus:border-yellow-500/70 focus:ring-1 focus:ring-yellow-500/30 focus:outline-none transition-all font-mono text-sm tracking-widest text-center"
                                />
                                <p className="text-[10px] text-gray-500 mt-1">Leave empty to keep current PIN. Max 6 digits.</p>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t border-gray-800 mt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all text-sm font-mono tracking-wide"
                            >
                                CANCEL
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg font-mono text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading && (
                                    <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? 'SAVING...' : 'SAVE CONFIGURATION'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
