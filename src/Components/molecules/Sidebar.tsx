// src/components/Sidebar.tsx

import React from 'react';
import { IconType } from 'react-icons';
import { 
  FaWpforms, 
  FaUserCheck, 
  FaMoneyCheckAlt, 
  FaTicketAlt, 
  FaFileContract, 
  FaBlog, 
  FaChalkboardTeacher 
} from 'react-icons/fa';
import { MdSpaceDashboard } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  icon: IconType;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { icon: MdSpaceDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FaWpforms, label: "Forms", path: "/forms" },
  { icon: FaUserCheck, label: "Attendance", path: "/attendance" },
  { icon: FaMoneyCheckAlt, label: "Payroll", path: "/payroll" },
  { icon: FaTicketAlt, label: "Tickets", path: "/tickets" },
  { icon: FaFileContract, label: "Policies", path: "/policies" },
  { icon: FaBlog, label: "Blog", path: "/blog" },
  { icon: FaChalkboardTeacher, label: "Training Room", path: "/training" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="flex flex-col w-[16%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col pt-14 pb-40 mx-auto w-full text-lg text-white bg-zinc-800 shadow-[11px_4px_14px_rgba(0,0,0,0.12)] max-md:pb-24 max-md:mt-10">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link to={item.path} key={index} className="block">
              <div
                className={`flex gap-6 px-7 py-5 ${
                  isActive
                    ? 'bg-sky-500'
                    : 'border border-solid border-white border-opacity-10'
                } shadow-[11px_4px_14px_rgba(0,0,0,0.12)] max-md:px-5`}
              >
                <Icon size={25} className='mt-0.3' />
                <div className="grow shrink my-auto">{item.label}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;