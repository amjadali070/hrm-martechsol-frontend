import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AavailableLeaves from "./Components/atoms/AavailableLeaves";
import AdminTicket from "./Components/atoms/AdminTicket";
import AttendanceTicket from "./Components/atoms/AttendanceTicket";
import BlogDetails from "./Components/atoms/BlogDetails";
import BlogList from "./Components/atoms/BlogList";
import FeedbackForm from "./Components/atoms/FeedbackForm";
import HRTicket from "./Components/atoms/HRTicket";
import LeaveApplication from "./Components/atoms/LeaveApplication";
import NetworkTicket from "./Components/atoms/NetworkTicket";
import NotFound from "./Components/atoms/NotFound";
import Notices from "./Components/atoms/Notices";
import PayrollView from "./Components/atoms/PayrollView";
import Policies from "./Components/atoms/Policies";
import ProvidentFund from "./Components/atoms/ProvidentFund";
import SubmitATicket from "./Components/atoms/SubmitATicket";
import SuggestionForm from "./Components/atoms/SuggestionForm";
import TicketStatus from "./Components/atoms/TicketStatus";
import TrackApplication from "./Components/atoms/TrackApplication";
import ViewAttendance from "./Components/atoms/ViewAttendance";
import EditProfilePage from "./Components/molecules/EditProfilePage";
import SiginPage from "./Components/molecules/SignPage";
import DashboardLayout from "./Components/organisms/DashboardLayout";
import MainLayout from "./Components/organisms/MainLayout";
import PrivateRoute from "./Components/organisms/PrivateRoute";
import RegisterUser from "./Components/organisms/RegisterUser";
import { AuthProvider } from "./Components/organisms/AuthContext";
import { BlogProvider } from "./Components/organisms/BlogContext";
import EmployeeManagement from "./Components/molecules/EmployeeManagement";
import AddNewEmployee from "./Components/molecules/AddNewEmployee";
import PayrollManagement from "./Components/molecules/PayrollManagement";
import EditablePayrollPage from "./Components/molecules/EditablePayrollPage";
import LeaveManagement from "./Components/molecules/LeaveManagement";
import TicketManagement from "./Components/molecules/TicketManagement";
import HolidayManagement from "./Components/molecules/HolidayManagement";
import UserShiftManagement from "./Components/molecules/UserShiftManagement";
import EmployeeLetter from "./Components/atoms/EmployeeLetter";
import ExperienceLetter from "./Components/atoms/ExperienceLetter";
import ForgotPasswordPage from "./Components/molecules/ForgotPasswordPage";
import NoticesManagement from "./Components/atoms/NoticesManagement";
import FullNotificationsPage from "./Components/atoms/FullNotificationsPage";
import NotificationDetailPage from "./Components/atoms/NotificationDetailPage";
import FormsManagement from "./Components/molecules/FormsManagement";
import AllWorkAnniversaries from "./Components/atoms/AllWorkAnniversaries";
import AllUpcomingBirthdays from "./Components/atoms/AllUpcomingBirthdays";
import VehicleManagement from "./Components/molecules/VehicleManagement";
import UserProfileUpdater from "./Components/atoms/SpecificUserUpdate/UserProfileUpdater";
import AttendanceManagement from "./Components/molecules/AttendanceManagement";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="font-sans">
        <BrowserRouter>
          <Routes>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/" element={<SiginPage />} />
            <Route path="/login" element={<SiginPage />} />
            <Route path="/register" element={<RegisterUser />} />

            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardLayout />} />
                <Route path="/forms/feedback" element={<FeedbackForm />} />
                <Route path="/forms/suggestion" element={<SuggestionForm />} />
                <Route
                  path="/forms/leave-application"
                  element={<LeaveApplication />}
                />
                <Route
                  path="/forms/track-application"
                  element={<TrackApplication />}
                />
                <Route path="/attendance/view" element={<ViewAttendance />} />
                <Route path="/payroll/view" element={<PayrollView />} />
                <Route
                  path="/payroll/available-leaves"
                  element={<AavailableLeaves />}
                />
                <Route
                  path="/payroll/provident-fund"
                  element={<ProvidentFund />}
                />
                <Route
                  path="/tickets/attendance"
                  element={<AttendanceTicket />}
                />
                <Route path="/tickets/network" element={<NetworkTicket />} />
                <Route path="/tickets/hr" element={<HRTicket />} />
                <Route path="/tickets/admin" element={<AdminTicket />} />
                <Route path="/tickets/status" element={<TicketStatus />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/announcements" element={<Notices />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
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
                <Route
                  path="/organization/employee-management"
                  element={<EmployeeManagement />}
                />
                <Route
                  path="/organization/employee-management/add-new-employee"
                  element={<AddNewEmployee />}
                />
                <Route
                  path="/organization/payroll-management"
                  element={<PayrollManagement />}
                />
                <Route
                  path="/organization/payroll-management/edit/:id"
                  element={<EditablePayrollPage />}
                />
                <Route
                  path="/organization/payroll-management/:id"
                  element={<EditablePayrollPage />}
                />
                <Route
                  path="/organization/leave-management"
                  element={<LeaveManagement />}
                />
                <Route
                  path="/organization/ticket-management"
                  element={<TicketManagement />}
                />
                <Route
                  path="/organization/holiday-management"
                  element={<HolidayManagement />}
                />
                <Route
                  path="/organization/user-shift-management"
                  element={<UserShiftManagement />}
                />
                <Route
                  path="/organization/notice-management"
                  element={<NoticesManagement />}
                />
                <Route
                  path="/organization/forms-management"
                  element={<FormsManagement />}
                />
                <Route
                  path="/organization/vehical-management"
                  element={<VehicleManagement />}
                />
                <Route
                  path="/organization/attendance-management"
                  element={<AttendanceManagement />}
                />
                <Route
                  path="/all-anniversaries"
                  element={<AllWorkAnniversaries />}
                />
                <Route
                  path="all-upcoming-birthdays"
                  element={<AllUpcomingBirthdays />}
                />
                <Route
                  path="/letters/employee-letter"
                  element={<EmployeeLetter />}
                />
                <Route
                  path="/letters/experience-letter"
                  element={<ExperienceLetter />}
                />
                {/* <Route path="/edit-profile/:id" element={<EditProfilePage />} /> */}
                <Route
                  path="/edit-profile/:id"
                  element={<UserProfileUpdater />}
                />
                <Route
                  path="/notifications"
                  element={<FullNotificationsPage />}
                />
                <Route
                  path="/notification-detail"
                  element={<NotificationDetailPage />}
                />
                <Route path="*" element={<NotFound />} />
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
