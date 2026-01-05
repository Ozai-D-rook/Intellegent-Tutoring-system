import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search } from 'lucide-react';
import CourseCard from '../../components/CourseCard';
import RecommendationRail from '../../components/RecommendationRail';
import { useNavigate } from 'react-router-dom';

const CourseCatalog = () => {
    const { content, getRecommendations } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const recommendations = getRecommendations();

    const filteredContent = content.filter(c =>
        c.status === 'Published' &&
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStartCourse = (courseId) => {
        navigate(`/student/classroom/${courseId}`);
    };

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Courses</h1>
                <p className="text-gray-500">Discover new skills and knowledge from our extensive library of educational content.</p>

                <div className="mt-8 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="What do you want to learn today?"
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Recommendations Rail */}
            {!searchTerm && (
                <RecommendationRail courses={recommendations} onStart={handleStartCourse} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredContent.map(item => (
                    <CourseCard key={item.id} course={item} onStart={handleStartCourse} />
                ))}
            </div>

            {filteredContent.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">No courses found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
};

export default CourseCatalog;
