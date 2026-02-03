import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import searchRoutes from './routes/search.js';
import ttsRoutes from './routes/tts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/tts', ttsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', message: 'JARVIS backend is operational.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🤖 JARVIS Backend online on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
