import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/organisms/LoginPage';
import Register from './components/organisms/RegisterUser';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/organisms/PrivateRoute';
import MainLayout from './components/layouts/MainLayout';
import DashboardLayout from './components/organisms/DashboardLayout';
import FeedbackForm from './components/atoms/FeedbackForm';
import { AuthProvider } from './components/organisms/AuthContext';
import SuggestionForm from './components/atoms/SuggestionForm';
import LeaveApplication from './components/atoms/LeaveApplication';
import TrackApplication from './components/atoms/TrackApplication';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="font-sans">
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />

            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardLayout />} />
                <Route path="/forms/feedback" element={<FeedbackForm />} />
                <Route path="/forms/suggestion" element={<SuggestionForm />} />
                <Route path="/forms/leave-application" element={<LeaveApplication/>} />
                <Route path="/forms/track-application" element={<TrackApplication />} />
              </Route>
            </Route>
          </Routes>
          <ToastContainer position="top-center" />
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;