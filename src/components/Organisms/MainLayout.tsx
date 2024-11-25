import React from "react";
import { Outlet } from "react-router";
import Sidebar from "../molecules/Sidebar";
import Header from "../atoms/Header";
import { useUser } from "./UserContext";

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
    <div className="flex h-screen overflow-hidden bg-[#efefef]">
      {/* Sidebar */}
      {userRole && <Sidebar role={userRole} />}

      {/* Main Content */}
      <main className="flex flex-col flex-1 ml-0 md:ml-5 overflow-auto">
        <Header />
        <div className="flex flex-col mt-1 md:mt-4 w-full px-3 md:px-8 pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;