import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import FeedbackForm from './components/Atoms/FeedbackForm';
import SuggestionForm from './components/Atoms/SuggestionForm';
import LeaveApplication from './components/Atoms/LeaveApplication';
import TrackApplication from './components/Atoms/TrackApplication';
import ViewAttendance from './components/Atoms/ViewAttendance';
import PayrollView from './components/Atoms/PayrollView';
import AavailableLeaves from './components/Atoms/AavailableLeaves';
import ProvidentFund from './components/Atoms/ProvidentFund';
import NotFound from './components/Atoms/NotFound';
import AttendanceTicket from './components/Atoms/AttendanceTicket';
import Policies from './components/Atoms/Policies';
import NetworkTicket from './components/Atoms/NetworkTicket';
import HRTicket from './components/Atoms/HRTicket';
import AdminTicket from './components/Atoms/AdminTicket';
import TicketStatus from './components/Atoms/TicketStatus';
import Notices from './components/Atoms/Notices';
import EditProfilePage from './components/Molecules/EditProfilePage';
import SubmitATicket from './components/Atoms/SubmitATicket';
import BlogList from './components/Atoms/BlogList';
import BlogDetails from './components/Atoms/BlogDetails';
import { BlogProvider } from './components/context/BlogContext';
import { AuthProvider } from './components/context/AuthContext';
import SiginPage from './components/Molecules/SignPage';
import RegisterUser from './components/Organisms/RegisterUser';
import PrivateRoute from './components/Organisms/PrivateRoute';
import DashboardLayout from './components/Organisms/DashboardLayout';
import MainLayout from './components/Organisms/MainLayout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="font-sans">
        <Router>
          <Routes>
            <Route path="/" element={<SiginPage />} />
            <Route path="/login" element={<SiginPage />} />
            <Route path="/register" element={<RegisterUser />} />

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
                <Route path="/tickets/network" element={<NetworkTicket/>} />
                <Route path="/tickets/hr" element={<HRTicket/>} />
                <Route path="/tickets/admin" element={<AdminTicket/>} />
                <Route path="/tickets/status" element={<TicketStatus/>} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/announcements" element={<Notices/>} />
                <Route path="/edit-profile" element={<EditProfilePage/>} />
                <Route path="/create-ticket" element={<SubmitATicket />} />
                <Route
                  path="/blog"
                  element={
                    <BlogProvider>
                      <BlogList />
                    </BlogProvider>
                  }
                />
                <Route
                  path="/blog/:blogId"
                  element={
                    <BlogProvider>
                      <BlogDetails />
                    </BlogProvider>
                  }
                />
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