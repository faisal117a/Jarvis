/**
 * Wake Word Hook - DISABLED
 * The automatic wake word detection was causing performance issues.
 * Users should use the mic button to activate voice input.
 */
export function useWakeWord() {
    // Wake word detection is disabled to prevent performance issues
    // Users can click the mic button to start voice input
    return {
        isSupported: false,
        startWakeWordDetection: () => { },
        stopWakeWordDetection: () => { }
    };
}

export default useWakeWord;
