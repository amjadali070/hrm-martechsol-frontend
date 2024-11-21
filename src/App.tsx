import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AavailableLeaves from './components/Atoms/AavailableLeaves';
import AdminTicket from './components/Atoms/AdminTicket';
import AttendanceTicket from './components/Atoms/AttendanceTicket';
import BlogDetails from './components/Atoms/BlogDetails';
import BlogList from './components/Atoms/BlogList';
import FeedbackForm from './components/Atoms/FeedbackForm';
import HRTicket from './components/Atoms/HRTicket';
import LeaveApplication from './components/Atoms/LeaveApplication';
import NetworkTicket from './components/Atoms/NetworkTicket';
import NotFound from './components/Atoms/NotFound';
import Notices from './components/Atoms/Notices';
import PayrollView from './components/Atoms/PayrollView';
import Policies from './components/Atoms/Policies';
import ProvidentFund from './components/Atoms/ProvidentFund';
import SubmitATicket from './components/Atoms/SubmitATicket';
import SuggestionForm from './components/Atoms/SuggestionForm';
import TicketStatus from './components/Atoms/TicketStatus';
import TrackApplication from './components/Atoms/TrackApplication';
import ViewAttendance from './components/Atoms/ViewAttendance';
import { AuthProvider } from './components/Organisms/AuthContext';
import EditProfilePage from './components/Molecules/EditProfilePage';
import SiginPage from './components/Molecules/SignPage';
import DashboardLayout from './components/Organisms/DashboardLayout';
import MainLayout from './components/Organisms/MainLayout';
import PrivateRoute from './components/Organisms/PrivateRoute';
import RegisterUser from './components/Organisms/RegisterUser';
import { BlogProvider } from './components/Organisms/BlogContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="font-sans">
        <BrowserRouter>
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
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;