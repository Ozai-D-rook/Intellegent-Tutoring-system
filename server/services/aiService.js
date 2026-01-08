const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || 'MockKey');

const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

const aiService = {
    /**
     * Generate context-aware chat response ("Pesta")
     */
    async generateChatResponse(message, context, history = []) {
        try {
            if (!process.env.AI_API_KEY) {
                return "AI Configuration Error: API Key missing on server.";
            }

            // Construct System Prompt
            const systemPrompt = `
                You are Pesta, an intelligent and helpful AI Tutor for the AI-ITS platform.
                
                CONTEXT INSTRUCTIONS:
                - You have access to the specific lesson content provided below.
                - Answer the student's question based PRIMARILY on this context.
                - If the answer is not in the context, you may use general knowledge but clearly state that it's outside the current lesson scope.
                - Be encouraging, concise, and educational.
                - Do not give direct answers to quiz questions; guide the student instead.

                CURRENT LESSON CONTEXT:
                ${context || "No specific lesson context provided."}
            `;

            // Start Chat
            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: systemPrompt }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I am Pesta, ready to assist based on the provided lesson context." }],
                    },
                    ...history.map(h => ({
                        role: h.role === 'pesta' ? 'model' : 'user',
                        parts: [{ text: h.content }]
                    }))
                ],
                generationConfig: {
                    maxOutputTokens: 500,
                },
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("AI Service Error (Chat):", error);
            return "I'm having trouble connecting to my brain right now. Please try again later.";
        }
    },

    /**
     * Generate Diagnostic Pre-test Questions
     */
    async generateDiagnosticTest(topic) {
        try {
            if (!process.env.AI_API_KEY) throw new Error("API Key Missing");

            const prompt = `
                Create a diagnostic pre-test for the topic: "${topic}".
                Generate 5 multiple-choice questions.
                Return ONLY raw JSON array. format:
                [
                    { "question": "...", "options": ["A", "B", "C", "D"], "answer": 0 }
                ]
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Cleanup markdown code blocks if present
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);

        } catch (error) {
            console.error("AI Service Error (Diagnostic):", error);
            // Fallback mock data
            return [
                { question: "Diagnostic generation failed. Mock Question 1?", options: ["Yes", "No"], answer: 0 }
            ];
        }
    },

    /**
     * Classify Student Level
     */
    async classifyStudent(performanceData) {
        try {
            if (!process.env.AI_API_KEY) throw new Error("API Key Missing");

            const prompt = `
                Analyze this student's performance:
                ${JSON.stringify(performanceData)}

                Classify them as "Beginner", "Intermediate", or "Advanced".
                Provide a short reasoning.
                Return JSON: { "level": "...", "reason": "..." }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);

        } catch (error) {
            console.error("AI Service Error (Classify):", error);
            return { level: "Beginner", reason: "Fallback due to AI error." };
        }
    },

    /**
     * Generate 10-question Placement Test (IQ/Logic)
     */
    async generatePlacementTest() {
        try {
            if (!process.env.AI_API_KEY) throw new Error("API Key Missing");

            const prompt = `
                Generate a 10-question placement test to assess a student's knowledge in Physics.
                Focus specifically on these three topics:
                1. Gravity (3 questions)
                2. Molecular Property of Matter (4 questions)
                3. Sound (3 questions)
                
                The questions should range from basic definitions to application of principles.
                
                Return ONLY raw JSON array. format:
                [
                    { 
                        "id": 1,
                        "question": "...", 
                        "options": ["A", "B", "C", "D"], 
                        "correctIndex": 0, 
                        "category": "Logic" 
                    }
                ]
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean markdown
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);

        } catch (error) {
            console.error("AI Service Error (Placement):", error);
            // Fallback mock data
            return Array(5).fill(null).map((_, i) => ({
                id: i + 1,
                question: `Mock Logic Question ${i + 1}?`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctIndex: 0,
                category: "Mock"
            }));
        }
    }
};

module.exports = aiService;
