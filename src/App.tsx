import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import FeedbackForm from './components/atoms/FeedbackForm';
import SuggestionForm from './components/atoms/SuggestionForm';
import LeaveApplication from './components/atoms/LeaveApplication';
import TrackApplication from './components/atoms/TrackApplication';
import ViewAttendance from './components/atoms/ViewAttendance';
import PayrollView from './components/atoms/PayrollView';
import AavailableLeaves from './components/atoms/AavailableLeaves';
import ProvidentFund from './components/atoms/ProvidentFund';
import NotFound from './components/atoms/NotFound';
import AttendanceTicket from './components/atoms/AttendanceTicket';
import Policies from './components/atoms/Policies';
import NetworkTicket from './components/atoms/NetworkTicket';
import HRTicket from './components/atoms/HRTicket';
import AdminTicket from './components/atoms/AdminTicket';
import TicketStatus from './components/atoms/TicketStatus';
import Notices from './components/atoms/Notices';
import EditProfilePage from './components/molecules/EditProfilePage';
import SubmitATicket from './components/atoms/SubmitATicket';
import BlogList from './components/atoms/BlogList';
import BlogDetails from './components/atoms/BlogDetails';
import { BlogProvider } from './components/context/BlogContext';
import { AuthProvider } from './components/context/AuthContext';
import SiginPage from './components/molecules/SignPage';
import RegisterUser from './components/organisms/RegisterUser';
import PrivateRoute from './components/organisms/PrivateRoute';
import DashboardLayout from './components/organisms/DashboardLayout';
import MainLayout from './components/organisms/MainLayout';

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