const axios = require('axios');
require('dotenv').config();

const deepseekClient = axios.create({
    baseURL: process.env.DEEPSEEK_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    }
});

/**
 * Obtiene una respuesta inteligente de DeepSeek basada en el contexto y el historial.
 * @param {string} userMessage - El mensaje enviado por el cliente.
 * @param {Array} history - Historial de la conversación (opcional).
 * @param {string} systemPrompt - El prompt del sistema que define la personalidad del bot.
 */
async function getChatCompletion(userMessage, history = [], systemPrompt = '') {
    try {
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: userMessage }
        ];

        const response = await deepseekClient.post('/chat/completions', {
            model: 'deepseek-chat',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error llamando a la API de DeepSeek:', error.response ? error.response.data : error.message);
        throw new Error('No se pudo obtener respuesta de la IA');
    }
}

module.exports = {
    getChatCompletion
};
