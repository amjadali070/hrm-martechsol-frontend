import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./Components/organisms/AuthContext";
import AdminTicket from "./components/atoms/AdminTicket";
import AllUpcomingBirthdays from "./components/atoms/AllUpcomingBirthdays";
import AllWorkAnniversaries from "./components/atoms/AllWorkAnniversaries";
import AttendanceManager from "./components/atoms/AttendanceManager";
import AttendanceTicket from "./components/atoms/AttendanceTicket";
import BlogDetails from "./components/atoms/BlogDetails";
import BlogList from "./components/atoms/BlogList";
import EmployeeLetter from "./components/atoms/EmployeeLetter";
import ExperienceLetter from "./components/atoms/ExperienceLetter";
import FeedbackForm from "./components/atoms/FeedbackForm";
import FullNotificationsPage from "./components/atoms/FullNotificationsPage";
import HRTicket from "./components/atoms/HRTicket";
import LeaveApplication from "./components/atoms/LeaveApplication";
import LeavesAvailable from "./components/atoms/LeavesAvailable";
import NetworkTicket from "./components/atoms/NetworkTicket";
import NotFound from "./components/atoms/NotFound";
import Notices from "./components/atoms/Notices";
import CreateNotice from "./components/atoms/notices/CreateNotice";
import NoticesManagement from "./components/atoms/NoticesManagement";
import NotificationDetailPage from "./components/atoms/NotificationDetailPage";
import PayrollView from "./components/atoms/PayrollView";
import Policies from "./components/atoms/Policies";
import ProvidentFund from "./components/atoms/ProvidentFund";
import UserProfileUpdater from "./components/atoms/SpecificUserUpdate/UserProfileUpdater";
import SubmitATicket from "./components/atoms/SubmitATicket";
import SuggestionForm from "./components/atoms/SuggestionForm";
import TicketStatus from "./components/atoms/TicketStatus";
import TrackApplication from "./components/atoms/TrackApplication";
import ViewAttendance from "./components/atoms/ViewAttendance";
import AddNewEmployee from "./components/molecules/AddNewEmployee";
import AttendanceManagement from "./components/molecules/AttendanceManagement";
import EditablePayrollPage from "./components/molecules/EditablePayrollPage";
import EditProfilePage from "./components/molecules/EditProfilePage";
import EmployeeManagement from "./components/molecules/EmployeeManagement";
import ForgotPasswordPage from "./components/molecules/ForgotPasswordPage";
import FormsManagement from "./components/molecules/FormsManagement";
import HolidayManagement from "./components/molecules/HolidayManagement";
import LeaveManagement from "./components/molecules/LeaveManagement";
import PayrollManagement from "./Components/molecules/PayrollManagement";
import SiginPage from "./components/molecules/SignPage";
import TeamManagement from "./components/molecules/TeamManagement";
import TicketManagement from "./components/molecules/TicketManagement";
import UserShiftManagement from "./components/molecules/UserShiftManagement";
import VehicleManagement from "./components/molecules/VehicleManagement";
import { BlogProvider } from "./Components/organisms/BlogContext";
import DashboardLayout from "./components/organisms/DashboardLayout";
import MainLayout from "./components/organisms/MainLayout";
import PrivateRoute from "./components/organisms/PrivateRoute";
import RegisterUser from "./components/organisms/RegisterUser";

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
                  element={<LeavesAvailable />}
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
                  path="/organization/vehicle-management"
                  element={<VehicleManagement />}
                />
                <Route
                  path="/organization/attendance-management"
                  element={<AttendanceManagement />}
                />
                <Route
                  path="/organization/team-management"
                  element={<TeamManagement />}
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
                <Route path="/notices/create" element={<CreateNotice />} />

                <Route
                  path="/organization/attendance-manager"
                  element={<AttendanceManager />}
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
