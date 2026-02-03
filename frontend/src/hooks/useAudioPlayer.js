import { useRef, useCallback } from 'react';
import { useJarvisStore } from '../store/jarvisStore';

/**
 * Audio Player Hook - Fixed
 * Handles TTS audio playback from ElevenLabs
 */
export function useAudioPlayer() {
    const audioRef = useRef(null);

    const { startSpeaking, stopSpeaking, setError } = useJarvisStore();

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            if (audioRef.current.src) {
                URL.revokeObjectURL(audioRef.current.src);
            }
            audioRef.current = null;
        }
    }, []);

    const playAudio = useCallback(async (audioBuffer) => {
        try {
            // Stop any currently playing audio
            stopAudio();

            startSpeaking();

            // Create blob URL from buffer
            const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);

            const audio = new Audio();
            audioRef.current = audio;

            // Set up event handlers before setting src
            audio.onloadeddata = () => {
                console.log('🔊 Audio loaded, playing...');
            };

            audio.onended = () => {
                console.log('🔊 Audio playback complete');
                URL.revokeObjectURL(url);
                audioRef.current = null;
                stopSpeaking();
            };

            audio.onerror = (e) => {
                console.error('Audio playback error:', e);
                URL.revokeObjectURL(url);
                audioRef.current = null;
                setError('Audio playback failed');
                stopSpeaking();
            };

            audio.src = url;

            // Wait a small moment for audio to be ready
            await new Promise(resolve => setTimeout(resolve, 100));

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.error('Audio play error:', error);
                    // Auto-play was prevented, just stop speaking
                    stopSpeaking();
                });
            }
        } catch (error) {
            console.error('Audio player error:', error);
            setError('Failed to play audio response');
            stopSpeaking();
        }
    }, [startSpeaking, stopSpeaking, setError, stopAudio]);

    const endSpeaking = useCallback(() => {
        stopAudio();
        stopSpeaking();
    }, [stopAudio, stopSpeaking]);

    return {
        playAudio,
        stopAudio: endSpeaking,
    };
}

export default useAudioPlayer;
