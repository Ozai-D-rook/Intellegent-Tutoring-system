export const initialStudents = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Active", enrolledCourses: 2, points: 1250, badges: ["Fast Learner", "Quiz Master"] },
    { id: 2, name: "Bob Smith", email: "bob@example.com", status: "Inactive", enrolledCourses: 0, points: 450, badges: [] },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", status: "Active", enrolledCourses: 5, points: 3100, badges: ["Tech Wizard", "Helpful Peer", "Top Scorer"] },
    { id: 4, name: "Diana Prince", email: "diana@example.com", status: "Active", enrolledCourses: 4, points: 2800, badges: ["Top Scorer"] },
    { id: 5, name: "Evan Wright", email: "evan@example.com", status: "Active", enrolledCourses: 3, points: 1500, badges: ["Fast Learner"] },
];

export const initialContent = [
    { id: 1, title: "Introduction to AI", type: "Video", date: "2023-10-01", status: "Published" },
    { id: 2, title: "Neural Networks Basics", type: "Article", date: "2023-10-05", status: "Draft" },
    { id: 3, title: "Machine Learning Quiz", type: "Quiz", date: "2023-10-10", status: "Published" },
    { id: 4, title: "Advanced Python Algorithms", type: "Video", date: "2023-10-12", status: "Published" },
    { id: 5, title: "Data Science Fundamentals", type: "Article", date: "2023-10-15", status: "Published" },
];

export const initialAnalytics = {
    engagement: [
        { name: 'Mon', activeUsers: 40 },
        { name: 'Tue', activeUsers: 30 },
        { name: 'Wed', activeUsers: 20 },
        { name: 'Thu', activeUsers: 27 },
        { name: 'Fri', activeUsers: 18 },
        { name: 'Sat', activeUsers: 23 },
        { name: 'Sun', activeUsers: 34 },
    ],
    courseCompletions: [
        { name: 'Intro to AI', completed: 12, dropped: 2 },
        { name: 'Python Basics', completed: 25, dropped: 5 },
        { name: 'Data Science', completed: 18, dropped: 3 },
    ],
    quizScores: [
        { range: '0-50%', count: 5 },
        { range: '51-70%', count: 12 },
        { range: '71-90%', count: 25 },
        { range: '91-100%', count: 8 },
    ]
};
