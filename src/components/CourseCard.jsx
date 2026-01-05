import React from 'react';
import { PlayCircle, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CourseCard = ({ course, onStart }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all"
        >
            <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white/50" />
            </div>

            <div className="p-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${course.type === 'Video' ? 'bg-blue-100 text-blue-700' :
                        course.type === 'Quiz' ? 'bg-purple-100 text-purple-700' :
                            'bg-green-100 text-green-700'
                    }`}>
                    {course.type || 'Course'}
                </span>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                    Master the fundamentals of {course.title} in this comprehensive module designed for beginners.
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>2h 15m</span>
                    </div>
                    <button
                        onClick={() => onStart(course.id)}
                        className="flex items-center text-blue-600 font-bold text-sm group hover:underline"
                    >
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
