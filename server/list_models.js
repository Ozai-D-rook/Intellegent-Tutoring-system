const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

async function listModels() {
    try {
        const modelResponse = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get access to client if needed, or just use direct list if available in this SDK version. 
        // Actually SDK usually exposes it differently. Let's try the standard verify way or just standard error handling.
        // The SDK documentation says request to list models is not always directly exposed in the high level client easily in older versions, 
        // but let's try a simple generation with a known 'safe' fallback or just catch the error details more explicitly.

        // Better yet, let's try a few known candidates in a loop and report which one works.
        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-1.0-pro",
            "gemini-pro",
            "gemini-pro-vision"
        ];

        console.log("Testing Model Availability...");

        for (const modelName of candidates) {
            try {
                console.log(`Testing ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                const response = await result.response;
                console.log(`✅ SUCCESS: ${modelName} is working.`);
                process.exit(0); // Exit on first success to save time
            } catch (error) {
                console.log(`❌ FAILED: ${modelName} - ${error.message.split('\n')[0]}`);
            }
        }

        console.log("All common model names failed. Please check API Key permissions.");

    } catch (e) {
        console.error(e);
    }
}

listModels();
