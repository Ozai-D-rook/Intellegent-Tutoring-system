import React from 'react';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

const BadgeCard = ({ badge, index }) => {
    const getBadgeColor = (name) => {
        switch (name) {
            case 'Fast Learner': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
            case 'Quiz Master': return 'bg-purple-100 text-purple-600 border-purple-200';
            case 'Tech Wizard': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'Helpful Peer': return 'bg-green-100 text-green-600 border-green-200';
            case 'Top Scorer': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-3 p-3 rounded-xl border ${getBadgeColor(badge)}`}
        >
            <div className="p-2 bg-white/50 rounded-full backdrop-blur-sm">
                <Award className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">{badge}</span>
        </motion.div>
    );
};

export default BadgeCard;
