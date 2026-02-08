import express from 'express';
import { generateResponse } from '../services/openaiService.js';
import { requiresSearch, performSearch } from '../services/searchService.js';

import { configMiddleware } from '../middleware/configMiddleware.js';

const router = express.Router();
router.use(configMiddleware);

/**
 * POST /api/chat
 * Process user message and return JARVIS response
 */
router.post('/', async (req, res) => {
    try {
        const { message, context = [] } = req.body;

        console.log('📨 Chat request:', { message, contextLength: context.length });

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        let searchResults = null;

        // Check if we need to perform a web search
        if (requiresSearch(message)) {
            console.log('🔍 Web search triggered for:', message);
            try {
                searchResults = await performSearch(message, req.config.searchApiKey);
            } catch (searchError) {
                console.warn('Search failed:', searchError.message);
                // Continue without search results
            }
        }

        // Generate JARVIS response
        console.log('🤖 Generating response...');
        const reply = await generateResponse(message, context, searchResults, req.config);
        console.log('✅ Response generated');

        res.json({
            reply,
            searchPerformed: !!searchResults,
        });
    } catch (error) {
        console.error('❌ Chat Error:', error.message);
        console.error('Full error:', error);

        // Return friendly error as the reply
        res.status(500).json({
            error: error.message,
            reply: 'I apologize, sir. I seem to be experiencing a temporary disruption.',
        });
    }
});

export default router;

