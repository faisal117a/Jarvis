# JARVIS Web App MVP – COMPLETE BUILD PROMPT (.md)

> **Project Name**: JARVIS (Web)
> 
> **Inspiration**: Tony Stark’s JARVIS (cinematic, calm, humanistic)
> 
> **Scope**: MVP (working, expandable, production-minded)

---

## 1. PRODUCT GOAL

Build a **web-based JARVIS assistant** that:
- Activates on the keyword **"Jarvis"**
- Accepts **voice input** and **text input**
- Responds with **text + cinematic British voice**
- Searches the web in real time when needed
- Uses a **sci-fi, humanistic UI** (NO AI gradients)

This is not a chatbot UI — it is a **system companion**.

---

## 2. FINAL TECH STACK (LOCKED)

### Frontend
- React (Vite)
- Tailwind CSS
- Web Speech API (speech → text)
- Web Audio API (audio playback)

### Backend
- Node.js
- Express.js

### APIs
- OpenAI API (responses)
- Google Search API (SearchAPI)
- ElevenLabs API (British TTS voice)

### Configuration
- `.env` file (all secrets)

---

## 3. ENVIRONMENT VARIABLES (.env)

```
OPENAI_API_KEY=
GOOGLE_SEARCH_API_KEY=
GOOGLE_SEARCH_ENGINE_ID=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=optional
```

---

## 4. CORE FEATURES (MVP)

### 4.1 Wake Word Detection
- Passive listening via Web Speech API
- Keyword detection: **"jarvis"**
- On detection:
  - UI activates
  - Listening mode starts

> NOTE: No ML wake-word engine in MVP

---

### 4.2 Voice Input
- Continuous listening when active
- Auto-stop on silence (5–7 seconds)
- Manual stop supported

---

### 4.3 Voice Output
- ElevenLabs British cinematic voice
- Configurable voice ID
- Slight delay before playback
- Natural pacing

---

### 4.4 Chat Interface
- Console / HUD style
- User messages (right)
- JARVIS messages (left)
- Session-only memory

---

### 4.5 Real-Time Web Search

Triggered when input contains:
- latest
- today
- current
- price
- news

Flow:
1. Detect intent
2. Fetch Google search results
3. Extract top 3–5 links
4. Summarize with OpenAI
5. Respond naturally

---

## 5. GLOBAL STATE MODEL

```ts
isIdle: boolean
isListening: boolean
isProcessing: boolean
isSpeaking: boolean
wakeWordDetected: boolean
conversation: Message[]
```

---

## 6. USER FLOW

1. User opens app
2. Mic permission requested
3. JARVIS is idle
4. User says: "Jarvis"
5. System activates
6. User speaks command
7. System processes:
   - AI only OR
   - Web search + AI summary
8. JARVIS replies (text + voice)
9. Returns to idle

---

## 7. FILE STRUCTURE

```
jarvis-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MicButton.jsx
│   │   │   ├── StatusRing.jsx
│   │   ├── hooks/
│   │   │   ├── useWakeWord.js
│   │   │   ├── useSpeechRecognition.js
│   │   │   ├── useAudioPlayer.js
│   │   ├── store/
│   │   │   └── jarvisStore.js
│   │   ├── styles/
│   │   │   └── theme.css
│   │   └── App.jsx
│   └── tailwind.config.js
│
├── backend/
│   ├── routes/
│   │   ├── chat.js
│   │   ├── search.js
│   │   └── tts.js
│   ├── services/
│   │   ├── openaiService.js
│   │   ├── searchService.js
│   │   └── elevenLabsService.js
│   ├── index.js
│   └── .env
│
└── README.md
```

---

## 8. BACKEND API DESIGN

### POST /api/chat
Input:
```json
{ "message": "text", "context": [] }
```
Output:
```json
{ "reply": "text" }
```

---

### POST /api/search
Input:
```json
{ "query": "latest news" }
```
Output:
```json
{ "summary": "text" }
```

---

### POST /api/tts
Input:
```json
{ "text": "Jarvis reply" }
```
Output:
- Audio stream or audio URL

---

## 9. MASTER SYSTEM PROMPT (OPENAI)

```
You are JARVIS.

Personality:
- Calm
- British
- Cinematic
- Intelligent

Rules:
- Be concise by default
- Expand only if required
- Never mention APIs or system internals
- If real-time data is needed, request web search results

Tone:
- Confident
- Polite
- Human-like
```

---

## 10. DESIGN GUIDELINES (STRICT)

DO NOT USE:
- AI gradients
- Neon glow
- Glassmorphism overload

USE:
- Matte black backgrounds
- Steel gray panels
- Soft cyan accents
- Thin lines
- Subtle pulse animations

---

## 11. MUST-HAVE MVP CHECKLIST

- Wake word activation
- Voice input
- Voice output
- Chat UI
- Real-time search
- Session memory
- Secure .env usage

---

## 12. RESULT SUMMARY

After MVP completion you will have:
- A working JARVIS-like web assistant
- Voice-driven interaction
- Live web intelligence
- Expandable, clean architecture

Future phases may include:
- Persistent memory
- Automation tools
- Background ambient system sounds
- Vision input

---

## 13. FINAL NOTES

This MVP is intentionally:
- Lightweight
- Cinematic
- Developer-friendly

Build correctness first.
Polish second.
Intelligence grows over time.

"Sometimes you gotta run before you can walk." — Tony Stark