import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useData } from '../context/DataContext';

const WelcomeVideoModal = () => {
    const { currentUser, updateUser } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        // Check if user has seen video
        const checkRequirement = async () => {
            if (currentUser && !currentUser.has_seen_welcome) {
                // Fetch video URL from system settings
                const { data, error } = await supabase
                    .from('system_settings')
                    .select('value')
                    .eq('key', 'welcome_video_url')
                    .single();

                if (data) {
                    setVideoUrl(data.value);
                    // Small delay for UX
                    setTimeout(() => setIsOpen(true), 1500);
                }
            }
        };

        checkRequirement();
    }, [currentUser]);

    const handleClose = async () => {
        setIsOpen(false);
        if (currentUser) {
            // Optimistic update
            updateUser({ has_seen_welcome: true });

            // DB Update
            const { error } = await supabase
                .from('profiles')
                .update({ has_seen_welcome: true })
                .eq('id', currentUser.id);

            if (error) console.error("Error updating welcome status:", error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center">
                                <Play className="w-5 h-5 mr-2 fill-current" />
                                Welcome to AI-ITS!
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Video Container */}
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                src={videoUrl}
                                title="Welcome Video"
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Footer */}
                        <div className="p-6 text-center">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to start your journey?</h3>
                            <button
                                onClick={handleClose}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:scale-105"
                            >
                                Let's Get Started!
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeVideoModal;
