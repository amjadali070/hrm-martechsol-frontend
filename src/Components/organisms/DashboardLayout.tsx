import React, { useContext } from "react";
import { useNavigate } from "react-router";
import profilePlaceholder from "../../assets/placeholder.png";
import Announcements from "../atoms/Announcements";
import AttendanceOverview from "../atoms/AttendanceOverview";
import LeaveOverview from "../atoms/LeaveOverview";
import QuickActions, { QuickActionItem } from "../atoms/QuickAction";
import AttendanceTicketOverview from "../atoms/AttendanceTicketOverview";
import { AuthContext } from "./AuthContext";
import WorkAnniversariesCard from "../atoms/WorkAnniversariesCard";
import UpcomingBirthdaysCard from "../atoms/UpcomingBirthdaysCard";
import {
  FaSpinner,
  FaMoneyBillWave,
  FaCar,
  FaCalendarPlus,
  FaTicketAlt,
  FaFileInvoiceDollar,
  FaHeadset,
  FaBook,
  FaBriefcase,
  FaClock,
  FaCalendarDay,
} from "react-icons/fa";
import UserVehicleView from "../atoms/UserVehicleView";
import LeaveManagementCard from "../atoms/LeaveManagementCard";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center justify-center">
          <FaSpinner
            size={40}
            className="animate-spin text-gunmetal-600 mb-4"
            aria-hidden="true"
          />
          <p className="text-slate-grey-500 font-medium tracking-wide">
            Initializing Workspace...
          </p>
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

  const getActions = (): QuickActionItem[] => {
    // Professional Monochrome Style: Standardized colors
    const baseActionStyle =
      "bg-white border border-platinum-200 text-gunmetal-700 hover:border-gunmetal-300 hover:shadow-md transition-all";

    if (isFinance) {
      return [
        {
          label: "Payroll Finances",
          onClick: () => navigate("/organization/payroll-finance"),
          tooltip: "View and manage payroll finances",
          icon: FaMoneyBillWave,
          color:
            "bg-alabaster-grey-50 text-gunmetal-700 border border-alabaster-grey-200",
        },
        {
          label: "Vehicle Finances",
          onClick: () => navigate("/organization/vehicle-finance"),
          tooltip: "View and manage vehicle finances",
          icon: FaCar,
          color:
            "bg-alabaster-grey-50 text-gunmetal-700 border border-alabaster-grey-200",
        },
      ];
    }

    return [
      {
        label: "Apply Leave",
        onClick: () => navigate("/forms/leave-application"),
        tooltip: "New Request",
        icon: FaCalendarPlus,
        color:
          "bg-white text-carbon-black-900 border border-platinum-200 hover:border-platinum-300",
      },
      {
        label: "Tickets",
        onClick: () => navigate("/tickets/attendance"),
        tooltip: "Support",
        icon: FaTicketAlt,
        color:
          "bg-white text-carbon-black-900 border border-platinum-200 hover:border-platinum-300",
      },
      {
        label: "Payroll",
        onClick: () => navigate("/payroll/view"),
        tooltip: "Payslips",
        icon: FaFileInvoiceDollar,
        color:
          "bg-white text-carbon-black-900 border border-platinum-200 hover:border-platinum-300",
      },
      {
        label: "Support",
        onClick: () => navigate("/create-ticket"),
        tooltip: "Help Desk",
        icon: FaHeadset,
        color:
          "bg-white text-carbon-black-900 border border-platinum-200 hover:border-platinum-300",
      },
      {
        label: "Policies",
        onClick: () => navigate("/policies"),
        tooltip: "Guidelines",
        icon: FaBook,
        color:
          "bg-white text-carbon-black-900 border border-platinum-200 hover:border-platinum-300",
      },
    ];
  };

  const handleViewAllAttendance = () => navigate("/attendance/view");
  const handleViewLeaveApplications = () =>
    navigate("/forms/track-application");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="pb-12 animate-fadeIn space-y-8">
      {/* 1. Hero Section - Premium Corporate Aesthetic */}
      <div className="relative rounded-xl bg-linear-to-r from-gunmetal-900 to-black text-white overflow-hidden shadow-2xl p-8 lg:p-10 border border-white/10">
        {/* Subtle abstract geometric background instead of blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gunmetal-700/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg p-1 bg-white/5 backdrop-blur-md border border-white/10 shadow-lg ring-1 ring-white/5 group-hover:ring-white/20 transition-all">
                <img
                  src={
                    processPath(user.personalDetails?.profilePicture) ||
                    profilePlaceholder
                  }
                  alt={user.name}
                  onError={(e) => {
                    e.currentTarget.src = profilePlaceholder;
                  }}
                  className="w-full h-full rounded-md object-cover grayscale-[0.2] transition-all duration-500 group-hover:grayscale-0"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white text-green-600 text-[9px] font-bold px-2 py-0.5 rounded shadow-sm border border-platinum-200 tracking-wider">
                ONLINE
              </div>
            </div>

            <div>
              <p className="text-platinum-400 font-medium mb-1 text-sm tracking-wide flex items-center gap-2">
                <FaCalendarDay className="opacity-70 text-xs" /> {today}
              </p>
              <h1 className="relative z-10 text-3xl md:text-4xl font-display font-semibold tracking-tight mb-3 text-surface-700">
                Good Afternoon, {user.name.split(" ")[0]}
              </h1>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 text-xs font-medium text-platinum-200 border border-white/10 hover:bg-white/10 transition-colors">
                  <FaBriefcase className="text-platinum-400" />{" "}
                  {user.personalDetails?.abbreviatedJobTitle}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 text-xs font-medium text-platinum-200 border border-white/10 hover:bg-white/10 transition-colors">
                  <FaClock className="text-platinum-400" />{" "}
                  {user.personalDetails?.shiftStartTime || "09:00"} -{" "}
                  {user.personalDetails?.shiftEndTime || "18:00"}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block text-right">
            <p className="text-gunmetal-300 text-xs mb-1 uppercase tracking-[0.2em] font-semibold">
              Workspace
            </p>
            <p className="text-2xl font-light font-display text-surface-400 tracking-wide">
              {user.role}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions Bar */}
      <QuickActions actions={getActions()} />

      {!isFinance && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AttendanceOverview onViewAll={handleViewAllAttendance} />
          <LeaveManagementCard onViewAll={handleViewLeaveApplications} />

          <AttendanceTicketOverview />
          <UserVehicleView userId={user._id} />

          <Announcements />
          <LeaveOverview />

          {isAuthorized && (
            <>
              <WorkAnniversariesCard />
              <UpcomingBirthdaysCard />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
