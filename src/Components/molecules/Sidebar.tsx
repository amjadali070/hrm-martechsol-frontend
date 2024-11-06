// frontend/src/molecules/Sidebar.tsx

import React, { useState, useContext } from 'react';
import {
  IoIosArrowForward,
} from 'react-icons/io';
import { GoProjectSymlink } from 'react-icons/go';
import {
  MdDashboard,
  MdKeyboardArrowRight,
  MdLogout,
  MdSearch,
  MdSettings,
  MdPeople,
} from 'react-icons/md';
import { TiMessages } from 'react-icons/ti';
import { HiMenuAlt3 } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { FaCartPlus, FaPlus } from 'react-icons/fa';
// import logo from '../../assets/logo.png';
import { AuthContext } from '../organisms/AuthContext';

interface SidebarProps {
  onSubmenuClick: (submenuKey: string) => void;
  logo: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSubmenuClick, logo}) => {
  const { user } = useContext(AuthContext); // Get user from context
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('Dashboard');
  const [selectedSubmenuItem, setSelectedSubmenuItem] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [submenuState, setSubmenuState] = useState<{
    [key: string]: boolean;
  }>({
    Projects: false,
    Messages: false,
    Settings: false,
    NewOrder: false,
    SuperAdmin: false,
    DashboardSettings: false,
  });

  const navigate = useNavigate();

  const handleMenuItemClick = (label: string) => {
    setSelectedMenuItem(label);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);

    setSubmenuState(prevState => ({
      ...prevState,
      [label]: !prevState[label],
      ...Object.keys(prevState).reduce((acc, key) => {
        if (key !== label) acc[key] = false;
        return acc;
      }, {} as { [key: string]: boolean }),
    }));

    switch (label) {
      case 'Dashboard':
        onSubmenuClick('dashboard');
        navigate('/dashboard');
        break;
      case 'Search':
        onSubmenuClick('search-projects');
        navigate('/dashboard');
        break;
      case 'Add Project':
        onSubmenuClick('add-project');
        navigate('/dashboard');
        break;
      case 'Log Out':
        // Implement logout functionality
        navigate('/');
        break;
      case 'SuperAdmin':
        navigate('/superadmin');
        break;
      case 'DashboardSettings': // Handle Dashboard Settings navigation
        onSubmenuClick('dashboard-settings');
        navigate('/dashboard/dashboard-settings');
        break;
      default:
        break;
    }
  };

  const handleSubmenuClick = (submenuKey: string) => {
    setSelectedSubmenuItem(submenuKey);
    onSubmenuClick(submenuKey);
  };

  const projectSubmenuItems = [
    { label: 'All Projects', key: 'all-projects' },
    { label: 'Open Projects', key: 'open-projects' },
    { label: 'Closed Projects', key: 'closed-projects' },
    { label: 'Subscription Management', key: 'subscription-management' },
  ];

  const messagesSubmenuItems = [
    { label: 'View All Messages', key: 'all-messages' },
    { label: 'Write Message', key: 'write-message' },
  ];

  const newOrderSubmenuItems = [
    { label: 'All Services', key: 'all-services' },
    { label: 'Request a Proposal', key: 'request-proposal' },
  ];

  const settingsSubmenuItems = [
    { label: 'Preferences', key: 'preferences' },
    { label: 'Change Password', key: 'change-password' },
    { label: 'Manage Users', key: 'addedit-users' },
  ];

  // Super Admin submenu items
  const superAdminSubmenuItems = [
    { label: 'All Users', key: 'all-users' },
    { label: 'All Projects', key: 'superadmin-all-projects' },
    { label: 'Messages', key: 'superadmin-all-messages' },
    { label: 'Dashboard Settings', key: 'dashboard-settings' }, // Added Dashboard Settings
  ];

  return (
    <>
      {/* Mobile Menu Header */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-blue-50">
        <HiMenuAlt3
          className="text-3xl cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <h1 className="text-xl font-medium">Dashboard</h1>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? 'block' : 'hidden'
        } lg:flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        } transition-all duration-300 bg-blue-50 rounded-xl border border-solid border-slate-300`}
      >
        <nav className="flex flex-col px-4 pt-5 pb-3 w-full">
          <div className="flex justify-between items-center w-full mb-4">
            {!isCollapsed && (
              <img src={logo} alt="Logo" className="h-10 w-auto" />
            )}
            <div
              className="flex justify-center items-center w-10 h-10 bg-white border border-solid border-slate-300 rounded-full cursor-pointer"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <IoIosArrowForward
                className={`transform ${
                  isCollapsed ? 'rotate-180' : ''
                } transition-transform duration-300`}
              />
            </div>
          </div>
          <hr className="shrink-0 mt-5 h-px border border-solid border-slate-300" />
          <div className={`flex flex-col mt-6 w-full text-lg text-gray-500`}>
            <div className={`text-start uppercase ${isCollapsed ? 'hidden' : ''}`}>
              Menu
            </div>
            <ul className="mt-4 space-y-2">
              {/* Dashboard Menu Item */}
              <li
                onClick={() => handleMenuItemClick('Dashboard')}
                className={`flex gap-2.5 items-center p-3 w-full cursor-pointer justify-between ${
                  selectedMenuItem === 'Dashboard'
                    ? 'text-white bg-purple-700'
                    : ''
                } rounded-xl`}
              >
                <div className="flex gap-2.5 items-center">
                  <span className="object-contain w-6 h-6 mt-1">
                    <MdDashboard />
                  </span>
                  {!isCollapsed && <span>Dashboard</span>}
                </div>
              </li>

              {/* Projects Menu Item */}
              <li
                onClick={() => handleMenuItemClick('Projects')}
                className={`flex gap-2.5 items-center p-3 w-full cursor-pointer justify-between ${
                  selectedMenuItem === 'Projects'
                    ? 'text-white bg-purple-700'
                    : ''
                } rounded-xl`}
              >
                <div className="flex gap-2.5 items-center">
                  <span className="object-contain w-6 h-6 mt-1">
                    <GoProjectSymlink />
                  </span>
                  {!isCollapsed && <span>Projects</span>}
                </div>
                {!isCollapsed && (
                  <MdKeyboardArrowRight
                    className={`shrink-0 w-6 h-6 ${
                      submenuState['Projects'] ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </li>

              {/* Projects Submenu */}
              {submenuState['Projects'] && !isCollapsed && (
                <ul className="ml-8 mt-2 space-y-2">
                  {projectSubmenuItems.map(item => (
                    <li
                      key={item.key}
                      onClick={() => handleSubmenuClick(item.key)}
                      className={`p-2 text-gray-700 cursor-pointer ${
                        selectedSubmenuItem === item.key
                          ? 'text-black bg-gray-200'
                          : ''
                      } rounded-xl`}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}

              {/* Messages Menu Item */}
              <li
                onClick={() => handleMenuItemClick('Messages')}
                className={`flex gap-2.5 items-center p-3 w-full cursor-pointer justify-between ${
                  selectedMenuItem === 'Messages'
                    ? 'text-white bg-purple-700'
                    : ''
                } rounded-xl`}
              >
                <div className="flex gap-2.5 items-center">
                  <span className="object-contain w-6 h-6 mt-1">
                    <TiMessages />
                  </span>
                  {!isCollapsed && <span>Messages</span>}
                </div>
                {!isCollapsed && (
                  <MdKeyboardArrowRight
                    className={`shrink-0 w-6 h-6 ${
                      submenuState['Messages'] ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </li>

              {/* Messages Submenu */}
              {submenuState['Messages'] && !isCollapsed && (
                <ul className="ml-8 mt-2 space-y-2">
                  {messagesSubmenuItems.map(item => (
                    <li
                      key={item.key}
                      onClick={() => handleSubmenuClick(item.key)}
                      className={`p-2 text-gray-700 cursor-pointer ${
                        selectedSubmenuItem === item.key
                          ? 'text-black bg-gray-200'
                          : ''
                      } rounded-xl`}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}

              <li
                onClick={() => handleMenuItemClick('New Order')}
                className={`flex gap-2.5 items-center p-3 w-full cursor-pointer justify-between ${
                  selectedMenuItem === 'New Order'
                    ? 'text-white bg-purple-700'
                    : ''
                } rounded-xl`}
              >
                <div className="flex gap-2.5 items-center">
                  <span className="object-contain w-6 h-6 mt-1">
                    <FaCartPlus />
                  </span>
                  {!isCollapsed && <span>New Order</span>}
                </div>
                {!isCollapsed && (
                  <MdKeyboardArrowRight
                    className={`shrink-0 w-6 h-6 ${
                      submenuState['NewOrder'] ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </li>

              {/* New Order Submenu */}
              {submenuState['New Order'] && !isCollapsed && (
                <ul className="ml-8 mt-2 space-y-2">
                  {newOrderSubmenuItems.map(item => (
                    <li
                      key={item.key}
                      onClick={() => handleSubmenuClick(item.key)}
                      className={`p-2 text-gray-700 cursor-pointer ${
                        selectedSubmenuItem === item.key
                          ? 'text-black bg-gray-200'
                          : ''
                      } rounded-xl`}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}

              {/* Settings Menu Item */}
              <li
                onClick={() => handleMenuItemClick('Settings')}
                className={`flex gap-2.5 items-center p-3 w-full cursor-pointer justify-between ${
                  selectedMenuItem === 'Settings'
                    ? 'text-white bg-purple-700'
                    : ''
                } rounded-xl`}
              >
                <div className="flex gap-2.5 items-center">
                  <span className="object-contain w-6 h-6 mt-1">
                    <MdSettings />
                  </span>
                  {!isCollapsed && <span>Settings</span>}
                </div>
                {!isCollapsed && (
                  <MdKeyboardArrowRight
                    className={`shrink-0 w-6 h-6 ${
                      submenuState['Settings'] ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </li>

              {/* Settings Submenu */}
              {submenuState['Settings'] && !isCollapsed && (
                <ul className="ml-8 mt-2 space-y-2">
                  {settingsSubmenuItems.map(item => (
                    <li
                      key={item.key}
                      onClick={() => handleSubmenuClick(item.key)}
                      className={`p-2 text-gray-700 cursor-pointer ${
                        selectedSubmenuItem === item.key
                          ? 'text-black bg-gray-200'
                          : ''
                      } rounded-xl`}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}

              {/* Super Admin Menu Item */}
              {user?.role === 'superAdmin' && (
                <>
                  <li
                    onClick={() => handleMenuItemClick('SuperAdmin')}
                    className={`flex gap-2.5 items-center p-3 w-full cursor-pointer justify-between ${
                      selectedMenuItem === 'SuperAdmin'
                        ? 'text-white bg-purple-700'
                        : ''
                    } rounded-xl`}
                  >
                    <div className="flex gap-2.5 items-center">
                      <span className="object-contain w-6 h-6 mt-1">
                        <MdPeople />
                      </span>
                      {!isCollapsed && <span>Super Admin</span>}
                    </div>
                    {!isCollapsed && (
                      <MdKeyboardArrowRight
                        className={`shrink-0 w-6 h-6 ${
                          submenuState['SuperAdmin'] ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </li>

                  {/* Super Admin Submenu */}
                  {submenuState['SuperAdmin'] && !isCollapsed && (
                    <ul className="ml-8 mt-2 space-y-2">
                      {superAdminSubmenuItems.map(item => (
                        <li
                          key={item.key}
                          onClick={() => handleSubmenuClick(item.key)}
                          className={`p-2 text-gray-700 cursor-pointer ${
                            selectedSubmenuItem === item.key
                              ? 'text-black bg-gray-200'
                              : ''
                          } rounded-xl`}
                        >
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {/* Search Menu Item */}
              <li
                onClick={() => handleMenuItemClick('Search')}
                className={`flex gap-2.5 items-center p-3 w-full cursor-pointer justify-between ${
                  selectedMenuItem === 'Search'
                    ? 'text-white bg-purple-700'
                    : ''
                } rounded-xl`}
              >
                <div className="flex gap-2.5 items-center">
                  <span className="object-contain w-6 h-6 mt-1">
                    <MdSearch />
                  </span>
                  {!isCollapsed && <span>Search</span>}
                </div>
              </li>

              {/* Add Project Menu Item */}
              <li
                onClick={() => handleMenuItemClick('Add Project')}
                className={`flex gap-2.5 items-center p-3 w-full cursor-pointer justify-between ${
                  selectedMenuItem === 'Add Project'
                    ? 'text-white bg-purple-700'
                    : ''
                } rounded-xl`}
              >
                <div className="flex gap-2.5 items-center">
                  <span className="object-contain w-6 h-6 mt-1">
                    <FaPlus />
                  </span>
                  {!isCollapsed && <span>Add Project</span>}
                </div>
              </li>

              {/* Log Out Menu Item */}
              <li
                onClick={() => handleMenuItemClick('Log Out')}
                className={`flex gap-2.5 items-center p-3 w-full cursor-pointer justify-between ${
                  selectedMenuItem === 'Log Out'
                    ? 'text-white bg-purple-700'
                    : ''
                } rounded-xl`}
              >
                <div className="flex gap-2.5 items-center">
                  <span className="object-contain w-6 h-6 mt-1">
                    <MdLogout />
                  </span>
                  {!isCollapsed && <span>Log Out</span>}
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;