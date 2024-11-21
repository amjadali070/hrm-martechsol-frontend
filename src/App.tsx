import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AavailableLeaves from './components/atoms/AavailableLeaves';
import AdminTicket from './components/atoms/AdminTicket';
import AttendanceTicket from './components/atoms/AttendanceTicket';
import BlogDetails from './components/atoms/BlogDetails';
import BlogList from './components/atoms/BlogList';
import FeedbackForm from './components/atoms/FeedbackForm';
import HRTicket from './components/atoms/HRTicket';
import LeaveApplication from './components/atoms/LeaveApplication';
import NetworkTicket from './components/atoms/NetworkTicket';
import NotFound from './components/atoms/NotFound';
import Notices from './components/atoms/Notices';
import PayrollView from './components/atoms/PayrollView';
import Policies from './components/atoms/Policies';
import ProvidentFund from './components/atoms/ProvidentFund';
import SubmitATicket from './components/atoms/SubmitATicket';
import SuggestionForm from './components/atoms/SuggestionForm';
import TicketStatus from './components/atoms/TicketStatus';
import TrackApplication from './components/atoms/TrackApplication';
import ViewAttendance from './components/atoms/ViewAttendance';
import { AuthProvider } from './components/organisms/AuthContext';
import EditProfilePage from './components/molecules/EditProfilePage';
import SiginPage from './components/molecules/SignPage';
import DashboardLayout from './components/organisms/DashboardLayout';
import MainLayout from './components/organisms/MainLayout';
import PrivateRoute from './components/organisms/PrivateRoute';
import RegisterUser from './components/organisms/RegisterUser';
import { BlogProvider } from './Components/organisms/BlogContext';

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