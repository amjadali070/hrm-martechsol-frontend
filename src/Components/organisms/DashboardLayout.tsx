import React, { useContext } from "react";
import { useNavigate } from "react-router";
import profilePlaceholder from "../../assets/placeholder.png";
import Announcements from "../atoms/Announcements";
import AttendanceOverview from "../atoms/AttendanceOverview";
import LeaveOverview from "../atoms/LeaveOverview";
import QuickActions from "../atoms/QuickAction";
import ProfileCard from "../molecules/ProfileCard";
import AttendanceTicketOverview from "../atoms/AttendanceTicketOverview";
import { AuthContext } from "./AuthContext";
import WorkAnniversariesCard from "../atoms/WorkAnniversariesCard";
import UpcomingBirthdaysCard from "../atoms/UpcomingBirthdaysCard";
import { FaSpinner } from "react-icons/fa";
import UserVehicleView from "../atoms/UserVehicleView";
import LeaveManagementCard from "../atoms/LeaveManagementCard";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center justify-center mt-20 mb-20">
          <FaSpinner
            size={30}
            className="animate-spin text-blue-600 mb-2"
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }

  const authorizedRoles = ["HR", "SuperAdmin"];
  const isAuthorized = authorizedRoles.includes(user.role || "");
  const isFinance = user.role === "Finance";

  const processPath = (path?: string) => {
    if (!path) return null;
    if (/^(http|https):\/\/[^ "]+$/.test(path)) {
      return path;
    }
    return `${backendUrl.replace(/\/+$/, "")}/${path
      .replace(/\\+/g, "/")
      .replace(/^\/+/, "")}`;
  };

  const getActions = () => {
    if (isFinance) {
      return [
        {
          label: "Payroll Finances",
          onClick: () => navigate("/organization/payroll-finance"),
          tooltip: "View and manage payroll finances",
        },
        {
          label: "Vehicle Finances",
          onClick: () => navigate("/finance/vehicles"),
          tooltip: "View and manage vehicle finances",
        },
        {
          label: "Total Finances",
          onClick: () => navigate("/finance/overview"),
          tooltip: "View total financial overview",
        },
      ];
    }

    return [
      {
        label: "Apply for Leave",
        onClick: () => navigate("/forms/leave-application"),
        tooltip: "Apply for a new leave request",
      },
      {
        label: "Attendance Ticket",
        onClick: () => navigate("/tickets/attendance"),
        tooltip: "View your latest payslip",
      },
      {
        label: "View Payroll",
        onClick: () => navigate("/payroll/view"),
        tooltip: "Check your attendance records",
      },
      {
        label: "Submit a Ticket",
        onClick: () => navigate("/create-ticket"),
        tooltip: "Report an issue or request support",
      },
      {
        label: "View Policies",
        onClick: () => navigate("/policies"),
        tooltip: "Review company policies",
      },
    ];
  };

  const handleViewAllAttendance = () => navigate("/attendance/view");
  const handleViewAll = () => {
    navigate("/organization/leave-management");
  };

  return (
    <div className="flex flex-col space-y-5 md:space-y-10">
      <ProfileCard
        name={user.name}
        jobTitle={user.personalDetails?.abbreviatedJobTitle || "N/A"}
        imageSrc={
          processPath(user.personalDetails?.profilePicture) ||
          profilePlaceholder
        }
        shiftStartTime={user.personalDetails?.shiftStartTime || "N/A"}
        shiftEndTime={user.personalDetails?.shiftEndTime || "N/A"}
      />

      <QuickActions actions={getActions()} />

      {!isFinance && (
        <div>
          <div className="flex flex-col md:flex-row gap-3">
            <Announcements />
            <LeaveOverview />
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-3">
            <AttendanceOverview onViewAll={handleViewAllAttendance} />
            <AttendanceTicketOverview />
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-3">
            <UserVehicleView userId={user._id} />
            <LeaveManagementCard onViewAll={handleViewAll} />
          </div>

          {isAuthorized && (
            <div className="flex flex-col md:flex-row gap-3 mt-3">
              <WorkAnniversariesCard />
              <UpcomingBirthdaysCard />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
