import React from 'react';
import { useData } from '../../context/DataContext';
import { Trophy, Clock, Target, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import StudyCalendar from '../../components/StudyCalendar';

const StudentDashboard = () => {
    const { currentUser, getStudentProgress, loading } = useData();

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (!currentUser) {
        return <div className="p-10 text-center">Please log in.</div>;
    }

    const progress = getStudentProgress(currentUser.id);

    return (
        <div className="space-y-6 md:space-y-8 pb-20 md:pb-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Welcome, {(currentUser.full_name || currentUser.name || "Student").split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-500 mt-1 md:mt-2 text-sm md:text-base">Ready to continue your learning journey?</p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-sm text-gray-400">Current Level</p>
                    <p className="text-xl font-bold text-blue-600">
                        {currentUser.learning_level || "Beginner"} Learner
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 md:p-6 text-white shadow-lg shadow-blue-500/20">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-blue-100 text-xs md:text-sm font-medium">Courses in Progress</p>
                            <h3 className="text-2xl md:text-3xl font-bold mt-1">{progress.courses.length}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <Trophy className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs md:text-sm font-medium">Completed Lessons</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                                {progress.courses.reduce((acc, curr) => acc + curr.completedLessons, 0)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <Clock className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs md:text-sm font-medium">Learning Hours</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">12.5</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* My Learning Section */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                        <PlayCircle className="w-5 h-5 mr-2 text-blue-500" />
                        Continue Learning
                    </h2>
                    <div className="space-y-3 md:space-y-4">
                        {progress.courses.map((course) => (
                            <motion.div
                                key={course.id}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer flex justify-between items-center"
                            >
                                <div className="flex-1 mr-4">
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 text-sm md:text-base">
                                        {course.title}
                                    </h3>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${(course.completedLessons / course.totalLessons) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">{course.completedLessons}/{course.totalLessons} Lessons</p>
                                </div>
                                <button className="p-2 bg-blue-50 text-blue-600 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle size={20} className="md:w-6 md:h-6" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Study Planner */}
                <div>
                    <StudyCalendar />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
