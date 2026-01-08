import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Search, Trash2, Video, FileText, HelpCircle, X, Edit2, Save, Layers, ChevronRight, Check, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const ToolbarBtn = ({ icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="p-1.5 text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all"
        title={label}
    >
        {icon}
    </button>
);

const ContentManagement = () => {
    const { content, addContent, removeContent, updateContent, fetchCourseSteps, addStep, updateStep, deleteStep } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    // Modal & Editor States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [courseSteps, setCourseSteps] = useState([]);

    // Step Editor State
    const [activeStep, setActiveStep] = useState(null); // The step currently being edited within the builder
    const [isStepModalOpen, setIsStepModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        type: 'Video',
        description: '',
        status: 'Draft',
        url: ''
    });

    // --- Course CRUD Handlers ---
    const resetForm = () => {
        setFormData({ title: '', type: 'Video', description: '', status: 'Draft', url: '' });
        setEditingItem(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            type: item.type,
            description: item.description || '',
            status: item.status,
            url: item.url || ''
        });
        setIsModalOpen(true);
    };

    const handleOpenBuilder = async (item) => {
        setEditingItem(item);
        setIsBuilderOpen(true);
        // Load steps for this course
        const steps = await fetchCourseSteps(item.id);
        setCourseSteps(steps || []);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            updateContent(editingItem.id, formData);
        } else {
            addContent(formData);
        }
        setIsModalOpen(false);
        resetForm();
    };

    // --- Step CRUD Handlers ---
    const handleSaveStep = async (stepData) => {
        try {
            if (activeStep?.id) {
                // Update
                const updated = await updateStep(activeStep.id, stepData);
                setCourseSteps(prev => prev.map(s => s.id === updated.id ? updated : s));
            } else {
                // Create
                const newStep = await addStep({
                    ...stepData,
                    course_id: editingItem.id,
                    sequence_order: courseSteps.length + 1
                });
                setCourseSteps(prev => [...prev, newStep]);
            }
            setIsStepModalOpen(false);
            setActiveStep(null);
        } catch (err) {
            alert("Failed to save step: " + err.message);
        }
    };

    const handleDeleteStep = async (stepId) => {
        if (!window.confirm("Delete this step?")) return;
        try {
            await deleteStep(stepId);
            setCourseSteps(prev => prev.filter(s => s.id !== stepId));
        } catch (err) {
            alert("Failed to delete step: " + err.message);
        }
    };

    const filteredContent = content.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Video': return <Video className="w-5 h-5 text-blue-500" />;
            case 'Article': return <FileText className="w-5 h-5 text-green-500" />;
            case 'Quiz': return <HelpCircle className="w-5 h-5 text-purple-500" />;
            default: return <FileText className="w-5 h-5 text-gray-400" />;
        }
    };

    if (isBuilderOpen) {
        return (
            <CourseBuilder
                course={editingItem}
                steps={courseSteps}
                onClose={() => setIsBuilderOpen(false)}
                onSaveStep={handleSaveStep}
                onDeleteStep={handleDeleteStep}
                isStepModalOpen={isStepModalOpen}
                setIsStepModalOpen={setIsStepModalOpen}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
                    <p className="text-gray-500">Create and manage educational materials</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Content</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search content..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                {getTypeIcon(item.type)}
                            </div>
                            <span className={`px-2 py-1 rounded-md text-xs font-semibold ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {item.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            {item.description || "No description provided."}
                        </p>

                        <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-4 border-gray-50">
                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handleOpenBuilder(item)}
                                    className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors flex items-center space-x-1"
                                    title="Manage Steps"
                                >
                                    <Layers className="w-4 h-4" />
                                    <span className="text-xs font-bold">Steps</span>
                                </button>
                                <button
                                    onClick={() => handleOpenEdit(item)}
                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                    title="Edit Details"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => removeContent(item.id)}
                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal for Course Details */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingItem ? 'Edit Course Details' : 'Add New Course'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                {/* ... (Other fields can remain simplified for now, focusing on Title + Description) ... */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-component for Building Course Steps
const CourseBuilder = ({ course, steps, onClose, onSaveStep, onDeleteStep, isStepModalOpen, setIsStepModalOpen, activeStep, setActiveStep }) => {
    // Local state for the step form
    const [stepData, setStepData] = useState({ title: '', body: '', quiz_data: null });

    useEffect(() => {
        if (activeStep) {
            setStepData({
                title: activeStep.title,
                body: activeStep.body || '',
                quiz_data: activeStep.quiz_data
            });
        } else {
            setStepData({ title: '', body: '', quiz_data: null });
        }
    }, [activeStep]);

    const handleStepSubmit = (e) => {
        e.preventDefault();
        onSaveStep(stepData);
    };

    return (
        <div className="bg-white min-h-screen rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                    <p className="text-sm text-gray-500">Course Builder</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Back to List
                    </button>
                    <button
                        onClick={() => { setActiveStep(null); setIsStepModalOpen(true); }}
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Step
                    </button>
                </div>
            </div>

            {/* Steps List */}
            <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-4">
                    {steps.length === 0 && (
                        <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500">
                            <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No steps yet. Click "Add Step" to begin building your course.</p>
                        </div>
                    )}

                    {steps.map((step, index) => (
                        <div key={step.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center group hover:border-blue-300 transition-all">
                            <div className="flex items-center space-x-4">
                                <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                                    <div className="flex items-center space-x-3 mt-1">
                                        {step.body && <span className="text-xs text-gray-500 flex items-center"><FileText className="w-3 h-3 mr-1" /> Content</span>}
                                        {step.quiz_data && <span className="text-xs text-purple-600 flex items-center"><HelpCircle className="w-3 h-3 mr-1" /> Quiz</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setActiveStep(step); setIsStepModalOpen(true); }}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDeleteStep(step.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Editor Modal */}
            <AnimatePresence>
                {isStepModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                                <h3 className="text-xl font-bold text-gray-900">{activeStep ? 'Edit Step' : 'New Step'}</h3>
                                <button onClick={() => setIsStepModalOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
                            </div>

                            <form onSubmit={handleStepSubmit} className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Step Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg font-medium outline-none"
                                            value={stepData.title}
                                            onChange={(e) => setStepData({ ...stepData, title: e.target.value })}
                                            placeholder="e.g. Introduction to Variables"
                                        />
                                    </div>

                                    {/* Content Editor */}
                                    <div className="grid grid-cols-2 gap-8 h-[400px]">
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-end mb-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Markdown Content</label>
                                                {/* Toolbar */}
                                                <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
                                                    <ToolbarBtn icon={<span className="font-bold font-serif">B</span>} label="Bold" onClick={() => {
                                                        const ta = document.getElementById('step-body');
                                                        const [start, end] = [ta.selectionStart, ta.selectionEnd];
                                                        const text = stepData.body;
                                                        const newText = text.substring(0, start) + "**" + text.substring(start, end) + "**" + text.substring(end);
                                                        setStepData({ ...stepData, body: newText });
                                                    }} />
                                                    <ToolbarBtn icon={<span className="italic font-serif">I</span>} label="Italic" onClick={() => {
                                                        const ta = document.getElementById('step-body');
                                                        const [start, end] = [ta.selectionStart, ta.selectionEnd];
                                                        const text = stepData.body;
                                                        const newText = text.substring(0, start) + "*" + text.substring(start, end) + "*" + text.substring(end);
                                                        setStepData({ ...stepData, body: newText });
                                                    }} />
                                                    <div className="w-px bg-gray-300 mx-1" />
                                                    <ToolbarBtn icon={<FileText size={14} />} label="Link" onClick={() => {
                                                        setStepData({ ...stepData, body: stepData.body + "[Link Text](https://example.com) " });
                                                    }} />
                                                    <ToolbarBtn icon={<ImageIcon size={14} />} label="Image" onClick={() => {
                                                        setStepData({ ...stepData, body: stepData.body + "\n![Image Alt](https://placehold.co/600x400) \n" });
                                                    }} />
                                                    <ToolbarBtn icon={<Video size={14} />} label="Video" onClick={() => {
                                                        setStepData({ ...stepData, body: stepData.body + "\n<iframe src=\"https://www.youtube.com/embed/dQw4w9WgXcQ\" title=\"Video\" allowfullscreen></iframe>\n" });
                                                    }} />
                                                </div>
                                            </div>
                                            <textarea
                                                id="step-body"
                                                className="flex-1 w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none outline-none"
                                                value={stepData.body}
                                                onChange={(e) => setStepData({ ...stepData, body: e.target.value })}
                                                placeholder="# Header\n\nWrite your content here..."
                                            />
                                            <p className="text-xs text-gray-400 mt-2">Use toolbar or type Markdown directly.</p>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preview</label>
                                            <div className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl overflow-y-auto prose prose-sm max-w-none">
                                                {/* Simple Previewer */}
                                                {stepData.body ? (
                                                    <ReactMarkdown
                                                        rehypePlugins={[rehypeRaw]}
                                                        components={{
                                                            img: ({ node, ...props }) => (
                                                                <img {...props} className="rounded-lg shadow-sm max-w-full h-auto mx-auto my-4 border border-gray-100" />
                                                            ),
                                                            iframe: ({ node, ...props }) => (
                                                                <div className="aspect-video w-full my-4 rounded-lg overflow-hidden shadow-sm">
                                                                    <iframe {...props} className="w-full h-full" loading="lazy" />
                                                                </div>
                                                            ),
                                                            a: ({ node, ...props }) => (
                                                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                                                    {props.children}
                                                                </a>
                                                            )
                                                        }}
                                                    >
                                                        {stepData.body}
                                                    </ReactMarkdown>
                                                ) : <span className="text-gray-400 italic">Preview appears here...</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quiz Section (Simplified) */}
                                    <div className="border-t border-gray-100 pt-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="block text-sm font-bold text-gray-700">Quiz (Optional)</label>
                                            {!stepData.quiz_data && (
                                                <button
                                                    type="button"
                                                    onClick={() => setStepData({ ...stepData, quiz_data: { question: '', options: ['', ''], answer: 0 } })}
                                                    className="text-sm text-blue-600 font-bold hover:underline"
                                                >
                                                    + Add Quiz
                                                </button>
                                            )}
                                        </div>

                                        {stepData.quiz_data && (
                                            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                                <div className="flex justify-between mb-4">
                                                    <h4 className="font-bold text-purple-900">Quiz Settings</h4>
                                                    <button type="button" onClick={() => setStepData({ ...stepData, quiz_data: null })} className="text-red-500 text-xs font-bold uppercase">Remove</button>
                                                </div>

                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Question: What is 2 + 2?"
                                                        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                        value={stepData.quiz_data.question}
                                                        onChange={(e) => setStepData({
                                                            ...stepData,
                                                            quiz_data: { ...stepData.quiz_data, question: e.target.value }
                                                        })}
                                                    />

                                                    {/* Options */}
                                                    <div className="space-y-2">
                                                        {stepData.quiz_data.options.map((opt, idx) => (
                                                            <div key={idx} className="flex items-center space-x-2">
                                                                <input
                                                                    type="radio"
                                                                    name="correct"
                                                                    checked={stepData.quiz_data.answer === idx}
                                                                    onChange={() => setStepData({
                                                                        ...stepData,
                                                                        quiz_data: { ...stepData.quiz_data, answer: idx }
                                                                    })}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Option ${idx + 1}`}
                                                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                                    value={opt}
                                                                    onChange={(e) => {
                                                                        const newOpts = [...stepData.quiz_data.options];
                                                                        newOpts[idx] = e.target.value;
                                                                        setStepData({ ...stepData, quiz_data: { ...stepData.quiz_data, options: newOpts } });
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                                    <button type="button" onClick={() => setIsStepModalOpen(false)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                                    <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg transition-colors">Save Step</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContentManagement;
