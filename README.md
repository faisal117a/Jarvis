# J.A.R.V.I.S - AI Assistant

> Just A Rather Very Intelligent System

A web-based AI assistant inspired by Tony Stark's JARVIS, featuring voice input, text-to-speech output, real-time web search, and a premium sci-fi interface.

![JARVIS](https://img.shields.io/badge/JARVIS-v1.0-00d4ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)

## ✨ Features

- 🎤 **Voice Input** - Click the mic button to speak
- 🔊 **Voice Output** - JARVIS responds with British AI voice (ElevenLabs)
- 🔍 **Real-time Web Search** - Powered by SearchAPI.io
- 🤖 **AI Chat** - Powered by OpenAI GPT-4o-mini
- 🔐 **PIN Security** - Protected access with 6-digit PIN
- 🎨 **Premium UI** - Dark sci-fi theme with animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/faisal117a/Jarvis.git
   cd Jarvis
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy the example env file
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` with your API keys:
   - `OPENAI_API_KEY` - Get from [OpenAI](https://platform.openai.com/api-keys)
   - `SEARCHAPI_API_KEY` - Get from [SearchAPI.io](https://www.searchapi.io/)
   - `ELEVENLABS_API_KEY` - Get from [ElevenLabs](https://elevenlabs.io/)
   - `JARVIS_PIN` - Set your 6-digit access PIN

4. **Start the servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 🔐 Security

JARVIS requires a 6-digit PIN to access. Configure it in `backend/.env`:

```
JARVIS_PIN=123456
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React, Vite, TailwindCSS |
| Backend | Node.js, Express |
| AI | OpenAI GPT-4o-mini |
| Voice | ElevenLabs TTS |
| Search | SearchAPI.io |

## 📁 Project Structure

```
jarvis/
├── backend/
│   ├── routes/
│   │   ├── auth.js      # PIN verification
│   │   ├── chat.js      # AI chat
│   │   ├── search.js    # Web search
│   │   └── tts.js       # Text-to-speech
│   ├── services/
│   │   ├── openaiService.js
│   │   ├── searchService.js
│   │   └── elevenLabsService.js
│   ├── index.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── index.css
│   └── vite.config.js
└── README.md
```

## 🎨 Screenshots

The interface features a dark sci-fi theme with:
- Animated status ring
- Glowing cyan accents
- Responsive layout
- Premium message bubbles

## 📝 License

MIT License - Feel free to use and modify!

---

**Powered by [webworldcenter.com](https://webworldcenter.com)**
