import React, { useState, useRef, useEffect } from 'react';
import { useJarvisStore } from '../store/jarvisStore';
import MessageBubble from './MessageBubble';

/**
 * ChatWindow Component - Fixed
 * Main chat interface with messages and input
 */
function ChatWindow({ onSendMessage }) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const {
        conversation,
        isProcessing,
        isListening,
        currentTranscript,
        clearConversation
    } = useJarvisStore();

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation, isProcessing, currentTranscript]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() && !isProcessing) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleClear = () => {
        if (conversation.length > 0 && window.confirm('Clear conversation history?')) {
            clearConversation();
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="glass-panel h-full flex flex-col relative overflow-hidden">
            {/* Corner Accents */}
            <div className="corner-accent top-left" />
            <div className="corner-accent top-right" />
            <div className="corner-accent bottom-left" />
            <div className="corner-accent bottom-right" />

            {/* Header */}
            <div className="chat-header flex items-center justify-between px-4 py-3 border-b border-[var(--jarvis-steel)]">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--jarvis-text)]">CONSOLE</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--jarvis-text-muted)]">
                        {conversation.length} messages
                    </span>
                    {conversation.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="p-1.5 rounded-lg hover:bg-[var(--jarvis-gray)] text-[var(--jarvis-text-muted)] hover:text-[var(--jarvis-red)] transition-colors"
                            title="Clear conversation"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.length === 0 ? (
                    /* Welcome Screen */
                    <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-fade-in">
                        <div className="w-16 h-16 rounded-full border-2 border-[var(--jarvis-cyan)] flex items-center justify-center mb-4 bg-[var(--jarvis-gray)]">
                            <span className="text-[var(--jarvis-cyan)] text-2xl font-bold">J</span>
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--jarvis-text)] mb-2">
                            {getGreeting()}, Sir.
                        </h2>
                        <p className="text-sm text-[var(--jarvis-text-dim)] mb-6 max-w-md">
                            I am JARVIS, your personal AI assistant. How may I be of service today?
                        </p>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {['What can you do?', "What's the latest news?", 'Tell me a fun fact', 'Help me brainstorm'].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => onSendMessage(suggestion)}
                                    className="px-3 py-1.5 text-xs rounded-full bg-[var(--jarvis-gray)] border border-[var(--jarvis-steel)] text-[var(--jarvis-text-dim)] hover:border-[var(--jarvis-cyan)] hover:text-[var(--jarvis-cyan)] transition-all"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>

                        {/* Voice Hint */}
                        <div className="flex items-center gap-2 text-[var(--jarvis-text-muted)] text-xs">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                                <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                            </svg>
                            <span>Say "<span className="text-[var(--jarvis-cyan)]">Jarvis</span>" to activate voice mode</span>
                        </div>
                    </div>
                ) : (
                    /* Message List */
                    <>
                        {conversation.map((message, index) => (
                            <MessageBubble
                                key={message.timestamp || index}
                                role={message.role}
                                content={message.content}
                                timestamp={message.timestamp}
                                searchPerformed={message.searchPerformed}
                            />
                        ))}
                    </>
                )}

                {/* Live Transcript */}
                {isListening && currentTranscript && (
                    <div className="message-bubble user opacity-70">
                        <p className="text-sm italic">{currentTranscript}...</p>
                    </div>
                )}

                {/* Typing Indicator */}
                {isProcessing && (
                    <div className="flex items-start gap-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-[var(--jarvis-gray)] border border-[var(--jarvis-cyan)] flex items-center justify-center flex-shrink-0">
                            <span className="text-[var(--jarvis-cyan)] text-xs font-bold">J</span>
                        </div>
                        <div className="message-bubble assistant">
                            <div className="typing-indicator">
                                <div className="typing-dot" />
                                <div className="typing-dot" />
                                <div className="typing-dot" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--jarvis-steel)]">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message or command..."
                        className="jarvis-input pr-12"
                        disabled={isProcessing || isListening}
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isProcessing || isListening}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--jarvis-cyan)] text-[var(--jarvis-bg)] disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatWindow;
