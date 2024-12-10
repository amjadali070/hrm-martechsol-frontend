import React from "react";
import { useNavigate } from "react-router";
import profilePlaceHolder from "../../assets/placeholder.png";
import Announcements from "../atoms/Announcements";
import AttendanceOverview from "../atoms/AttendanceOverview";
import LeaveOverview from "../atoms/LeaveOverview";
import QuickActions from "../atoms/QuickAction";
import ProfileCard from "../molecules/ProfileCard";
import AttendanceTicketOverview from "../atoms/AttendanceTicketOverview";
import useUser from "../../hooks/useUser";
import WorkAnniversariesCard from "../atoms/WorkAnniversariesCard";
import UpcomingBirthdaysCard from "../atoms/UpcomingBirthdaysCard";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const actions = [
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

  const handleViewAllAttendance = () => navigate("/attendance/view");

  return (
    <div className="flex flex-col space-y-5 md:space-y-10">
      <ProfileCard
        name={user?.name || "N/A"}
        jobTitle={user?.personalDetails?.abbreviatedJobTitle || "N/A"}
        imageSrc={user?.personalDetails?.profilePicture || profilePlaceHolder}
        userShift={user?.personalDetails?.shiftTimings || "N/A"}
      />

      <QuickActions actions={actions} />

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
          <WorkAnniversariesCard />
          <UpcomingBirthdaysCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
