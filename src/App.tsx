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
import ViewAttendance from './components/atoms/ViewAttendance';
import PayrollView from './components/atoms/PayrollView';
import AavailableLeaves from './components/atoms/AavailableLeaves';
import ProvidentFund from './components/atoms/ProvidentFund';
import NotFound from './components/atoms/NotFound';
import AttendanceTicket from './components/atoms/AttendanceTicket';

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
                <Route path="/attendance/view" element={<ViewAttendance/>} />
                <Route path="/payroll/view" element={<PayrollView />} />
                <Route path="/payroll/available-leaves" element={<AavailableLeaves/>} />
                <Route path="/payroll/provident-fund" element={<ProvidentFund/>} />
                <Route path="/tickets/attendance" element={<AttendanceTicket/>} />
                <Route path="*" element={<NotFound/>} />
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