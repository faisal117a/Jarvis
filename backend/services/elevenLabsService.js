/**
 * Default ElevenLabs voice ID for British accent
 * Daniel - British, calm, authoritative
 */
const DEFAULT_VOICE_ID = 'onwK4e9ZLuTAKqWW03F9'; // Daniel voice

/**
 * Generate speech audio from text using ElevenLabs
 * @param {string} text - Text to convert to speech
 * @returns {Promise<Buffer>} - Audio buffer
 */
export async function generateSpeech(text, apiKey = null, voiceId = null) {
    const key = apiKey || process.env.ELEVENLABS_API_KEY;
    const voice = voiceId || process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;

    if (!key) {
        throw new Error('ElevenLabs API key not configured');
    }

    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': key,
                },
                body: JSON.stringify({
                    text,
                    // Using newer model that's available on free tier
                    model_id: 'eleven_turbo_v2_5',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                        style: 0.0,
                        use_speaker_boost: true,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs Response:', response.status, errorText);
            throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (error) {
        console.error('ElevenLabs Error:', error.message);
        throw error;
    }
}

export default { generateSpeech };

