import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../molecules/Sidebar';
import Header from '../atoms/Header';
import { useUser } from './UserContext';

const MainLayout: React.FC = () => {
  const { userRole, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#efefef]">
        <svg
          className="animate-spin h-12 w-12 text-purple-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-3 text-purple-600 font-semibold text-lg">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#efefef] max-md:flex-col">
      {userRole && <Sidebar role={userRole} />}
      <main className="flex flex-col flex-1 ml-5 overflow-auto max-md:ml-0 mt-3">
        <Header />
        <div className="flex flex-col mt-8 w-full max-md:mt-10 max-md:max-w-full pl-3 pr-8 pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;