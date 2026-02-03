import { useRef, useCallback } from 'react';
import { useJarvisStore } from '../store/jarvisStore';

/**
 * Speech Recognition Hook - Auto-send on pause
 * Automatically sends message after 2 seconds of silence
 * Mic stays on for follow-up questions
 */
export function useSpeechRecognition() {
    const recognitionRef = useRef(null);
    const silenceTimeoutRef = useRef(null);
    const lastTranscriptRef = useRef('');

    const {
        isListening,
        setTranscript,
        startListening,
        stopListening,
        startProcessing,
        addMessage,
        setError,
        reset,
        activate,
    } = useJarvisStore();

    const SILENCE_DELAY = 2000; // 2 seconds of silence to auto-send

    const clearSilenceTimeout = useCallback(() => {
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
        }
    }, []);

    const cleanup = useCallback(() => {
        clearSilenceTimeout();
        if (recognitionRef.current) {
            try {
                recognitionRef.current.abort();
            } catch (e) {
                // Ignore
            }
            recognitionRef.current = null;
        }
    }, [clearSilenceTimeout]);

    const sendMessage = useCallback((text) => {
        const trimmed = text.trim();
        if (trimmed) {
            // Clean up wake word if accidentally said
            const cleaned = trimmed.replace(/^(hey\s+)?jarvis[,.\s]*/i, '').trim();
            if (cleaned) {
                console.log('📤 Auto-sending:', cleaned);
                addMessage('user', cleaned);
                startProcessing();
                return true;
            }
        }
        return false;
    }, [addMessage, startProcessing]);

    const stopRecognition = useCallback(() => {
        clearSilenceTimeout();
        const transcript = lastTranscriptRef.current;
        cleanup();
        stopListening();

        // Send any remaining text
        if (transcript) {
            sendMessage(transcript);
            lastTranscriptRef.current = '';
        } else {
            reset();
        }
    }, [cleanup, clearSilenceTimeout, stopListening, sendMessage, reset]);

    const startRecognition = useCallback(() => {
        // Check browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech recognition is not supported in this browser. Please use Chrome.');
            return;
        }

        // Cleanup any existing
        cleanup();
        lastTranscriptRef.current = '';

        try {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            let finalTranscript = '';

            recognition.onstart = () => {
                console.log('🎤 Microphone ON');
                activate();
                startListening();
                setTranscript('');
                finalTranscript = '';
            };

            recognition.onresult = (event) => {
                clearSilenceTimeout();

                let interim = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interim += transcript;
                    }
                }

                const fullText = finalTranscript + interim;
                setTranscript(fullText);
                lastTranscriptRef.current = finalTranscript;

                // Only set auto-send timeout if we have final results
                if (finalTranscript.trim()) {
                    silenceTimeoutRef.current = setTimeout(() => {
                        console.log('⏱️ Silence detected, auto-sending...');
                        if (sendMessage(finalTranscript)) {
                            finalTranscript = '';
                            lastTranscriptRef.current = '';
                            setTranscript('');
                        }
                    }, SILENCE_DELAY);
                }
            };

            recognition.onerror = (event) => {
                console.warn('Speech recognition error:', event.error);
                clearSilenceTimeout();

                if (event.error === 'not-allowed') {
                    cleanup();
                    setError('Microphone access denied. Please allow microphone access in your browser settings.');
                    stopListening();
                    reset();
                } else if (event.error === 'no-speech') {
                    // No speech detected - keep listening
                } else if (event.error === 'aborted') {
                    // User stopped
                } else {
                    // Try to restart
                    try {
                        setTimeout(() => recognition.start(), 100);
                    } catch (e) {
                        // Can't restart
                    }
                }
            };

            recognition.onend = () => {
                console.log('🎤 Recognition ended');

                // Auto-restart if still supposed to be listening
                if (recognitionRef.current === recognition && useJarvisStore.getState().isListening) {
                    try {
                        setTimeout(() => {
                            if (recognitionRef.current === recognition) {
                                recognition.start();
                            }
                        }, 100);
                    } catch (e) {
                        console.log('Could not restart');
                    }
                }
            };

            recognitionRef.current = recognition;
            recognition.start();
        } catch (err) {
            console.error('Failed to start speech recognition:', err);
            setError('Failed to start voice input. Please try again.');
            reset();
        }
    }, [cleanup, clearSilenceTimeout, activate, startListening, stopListening, setTranscript, setError, reset, sendMessage]);

    return {
        isListening,
        startRecognition,
        stopRecognition,
    };
}

export default useSpeechRecognition;
