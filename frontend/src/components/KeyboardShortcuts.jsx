import React from 'react';

/**
 * Keyboard Shortcuts Panel
 */
function KeyboardShortcuts({ isOpen, onClose }) {
    if (!isOpen) return null;

    const shortcuts = [
        { keys: ['Space'], description: 'Hold to talk (push-to-talk mode)' },
        { keys: ['Enter'], description: 'Send message' },
        { keys: ['Shift', 'Enter'], description: 'New line in message' },
        { keys: ['Esc'], description: 'Stop listening / Close panel' },
        { keys: ['Ctrl', 'K'], description: 'Focus chat input' },
        { keys: ['Ctrl', 'L'], description: 'Clear conversation' },
        { keys: ['Ctrl', ','], description: 'Open settings' },
    ];

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
                            <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.679zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-lg font-semibold text-[var(--jarvis-text)]">Keyboard Shortcuts</h2>
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

                {/* Shortcuts List */}
                <div className="p-6 space-y-3">
                    {shortcuts.map((shortcut, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between py-2"
                        >
                            <span className="text-sm text-[var(--jarvis-text-dim)]">
                                {shortcut.description}
                            </span>
                            <div className="flex gap-1">
                                {shortcut.keys.map((key, keyIndex) => (
                                    <React.Fragment key={key}>
                                        <kbd className="px-2 py-1 text-xs font-mono bg-[var(--jarvis-gray)] border border-[var(--jarvis-steel)] rounded text-[var(--jarvis-text)]">
                                            {key}
                                        </kbd>
                                        {keyIndex < shortcut.keys.length - 1 && (
                                            <span className="text-[var(--jarvis-text-muted)]">+</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default KeyboardShortcuts;
