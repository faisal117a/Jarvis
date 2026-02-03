import React from 'react';

/**
 * Settings Panel Component
 * Allows customization of JARVIS behavior
 */
function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }) {
    if (!isOpen) return null;

    const handleToggle = (key) => {
        onSettingsChange({ ...settings, [key]: !settings[key] });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative glass-panel-dark rounded-2xl w-full max-w-md mx-4 animate-fade-in-up">
                {/* Corner Accents */}
                <div className="corner-accent top-left" />
                <div className="corner-accent top-right" />
                <div className="corner-accent bottom-left" />
                <div className="corner-accent bottom-right" />

                {/* Header */}
                <div className="px-6 py-4 border-b border-[var(--jarvis-steel)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[var(--jarvis-cyan)]">
                            <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 5H6.75a.75.75 0 000 1.5h.656l-.656 8.78a3.75 3.75 0 003.741 3.97h4.018a3.75 3.75 0 003.741-3.97l-.656-8.78h.656a.75.75 0 000-1.5h-2.3l-.178-1.183a1.875 1.875 0 00-1.85-1.567h-1.844zM10.5 10.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.75.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-lg font-semibold text-[var(--jarvis-text)]">Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-[var(--jarvis-gray)] transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[var(--jarvis-text-dim)]">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Settings List */}
                <div className="p-6 space-y-6">
                    {/* Voice Output */}
                    <SettingToggle
                        label="Voice Output"
                        description="Enable JARVIS voice responses using ElevenLabs"
                        enabled={settings.voiceEnabled}
                        onToggle={() => handleToggle('voiceEnabled')}
                    />

                    {/* Web Search */}
                    <SettingToggle
                        label="Web Search"
                        description='Automatically search the web for "latest", "news", "current" queries'
                        enabled={settings.webSearchEnabled}
                        onToggle={() => handleToggle('webSearchEnabled')}
                    />

                    {/* Wake Word */}
                    <SettingToggle
                        label="Wake Word Detection"
                        description='Listen for "Jarvis" wake word in the background'
                        enabled={settings.wakeWordEnabled}
                        onToggle={() => handleToggle('wakeWordEnabled')}
                    />

                    {/* Sound Effects */}
                    <SettingToggle
                        label="Sound Effects"
                        description="Play activation and notification sounds"
                        enabled={settings.soundEffects}
                        onToggle={() => handleToggle('soundEffects')}
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[var(--jarvis-steel)] bg-[var(--jarvis-gray)]">
                    <p className="text-xs text-[var(--jarvis-text-muted)] text-center">
                        Settings are saved locally in your browser
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * Individual Setting Toggle
 */
function SettingToggle({ label, description, enabled, onToggle }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-sm font-medium text-[var(--jarvis-text)]">{label}</p>
                <p className="text-xs text-[var(--jarvis-text-muted)] mt-0.5">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={`relative w-12 h-6 rounded-full transition-all ${enabled
                        ? 'bg-[var(--jarvis-cyan)]'
                        : 'bg-[var(--jarvis-steel)]'
                    }`}
            >
                <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-7' : 'left-1'
                        }`}
                />
            </button>
        </div>
    );
}

export default SettingsPanel;
