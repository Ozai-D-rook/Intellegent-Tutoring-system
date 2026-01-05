import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MessageSquare, LogOut, Trophy, User } from 'lucide-react';
import AIChat from '../components/AIChat';

const StudentLayout = () => {
    const navItems = [
        { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/student/courses", label: "Catalog", icon: BookOpen },
        { to: "/student/leaderboard", label: "Leaderboard", icon: Trophy },
        { to: "/student/profile", label: "My Profile", icon: User },
    ];

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <div className="h-screen w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300">
                <div className="p-6 border-b border-gray-100 flex items-center justify-center lg:justify-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                        AI
                    </div>
                    <span className="hidden lg:block ml-3 font-bold text-xl text-gray-800 tracking-tight">AI-ITS</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-semibold'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 line-through-decoration-none'
                                }`
                            }
                        >
                            <item.icon className="w-6 h-6 lg:w-5 lg:h-5 transition-transform group-hover:scale-110" />
                            <span className="hidden lg:block font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <NavLink
                        to="/"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
                    >
                        <LogOut className="w-6 h-6 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                        <span className="hidden lg:block font-medium">Sign Out</span>
                    </NavLink>
                </div>
            </div>

            <main className="flex-1 overflow-auto">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
            <AIChat />
        </div>
    );
};

export default StudentLayout;
