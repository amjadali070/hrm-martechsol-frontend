import React, { useState } from "react";
import {
  FaUserCheck,
  FaTicketAlt,
  FaBlog,
  FaChalkboardTeacher,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
  FaClipboardList,
} from "react-icons/fa";
import { PiNetworkFill } from "react-icons/pi";
import { RiCashFill } from "react-icons/ri";
import { MdRuleFolder, MdSpaceDashboard } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { IconType } from "react-icons/lib";

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuItem {
  icon: IconType;
  label: string;
  path: string;
  subItems?: SubMenuItem[];
  visibleTo?: string[];
}

const menuItems: MenuItem[] = [
  { icon: MdSpaceDashboard, label: "Dashboard", path: "/dashboard" },
  {
    icon: PiNetworkFill,
    label: "Ecosystems",
    path: "/organization",
    visibleTo: ["HR", "SuperAdmin"],
    subItems: [
      {
        label: "Employee Management",
        path: "/organization/employee-management",
      },
      { label: "Payroll Management", path: "/organization/payroll-management" },
      { label: "Leave Management", path: "/organization/leave-management" },
      {
        label: "Attendance Management",
        path: "/organization/attendance-management",
      },
      { label: "Ticket Management", path: "/organization/ticket-management" },
      { label: "Holiday Management", path: "/organization/holiday-management" },
      {
        label: "User Shift Management",
        path: "/organization/user-shift-management",
      },
      {
        label: "Notice Management",
        path: "/organization/notice-management",
      },
      {
        label: "Forms Management",
        path: "/organization/forms-management",
      },
      {
        label: "Vehical Management",
        path: "/organization/vehical-management",
      },
    ],
  },
  {
    icon: FaClipboardList,
    label: "Forms",
    path: "/forms",
    subItems: [
      { label: "Feedback Form", path: "/forms/feedback" },
      { label: "Suggestion Form", path: "/forms/suggestion" },
      { label: "Leave Application", path: "/forms/leave-application" },
      { label: "Track Application", path: "/forms/track-application" },
    ],
  },
  {
    icon: FaUserCheck,
    label: "Attendance",
    path: "/attendance",
    subItems: [{ label: "View Attendance", path: "/attendance/view" }],
  },
  {
    icon: RiCashFill,
    label: "Payroll",
    path: "/payroll",
    subItems: [
      { label: "View Payroll", path: "/payroll/view" },
      { label: "Leaves Available", path: "/payroll/available-leaves" },
      { label: "Provident Fund", path: "/payroll/provident-fund" },
    ],
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
    ],
  },
  {
    icon: IoDocumentText,
    label: "Letters",
    path: "/letters",
    subItems: [
      { label: "Employee Letter", path: "/letters/employee-letter" },
      { label: "Experience Letter", path: "/letters/experience-letter" },
    ],
  },
  { icon: MdRuleFolder, label: "Policies", path: "/policies" },
  { icon: FaBlog, label: "Blog", path: "/blog" },
  { icon: FaChalkboardTeacher, label: "Training Room", path: "/training" },
];

interface SidebarProps {
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isMenuActive = (item: MenuItem): boolean => {
    if (item.subItems) {
      return item.subItems.some((sub) => sub.path === location.pathname);
    }
    return location.pathname === item.path;
  };

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-16 left-4 z-20 p-2 text-white bg-blue-600 rounded-lg shadow-lg"
      >
        <FaBars size={24} />
      </button>

      <div
        className={`fixed z-30 inset-y-0 left-0 transform bg-zinc-800 text-white rounded-none transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:flex md:flex-col w-64 h-screen p-3`}
      >
        <div className="flex justify-between items-center px-4 py-3 bg-purple-800 md:hidden">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="flex flex-col pt-2 pb-10 mx-auto w-full text-lg overflow-y-auto custom-scroll">
          {menuItems
            .filter((item) => !item.visibleTo || item.visibleTo.includes(role))
            .map((item, index) => {
              const Icon = item.icon;
              const isActive = isMenuActive(item);

              return (
                <div key={index}>
                  <div className="block">
                    {item.subItems ? (
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={`flex items-center justify-between w-full px-4 py-3 ${
                          isActive
                            ? "bg-sky-500"
                            : "border border-solid border-white border-opacity-10 mt-2 mb-2"
                        } rounded-md hover:bg-sky-600 transition-colors duration-200`}
                      >
                        <div className="flex items-center gap-6">
                          <Icon size={20} />
                          <span className="text-md">{item.label}</span>
                        </div>
                        <div>
                          {openMenus[item.label] ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </div>
                      </button>
                    ) : (
                      <Link to={item.path}>
                        <div
                          className={`flex items-center gap-6 px-4 py-3 mb-2 mt-2 ${
                            isActive
                              ? "bg-sky-500"
                              : "border border-solid border-white border-opacity-10"
                          } rounded-md hover:bg-sky-600 transition-colors duration-200`}
                        >
                          <Icon size={20} />
                          <span className="text-md">{item.label}</span>
                        </div>
                      </Link>
                    )}
                  </div>

                  {item.subItems && openMenus[item.label] && (
                    <div className="ml-12 mt-2 mb-2 flex flex-col space-y-2">
                      {item.subItems.map((subItem, subIndex) => {
                        const isSubActive = location.pathname === subItem.path;
                        return (
                          <Link to={subItem.path} key={subIndex}>
                            <div
                              className={`flex items-center gap-4 px-4 py-2 rounded-md ${
                                isSubActive ? "bg-sky-400" : "bg-transparent"
                              } hover:bg-sky-500 transition-colors duration-200`}
                            >
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
        </nav>
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
        ></div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 0px;
          background-color: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #6d6d6d;
          border-radius: 5px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
