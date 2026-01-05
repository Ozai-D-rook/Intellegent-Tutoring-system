import React from 'react';
import { useData } from '../../context/DataContext';
import { Trophy, Medal, Star } from 'lucide-react';
import BadgeCard from '../../components/gamification/BadgeCard';

const StudentLeaderboard = () => {
    const { getLeaderboard, currentUser } = useData();
    const leaderboard = getLeaderboard();

    return (
        <div className="space-y-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-yellow-500 mr-3" />
                    Class Leaderboard
                </h1>
                <p className="text-gray-500">Compete with your peers and earn rewards!</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                                #{leaderboard.findIndex(s => s.id === currentUser.id) + 1}
                            </div>
                            <div>
                                <p className="opacity-80 font-medium">Your Rank</p>
                                <p className="text-2xl font-bold">{currentUser.name || currentUser.full_name || "Student"}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="opacity-80 font-medium">Total Points</p>
                            <p className="text-3xl font-bold">{leaderboard.find(s => s.id === currentUser.id)?.points || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-sm border-b border-gray-100">
                                <th className="pb-4 pl-4 font-medium">Rank</th>
                                <th className="pb-4 font-medium">Student</th>
                                <th className="pb-4 font-medium">Badges</th>
                                <th className="pb-4 pr-4 text-right font-medium">Points</th>
                            </tr>
                        </thead>
                        <tbody className="space-y-4">
                            {leaderboard.map((student, index) => (
                                <tr key={student.id} className={`group ${student.id === currentUser.id ? 'bg-blue-50/50' : ''}`}>
                                    <td className="py-4 pl-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                            index === 1 ? 'bg-gray-100 text-gray-600' :
                                                index === 2 ? 'bg-orange-100 text-orange-600' :
                                                    'text-gray-400'
                                            }`}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold">
                                                {(student.name || student.full_name || "U").charAt(0)}
                                            </div>
                                            <span className={`font-semibold ${student.id === currentUser.id ? 'text-blue-600' : 'text-gray-900'}`}>
                                                {student.name || student.full_name || "Unknown User"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {student.badges.slice(0, 3).map((badge, idx) => (
                                                <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600 flex items-center">
                                                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                                    {badge}
                                                </span>
                                            ))}
                                            {student.badges.length > 3 && (
                                                <span className="text-xs px-2 py-1 bg-gray-50 rounded-md text-gray-500">+{student.badges.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <span className="font-bold text-gray-900">{student.points.toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* My Achievements Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Achievements</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {leaderboard.find(s => s.id === currentUser.id)?.badges.map((badge, idx) => (
                        <BadgeCard key={idx} badge={badge} index={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentLeaderboard;
