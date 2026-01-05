import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const StudyCalendar = () => {
    // Mock deadlines for now
    const deadlines = [
        { id: 1, title: "Intro to AI Quiz", date: "Today", time: "5:00 PM", type: "urgent" },
        { id: 2, title: "Python Basics Project", date: "Tomorrow", time: "11:59 PM", type: "normal" }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 flex items-center">
                    <CalendarIcon className="w-5 h-5 text-blue-500 mr-2" />
                    Study Planner
                </h3>
                <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-500">Upcoming</span>
            </div>

            <div className="space-y-4">
                {deadlines.map(item => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className={`p-2 rounded-lg ${item.type === 'urgent' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                            }`}>
                            <Clock className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                            <p className="text-sm text-gray-500 flex justify-between mt-1">
                                <span>{item.date}</span>
                                <span>{item.time}</span>
                            </p>
                        </div>
                    </div>
                ))}

                <button className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors mt-2">
                    + Add Study Block
                </button>
            </div>
        </div>
    );
};

export default StudyCalendar;
