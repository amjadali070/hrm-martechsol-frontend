import React, { useState } from "react";
import {
  FaUserCheck,
  FaTicketAlt,
  FaBlog,
  FaChalkboardTeacher,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaClipboardList,
  FaCog,
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
  visibleTo?: string[];
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
    label: "Organization",
    path: "/organization",
    visibleTo: ["HR", "manager", "SuperAdmin", "test", "Finance"],
    subItems: [
      {
        label: "Attendance Data",
        path: "/organization/attendance-management",
        visibleTo: ["manager", "SuperAdmin", "HR"],
      },
      {
        label: "Employees",
        path: "/organization/employee-management",
        visibleTo: ["HR", "SuperAdmin"],
      },
      {
        label: "Payroll Management",
        path: "/organization/payroll-management",
        visibleTo: ["HR", "SuperAdmin"],
      },
      {
        label: "Payroll Finance",
        path: "/organization/payroll-finance",
        visibleTo: ["SuperAdmin", "Finance"],
      },
      {
        label: "Vehicle Finance",
        path: "/organization/vehicle-finance",
        visibleTo: ["SuperAdmin", "Finance"],
      },
      {
        label: "Leaves",
        path: "/organization/leave-management",
        visibleTo: ["HR", "manager", "SuperAdmin"],
      },
      {
        label: "Tickets",
        path: "/organization/ticket-management",
        visibleTo: ["HR", "manager", "SuperAdmin"],
      },
      {
        label: "Holidays",
        path: "/organization/holiday-management",
        visibleTo: ["HR", "SuperAdmin"],
      },
      {
        label: "Shifts",
        path: "/organization/user-shift-management",
        visibleTo: ["HR", "manager", "SuperAdmin"],
      },
      {
        label: "Teams",
        path: "/organization/team-management",
        visibleTo: ["HR", "manager", "SuperAdmin"],
      },
      {
        label: "Notices",
        path: "/organization/notice-management",
        visibleTo: ["HR", "SuperAdmin"],
      },
      {
        label: "Forms",
        path: "/organization/forms-management",
        visibleTo: ["SuperAdmin"],
      },
      {
        label: "Vehicles",
        path: "/organization/vehicle-management",
        visibleTo: ["HR", "SuperAdmin"],
      },
      {
        label: "Activity Logs",
        path: "/organization/activity-logs",
        visibleTo: ["HR", "SuperAdmin"],
      },
      {
        label: "Passwords",
        path: "/admin/password-manager",
        visibleTo: ["SuperAdmin"],
      },
      {
        label: "Attendance Manager",
        path: "/organization/attendance-manager",
        visibleTo: ["test"],
      },
    ],
  },
  {
    icon: FaClipboardList,
    label: "Requests",
    path: "/forms",
    subItems: [
      { label: "Feedback", path: "/forms/feedback" },
      { label: "Suggestion", path: "/forms/suggestion" },
      { label: "Leave Application", path: "/forms/leave-application" },
      { label: "Track Status", path: "/forms/track-application" },
    ],
  },
  {
    icon: FaUserCheck,
    label: "My Attendance",
    path: "/attendance",
    subItems: [
      { label: "View History", path: "/attendance/view" },
      {
        label: "Holidays",
        path: "/attendance/view-holidays",
      },
    ],
  },
  {
    icon: RiCashFill,
    label: "My Payroll",
    path: "/payroll",
    subItems: [
      { label: "Payslips", path: "/payroll/view" },
      { label: "Leave Balances", path: "/payroll/available-leaves" },
      { label: "Provident Fund", path: "/payroll/provident-fund" },
    ],
  },
  {
    icon: FaTicketAlt,
    label: "Support Tickets",
    path: "/tickets",
    subItems: [
      { label: "Attendance Support", path: "/tickets/attendance" },
      { label: "Network Support", path: "/tickets/network" },
      { label: "HR Support", path: "/tickets/hr" },
      { label: "Admin Support", path: "/tickets/admin" },
    ],
  },
  {
    icon: IoDocumentText,
    label: "Documents",
    path: "/letters",
    subItems: [
      { label: "Employment Letter", path: "/letters/employee-letter" },
      { label: "Experience Letter", path: "/letters/experience-letter" },
    ],
  },
  { icon: MdRuleFolder, label: "Policies", path: "/policies" },
  { icon: FaBlog, label: "Company Blog", path: "/blog" },
  { icon: FaChalkboardTeacher, label: "Training", path: "/training-room" },
  { icon: FaCog, label: "Settings", path: "/settings" },
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

  const filteredMenuItems =
    role === "Finance"
      ? menuItems.filter((item) => item.label === "Organization")
      : menuItems.filter(
          (item) => !item.visibleTo || item.visibleTo.includes(role),
        );

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 text-white bg-gunmetal-800 rounded-lg shadow-lg hover:bg-gunmetal-700 transition-colors"
      >
        <FaBars size={20} />
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-carbon-black-900/60 backdrop-blur-sm z-40 md:hidden"
        ></div>
      )}

      <aside
        className={`fixed z-50 inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:flex md:flex-col w-72 h-screen transition-transform duration-300 ease-in-out shadow-2xl bg-gunmetal-950 text-white border-r border-white/5`}
      >
        {/* Logo Area */}
        <div className="flex justify-between items-center px-6 py-8 border-b border-white/5">
          <div className="flex flex-col">
            <span className="text-2xl font-display font-bold tracking-tight text-white">
              NEXUS<span className="text-platinum-400">HRM</span>
            </span>
            <span className="text-[10px] text-slate-grey-400 uppercase tracking-[0.2em] mt-1">
              Enterprise Suite
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-grey-400 hover:text-white transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Scrollable Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent [scrollbar-width:none]">
          {filteredMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isMenuActive(item);

            return (
              <div key={index} className="mb-2">
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? "bg-carbon-black-800 text-white shadow-xl shadow-black/10 border border-white/5"
                          : "text-slate-grey-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={`${
                            isActive
                              ? "text-white"
                              : "text-slate-grey-500 group-hover:text-white"
                          } transition-colors`}
                        />
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                      </div>
                      <div
                        className={`text-slate-grey-500 transition-transform duration-200 ${
                          openMenus[item.label] ? "rotate-180" : ""
                        }`}
                      >
                        <FaChevronDown size={10} />
                      </div>
                    </button>

                    {/* Submenu */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openMenus[item.label]
                          ? "max-h-[600px] opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-4 space-y-1">
                        {item.subItems
                          .filter(
                            (subItem) =>
                              !subItem.visibleTo ||
                              subItem.visibleTo.includes(role),
                          )
                          .map((subItem, subIndex) => {
                            const isSubActive =
                              location.pathname === subItem.path;
                            return (
                              <Link
                                to={subItem.path}
                                key={subIndex}
                                className={`block px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                  isSubActive
                                    ? "bg-white/10 text-white"
                                    : "text-slate-grey-400 hover:text-white hover:bg-white/5"
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-carbon-black-800 text-white shadow-xl shadow-black/10 border border-white/5"
                        : "text-slate-grey-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={`${
                        isActive
                          ? "text-white"
                          : "text-slate-grey-500 group-hover:text-white"
                      } transition-colors`}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-gunmetal-700 to-black flex items-center justify-center text-xs font-bold text-white border border-white/10">
              NX
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Nexus Corp</span>
              <span className="text-[10px] text-slate-grey-500">
                v2.5.0 Enterprise
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
