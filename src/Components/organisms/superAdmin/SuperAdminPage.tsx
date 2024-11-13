// frontend/src/components/SuperAdmin/SuperAdminDashboard.tsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { MdPeople, MdMail, MdMessage, MdWork } from 'react-icons/md';
import { AuthContext } from '../../organisms/AuthContext';
import SuperAdminProjects from './SuperAdminProjects';
import SuperAdminUsers from './SuperAdminUsers';
import SuperAdminMessages from './SuperAdminMessages';
import DashboardSettings from './DashboardSettings';
import SummaryCard from './SummaryCard';

type Section = 'dashboard' | 'users' | 'projects' | 'messages' | 'settings';

const SuperAdminDashboard: React.FC = () => {
  // State variables for dashboard metrics
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useContext(AuthContext);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const [selectedSection, setSelectedSection] = useState<Section>('dashboard');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const usersResponse = await axios.get(`${backendUrl}/api/superadmin/users`, {
          params: { page: 1, limit: 1 },
          withCredentials: true,
        });
        setTotalUsers(usersResponse.data.length || 0);

        const projectsResponse = await axios.get(`${backendUrl}/api/superadmin/projects`, {
          params: { page: 1, limit: 1 },
          withCredentials: true,
        });
        setTotalProjects(projectsResponse.data.length || 0);

        const messagesResponse = await axios.get(`${backendUrl}/api/superadmin/messages`, {
          params: { page: 1, limit: 1 },
          withCredentials: true,
        });
        setTotalMessages(messagesResponse.data.length || 0);

        const unreadResponse = await axios.get(`${backendUrl}/api/messages/unread-count`, {
          withCredentials: true,
        });
        setUnreadMessages(unreadResponse.data.unreadCount || 0);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'superAdmin') {
      fetchDashboardData();
    }
  }, [backendUrl, user]);

  if (!user || user.role !== 'superAdmin') {
    return <div className="text-center text-red-500 mt-4">Access Denied. Super Admins Only.</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-500 mt-4">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  const renderSelectedSection = () => {
    switch (selectedSection) {
      case 'users':
        return <SuperAdminUsers />;
      case 'projects':
        return <SuperAdminProjects />;
      case 'messages':
        return <SuperAdminMessages />;
      // case 'settings':
      //   return <DashboardSettings />;
      // case 'dashboard':
      default:
        return <div className="mt-8 text-center text-gray-600">Select a section from the quick links above to manage.</div>;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Users"
          count={totalUsers}
          icon={MdPeople}
          bgColor="purple"
        />
        <SummaryCard
          title="Total Projects"
          count={totalProjects}
          icon={MdWork}
          bgColor="purple"
        />
        <SummaryCard
          title="Total Messages"
          count={totalMessages}
          icon={MdMail}
          bgColor="purple"
        />
        <SummaryCard
          title="Unread Messages"
          count={unreadMessages}
          icon={MdMessage}
          bgColor="purple"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          className="flex flex-col items-center p-4 bg-[#f6f6f6] rounded-lg shadow-inner cursor-pointer hover:bg-blue-100 transition-colors duration-200"
          onClick={() => setSelectedSection('users')}
        >
          <MdPeople size={40} className="text-indigo-500 mb-4" />
          <h3 className="text-lg font-medium">Manage Users</h3>
        </div>
        <div
          className="flex flex-col items-center p-4 bg-green-50 rounded-lg shadow-inner cursor-pointer hover:bg-green-100 transition-colors duration-200"
          onClick={() => setSelectedSection('projects')}
        >
          <MdWork size={40} className="text-green-500 mb-4" />
          <h3 className="text-lg font-medium">Manage Projects</h3>
        </div>
        <div
          className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg shadow-inner cursor-pointer hover:bg-yellow-100 transition-colors duration-200"
          onClick={() => setSelectedSection('messages')}
        >
          <MdMail size={40} className="text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium">Manage Messages</h3>
        </div>
        {/* <div
          className="flex flex-col items-center p-4 bg-purple-50 rounded-lg shadow-inner cursor-pointer hover:bg-purple-100 transition-colors duration-200"
          onClick={() => setSelectedSection('settings')}
        >
          <MdWork size={40} className="text-purple-500 mb-4" />
          <h3 className="text-lg font-medium">Dashboard Settings</h3>
        </div> */}
      </div>

      {/* Render Selected Section */}
      <div className="mt-8">
        {renderSelectedSection()}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;