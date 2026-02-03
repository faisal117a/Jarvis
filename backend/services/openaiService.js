import OpenAI from 'openai';

// Lazy initialization - client created on first use
let openaiClient = null;

function getOpenAIClient() {
    if (!openaiClient) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OpenAI API key not configured');
        }
        openaiClient = new OpenAI({ apiKey });
    }
    return openaiClient;
}

const JARVIS_SYSTEM_PROMPT = `You are JARVIS.

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

You speak like a refined British AI assistant from a futuristic setting. Your responses are helpful, direct, and occasionally witty. You address the user respectfully and maintain a calm, composed demeanor at all times.`;

/**
 * Generate a response from JARVIS using OpenAI
 * @param {string} message - User's message
 * @param {Array} context - Previous conversation context
 * @param {string} searchResults - Optional web search results to include
 * @returns {Promise<string>} - JARVIS response
 */
export async function generateResponse(message, context = [], searchResults = null) {
    const messages = [
        { role: 'system', content: JARVIS_SYSTEM_PROMPT },
        ...context,
    ];

    // If we have search results, add them to context
    if (searchResults) {
        messages.push({
            role: 'system',
            content: `Here is current information from the web to help answer the user's query:\n\n${searchResults}\n\nUse this information to provide an accurate, up-to-date response.`,
        });
    }

    messages.push({ role: 'user', content: message });

    try {
        const openai = getOpenAIClient();
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            max_tokens: 500,
            temperature: 0.7,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI Error:', error.message);
        throw new Error('I apologize, sir. I seem to be experiencing a temporary disruption in my cognitive systems.');
    }
}

export default { generateResponse };
