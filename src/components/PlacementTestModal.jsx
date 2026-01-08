import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Brain, ArrowRight, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useData } from '../context/DataContext';

const PlacementTestModal = () => {
    const { currentUser, updateUser } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentExternalStep, setCurrentExternalStep] = useState('intro'); // intro, test, result
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(0);
    const [placementResult, setPlacementResult] = useState(null); // { level: 'Advanced', reason: '...' }

    // Should this modal show?
    // Only if user has seen welcome video BUT has NOT taken placement test
    useEffect(() => {
        if (currentUser && currentUser.has_seen_welcome && !currentUser.has_taken_placement_test) {
            setIsOpen(true);
        }
    }, [currentUser]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const res = await fetch(`${API_URL}/ai/placement`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.questions) {
                setQuestions(data.questions);
                setCurrentExternalStep('test');
                setCurrentQuestionIndex(0);
            }
        } catch (error) {
            console.error("Failed to load placement test:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (optionIndex) => {
        setAnswers({ ...answers, [currentQuestionIndex]: optionIndex });
    };

    const handleNext = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Finish Test
            calculateAndSubmit();
        }
    };

    const calculateAndSubmit = async () => {
        setLoading(true);
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctIndex) correctCount++;
        });

        const finalScore = correctCount;
        setScore(finalScore);

        // Simple Classification Logic (can be enhanced by AI later)
        let level = 'Beginner';
        let reason = 'Keep practicing to build your foundation.';

        if (finalScore >= 8) {
            level = 'Advanced';
            reason = 'Excellent logical and reasoning skills!';
        } else if (finalScore >= 5) {
            level = 'Intermediate';
            reason = 'Good understanding, ready for standard coursework.';
        }

        setPlacementResult({ level, reason });

        try {
            // Update Supabase
            const { error } = await supabase
                .from('profiles')
                .update({
                    learning_level: level,
                    has_taken_placement_test: true
                })
                .eq('id', currentUser.id);

            if (!error) {
                // Update Local Context
                updateUser({
                    ...currentUser,
                    learning_level: level,
                    has_taken_placement_test: true
                });
            }
            setCurrentExternalStep('result');
        } catch (err) {
            console.error("Error saving placement:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
                >
                    {/* Intro Screen */}
                    {currentExternalStep === 'intro' && (
                        <div className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
                                <Brain size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Let's find your starting point! 🚀</h2>
                            <p className="text-gray-600 text-lg">
                                Take a quick 10-question logic assessment so our AI can customize the learning experience for you.
                            </p>
                            <button
                                onClick={fetchQuestions}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {loading ? 'Preparing Test...' : 'Start Assessment'}
                            </button>
                        </div>
                    )}

                    {/* Test Screen */}
                    {currentExternalStep === 'test' && questions.length > 0 && (
                        <div className="flex flex-col h-[600px]">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <span className="font-bold text-gray-500">Question {currentQuestionIndex + 1}/{questions.length}</span>
                                <div className="flex space-x-1">
                                    {questions.map((_, i) => (
                                        <div key={i} className={`h-1.5 w-6 rounded-full ${i <= currentQuestionIndex ? 'bg-blue-500' : 'bg-gray-200'}`} />
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-8 overflow-y-auto">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                                    {questions[currentQuestionIndex].question}
                                </h3>

                                <div className="space-y-3">
                                    {questions[currentQuestionIndex].options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            className={`w-full p-4 text-left rounded-xl border-2 transition-all ${answers[currentQuestionIndex] === idx
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${answers[currentQuestionIndex] === idx ? 'border-blue-500' : 'border-gray-300'}`}>
                                                    {answers[currentQuestionIndex] === idx && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                                                </div>
                                                {opt}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={handleNext}
                                    disabled={answers[currentQuestionIndex] === undefined || loading}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {loading ? 'Submitting...' : (currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question')}
                                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Result Screen */}
                    {currentExternalStep === 'result' && placementResult && (
                        <div className="p-10 text-center space-y-8">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce">
                                <CheckCircle size={48} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">You are an {placementResult.level} Learner!</h2>
                                <p className="text-gray-500">Score: {score}/{questions.length}</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-xl text-left border border-gray-100">
                                <p className="text-gray-700 italic">"{placementResult.reason}"</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PlacementTestModal;
