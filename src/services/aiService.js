const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/ai';

export const aiService = {
    /**
     * Send a chat message to Pesta
     * @param {string} message - User's question
     * @param {string} context - Current lesson markdown/text
     * @param {Array} history - Previous chat messages
     */
    async chat(message, context, history = []) {
        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, context, history }),
            });

            if (!response.ok) {
                throw new Error('AI Server Error');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Chat Error:', error);
            return "I'm having trouble retrieving an answer right now. Please ensure the AI Server is running.";
        }
    },

    /**
     * Generate a diagnostic test
     */
    async getDiagnostic(topic) {
        try {
            const response = await fetch(`${API_URL}/diagnostic`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            });
            const data = await response.json();
            return data.questions;
        } catch (error) {
            console.error('Diagnostic Error:', error);
            return [];
        }
    },

    /**
     * Classify student
     */
    async classifyStudent(performance) {
        try {
            const response = await fetch(`${API_URL}/classify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ performance }),
            });
            return await response.json();
        } catch (error) {
            console.error('Classification Error:', error);
            return null;
        }
    }
};
