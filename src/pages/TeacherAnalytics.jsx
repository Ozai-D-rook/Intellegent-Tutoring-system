import React from 'react';
import { useData } from '../context/DataContext';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

const TeacherAnalytics = () => {
    const { analytics, students } = useData();

    const stats = [
        { label: "Active Students", value: students.filter(s => s.status === 'Active').length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Completion Rate", value: "78%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
        { label: "Total Points Awarded", value: students.reduce((acc, s) => acc + (s.points || 0), 0).toLocaleString(), icon: Award, color: "text-yellow-600", bg: "bg-yellow-50" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Class Performance</h2>
                <p className="text-gray-500 mt-1">Real-time insights into student engagement and learning outcomes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsChart
                    type="line"
                    title="Weekly Engagement (Active Users)"
                    data={analytics.engagement}
                    dataKey="activeUsers"
                />
                <AnalyticsChart
                    type="bar"
                    title="Course Completions vs Drops"
                    data={analytics.courseCompletions}
                    dataKey="completed"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-700 mb-4">Quiz Score Distribution</h3>
                        <div className="h-64 flex items-center justify-center">
                            {/* Reusing chart logic but for distribution */}
                            <ResponsiveWrapper>
                                <AnalyticsChart
                                    type="pie"
                                    title=""
                                    data={analytics.quizScores}
                                    dataKey="count"
                                />
                            </ResponsiveWrapper>
                        </div>
                    </div>
                </div>
                {/* Top Performers List */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-4">Top Performers</h3>
                    <div className="space-y-4">
                        {[...students].sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 5).map((student, idx) => (
                            <div key={student.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.points} pts</p>
                                    </div>
                                </div>
                                {idx === 0 && <Award className="w-4 h-4 text-yellow-500" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for layout
const ResponsiveWrapper = ({ children }) => <div className="w-full h-full">{children}</div>;

export default TeacherAnalytics;
