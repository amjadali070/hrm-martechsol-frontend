// frontend/src/components/Dashboard.tsx

import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../molecules/Sidebar';
import Header from '../atoms/Header';
import StatCard from '../atoms/StatCard';
import { IoIosFolderOpen } from 'react-icons/io';
import { VscEyeClosed } from 'react-icons/vsc';
import { SiVirustotal } from 'react-icons/si';
import { MdMail } from 'react-icons/md';
import Footer from '../atoms/Footer';
import WriteMessage from '../molecules/Messages/CustomMessage';
import ChangePassword from '../molecules/ProfileSettings/ChangePassword';
import UpdateUsers from '../molecules/ProfileSettings/UpdateUsers';
import ManageSubscription from '../molecules/UserProjects/ManageSubscription';
import SearchFiles from '../molecules/Search/SearchFiles';
import ProjectDetails from './ProjectDetails';
import ReturnToHomeButton from '../atoms/ReturnHomeButton';
import SendProposal from '../molecules/New Order/SendProposal';
import ProjectForm from './ProjectForm';
import { AuthContext } from './AuthContext';
import SuperAdminProjects from './superAdmin/SuperAdminProjects';
import SuperAdminUsers from './superAdmin/SuperAdminUsers';
import UserProjects from '../molecules/UserProjects/AllUserProjects';
import SuperAdminMessages from './superAdmin/SuperAdminMessages';
import DashboardSettings from './superAdmin/DashboardSettings';
import axios from 'axios';
import defaultLogo from '../../assets/logo.png';
import AllCloseProjects from '../molecules/UserProjects/ClosedUserProjects';
import AllOpenProjects from '../molecules/UserProjects/OpenUserProjects';
import AllProjectFiles from '../molecules/AllProjectFiles';
import AllMessages from '../molecules/Messages/Allmessages';
import Preferences from '../molecules/ProfileSettings/Prefrences';
import { toast } from 'react-toastify';
import { ProjectInfo } from '../../types/projectInfo';
import SuperAdminDashboard from './superAdmin/SuperAdminPage';

interface DashboardProps {
  children?: React.ReactNode;
}

const sanitizeFilename = (filename: string) => {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
};

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [selectedContent, setSelectedContent] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectInfo | null>(null); // New State for Project Data
  
  const [dashboardSettings, setDashboardSettings] = useState<{
    logo: string;
    title: string;
  }>({
    logo: 'default-logo.png',
    title: 'Dashboard',
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [totalProjectsCount, setTotalProjectsCount] = useState<number>(0);
  const [openProjectsCount, setOpenProjectsCount] = useState<number>(0);
  const [closedProjectsCount, setClosedProjectsCount] = useState<number>(0);

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [unreadLoading, setUnreadLoading] = useState<boolean>(true);
  const [unreadError, setUnreadError] = useState<string | null>(null);

  const [countsLoading, setCountsLoading] = useState<boolean>(true);
  const [countsError, setCountsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardSettings = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/superadmin/dashboard-settings`, { withCredentials: true });
        setDashboardSettings({
          title: response.data.title,
          logo: response.data.logo,
        });
      } catch (error: any) {
        console.error('Error fetching dashboard settings:', error.response?.data?.message || error.message);
        setDashboardSettings({
          logo: 'default-logo.png',
          title: 'Dashboard',
        });
      }
    };

    if (user) {
      fetchDashboardSettings();
    }
  }, [backendUrl, user]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setCountsLoading(true);
        setCountsError(null);

        const allProjectsEndpoint = `${backendUrl}/api/projects?page=1&limit=1`;
        const openProjectsEndpoint = `${backendUrl}/api/projects?status=Open&page=1&limit=1`;
        const closedProjectsEndpoint = `${backendUrl}/api/projects?status=Approved&page=1&limit=1`;

        const [allResponse, openResponse, closedResponse] = await Promise.all([
          axios.get(allProjectsEndpoint, { withCredentials: true }),
          axios.get(openProjectsEndpoint, { withCredentials: true }),
          axios.get(closedProjectsEndpoint, { withCredentials: true }),
        ]);

        setTotalProjectsCount(allResponse.data.total);
        setOpenProjectsCount(openResponse.data.total);
        setClosedProjectsCount(closedResponse.data.total);
      } catch (error: any) {
        console.error('Error fetching project counts:', error);
        setCountsError('Failed to fetch project counts.');
        setTotalProjectsCount(0);
        setOpenProjectsCount(0);
        setClosedProjectsCount(0);
      } finally {
        setCountsLoading(false);
      }
    };

    if (user) {
      fetchCounts();
    }
  }, [backendUrl, user]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        setUnreadLoading(true);
        setUnreadError(null);
        const response = await axios.get(`${backendUrl}/api/messages/unread-count`, { withCredentials: true });
        setUnreadCount(response.data.unreadCount);
      } catch (error: any) {
        console.error('Error fetching unread messages count:', error);
        setUnreadError('Failed to fetch unread messages count.');
        setUnreadCount(0);
      } finally {
        setUnreadLoading(false);
      }
    };

    if (user) {
      fetchUnreadCount();
    }
  }, [backendUrl, user]);

  const logoSrc = dashboardSettings.logo === 'default-logo.png' ? defaultLogo : `${backendUrl}/uploads/${dashboardSettings.logo}`;

  const handleSubmenuClick = (submenuKey: string) => {
    setSelectedContent(submenuKey);
    setSelectedProjectId(null);
    setProjectData(null);
  };

  const handleReturnHome = () => {
    setSelectedContent('dashboard');
    setSelectedProjectId(null);
    setProjectData(null);
  };
  
  const handleAddSubscription = () => {
    setSelectedContent('add-project');
  };

  const handleProjectClick = async (projectId: string) => {
    try {
      const response = await axios.get<ProjectInfo>(`${backendUrl}/api/projects/${projectId}`, { withCredentials: true });
      setProjectData(response.data);
      setSelectedProjectId(projectId);
    } catch (error: any) {
      console.error('Error fetching project data:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Failed to fetch project data.');
    }
  };

  const renderContent = () => {
    if (selectedProjectId && projectData) {
      return <ProjectDetails projectId={selectedProjectId} onBack={handleReturnHome} />;
    }

    if (user?.role === 'superAdmin') {
      switch (selectedContent) {
        case 'superadmin-dashboard':
          return <SuperAdminDashboard />;
        case 'all-users':
          return <SuperAdminUsers />;
        case 'superadmin-all-projects':
          return <SuperAdminProjects />;
        case 'superadmin-all-messages':
          return <SuperAdminMessages />;
        case 'dashboard-settings':
          return <DashboardSettings setDashboardSettings={setDashboardSettings} />;
        default:
          return <SuperAdminDashboard />;
      }
    }

    switch (selectedContent) {
      case 'all-projects':
        return <UserProjects onProjectClick={handleProjectClick} />;
      case 'open-projects':
        return <AllOpenProjects onProjectClick={handleProjectClick} />;
      case 'closed-projects':
        return <AllCloseProjects onProjectClick={handleProjectClick} />;
      case 'subscription-management':
        return <ManageSubscription onAddSubscription={handleAddSubscription} />;
      case 'all-messages':
        return <AllMessages />;
      case 'write-message':
        return <WriteMessage />;
      case 'all-services':
        return <ProjectForm />;
      case 'request-proposal':
        return <SendProposal />;
      case 'preferences':
        return <Preferences />;
      case 'change-password':
        return <ChangePassword />;
      case 'addedit-users':
        return <UpdateUsers />;
      case 'search-projects':
        return <SearchFiles />;
      case 'add-project':
        return <ProjectForm />;
      default:
        return (
          <div className="overflow-hidden px-4 pt-2.5 bg-white rounded-3xl">
            <div className="flex flex-col mt-4 w-full text-lg text-gray-500">
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 max-md:max-w-full">
                {/* **StatCards with Dynamic Counts** */}
                <StatCard
                  title="Total Projects"
                  count={countsError ? null : totalProjectsCount}
                  icon={<SiVirustotal className="text-white" />}
                  onClick={() => handleSubmenuClick('all-projects')}
                  loading={countsLoading}
                  error={countsError}
                />
                <StatCard
                  title="Open Projects"
                  count={countsError ? null : openProjectsCount}
                  icon={<IoIosFolderOpen className="text-white" />}
                  onClick={() => handleSubmenuClick('open-projects')}
                  loading={countsLoading}
                  error={countsError}
                />
                <StatCard
                  title="Closed Projects"
                  count={countsError ? null : closedProjectsCount}
                  icon={<VscEyeClosed className="text-white" />}
                  onClick={() => handleSubmenuClick('closed-projects')}
                  loading={countsLoading}
                  error={countsError}
                />
                <StatCard
                  title="Unread Messages"
                  count={unreadError ? null : unreadCount}
                  icon={<MdMail className="text-white" />}
                  onClick={() => handleSubmenuClick('all-messages')}
                  loading={unreadLoading}
                  error={unreadError}
                />
              </div>
            </div>

            <section className='mt-6'>
              <AllOpenProjects onProjectClick={handleProjectClick} />
            </section>

            <section className='mt-6'>
              <AllCloseProjects onProjectClick={handleProjectClick} />
            </section>

            <section className='mt-6'>
              <AllProjectFiles onProjectClick={handleProjectClick} />
            </section>

            <section className='mt-6'>
              <AllMessages />
            </section>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="overflow-hidden px-4 pt-2.5 bg-white rounded-3xl flex-grow">
        <div className="flex flex-col gap-5 md:flex-row max-md:flex-col mb-5">
          <Sidebar 
              onSubmenuClick={handleSubmenuClick}
              logo={logoSrc}
           />
          <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
            <Header
              title={dashboardSettings.title}
            />
            <div className="flex flex-col mt-4 w-full text-lg text-gray-500">
              {renderContent()}
              <div className="mt-5 ml-4">
                <ReturnToHomeButton onReturnHome={handleReturnHome} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;