import { create } from 'zustand';

/**
 * JARVIS Global State Store
 * Manages the entire state of the JARVIS assistant
 */
export const useJarvisStore = create((set, get) => ({
    // === STATE ===
    isIdle: true,
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    wakeWordDetected: false,
    conversation: [],
    currentTranscript: '',
    error: null,

    // === ACTIONS ===

    // Wake word detected - activate JARVIS
    activate: () => set({
        isIdle: false,
        wakeWordDetected: true,
        isListening: true,
        error: null,
    }),

    // Start listening for user input
    startListening: () => set({
        isListening: true,
        isIdle: false,
        currentTranscript: '',
        error: null,
    }),

    // Stop listening
    stopListening: () => set({
        isListening: false,
    }),

    // Update current transcript as user speaks
    setTranscript: (transcript) => set({
        currentTranscript: transcript,
    }),

    // Start processing user input
    startProcessing: () => set({
        isListening: false,
        isProcessing: true,
    }),

    // Stop processing
    stopProcessing: () => set({
        isProcessing: false,
    }),

    // Start speaking response
    startSpeaking: () => set({
        isProcessing: false,
        isSpeaking: true,
    }),

    // Stop speaking
    stopSpeaking: () => set({
        isSpeaking: false,
        isIdle: true,
        wakeWordDetected: false,
        currentTranscript: '',
    }),

    // Add message to conversation
    addMessage: (role, content, searchPerformed = false) => set((state) => ({
        conversation: [
            ...state.conversation,
            { role, content, timestamp: Date.now(), searchPerformed },
        ],
    })),

    // Set error
    setError: (error) => set({ error }),

    // Clear error
    clearError: () => set({ error: null }),

    // Reset to idle state
    reset: () => set({
        isIdle: true,
        isListening: false,
        isProcessing: false,
        isSpeaking: false,
        wakeWordDetected: false,
        currentTranscript: '',
        error: null,
    }),

    // Clear conversation history
    clearConversation: () => set({ conversation: [] }),

    // Get current status label
    getStatusLabel: () => {
        const state = get();
        if (state.isSpeaking) return 'Speaking';
        if (state.isProcessing) return 'Processing';
        if (state.isListening) return 'Listening';
        if (state.wakeWordDetected) return 'Active';
        return 'Idle';
    },
}));

export default useJarvisStore;
