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
            } catch {
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

            // Detect mobile device to adjust settings
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // On mobile, continuous mode causes duplication bugs (Android Chrome).
            // We use single-shot mode on mobile for stability.
            recognition.continuous = !isMobile;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            // let finalTranscript = '';
            let restartCount = 0;
            const MAX_RESTARTS = 3;
            const RESTART_WINDOW = 3000; // Reset count if running longer than this
            let startTime = Date.now();

            recognition.onstart = () => {
                console.log('🎤 Microphone ON');
                startTime = Date.now();
                activate();
                startListening();
                setTranscript('');
                // finalTranscript = '';
            };

            recognition.onresult = (event) => {
                clearSilenceTimeout();
                // Reset restart count on successful result
                restartCount = 0;

                // Chrome Android behave differently.
                // The safest way is to rebuild the ENTIRE transcript from event.results[0] to length.

                let fullFinal = '';
                let fullInterim = '';

                for (let i = 0; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        fullFinal += transcript;
                    } else {
                        fullInterim += transcript;
                    }
                }

                const fullText = fullFinal + fullInterim;
                setTranscript(fullText);
                lastTranscriptRef.current = fullFinal;

                // Auto-send logic
                if (fullFinal.trim()) {
                    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

                    silenceTimeoutRef.current = setTimeout(() => {
                        console.log('⏱️ Silence detected, auto-sending...');

                        // We send the FULL final text gathered so far. 
                        if (sendMessage(fullFinal)) {
                            // Clear ref to prevent double-send in stopRecognition
                            lastTranscriptRef.current = '';

                            // Stop recognition to clear the buffer and prevent duplicates
                            stopRecognition();
                        }
                    }, SILENCE_DELAY);
                }
            };

            recognition.onerror = (event) => {
                console.warn('Speech recognition error:', event.error);
                clearSilenceTimeout();

                if (event.error === 'not-allowed') {
                    cleanup();
                    setError('Microphone access denied. Please check permissions.');
                    stopListening();
                    reset();
                } else if (event.error === 'no-speech') {
                    // Ignore no-speech, it just means silence
                } else if (event.error === 'aborted') {
                    // User stopped
                } else {
                    // Other errors (network, etc)
                    // Don't immediately stop, let onend handle restart logic
                }
            };

            recognition.onend = () => {
                console.log('🎤 Recognition ended');

                // On mobile/single-shot: if we have capture text, sending it immediately 
                // is more natural than waiting for silence timeout or restarting.
                if (!recognition.continuous && lastTranscriptRef.current.trim()) {
                    console.log('📱 Mobile end-of-speech detected, triggering send...');
                    // Clear the silence timer since we are handling it now
                    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

                    if (sendMessage(lastTranscriptRef.current)) {
                        lastTranscriptRef.current = '';
                        // Explicitly return to prevent restart logic
                        return;
                    }
                }

                // Only restart if we are supposed to be listening
                if (recognitionRef.current === recognition && useJarvisStore.getState().isListening) {
                    const timeRunning = Date.now() - startTime;

                    // If it ran for less than 1 second, it might be a glitch loop -> count it
                    if (timeRunning < 1000) {
                        restartCount++;
                    } else {
                        restartCount = 0; // Reset if it ran successfully for a while
                    }

                    if (restartCount > MAX_RESTARTS) {
                        console.error('Too many rapid restarts. Stopping microphone.');
                        stopListening();
                        setError('Microphone connection unstable. Please try again.');
                        return;
                    }

                    // On mobile (one-shot mode), we restart immediately to simulate continuous listening
                    // unless we are in the middle of processing (which is checked by isListening flag)
                    try {
                        setTimeout(() => {
                            if (recognitionRef.current === recognition && useJarvisStore.getState().isListening) {
                                console.log('🔄 Restarting recognition...');
                                recognition.start();
                            }
                        }, 200);
                    } catch {
                        // console.log('Could not restart:', e);
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
    }, [cleanup, clearSilenceTimeout, activate, startListening, stopListening, setTranscript, setError, reset, sendMessage, stopRecognition]);

    return {
        isListening,
        startRecognition,
        stopRecognition,
    };
}

export default useSpeechRecognition;
