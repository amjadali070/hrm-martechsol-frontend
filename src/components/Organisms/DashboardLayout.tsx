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

  const announcementsData = [
    {
      id: 1,
      date: "2024-11-15",
      subject: "Annual Holiday Announcement",
      status: "Read" as "Read",
      paragraph:
        "The office will remain closed on the 25th of December for the annual holiday.",
    },
    {
      id: 2,
      date: "2024-11-10",
      subject: "Policy Update Notification",
      status: "Read" as "Read",
      paragraph:
        "The company policy has been updated. Please review it on the HR portal.",
    },
    {
      id: 3,
      date: "2024-11-05",
      subject: "Team Meeting Schedule",
      status: "Read" as "Read",
      paragraph:
        "The team meeting is scheduled for 10 AM on November 7th in the main conference room.",
    },
  ];

  const attendanceTickets = [
    {
      id: 1,
      date: "2024-11-20",
      comments: "Worked from home.",
      status: "Approved" as "Approved",
    },
    {
      id: 2,
      date: "2024-11-19",
      comments: "Arrived late due to traffic.",
      status: "Pending" as "Pending",
    },
    {
      id: 3,
      date: "2024-11-18",
      comments: "Left early for a doctor's appointment.",
      status: "Rejected" as "Rejected",
    },
  ];

  const handleViewAllAnnouncements = () => navigate("/announcements");
  const handleViewAllAttendance = () => navigate("/attendance/view");
  const handleViewAllAttendanceTickets = () => navigate("/tickets/attendance");

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
          <Announcements
            announcements={announcementsData}
            onViewAll={handleViewAllAnnouncements}
          />
          <LeaveOverview />
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-3">
          <AttendanceOverview onViewAll={handleViewAllAttendance} />
          <AttendanceTicketOverview />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
