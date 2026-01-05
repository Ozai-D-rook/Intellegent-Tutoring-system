import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { User, Save, BookOpen, Clock, Zap } from 'lucide-react';

const UserProfile = () => {
    const { currentUser, updateUser } = useData();
    const [formData, setFormData] = useState({
        name: currentUser.name,
        learningStyle: currentUser.preferences.learningStyle,
        weeklyGoalHours: currentUser.preferences.weeklyGoalHours
    });
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser({
            name: formData.name,
            preferences: {
                ...currentUser.preferences,
                learningStyle: formData.learningStyle,
                weeklyGoalHours: parseInt(formData.weeklyGoalHours)
            }
        });
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">

                {/* Profile Header */}
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <User className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mt-1">
                            {currentUser.role.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Learning Style</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Video', 'Article', 'Quiz'].map((style) => (
                                <button
                                    key={style}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, learningStyle: style })}
                                    className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${formData.learningStyle === style
                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {style === 'Video' && <Zap className="w-5 h-5" />}
                                    {style === 'Article' && <BookOpen className="w-5 h-5" />}
                                    {style === 'Quiz' && <Clock className="w-5 h-5" />}
                                    <span className="text-sm font-medium">{style}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            We'll recommend more content based on this selection.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Learning Goal (Hours)</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={formData.weeklyGoalHours}
                            onChange={(e) => setFormData({ ...formData, weeklyGoalHours: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 border-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    {successMsg && (
                        <span className="text-green-600 text-sm font-medium animate-pulse">
                            {successMsg}
                        </span>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition-colors ml-auto"
                    >
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                    </button>
                </div>

            </form>
        </div>
    );
};

export default UserProfile;
