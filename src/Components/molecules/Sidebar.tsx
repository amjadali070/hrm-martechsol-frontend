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
import { AuthContext } from '../organisms/AuthContext';

interface SidebarProps {
  onSubmenuClick: (submenuKey: string) => void;
  logo: string;
}

interface SubmenuItem {
  label: string;
  key: string;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  key: string;
  submenu?: SubmenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ onSubmenuClick, logo }) => {
  const { user } = useContext(AuthContext); // Get user from context
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('');
  const [selectedSubmenuItem, setSelectedSubmenuItem] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeSubmenus, setActiveSubmenus] = useState<{ [key: string]: boolean }>({});
  
  const navigate = useNavigate();

  const superAdminMenu: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: <MdDashboard />,
      key: 'superadmin-dashboard',
    },
    {
      label: 'All Users',
      icon: <MdPeople />,
      key: 'all-users',
    },
    {
      label: 'All Projects',
      icon: <GoProjectSymlink />,
      key: 'superadmin-all-projects',
    },
    {
      label: 'Messages',
      icon: <TiMessages />,
      key: 'superadmin-all-messages',
    },
    {
      label: 'Dashboard Settings',
      icon: <MdSettings />,
      key: 'dashboard-settings',
    },
    {
      label: 'Log Out',
      icon: <MdLogout />,
      key: 'Log Out',
    },
  ];

  const userMenu: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: <MdDashboard />,
      key: 'Dashboard',
    },
    {
      label: 'Projects',
      icon: <GoProjectSymlink />,
      key: 'Projects',
      submenu: [
        { label: 'All Projects', key: 'all-projects' },
        { label: 'Open Projects', key: 'open-projects' },
        { label: 'Closed Projects', key: 'closed-projects' },
        { label: 'Subscription Management', key: 'subscription-management' },
      ],
    },
    {
      label: 'Messages',
      icon: <TiMessages />,
      key: 'Messages',
      submenu: [
        { label: 'View All Messages', key: 'all-messages' },
        { label: 'Write Message', key: 'write-message' },
      ],
    },
    {
      label: 'New Order',
      icon: <FaCartPlus />,
      key: 'New Order',
      submenu: [
        { label: 'All Services', key: 'all-services' },
        { label: 'Request a Proposal', key: 'request-proposal' },
      ],
    },
    {
      label: 'Settings',
      icon: <MdSettings />,
      key: 'Settings',
      submenu: [
        { label: 'Preferences', key: 'preferences' },
        { label: 'Change Password', key: 'change-password' },
        { label: 'Manage Users', key: 'addedit-users' },
      ],
    },
    {
      label: 'Search',
      icon: <MdSearch />,
      key: 'Search',
    },
    {
      label: 'Add Project',
      icon: <FaPlus />,
      key: 'Add Project',
    },
    {
      label: 'Log Out',
      icon: <MdLogout />,
      key: 'Log Out',
    },
  ];

  const menuItems: MenuItem[] = user?.role === 'superAdmin' ? superAdminMenu : userMenu;

  const handleMenuItemClick = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem.key);
    setSelectedSubmenuItem('');

    if (menuItem.submenu) {
      setActiveSubmenus(prevState => ({
        ...prevState,
        [menuItem.key]: !prevState[menuItem.key],
        ...Object.keys(prevState).reduce((acc, key) => {
          if (key !== menuItem.key) acc[key] = false;
          return acc;
        }, {} as { [key: string]: boolean }),
      }));
    } else {
      switch (menuItem.key) {
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
          handleLogout();
          break;
        default:
          onSubmenuClick(menuItem.key);
          navigate(`/dashboard`);
          break;
      }
    }
  };


  const handleSubmenuClick = (submenuKey: string) => {
    setSelectedSubmenuItem(submenuKey);
    onSubmenuClick(submenuKey);
    navigate('/dashboard');
  };


  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      <div className="lg:hidden flex justify-between items-center p-4 bg-blue-50">
        <HiMenuAlt3
          className="text-3xl cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <h1 className="text-xl font-medium">Dashboard</h1>
      </div>

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
              <img src={logo} alt="Logo" className="mt-1 mr-1 h-7 w-auto" />
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
              {menuItems.map(menuItem => (
                <React.Fragment key={menuItem.key}>
                  <li
                    onClick={() => handleMenuItemClick(menuItem)}
                    className={`flex gap-2.5 items-center p-3 w-full cursor-pointer justify-between ${
                      selectedMenuItem === menuItem.key
                        ? 'text-white bg-[#ff6600]'
                        : ''
                    } rounded-xl`}
                  >
                    <div className="flex gap-2.5 items-center">
                      <span className="object-contain w-6 h-6 mt-1">
                        {menuItem.icon}
                      </span>
                      {!isCollapsed && <span>{menuItem.label}</span>}
                    </div>
                    {!isCollapsed && menuItem.submenu && (
                      <MdKeyboardArrowRight
                        className={`shrink-0 w-6 h-6 ${
                          activeSubmenus[menuItem.key] ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </li>

                  {menuItem.submenu && activeSubmenus[menuItem.key] && !isCollapsed && user?.role !== 'superAdmin' && (
                    <ul className="ml-8 mt-2 space-y-2">
                      {menuItem.submenu.map(submenuItem => (
                        <li
                          key={submenuItem.key}
                          onClick={() => handleSubmenuClick(submenuItem.key)}
                          className={`p-2 text-gray-700 cursor-pointer ${
                            selectedSubmenuItem === submenuItem.key
                              ? 'text-black bg-[#ff6600] bg-opacity-10'
                              : ''
                          } rounded-xl`}
                        >
                          {submenuItem.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
