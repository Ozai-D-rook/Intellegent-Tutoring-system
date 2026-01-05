import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import CourseCard from './CourseCard';
import { motion } from 'framer-motion';

const RecommendationRail = ({ courses, onStart }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!courses || courses.length === 0) return null;

    return (
        <div className="py-6">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                    Recommended for You
                </h3>
                <div className="flex space-x-2">
                    <button onClick={() => scroll('left')} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => scroll('right')} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {courses.map((course, idx) => (
                    <div key={course.id} className="min-w-[300px] snap-start">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <CourseCard course={course} onStart={onStart} />
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationRail;
