import React from 'react';
import { useJarvisStore } from '../store/jarvisStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

/**
 * MicButton Component - Fixed
 * Microphone button with state-specific appearance
 */
function MicButton() {
    const { isIdle, isListening, isProcessing, isSpeaking, activate } = useJarvisStore();
    const { startRecognition, stopRecognition, isSupported } = useSpeechRecognition();

    const handleClick = () => {
        if (isProcessing || isSpeaking) return;

        if (isListening) {
            stopRecognition();
        } else {
            if (isIdle) activate();
            startRecognition();
        }
    };

    const getButtonState = () => {
        if (isProcessing) return 'processing';
        if (isSpeaking) return 'speaking';
        if (isListening) return 'active';
        return 'idle';
    };

    const buttonState = getButtonState();
    const isDisabled = isProcessing || isSpeaking || !isSupported;

    // Icon based on state
    const renderIcon = () => {
        if (isProcessing) {
            // Spinner
            return (
                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            );
        }

        if (isSpeaking) {
            // Speaker icon
            return (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
                    <path d="M18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                </svg>
            );
        }

        if (isListening) {
            // Stop icon
            return (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
                </svg>
            );
        }

        // Mic icon (default)
        return (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
        );
    };

    const getLabel = () => {
        if (!isSupported) return 'Not supported';
        if (isListening) return 'Tap to stop';
        if (isProcessing) return 'Processing...';
        if (isSpeaking) return 'Speaking...';
        return 'Tap to speak';
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={handleClick}
                disabled={isDisabled}
                className={`mic-button ${buttonState}`}
                title={getLabel()}
            >
                {renderIcon()}
            </button>

            <p className="text-xs text-[var(--jarvis-text-muted)]">
                {getLabel()}
            </p>
        </div>
    );
}

export default MicButton;
