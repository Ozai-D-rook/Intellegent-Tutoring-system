import React, { createContext, useContext, useState } from 'react';
import { aiService } from '../services/aiService';

const AIContext = createContext();

export const useAI = () => useContext(AIContext);

export const AIProvider = ({ children }) => {
    // Chat State
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm Esther, your AI Tutor. Ask me anything about your current lesson.", sender: 'bot' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // Context Awareness
    const [currentLessonContext, setCurrentLessonContext] = useState("");

    const sendMessage = async (text) => {
        // Add User Message
        const userMsg = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        // Get AI Response
        const history = messages.map(m => ({ role: m.sender === 'bot' ? 'pesta' : 'user', content: m.text }));

        const responseText = await aiService.chat(text, currentLessonContext, history);

        // Add Bot Message
        const aiMsg = { id: Date.now() + 1, text: responseText, sender: 'bot' };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    };

    const updateContext = (context) => {
        setCurrentLessonContext(context);
    };

    return (
        <AIContext.Provider value={{
            messages,
            isTyping,
            sendMessage,
            updateContext,
            currentLessonContext
        }}>
            {children}
        </AIContext.Provider>
    );
};
