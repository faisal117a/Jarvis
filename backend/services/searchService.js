/**
 * SearchAPI.io Integration for JARVIS
 * Real-time Google Search via SearchAPI.io
 */

/**
 * Keywords that trigger a web search
 */
const SEARCH_TRIGGERS = [
    'latest', 'today', 'current', 'price', 'news',
    'now', 'recent', 'update', 'weather', 'stock',
    'score', 'result', 'happening', 'trending'
];

/**
 * Check if the message requires a web search
 * @param {string} message - User message
 * @returns {boolean}
 */
export function requiresSearch(message) {
    const lowerMessage = message.toLowerCase();
    return SEARCH_TRIGGERS.some(trigger => lowerMessage.includes(trigger));
}

/**
 * Perform a real-time Google Search via SearchAPI.io
 * @param {string} query - Search query
 * @returns {Promise<string>} - Formatted search results
 */
export async function performSearch(query) {
    const apiKey = process.env.SEARCHAPI_API_KEY;

    if (!apiKey) {
        console.warn('SearchAPI.io API key not configured');
        return null;
    }

    try {
        // SearchAPI.io endpoint
        const url = new URL('https://www.searchapi.io/api/v1/search');
        url.searchParams.append('engine', 'google');
        url.searchParams.append('q', query);
        url.searchParams.append('api_key', apiKey);
        url.searchParams.append('num', '5'); // Get top 5 results

        console.log('🔍 Searching via SearchAPI.io:', query);

        const response = await fetch(url.toString());

        if (!response.ok) {
            const errorText = await response.text();
            console.error('SearchAPI.io Error:', response.status, errorText);
            return null;
        }

        const data = await response.json();

        // Check for errors in response
        if (data.error) {
            console.error('SearchAPI.io Error:', data.error);
            return null;
        }

        // Build comprehensive results from multiple sources
        const results = [];

        // Add AI Overview if available
        if (data.ai_overview?.text) {
            results.push(`📊 AI Overview:\n${data.ai_overview.text}`);
        }

        // Add Answer Box if available (direct answers)
        if (data.answer_box) {
            if (data.answer_box.answer) {
                results.push(`💡 Quick Answer: ${data.answer_box.answer}`);
            } else if (data.answer_box.snippet) {
                results.push(`💡 Quick Answer: ${data.answer_box.snippet}`);
            }
        }

        // Add Knowledge Graph info if available
        if (data.knowledge_graph) {
            const kg = data.knowledge_graph;
            let kgInfo = `📚 ${kg.title || 'Information'}`;
            if (kg.type) kgInfo += ` (${kg.type})`;
            if (kg.description) kgInfo += `\n${kg.description}`;
            results.push(kgInfo);
        }

        // Add organic search results
        if (data.organic_results && data.organic_results.length > 0) {
            const organicFormatted = data.organic_results.slice(0, 5).map((item, index) => {
                let result = `[${index + 1}] ${item.title}`;
                if (item.snippet) result += `\n${item.snippet}`;
                if (item.date) result += `\n📅 ${item.date}`;
                result += `\n🔗 ${item.link}`;
                return result;
            });
            results.push('📄 Search Results:\n' + organicFormatted.join('\n\n'));
        }

        // Add top stories/news if available
        if (data.top_stories && data.top_stories.length > 0) {
            const newsFormatted = data.top_stories.slice(0, 3).map(item => {
                return `• ${item.title} (${item.source}, ${item.date || 'recent'})`;
            });
            results.push('📰 Top Stories:\n' + newsFormatted.join('\n'));
        }

        // Add related questions if available
        if (data.related_questions && data.related_questions.length > 0) {
            const questions = data.related_questions.slice(0, 3).map(q => `• ${q.question}`);
            results.push('❓ Related Questions:\n' + questions.join('\n'));
        }

        if (results.length === 0) {
            console.log('No search results found');
            return null;
        }

        const formattedResults = results.join('\n\n---\n\n');
        console.log('✅ Search completed, found', results.length, 'result sections');

        return formattedResults;
    } catch (error) {
        console.error('Search Error:', error.message);
        return null;
    }
}

/**
 * Get current news headlines
 * @param {string} topic - Optional topic to search news for
 * @returns {Promise<string>} - Formatted news results
 */
export async function getNews(topic = 'world news today') {
    return performSearch(topic + ' news');
}

/**
 * Get weather information
 * @param {string} location - Location to get weather for
 * @returns {Promise<string>} - Weather information
 */
export async function getWeather(location = 'current location') {
    return performSearch(`weather in ${location}`);
}

export default { requiresSearch, performSearch, getNews, getWeather };
