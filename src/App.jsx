import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AIProvider } from './context/AIContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import ContentManagement from './pages/ContentManagement';
import StudentLayout from './components/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseCatalog from './pages/student/CourseCatalog';
import StudentClassroom from './pages/student/StudentClassroom';
import StudentLeaderboard from './pages/student/StudentLeaderboard';
import TeacherAnalytics from './pages/TeacherAnalytics';
import UserProfile from './pages/UserProfile';
import Signup from './pages/Signup';

function App() {
  return (
    <DataProvider>
      <AIProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<StudentManagement />} />
              <Route path="/content" element={<ContentManagement />} />
              <Route path="/analytics" element={<TeacherAnalytics />} />
            </Route>

            <Route path="/student" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<CourseCatalog />} />
              <Route path="classroom/:courseId" element={<StudentClassroom />} />
              <Route path="leaderboard" element={<StudentLeaderboard />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AIProvider>
    </DataProvider>
  );
}

export default App;
