import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, LogOut, TrendingUp } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/students", label: "Students", icon: Users },
        { to: "/content", label: "Content", icon: BookOpen },
        { to: "/analytics", label: "Analytics", icon: TrendingUp },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-xl">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                    AI-ITS
                </h1>
                <p className="text-sm text-gray-400 mt-1">Teacher Portal</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <NavLink
                    to="/"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
