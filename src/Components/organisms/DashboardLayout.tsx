// src/components/DashboardLayout.tsx

import React from 'react';
import Announcements from '../atoms/Announcements';
import AttendanceOverview from '../atoms/AttendanceOverview';
import Header from '../atoms/Header';
import LeaveOverview from '../atoms/LeaveOverview';
import QuickActions from '../atoms/QuickAction';
import ProfileCard from '../molecules/ProfileCard';
import Sidebar from '../molecules/Sidebar';
import profileImage from '../../assets/profile.png';
import { useNavigate } from 'react-router-dom';
import { 
  FaRegCalendarAlt, 
  FaFileInvoiceDollar, 
  FaClock, 
  FaTicketAlt, 
  FaFileContract 
} from 'react-icons/fa';

const DashboardLayout: React.FC = () => {

  const navigate = useNavigate();

  const actions = [
    { 
      label: "Apply for Leave", 
      icon: FaRegCalendarAlt, 
      onClick: () => navigate('/apply-leave'),
      tooltip: "Apply for a new leave request"
    },
    { 
      label: "View Payslip", 
      icon: FaFileInvoiceDollar, 
      onClick: () => navigate('/view-payslip'),
      tooltip: "View your latest payslip"
    },
    { 
      label: "View Attendance", 
      icon: FaClock, 
      onClick: () => navigate('/view-attendance'),
      tooltip: "Check your attendance records"
    },
    { 
      label: "Create a Ticket", 
      icon: FaTicketAlt, 
      onClick: () => navigate('/create-ticket'),
      tooltip: "Report an issue or request support"
    },
    { 
      label: "View Policies", 
      icon: FaFileContract, 
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

  const handleViewAll = () => {
    navigate('/announcements');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100 max-md:flex-col">
      <Sidebar />
      <main className="flex flex-col flex-1 ml-5 overflow-auto max-md:ml-0">
        <div className="flex flex-col mt-8 w-full max-md:mt-10 max-md:max-w-full pl-3 pr-8">
          <Header />
          <ProfileCard 
            name={'Amjad Ali'} 
            title={'Full Stack Developer'} 
            imageSrc={profileImage}/>
          <QuickActions actions={actions} />
          <Announcements announcements={announcements} onViewAll={handleViewAll} />
          <div className="mt-8 max-md:mr-2 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <LeaveOverview />
              <AttendanceOverview />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;