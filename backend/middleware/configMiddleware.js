/**
 * Middleware to extract API keys from request headers.
 * keys can be passed as:
 * x-openai-key
 * x-searchapi-key
 * x-elevenlabs-key
 * 
 * Falls back to process.env if headers are not present.
 */
export const configMiddleware = (req, res, next) => {
    req.config = {
        openaiApiKey: req.headers['x-openai-key'] || process.env.OPENAI_API_KEY,
        searchApiKey: req.headers['x-searchapi-key'] || process.env.SEARCHAPI_API_KEY,
        elevenLabsApiKey: req.headers['x-elevenlabs-key'] || process.env.ELEVENLABS_API_KEY,
        elevenLabsVoiceId: req.headers['x-elevenlabs-voice-id'] || process.env.ELEVENLABS_VOICE_ID,
        jarvisPin: process.env.JARVIS_PIN // PIN is server-side only for now, or could be header too
    };
    next();
};
