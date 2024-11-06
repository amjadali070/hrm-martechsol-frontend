// frontend/src/components/Dashboard.tsx

import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../molecules/Sidebar';
import Header from '../atoms/Header';
import StatCard from '../atoms/StatCard';
import { IoIosFolderOpen } from 'react-icons/io';
import { VscEyeClosed } from 'react-icons/vsc';
import { FiMessageSquare } from 'react-icons/fi';
import { SiVirustotal } from 'react-icons/si';
import Footer from '../atoms/Footer';
import ClosedProjects from '../molecules/Projects/ClosedProjects';
import OpenProjects from '../molecules/Projects/OpenProjects';
import AllMessages from '../molecules/Messages/Allmessages';
import WriteMessage from '../molecules/Messages/CustomMessage';
import ChangePassword from '../molecules/ProfileSettings/ChangePassword';
import UpdateUsers from '../molecules/ProfileSettings/UpdateUsers';
import ManageSubscription from '../molecules/Projects/ManageSubscription';
import SearchFiles from '../molecules/Search/SearchFiles';
import ProjectDetails from './ProjectDetails';
import UpdatedProjectTable, {
  Project as ProjectType,
} from '../atoms/UpdateProjectsTable';
import ReturnToHomeButton from '../atoms/ReturnHomeButton';
import SendProposal from '../molecules/New Order/SendProposal';
import ProjectForm from './ProjectForm';
import ProjectList from './RecentFilesList';
import { AuthContext } from './AuthContext';
import SuperAdminProjects from './superAdmin/SuperAdminProjects';
import SuperAdminUsers from './superAdmin/SuperAdminUsers';
import UserProjects from '../molecules/UserProjects/AllUserProjects';
import Preferences from '../molecules/ProfileSettings/Prefrences';
import SuperAdminMessages from './superAdmin/SuperAdminMessages';
import DashboardSettings from './superAdmin/DashboardSettings'; // Import the DashboardSettings component
import axios from 'axios';
import defaultLogo from '../../assets/logo.png'; // Import default logo

interface DashboardProps {
  children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [selectedContent, setSelectedContent] = useState<string>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  const [dashboardSettings, setDashboardSettings] = useState<{
    logo: string;
    title: string;
  }>({
    logo: 'default-logo.png',
    title: 'Dashboard',
  });

  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
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
        // Fallback to default settings if there's an error (e.g., user not allowed)
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

  // Determine the logo to pass to Header
  const logoSrc = dashboardSettings.logo === 'default-logo.png' ? defaultLogo : `/uploads/${dashboardSettings.logo}`;

  const handleSubmenuClick = (submenuKey: string) => {
    setSelectedContent(submenuKey);
    setSelectedProjectId(null);
  };

  const handleReturnHome = () => {
    setSelectedContent('dashboard');
    setSelectedProjectId(null);
  };

  // Handler for adding new subscription
  const handleAddSubscription = () => {
    setSelectedContent('add-project');
  };

  interface Column {
    key: keyof ProjectType;
    label: string;
  }

  const columns: Column[] = [
    { key: 'projectName', label: 'Project Title' },
    { key: 'category', label: 'Category' },
    { key: 'completion', label: 'Completion' },
    { key: 'projectStatus', label: 'Project Status' },
    { key: 'deadline', label: 'Deadline' },
    { key: 'invoice', label: 'Invoice' },
    { key: 'riForm', label: 'RI Form' },
  ];

  // Sample project data (replace with actual data)
  const OpenProject: ProjectType[] = [
    {
      _id: '1',
      projectName: '1 Video 60-90 seconds',
      category: 'Video',
      completion: '1/1',
      projectStatus: 'Working',
      deadline: '2024-10-21T00:00:00Z',
      invoice: true,
      riForm: '-',
    },
  ];

  const ClosedProject: ProjectType[] = [];

  // Function to render the appropriate content based on user role and selected menu
  const renderContent = () => {
    if (selectedProjectId) {
      return <ProjectDetails />;
    }

    if (user?.role === 'superAdmin') {
      switch (selectedContent) {
        case 'all-users':
          return <SuperAdminUsers />;
        case 'superadmin-all-projects':
          return <SuperAdminProjects />;
        case 'superadmin-all-messages':
          return <SuperAdminMessages />;
        case 'dashboard-settings':
          return <DashboardSettings setDashboardSettings={setDashboardSettings} />;
        default:
          return <SuperAdminUsers />;
      }
    }

    // Render content for normal users
    switch (selectedContent) {
      case 'all-projects':
        return <UserProjects />;
      case 'open-projects':
        return <OpenProjects />;
      case 'closed-projects':
        return <ClosedProjects />;
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
                <StatCard
                  title="Total Projects"
                  count={4}
                  icon={<SiVirustotal className="text-white" />}
                  onClick={() => handleSubmenuClick('all-projects')}
                />
                <StatCard
                  title="Open Projects"
                  count={1}
                  icon={<IoIosFolderOpen className="text-white" />}
                  onClick={() => handleSubmenuClick('open-projects')}
                />
                <StatCard
                  title="Closed Projects"
                  count={0}
                  icon={<VscEyeClosed className="text-white" />}
                  onClick={() => handleSubmenuClick('closed-projects')}
                />
                <StatCard
                  title="Messages"
                  count={4}
                  icon={<FiMessageSquare className="text-white" />}
                  onClick={() => handleSubmenuClick('all-messages')}
                />
              </div>
            </div>

            <section>
              <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">
                Open Project(s)
              </h2>
              <UpdatedProjectTable projects={OpenProject} columns={columns} />
            </section>

            <section>
              <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">
                Closed Project(s)
              </h2>
              <UpdatedProjectTable projects={ClosedProject} columns={columns} />
            </section>

            <section>
              <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">
                Recent File(s)
              </h2>
              <ProjectList />
              {/* <UpdatedProjectTable projects={RecentFiles} columns={columns} /> */}
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
