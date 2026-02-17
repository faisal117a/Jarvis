import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

// Helper to update .env file
const updateEnvFile = (newKeys) => {
    try {
        let envContent = '';
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }

        let updatedContent = envContent;

        // Map frontend keys to backend ENV variables
        // We only update what is passed
        const mapping = {
            openaiApiKey: 'OPENAI_API_KEY',
            searchApiKey: 'SEARCHAPI_API_KEY',
            elevenLabsApiKey: 'ELEVENLABS_API_KEY',
            elevenLabsVoiceId: 'ELEVENLABS_VOICE_ID'
        };

        Object.keys(newKeys).forEach(frontKey => {
            const envKey = mapping[frontKey];
            const value = newKeys[frontKey];

            if (envKey && value !== undefined) {
                // Regex to find "KEY=value" respecting multiline
                // m flag makes ^ match start of line
                const regex = new RegExp(`^${envKey}=.*`, 'gm');

                if (regex.test(updatedContent)) {
                    // Update existing line
                    updatedContent = updatedContent.replace(regex, `${envKey}=${value}`);
                } else {
                    // Append new line if not exists
                    // Ensure we have a newline before if the file is not empty and doesn't end with one
                    const prefix = (updatedContent && !updatedContent.endsWith('\n')) ? '\n' : '';
                    updatedContent += `${prefix}${envKey}=${value}\n`;
                }

                // Update current process env so we don't need restart for immediate effect
                process.env[envKey] = value;
            }
        });

        fs.writeFileSync(envPath, updatedContent);
        return true;
    } catch (error) {
        console.error('Failed to update .env:', error);
        return false;
    }
};

/**
 * GET /api/config/status
 * Check if API keys are configured in .env
 */
router.get('/status', (req, res) => {
    const status = {
        configured: !!process.env.OPENAI_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
        searchapi: !!process.env.SEARCHAPI_API_KEY,
        elevenlabs: !!process.env.ELEVENLABS_API_KEY
    };
    res.json(status);
});

/**
 * POST /api/config/update
 * Update .env file with new keys
 */
router.post('/update', (req, res) => {
    const { keys, pin } = req.body;

    if (!keys) {
        return res.status(400).json({ error: 'No keys provided' });
    }

    const correctPin = (process.env.JARVIS_PIN || '').trim();
    // Check if system is already configured (has OpenAI key)
    const isConfigured = !!process.env.OPENAI_API_KEY;

    // If configured, require PIN to update
    if (isConfigured) {
        if (!pin || pin.trim() !== correctPin) {
            console.log(`Update attempt failed. Invalid PIN. Expected: ${correctPin ? 'SET' : 'NOT_SET'}, Received: ${pin}`);
            // Fallback: If no PIN is set in env, allow it (initial setup edge case)
            if (correctPin) {
                return res.status(401).json({ error: 'Invalid security PIN' });
            }
        }
    }

    if (updateEnvFile(keys)) {
        res.json({ success: true, message: 'Configuration updated successfully' });
    } else {
        res.status(500).json({ error: 'Failed to write configuration file' });
    }
});

export default router;
