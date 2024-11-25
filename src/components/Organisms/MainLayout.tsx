import React from "react";
import { Outlet } from "react-router";
import Sidebar from "../molecules/Sidebar";
import Header from "../atoms/Header";
import { useUser } from "./UserContext";

const MainLayout: React.FC = () => {
  const { userRole, loading } = useUser();

  const mainLayoutStyles: React.CSSProperties = {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "#efefef",
  };

  const mainContentStyles: React.CSSProperties = {
    flex: 1,
    marginLeft: 0,
    marginTop: "1rem",
    overflowY: "auto",
    padding: "0 1rem",
    scrollbarWidth: "thin",
    scrollbarColor: "#581c87 #f0f0f0",
  };

  const customScrollbar = `
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-track {
      background: #f0f0f0;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
      background: #007bff;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #0056b3;
    }
  `;

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
    <div style={mainLayoutStyles}>
      <style>{customScrollbar}</style>

      {userRole && <Sidebar role={userRole} />}

      <main style={mainContentStyles}>
        <Header />
        <div className="flex flex-col w-full p-2 pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;