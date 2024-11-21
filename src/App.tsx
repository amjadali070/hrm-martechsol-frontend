import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import FeedbackForm from './Components/atoms/FeedbackForm';
import SuggestionForm from './Components/atoms/SuggestionForm';
import LeaveApplication from './Components/atoms/LeaveApplication';
import TrackApplication from './Components/atoms/TrackApplication';
import ViewAttendance from './Components/atoms/ViewAttendance';
import PayrollView from './Components/atoms/PayrollView';
import AavailableLeaves from './Components/atoms/AavailableLeaves';
import ProvidentFund from './Components/atoms/ProvidentFund';
import NotFound from './Components/atoms/NotFound';
import AttendanceTicket from './Components/atoms/AttendanceTicket';
import Policies from './Components/atoms/Policies';
import NetworkTicket from './Components/atoms/NetworkTicket';
import HRTicket from './Components/atoms/HRTicket';
import AdminTicket from './Components/atoms/AdminTicket';
import TicketStatus from './Components/atoms/TicketStatus';
import Notices from './Components/atoms/Notices';
import EditProfilePage from './Components/molecules/EditProfilePage';
import SubmitATicket from './Components/atoms/SubmitATicket';
import BlogList from './Components/atoms/BlogList';
import BlogDetails from './Components/atoms/BlogDetails';
import { AuthProvider } from './Components/context/AuthContext';
import SiginPage from './Components/molecules/SignPage';
import RegisterUser from './Components/organisms/RegisterUser';
import PrivateRoute from './Components/organisms/PrivateRoute';
import DashboardLayout from './Components/organisms/DashboardLayout';
import MainLayout from './Components/organisms/MainLayout';
import { BlogProvider } from './Components/context/BlogContext';

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