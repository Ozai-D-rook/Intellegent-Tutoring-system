require('dotenv').config();
const aiService = require('./services/aiService');

async function test() {
    console.log("Testing AI Service with model: gemini-flash-latest");
    try {
        const response = await aiService.generateChatResponse("Hello, who are you?");
        console.log("✅ AI Response:", response);
    } catch (error) {
        console.error("❌ Test Failed:", error);
    }
}

test();
