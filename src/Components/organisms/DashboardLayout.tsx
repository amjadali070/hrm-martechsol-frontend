import React from 'react';
import Announcements from '../atoms/Announcements';
import AttendanceOverview from '../atoms/AttendanceOverview';
import Header from '../atoms/Header';
import LeaveOverview from '../atoms/LeaveOverview';
import QuickActions from '../atoms/QuickAction';
import ProfileCard from '../molecules/ProfileCard';
import Sidebar from '../molecules/Sidebar';
import profileImage from '../../assets/waqas.png';
import { useNavigate } from 'react-router-dom';

import FeedbackForm from '../atoms/FeedbackForm';

const DashboardLayout: React.FC = () => {

  const navigate = useNavigate();

  const actions = [
    { 
      label: "Apply for Leave", 
      onClick: () => navigate('/apply-leave'),
      tooltip: "Apply for a new leave request"
    },
    { 
      label: "Attendace Ticket", 
      onClick: () => navigate('/view-payslip'),
      tooltip: "View your latest payslip"
    },
    { 
      label: "View Payroll", 
      onClick: () => navigate('/view-attendance'),
      tooltip: "Check your attendance records"
    },
    { 
      label: "Submit a Ticket", 
      onClick: () => navigate('/create-ticket'),
      tooltip: "Report an issue or request support"
    },
    { 
      label: "View Policies", 
      onClick: () => navigate('/view-policies'),
      tooltip: "Review company policies"
    },
  ];

  const announcements = [
    { title: "Eid Holidays", isHighlighted: true, date: "2024-04-10" },
    { title: "Final Payroll for October 2024", isHighlighted: false, date: "2024-10-31" },
    { title: "Office Renovation", isHighlighted: false, date: "2024-12-01" },
    { title: "New Health Benefits", isHighlighted: false, date: "2024-11-15" },
  ];

  const attendanceRecords = [
    { date: "11 Nov 2024", timeIn: "11:58AM", timeOut: "9:41PM", totalTime: "9:42", status: "COMPLETED" },
    { date: "12 Nov 2024", timeIn: "9:00AM", timeOut: "5:00PM", totalTime: "8:00", status: "COMPLETED" },
    { date: "13 Nov 2024", timeIn: "9:15AM", timeOut: "5:15PM", totalTime: "8:00", status: "NOT COMPLETED" },
  ];
  

  const handleViewAll = () => {
    navigate('/announcements');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#efefef] max-md:flex-col">
      <Sidebar />
      <main className="flex flex-col flex-1 ml-5 overflow-auto max-md:ml-0">
        <div className="flex flex-col mt-8 w-full max-md:mt-10 max-md:max-w-full pl-3 pr-8 pb-10">
          <Header />
          <ProfileCard 
            name={'Mirza Waqas Baig'} 
            title={'Chief Executive Officer'} 
            imageSrc={profileImage}/>
          <QuickActions actions={actions} />
          <Announcements announcements={announcements} onViewAll={handleViewAll} />
          <div className="mt-5 max-md:mr-2 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <LeaveOverview />
              <AttendanceOverview attendanceRecords={attendanceRecords} onViewAll={handleViewAll} />
            </div>
            <FeedbackForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;