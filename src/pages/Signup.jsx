import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext'; // Assuming signUp is exposed here or import directly from supabaseClient
import { supabase } from '../supabaseClient';
import { User, Mail, Lock, Loader2, GraduationCap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'student' // 'student' or 'teacher'
    });
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: formData.role,
                    },
                },
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Create Profile entry (Trigger might handle this, but manual insertion is safer if no trigger)
                // Note: If you have a Trigger on auth.users to insert into public.profiles, skip this.
                // For simplicity/safety, we'll insert into profiles here assuming RLS allows it.

                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            email: formData.email,
                            full_name: formData.fullName,
                            role: formData.role
                        }
                    ]);

                if (profileError) {
                    console.error("Profile creation failed:", profileError);
                    // Verify if trigger exists or not. If trigger exists, this might fail with duplicate key, which is fine.
                }

                navigate(formData.role === 'teacher' ? '/dashboard' : '/student/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Create Account
                    </h1>
                    <p className="text-gray-500 mt-2">Join AI-ITS today</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 border-transparent outline-none transition-all"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 border-transparent outline-none transition-all"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'student' })}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${formData.role === 'student'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                    }`}
                            >
                                <GraduationCap className="w-6 h-6" />
                                <span className="font-bold text-sm">Student</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'teacher' })}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all ${formData.role === 'teacher'
                                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                    }`}
                            >
                                <BookOpen className="w-6 h-6" />
                                <span className="font-bold text-sm">Teacher</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/" className="text-blue-600 font-bold hover:underline">Log in</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
