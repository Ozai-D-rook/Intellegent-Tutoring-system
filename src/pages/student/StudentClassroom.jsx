import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAI } from '../../context/AIContext';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Check, Play, FileText, Lock, ChevronRight, HelpCircle, CheckCircle, AlertCircle, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const StudentClassroom = () => {
    const { courseId } = useParams();
    const { content, fetchCourseSteps } = useData();
    const { updateContext } = useAI();
    const navigate = useNavigate();

    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([0]); // Track completed step indices. Default 1st step unlocked.
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

    // Derived state for current step
    const currentStep = steps.length > 0 && steps[currentStepIndex] ? steps[currentStepIndex] : null;

    // Find the current content item
    const currentCourse = content.find(c => c.id.toString() === courseId);

    useEffect(() => {
        const loadSteps = async () => {
            if (currentCourse) {
                const fetchedSteps = await fetchCourseSteps(currentCourse.id);
                setSteps(fetchedSteps || []);
            }
        };
        loadSteps();
    }, [currentCourse, fetchCourseSteps]);

    // Sync Context with AI
    useEffect(() => {
        if (steps.length > 0 && steps[currentStepIndex]) {
            const step = steps[currentStepIndex];
            const contextString = `Current Step: ${step.title}\nContent:\n${step.body || "No text content"}`;
            updateContext(contextString);
        }
    }, [currentStepIndex, steps, updateContext]);

    if (!currentCourse) {
        return <div className="p-8 text-center">Course not found</div>;
    }

    const handleNext = () => {
        // If has quiz, must pass quiz first (handled in quiz component)
        // If no quiz, simple complete
        if (!currentStep.quiz_data) {
            markStepComplete();
        } else {
            setIsQuizOpen(true);
        }
    };

    const markStepComplete = () => {
        if (!completedSteps.includes(currentStepIndex + 1)) {
            setCompletedSteps([...completedSteps, currentStepIndex + 1]);
        }

        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            // Course Complete!
            alert("Congratulations! You've completed the course.");
        }
        setIsQuizOpen(false);
    };

    // Quiz Component
    const QuizModal = ({ quiz, onPass, onClose }) => {
        const [selectedOption, setSelectedOption] = useState(null);
        const [showResult, setShowResult] = useState(false);
        const [isCorrect, setIsCorrect] = useState(false);

        const handleSubmit = () => {
            const correct = selectedOption === quiz.answer;
            setIsCorrect(correct);
            setShowResult(true);
            if (correct) {
                setTimeout(() => {
                    onPass();
                }, 1500);
            }
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
                >
                    <div className="p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                                <HelpCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Quiz Time!</h3>
                        </div>

                        <p className="text-xl font-medium text-gray-800 mb-6">{quiz.question}</p>

                        <div className="space-y-3">
                            {quiz.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setSelectedOption(idx); setShowResult(false); }}
                                    disabled={showResult && isCorrect}
                                    className={`w-full p-4 rounded-xl text-left border-2 transition-all flex justify-between items-center ${selectedOption === idx
                                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                        } ${showResult && idx === quiz.answer ? '!border-green-500 !bg-green-50 !text-green-900' : ''}
                                       ${showResult && selectedOption === idx && !isCorrect ? '!border-red-500 !bg-red-50 !text-red-900' : ''}
                                     `}
                                >
                                    <span className="font-medium">{option}</span>
                                    {showResult && idx === quiz.answer && <CheckCircle className="w-5 h-5 text-green-600" />}
                                    {showResult && selectedOption === idx && !isCorrect && <AlertCircle className="w-5 h-5 text-red-600" />}
                                </button>
                            ))}
                        </div>

                        {showResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-6 p-4 rounded-xl text-center font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                                {isCorrect ? "Correct! Moving to next step..." : "Incorrect. Try again!"}
                            </motion.div>
                        )}

                        <div className="mt-8 flex justify-end space-x-3">
                            <button onClick={onClose} className="px-6 py-2 text-gray-500 hover:text-gray-700 font-bold">Cancel</button>
                            <button
                                onClick={handleSubmit}
                                disabled={selectedOption === null || (showResult && isCorrect)}
                                className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-purple-200"
                            >
                                Submit Answer
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 relative">

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 mb-4 rounded-xl shadow-sm">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="font-bold text-gray-900 truncate flex-1 ml-4">{currentCourse.title}</div>
            </div>

            {/* Sidebar: Steps List (Desktop: Static, Mobile: Drawer) */}
            <AnimatePresence>
                {(isSidebarOpen || window.innerWidth >= 768) && (
                    <>
                        {/* Mobile Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`md:hidden fixed inset-0 bg-black/50 z-40 ${!isSidebarOpen ? 'hidden' : ''}`}
                        />

                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`
                                fixed md:static inset-y-0 left-0 z-50 w-80 bg-white md:rounded-3xl shadow-2xl md:shadow-lg border-r md:border border-gray-100 overflow-hidden flex flex-col h-full
                                ${!isSidebarOpen ? 'hidden md:flex' : 'flex'}
                            `}
                        >
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <button
                                        onClick={() => navigate('/student/courses')}
                                        className="flex items-center text-xs text-gray-500 hover:text-gray-900 transition-colors font-bold uppercase tracking-wider"
                                    >
                                        <ArrowLeft className="w-3 h-3 mr-1" />
                                        Back to Catalog
                                    </button>
                                    {/* Mobile Close Button */}
                                    <button
                                        onClick={() => setIsSidebarOpen(false)}
                                        className="md:hidden p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 leading-tight">{currentCourse.title}</h2>
                                <p className="text-sm text-gray-500 mt-2">{completedSteps.length - 1} / {steps.length} Steps Completed</p>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${((completedSteps.length - 1) / steps.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {steps.length === 0 ? (
                                    <div className="text-center p-8 text-gray-400 text-sm">
                                        No steps added to this course yet.
                                    </div>
                                ) : (
                                    steps.map((step, index) => {
                                        const isLocked = !completedSteps.includes(index);
                                        const isCompleted = completedSteps.includes(index + 1);
                                        const isActive = index === currentStepIndex;

                                        return (
                                            <button
                                                key={step.id}
                                                onClick={() => {
                                                    if (!isLocked) {
                                                        setCurrentStepIndex(index);
                                                        setIsSidebarOpen(false); // Close sidebar on selection (mobile)
                                                    }
                                                }}
                                                disabled={isLocked}
                                                className={`w-full p-4 rounded-xl text-left border transition-all flex justify-between items-center group ${isActive
                                                    ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100'
                                                    : isLocked
                                                        ? 'bg-gray-50 border-transparent opacity-60 cursor-not-allowed'
                                                        : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0 ${isActive ? 'bg-blue-600 text-white' :
                                                        isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                                                        }`}>
                                                        {isCompleted && !isActive ? <Check className="w-4 h-4" /> : index + 1}
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold text-sm ${isActive ? 'text-blue-900' : 'text-gray-700'} line-clamp-1`}>{step.title}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5 flex items-center">
                                                            {step.type === 'Video' ? <Play className="w-3 h-3 mr-1" /> : <FileText className="w-3 h-3 mr-1" />}
                                                            {step.quiz_data ? '• Quiz' : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                {isLocked && <Lock className="w-4 h-4 text-gray-300" />}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full relative">
                {steps.length > 0 && currentStep ? (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                            <div className="max-w-3xl mx-auto pb-24"> {/* Padding bottom for footer */}
                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                    Step {currentStepIndex + 1}
                                </span>
                                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">{currentStep.title}</h1>

                                <div className="prose prose-lg prose-blue max-w-none text-gray-600 leading-relaxed font-sans">
                                    <ReactMarkdown
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            // Custom Image Renderer for Responsiveness
                                            img: ({ node, ...props }) => (
                                                <img
                                                    {...props}
                                                    className="rounded-xl shadow-md max-w-full h-auto mx-auto my-6 border border-gray-100"
                                                    alt={props.alt || "Lesson Image"}
                                                />
                                            ),
                                            // Custom Link/Iframe Renderer to support Video Embeds if passed as raw HTML or via special syntax
                                            iframe: ({ node, ...props }) => (
                                                <div className="aspect-video w-full my-6 rounded-xl overflow-hidden shadow-lg">
                                                    <iframe
                                                        {...props}
                                                        className="w-full h-full"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ),
                                            // Ensure links open in new tab if external
                                            a: ({ node, ...props }) => (
                                                <a
                                                    {...props}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                                                >
                                                    {props.children}
                                                </a>
                                            )
                                        }}
                                    >
                                        {currentStep.body || "No content for this step."}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 p-4 md:p-6 flex justify-between items-center bg-gray-50/80 backdrop-blur-md">
                            <button
                                onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                                disabled={currentStepIndex === 0}
                                className="px-4 md:px-6 py-2 md:py-3 text-gray-500 font-bold hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors text-sm md:text-base"
                            >
                                Previous
                            </button>

                            <button
                                onClick={handleNext}
                                className="px-6 md:px-8 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center space-x-2 transition-all transform active:scale-95 text-sm md:text-base"
                            >
                                <span>{currentStep.quiz_data ? 'Take Quiz' : 'Complete'}</span>
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12">
                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                            <FileText className="w-12 h-12 text-gray-300" />
                        </div>
                        <p className="text-lg font-medium">Select a step to begin learning.</p>
                        {steps.length === 0 && <p className="text-sm mt-2">This course has no content yet.</p>}
                    </div>
                )}
            </div>

            {/* Quiz Modal */}
            <AnimatePresence>
                {isQuizOpen && currentStep?.quiz_data && (
                    <QuizModal
                        quiz={currentStep.quiz_data}
                        onPass={markStepComplete}
                        onClose={() => setIsQuizOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentClassroom;
