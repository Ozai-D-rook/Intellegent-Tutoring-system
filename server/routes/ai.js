const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
    const { message, context, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    const response = await aiService.generateChatResponse(message, context, history);
    res.json({ response });
});

// POST /api/ai/diagnostic
router.post('/diagnostic', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
    }

    const questions = await aiService.generateDiagnosticTest(topic);
    res.json({ questions });
});

// POST /api/ai/classify
router.post('/classify', async (req, res) => {
    const { performance } = req.body;

    const classification = await aiService.classifyStudent(performance);
    res.json(classification);
});

module.exports = router;
