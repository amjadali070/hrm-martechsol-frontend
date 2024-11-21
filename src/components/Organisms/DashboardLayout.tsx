import React from 'react';
import Announcements from '../atoms/Announcements';
import AttendanceOverview from '../atoms/AttendanceOverview';
import ProfileCard from '../molecules/ProfileCard';
import QuickActions from '../atoms/QuickAction';
import LeaveOverview from '../atoms/LeaveOverview';
import { useNavigate } from 'react-router';
import profileImage from '../../assets/waqas.png';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Apply for Leave', onClick: () => navigate('/forms/leave-application'), tooltip: 'Apply for a new leave request' },
    { label: 'Attendance Ticket', onClick: () => navigate('/tickets/attendance'), tooltip: 'View your latest payslip' },
    { label: 'View Payroll', onClick: () => navigate('/payroll/view'), tooltip: 'Check your attendance records' },
    { label: 'Submit a Ticket', onClick: () => navigate('/create-ticket'), tooltip: 'Report an issue or request support' },
    { label: 'View Policies', onClick: () => navigate('/policies'), tooltip: 'Review company policies' },
  ];

  const announcementsData = [
    {
      id: 1,
      date: '2024-11-15',
      subject: 'Annual Holiday Announcement',
      status: "Read" as "Read",
      paragraph: 'The office will remain closed on the 25th of December for the annual holiday.',
    },
    {
      id: 2,
      date: '2024-11-10',
      subject: 'Policy Update Notification',
      status: "Read" as "Read",
      paragraph: 'The company policy has been updated. Please review it on the HR portal.',
    },
    {
      id: 3,
      date: '2024-11-05',
      subject: 'Team Meeting Schedule',
      status: "Read" as "Read",
      paragraph: 'The team meeting is scheduled for 10 AM on November 7th in the main conference room.',
    },
  ];

  const attendanceRecords = [
    { date: '11 Nov 2024', timeIn: '11:58AM', timeOut: '9:41PM', totalTime: '9:42', status: 'COMPLETED' },
    { date: '12 Nov 2024', timeIn: '9:00AM', timeOut: '5:00PM', totalTime: '8:00', status: 'COMPLETED' },
    { date: '13 Nov 2024', timeIn: '9:15AM', timeOut: '5:15PM', totalTime: '8:00', status: 'NOT COMPLETED' },
  ];

  const handleViewAll = () => {
    navigate('/announcements');
  };

  const handleViewAllLAttendence = () => {
    navigate('/attendance/view');
  };

  return (
    <>
      <ProfileCard name="Mirza Waqas Baig" title="Chief Executive Officer" imageSrc={profileImage} />
      <QuickActions actions={actions} />
      <Announcements announcements={announcementsData} onViewAll={handleViewAll} />
      <div className="mt-5 max-md:mr-2 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <LeaveOverview />
          <AttendanceOverview attendanceRecords={attendanceRecords} onViewAll={handleViewAllLAttendence} />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;