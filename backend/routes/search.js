import express from 'express';
import { performSearch } from '../services/searchService.js';
import { generateResponse } from '../services/openaiService.js';

import { configMiddleware } from '../middleware/configMiddleware.js';

const router = express.Router();
router.use(configMiddleware);

/**
 * POST /api/search
 * Perform web search and return summarized results
 */
router.post('/', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Query is required' });
        }

        console.log('🔍 Manual search for:', query);

        const searchResults = await performSearch(query, req.config.searchApiKey);

        if (!searchResults) {
            return res.json({
                summary: 'I was unable to find relevant information on that topic, sir.',
                rawResults: null,
            });
        }

        // Summarize results with OpenAI
        const summary = await generateResponse(
            `Please summarize the following search results about "${query}" in a concise, informative way:`,
            [],
            searchResults,
            req.config
        );

        res.json({
            summary,
            rawResults: searchResults,
        });
    } catch (error) {
        console.error('Search Error:', error.message);
        res.status(500).json({
            error: 'Search failed',
            summary: 'I apologize, sir. The search systems are temporarily unavailable.',
        });
    }
});

export default router;
