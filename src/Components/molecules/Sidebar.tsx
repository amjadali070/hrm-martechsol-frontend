import React, { useState } from 'react';
import { 
  FaUserCheck, 
  FaTicketAlt, 
  FaBlog, 
  FaChalkboardTeacher,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { SiGoogleforms } from "react-icons/si";
import { RiCashFill } from "react-icons/ri";
import { MdSpaceDashboard } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom';
import { IconType } from 'react-icons/lib';

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuItem {
  icon: IconType;
  label: string;
  path: string;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { icon: MdSpaceDashboard, label: "Dashboard", path: "/dashboard" },
  { 
    icon: SiGoogleforms, 
    label: "Forms", 
    path: "/forms",
    subItems: [
      { label: "Feedback Form", path: "/forms/feedback" },
      { label: "Suggestion Form", path: "/forms/suggestion" },
      { label: "Leave Application", path: "/forms/leave-application" },
      { label: "Track Application", path: "/forms/track-application" },
      // { label: "Application's Record (Manager)", path: "/forms/applications-record" },
    ]
  },
  { 
    icon: FaUserCheck, 
    label: "Attendance", 
    path: "/attendance",
    subItems: [
      { label: "View Attendance", path: "/attendance/view" },
      // { label: "Attendance's Record (Manager)", path: "/attendance/records" },
      // { label: "Manage User's Shift", path: "/attendance/manage-shift" },
    ]
  },
  { 
    icon: RiCashFill, 
    label: "Payroll", 
    path: "/payroll",
    subItems: [
      { label: "View Payroll", path: "/payroll/view" },
      { label: "Leaves Available", path: "/payroll/available-leaves" },
      { label: "Provident Fund", path: "/payroll/provident-fund" },
    ]
  },
  { 
    icon: FaTicketAlt, 
    label: "Tickets", 
    path: "/tickets",
    subItems: [
      { label: "Attendance Ticket", path: "/tickets/attendance" },
      { label: "Network Ticket", path: "/tickets/network" },
      { label: "HR Ticket", path: "/tickets/hr" },
      { label: "Admin Ticket", path: "/tickets/admin" },
      // { label: "Ticket Status", path: "/tickets/status" },
    ]
  },
  { icon: IoDocumentText, label: "Policies", path: "/policies" },
  { icon: FaBlog, label: "Blog", path: "/blog" },
  { icon: FaChalkboardTeacher, label: "Training Room", path: "/training" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isMenuActive = (item: MenuItem): boolean => {
    if (item.subItems) {
      return item.subItems.some(sub => sub.path === location.pathname);
    }
    return location.pathname === item.path;
  };

  return (
    <nav className="flex flex-col w-64 bg-zinc-800 text-white min-h-screen">
      <div className="flex flex-col pt-8 pb-40 mx-auto w-full text-lg p-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = isMenuActive(item);

          return (
            <div key={index}>
              <div className="block">
                {item.subItems ? (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`flex items-center justify-between w-full px-4 py-3 ${
                      isActive ? 'bg-sky-500' : 'border border-solid border-white border-opacity-10 mt-2 mb-2'
                    } rounded-md hover:bg-sky-600 transition-colors duration-200 max-md:px-5`}
                  >
                    <div className="flex items-center gap-6">
                      <Icon size={20} />
                      <span className="text-md">{item.label}</span>
                    </div>
                    <div>
                      {openMenus[item.label] ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </button>
                ) : (
                  <Link to={item.path}>
                    <div
                      className={`flex items-center gap-6 px-4 py-3 mb-2 mt-2 ${
                        isActive ? 'bg-sky-500' : 'border border-solid border-white border-opacity-10'
                      } rounded-md hover:bg-sky-600 transition-colors duration-200 max-md:px-5`}
                    >
                      <Icon size={20} />
                      <span className="text-md">{item.label}</span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Submenu Items */}
              {item.subItems && openMenus[item.label] && (
                <div className="ml-12 mt-2 mb-2 flex flex-col space-y-2">
                  {item.subItems.map((subItem, subIndex) => {
                    const isSubActive = location.pathname === subItem.path;
                    return (
                      <Link to={subItem.path} key={subIndex}>
                        <div
                          className={`flex items-center gap-4 px-4 py-2 rounded-md ${
                            isSubActive ? 'bg-sky-400' : 'bg-transparent'
                          } hover:bg-sky-500 transition-colors duration-200`}
                        >
                          {/* Optionally, add an icon for submenus */}
                          {/* <FaChevronRight size={14} /> */}
                          <span className="text-sm">{subItem.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;