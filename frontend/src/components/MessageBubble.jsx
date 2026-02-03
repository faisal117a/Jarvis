import React from 'react';

/**
 * MessageBubble Component - Fixed
 * Individual chat message display
 */
function MessageBubble({ role, content, timestamp, searchPerformed }) {
    const isUser = role === 'user';

    const formatTime = (ts) => {
        if (!ts) return '';
        return new Date(ts).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
                        ? 'bg-[var(--jarvis-cyan)] text-[var(--jarvis-bg)]'
                        : 'bg-[var(--jarvis-gray)] border border-[var(--jarvis-cyan)] text-[var(--jarvis-cyan)]'
                    }`}
            >
                <span className="text-xs font-bold">{isUser ? 'U' : 'J'}</span>
            </div>

            {/* Message */}
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
                    <p className="text-sm text-[var(--jarvis-text)] whitespace-pre-wrap break-words">
                        {content}
                    </p>
                </div>

                {/* Meta info */}
                <div className={`flex items-center gap-2 mt-1 text-[10px] text-[var(--jarvis-text-muted)] ${isUser ? 'flex-row-reverse' : ''}`}>
                    {timestamp && <span>{formatTime(timestamp)}</span>}
                    {searchPerformed && (
                        <span className="flex items-center gap-1 text-[var(--jarvis-cyan)]">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            Web search
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessageBubble;
