import React from 'react';
import { useJarvisStore } from '../store/jarvisStore';

/**
 * StatusRing Component - Fixed
 * Visual status indicator with color-coded states
 */
function StatusRing() {
    const { isListening, isProcessing, isSpeaking, currentTranscript } = useJarvisStore();

    const getState = () => {
        if (isSpeaking) return 'speaking';
        if (isProcessing) return 'processing';
        if (isListening) return 'listening';
        return 'idle';
    };

    const state = getState();

    const getLabel = () => {
        switch (state) {
            case 'listening':
                return 'LISTENING';
            case 'processing':
                return 'PROCESSING';
            case 'speaking':
                return 'SPEAKING';
            default:
                return 'IDLE';
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Status Ring */}
            <div className={`status-ring ${state}`}>
                {/* Outer glow ring */}
                <div className="status-ring-glow" />

                {/* Core circle */}
                <div className="status-ring-core">
                    {/* Inner icon/letter */}
                    <span
                        className="text-2xl font-bold"
                        style={{
                            color: state === 'idle' ? 'var(--jarvis-text-dim)' :
                                state === 'listening' ? 'var(--jarvis-cyan)' :
                                    state === 'processing' ? 'var(--jarvis-gold)' : 'var(--jarvis-green)'
                        }}
                    >
                        J
                    </span>
                </div>
            </div>

            {/* Status Label */}
            <div className="text-center">
                <p
                    className="text-xs font-semibold tracking-widest"
                    style={{
                        color: state === 'idle' ? 'var(--jarvis-text-dim)' :
                            state === 'listening' ? 'var(--jarvis-cyan)' :
                                state === 'processing' ? 'var(--jarvis-gold)' : 'var(--jarvis-green)'
                    }}
                >
                    {getLabel()}
                </p>
            </div>

            {/* Live Transcript */}
            {isListening && currentTranscript && (
                <div className="max-w-[200px] p-2 bg-[var(--jarvis-gray)] rounded-lg border border-[var(--jarvis-cyan)] animate-fade-in">
                    <p className="text-xs text-[var(--jarvis-text)] text-center italic">
                        "{currentTranscript}"
                    </p>
                </div>
            )}
        </div>
    );
}

export default StatusRing;
