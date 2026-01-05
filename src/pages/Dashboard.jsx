import React from 'react';
import { useData } from '../context/DataContext';
import { Users, BookOpen, Activity } from 'lucide-react';

const Dashboard = () => {
    const { students, content } = useData();

    const stats = [
        { label: "Total Students", value: students.length, icon: Users, color: "bg-blue-500" },
        { label: "Content Items", value: content.length, icon: BookOpen, color: "bg-purple-500" },
        { label: "Active Users", value: students.filter(s => s.status === 'Active').length, icon: Activity, color: "bg-green-500" },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className={`p-4 rounded-xl ${stat.color} text-white shadow-lg shadow-gray-200`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                <p className="text-gray-400">Activity stream mock placeholder...</p>
            </div>
        </div>
    );
};

export default Dashboard;
