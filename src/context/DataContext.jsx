import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialContent, initialAnalytics } from '../data/mockData';
import { supabase } from '../supabaseClient';

const initialProgress = {
    1: {
        completed: [1],
        inProgress: [2],
        courses: [
            { id: 101, title: "Introduction to AI", progress: 75, totalLessons: 4, completedLessons: 3 },
            { id: 102, title: "Python for Beginners", progress: 30, totalLessons: 10, completedLessons: 3 }
        ]
    }
};

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // Initial mock data acts as fallback
    const [students, setStudents] = useState([]);
    const [content, setContent] = useState([]); // Initialize empty, fetch from DB

    // Auth State
    const [session, setSession] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [studentProgress, setStudentProgress] = useState(initialProgress);
    const [analytics, setAnalytics] = useState(initialAnalytics);

    // Sync Auth Session
    useEffect(() => {
        const fetchProfile = async (userId) => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (data) {
                const prefs = data.preferences || { learningStyle: "Video", interests: [], weeklyGoalHours: 5 };
                setCurrentUser({ ...data, preferences: prefs });
            } else {
                console.error("Error fetching profile:", error);
                // Fallback for new users who might not have a profile yet (race condition)
                setCurrentUser({ id: userId, name: "New User", role: 'student', preferences: { learningStyle: "Video", interests: [] } });
            }
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch Content from DB
    useEffect(() => {
        const fetchContent = async () => {
            const { data, error } = await supabase
                .from('content')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) console.error("Error fetching content:", error);
            else setContent(data || []);
        };

        fetchContent();
    }, []);

    // Fetch Students from DB
    useEffect(() => {
        const fetchStudents = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'student')
                .order('full_name', { ascending: true });

            if (error) console.error("Error fetching students:", error);
            else setStudents(data || []);
        };

        // Real-time subscription for students
        const channel = supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                fetchStudents();
            })
            .subscribe();

        fetchStudents();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const getStudentProgress = (studentId) => studentProgress[studentId] || { completed: [], inProgress: [], courses: [] };

    const getLeaderboard = () => {
        return [...students].sort((a, b) => (b.points || 0) - (a.points || 0));
    };

    const getRecommendations = () => {
        if (!currentUser) return [];
        return content.filter(c =>
            c.status === 'Published' && (
                c.type === currentUser.preferences?.learningStyle ||
                currentUser.preferences?.interests?.some(interest => c.title.includes(interest))
            )
        );
    };

    const updateUser = (updates) => {
        setCurrentUser(prev => ({ ...prev, ...updates }));
    };

    // Student Actions
    const addStudent = (student) => {
        const newStudent = { ...student, id: Date.now(), status: 'Active', enrolledCourses: 0 };
        setStudents([...students, newStudent]);
    };

    const deleteStudent = (id) => {
        setStudents(students.filter(s => s.id !== id));
    };

    const toggleStudentStatus = (id) => {
        setStudents(students.map(s =>
            s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
        ));
    };

    // Content Actions
    const addContent = async (newContent) => {
        // Optimistic update
        const tempId = Date.now();
        const optimisticItem = { ...newContent, id: tempId, status: 'Draft', created_at: new Date().toISOString() };
        setContent([optimisticItem, ...content]);

        // DB Insert
        const { data, error } = await supabase
            .from('content')
            .insert([{
                title: newContent.title,
                type: newContent.type,
                status: 'Published', // Default to published for now
                created_by: currentUser?.id
            }])
            .select()
            .single();

        if (error) {
            console.error("Error adding content:", error);
            // Revert on error
            setContent(prev => prev.filter(c => c.id !== tempId));
            alert("Failed to save content: " + error.message);
        } else {
            // Replace optimistic item with real one
            setContent(prev => [data, ...prev.filter(c => c.id !== tempId)]);
        }
    };

    const removeContent = async (id) => {
        // Optimistic update
        const originalContent = [...content];
        setContent(content.filter(c => c.id !== id));

        const { error } = await supabase
            .from('content')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting content:", error);
            setContent(originalContent);
            alert("Failed to delete content");
        }
    };

    const updateContent = async (id, updates) => {
        // Optimistic update
        const originalContent = [...content];
        setContent(content.map(c => c.id === id ? { ...c, ...updates } : c));

        const { error } = await supabase
            .from('content')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error("Error updating content:", error);
            setContent(originalContent);
            alert("Failed to update content: " + error.message);
        }
    };

    // Course Steps Actions
    const fetchCourseSteps = async (courseId) => {
        const { data, error } = await supabase
            .from('course_steps')
            .select('*')
            .eq('course_id', courseId)
            .order('sequence_order', { ascending: true });

        if (error) {
            console.error("Error fetching steps:", error);
            return [];
        }
        return data; // Return data directly for local state management in components
    };

    const addStep = async (stepData) => {
        const { data, error } = await supabase
            .from('course_steps')
            .insert([stepData])
            .select()
            .single();

        if (error) throw error;
        return data;
    };

    const updateStep = async (stepId, updates) => {
        const { data, error } = await supabase
            .from('course_steps')
            .update(updates)
            .eq('id', stepId)
            .select()
            .single();

        if (error) throw error;
        return data;
    };

    const deleteStep = async (stepId) => {
        const { error } = await supabase
            .from('course_steps')
            .delete()
            .eq('id', stepId);

        if (error) throw error;
    };

    return (
        <DataContext.Provider value={{
            students,
            content,
            addStudent,
            deleteStudent,
            toggleStudentStatus,
            addContent,
            removeContent,
            updateContent,
            currentUser,
            getStudentProgress,
            analytics,
            getLeaderboard,
            updateUser,
            getRecommendations,
            fetchCourseSteps,
            addStep,
            updateStep,
            deleteStep,
            loading,
            session
        }}>
            {children}
        </DataContext.Provider>
    );
};
