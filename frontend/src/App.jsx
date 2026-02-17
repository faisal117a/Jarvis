import React, { useEffect, useState, useRef } from 'react';
import { useJarvisStore } from './store/jarvisStore';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import SetupWizard from './components/SetupWizard';

/**
 * PIN Entry Screen Component
 */
function PinScreen({ onSuccess, title = 'Security Authentication Required' }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newPin = pin.split('');
    newPin[index] = value;
    const updatedPin = newPin.join('').slice(0, 6);
    setPin(updatedPin);
    setError('');

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      // Keep trying to focus if it didn't work (React timing issue)
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
    }

    // Auto-submit when 6 digits entered
    if (updatedPin.length === 6) {
      verifyPin(updatedPin);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setPin(pasted);
      verifyPin(pasted);
    }
  };

  const verifyPin = async (pinCode) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinCode }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(pinCode);
      } else {
        setError('Invalid PIN. Access denied.');
        setPin('');
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Connection error. Please try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pin-screen">
      <div className="pin-container">
        {/* Logo */}
        <div className="pin-logo">
          <div className="pin-logo-ring">
            <span>J</span>
          </div>
        </div>

        <h1 className="pin-title">J.A.R.V.I.S</h1>
        <p className="pin-subtitle">{title}</p>

        {/* PIN Input */}
        <div className="pin-inputs">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={pin[i] || ''}
              onChange={(e) => handlePinChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="pin-input"
              disabled={loading}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && <p className="pin-error">{error}</p>}

        {/* Loading */}
        {loading && (
          <div className="pin-loading">
            <div className="pin-spinner" />
            <span>Verifying...</span>
          </div>
        )}

        {/* Hint */}
        <p className="pin-hint">Enter 6-digit access code (Default: 224232)</p>
      </div>
    </div>
  );
}

/**
 * JARVIS Main Application
 */
function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [apiKeys, setApiKeys] = useState({});

  // New state handling for re-authentication
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [verifiedPin, setVerifiedPin] = useState(null);

  const {
    isIdle,
    isProcessing,
    isListening,
    isSpeaking,
    conversation,
    currentTranscript,
    addMessage,
    stopProcessing,
    reset,
    error,
    clearError,
    clearConversation,
  } = useJarvisStore();

  const { startRecognition, stopRecognition } = useSpeechRecognition();
  const { playAudio } = useAudioPlayer();

  const [inputValue, setInputValue] = useState('');
  const processingRef = useRef(false);
  const lastMessageRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Check configuration on load
  const loadConfig = async () => {
    try {
      const res = await fetch('/api/config/status');
      const data = await res.json();

      // If backend not configured, prompt user immediately
      // But only if we are authenticated (so after PIN screen)
      if (!data.configured) {
        // We'll handle this logic after initial auth
        // Pass a flag down or check again
      }
      return data.configured;
    } catch (err) {
      console.error('Config check failed', err);
      return false;
    }
  };

  useEffect(() => {
    // Initial check is handled by auth flow now really
    // But we might want to know if system is configured to change start screen text?
  }, []);

  const handleInitialAuthSuccess = async (pin) => {
    setIsAuthenticated(true);
    // After auth, check if system is configured
    const configured = await loadConfig();
    if (!configured) {
      // If not configured, show setup immediately. 
      // We don't need PIN again because we just entered it.
      setVerifiedPin(pin);
      setShowSetup(true);
    }
  };

  const handleUpdateKeysClick = () => {
    setIsReauthenticating(true);
  };

  const handleReauthSuccess = (pin) => {
    setVerifiedPin(pin);
    setIsReauthenticating(false);
    setShowSetup(true);
  };

  const handeSetupClose = () => {
    setShowSetup(false);
    setVerifiedPin(null);
    // Maybe reload page to ensure new env vars are picked up cleanly?
    window.location.reload();
  };

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isProcessing]);

  // Process new user messages
  useEffect(() => {
    const lastMessage = conversation[conversation.length - 1];
    if (
      lastMessage &&
      lastMessage.role === 'user' &&
      isProcessing &&
      !processingRef.current &&
      lastMessage.timestamp !== lastMessageRef.current
    ) {
      processingRef.current = true;
      lastMessageRef.current = lastMessage.timestamp;
      sendToBackend(lastMessage.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, isProcessing]);

  const sendToBackend = async (message) => {
    try {
      const context = conversation.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      console.log('Sending to backend:', message);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, context }),
      });

      const data = await res.json();

      const reply = data.reply || 'I apologize, sir. I am experiencing technical difficulties.';
      addMessage('assistant', reply, data.searchPerformed);

      if (!res.ok) {
        console.error('Backend error:', data.error);
      }

      if (res.ok) {
        try {
          const ttsRes = await fetch('/api/tts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: reply }),
          });

          if (ttsRes.ok) {
            const audio = await ttsRes.arrayBuffer();
            await playAudio(audio);
          } else {
            finishProcessing();
          }
        } catch (ttsErr) {
          console.warn('TTS error:', ttsErr);
          finishProcessing();
        }
      } else {
        finishProcessing();
      }
    } catch (err) {
      console.error('Network error:', err);
      addMessage('assistant', 'I apologize, sir. I cannot connect to my backend systems.');
      finishProcessing();
    } finally {
      processingRef.current = false;
    }
  };

  const finishProcessing = () => {
    stopProcessing();
    setTimeout(() => reset(), 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing && !isListening) {
      addMessage('user', inputValue.trim());
      useJarvisStore.getState().startProcessing();
      setInputValue('');
    }
  };

  const handleMicClick = () => {
    if (isProcessing || isSpeaking) return;
    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const getState = () => {
    if (isSpeaking) return 'speaking';
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return 'idle';
  };

  const state = getState();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 1. Initial Authentication
  if (!isAuthenticated) {
    return <PinScreen onSuccess={handleInitialAuthSuccess} />;
  }

  // 2. Re-authentication for Settings
  if (isReauthenticating) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <PinScreen onSuccess={handleReauthSuccess} title="Confirm Access to System Config" />
        <button
          onClick={() => setIsReauthenticating(false)}
          className="absolute top-8 right-8 text-gray-500 hover:text-white"
        >
          CANCEL
        </button>
      </div>
    );
  }

  return (
    <div className="jarvis-app">
      {/* Header */}
      <header className="jarvis-header">
        <div className="jarvis-logo">
          <div className="jarvis-logo-icon">J</div>
          <div className="jarvis-logo-text">
            <h1>J.A.R.V.I.S</h1>
            <p>Just A Rather Very Intelligent System</p>
          </div>
        </div>
        <div className={`jarvis-status-badge ${isIdle ? 'idle' : 'active'}`}>
          {isIdle ? 'STANDBY' : 'ACTIVE'}
        </div>
      </header>

      {/* Main Content */}
      <main className="jarvis-main">
        {/* Sidebar */}
        <aside className="jarvis-sidebar">
          {/* Status Ring */}
          <div className="status-ring-container">
            <div className={`status-ring ${state}`}>
              <div className="status-ring-outer" />
              <div className="status-ring-inner">J</div>
            </div>
            <span className="status-label">{state.toUpperCase()}</span>
          </div>

          {/* Mic Button */}
          <div className="mic-button-container">
            <button
              className={`mic-button ${state !== 'idle' ? state : ''}`}
              onClick={handleMicClick}
              disabled={isProcessing || isSpeaking}
            >
              {isProcessing ? (
                <svg className="animate-spin" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" opacity="0.75" />
                </svg>
              ) : isSpeaking ? (
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.5c-1.1 0-2.3.66-2.66 1.9A9.76 9.76 0 001.5 12c0 .9.12 1.77.35 2.6.34 1.24 1.52 1.9 2.66 1.9h1.93l4.5 4.5c.94.94 2.56.27 2.56-1.06V4.06z" />
                </svg>
              ) : isListening ? (
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                  <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 01-6 6.71v2.29h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.29a6.75 6.75 0 01-6-6.71v-1.5a.75.75 0 01.75-.75z" />
                </svg>
              )}
            </button>
            <span className="mic-button-label">
              {isListening ? 'Tap to stop' : isProcessing ? 'Processing...' : isSpeaking ? 'Speaking...' : 'Tap to speak'}
            </span>
          </div>

          {/* Voice Info */}
          <div className="voice-info">
            <p className="voice-info-label">Voice Activation</p>
            <p className="voice-info-value">Use Mic Button</p>
          </div>

          {/* Settings Button (Update Keys) */}
          <button
            onClick={handleUpdateKeysClick}
            className="mt-4 w-full py-2 px-3 rounded border border-gray-700 bg-gray-900/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all text-xs font-mono flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            UPDATE KEYS
          </button>

          {/* Error */}
          {error && (
            <div style={{ padding: '12px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '8px', width: '100%' }}>
              <p style={{ fontSize: '11px', color: '#ff4444', marginBottom: '4px' }}>{error}</p>
              <button onClick={clearError} style={{ fontSize: '10px', color: '#ff8888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Dismiss
              </button>
            </div>
          )}
        </aside>

        {/* Chat Panel */}
        <section className="jarvis-chat">
          {/* Chat Header */}
          <div className="chat-header">
            <span className="chat-header-title">CONSOLE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="chat-header-meta">{conversation.length} messages</span>
              {conversation.length > 0 && (
                <button
                  onClick={() => window.confirm('Clear all messages?') && clearConversation()}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--jarvis-text-muted)' }}
                  title="Clear conversation"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {conversation.length === 0 ? (
              <div className="welcome-screen">
                <div className="welcome-icon">
                  <span>J</span>
                </div>
                <h2 className="welcome-title">{getGreeting()}, Sir.</h2>
                <p className="welcome-subtitle">
                  I am JARVIS, your personal AI assistant. How may I be of service today?
                </p>
                <div className="welcome-suggestions">
                  {['What can you do?', "What's the latest news?", 'Tell me a fun fact'].map((s) => (
                    <button
                      key={s}
                      className="suggestion-btn"
                      onClick={() => {
                        addMessage('user', s);
                        useJarvisStore.getState().startProcessing();
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="welcome-hint">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.75 6.75 0 01-6 6.71v2.29h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.29a6.75 6.75 0 01-6-6.71v-1.5a.75.75 0 01.75-.75z" />
                  </svg>
                  <span>Click the mic button to speak</span>
                </div>
              </div>
            ) : (
              <>
                {conversation.map((msg, i) => (
                  <div key={msg.timestamp || i} className={`message ${msg.role}`}>
                    <div className="message-avatar">{msg.role === 'user' ? 'U' : 'J'}</div>
                    <div className="message-content">
                      <div className="message-bubble">{msg.content}</div>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Live Transcript */}
            {isListening && currentTranscript && (
              <div className="message user" style={{ opacity: 0.7 }}>
                <div className="message-avatar">U</div>
                <div className="message-content">
                  <div className="message-bubble" style={{ fontStyle: 'italic' }}>{currentTranscript}...</div>
                </div>
              </div>
            )}

            {/* Typing */}
            {isProcessing && (
              <div className="message assistant">
                <div className="message-avatar">J</div>
                <div className="message-content">
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chat-input-container" onSubmit={handleSubmit}>
            <div className="chat-input-wrapper">
              <input
                type="text"
                className="chat-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message or command..."
                disabled={isProcessing || isListening}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!inputValue.trim() || isProcessing || isListening}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="jarvis-footer">
        <span>JARVIS v1.0 • Powered by webworldcenter.com</span>
        <span>© Stark Industries</span>
      </footer>

      <SetupWizard
        isOpen={showSetup}
        onClose={handeSetupClose}
        onSave={(keys) => setApiKeys(keys)}
        pin={verifiedPin}
      />
    </div>
  );
}

export default App;
