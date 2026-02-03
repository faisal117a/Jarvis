import express from 'express';
import { generateSpeech } from '../services/elevenLabsService.js';

const router = express.Router();

/**
 * POST /api/tts
 * Convert text to speech using ElevenLabs
 */
router.post('/', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Limit text length for API efficiency
        const truncatedText = text.slice(0, 1000);

        console.log('🔊 Generating speech for:', truncatedText.slice(0, 50) + '...');

        const audioBuffer = await generateSpeech(truncatedText);

        // Set headers for audio response
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length,
            'Cache-Control': 'no-cache',
        });

        res.send(audioBuffer);
    } catch (error) {
        console.error('TTS Error:', error.message);
        res.status(500).json({
            error: 'Speech synthesis failed',
            message: 'Voice systems temporarily offline.',
        });
    }
});

export default router;
