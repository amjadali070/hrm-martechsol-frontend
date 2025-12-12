import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import Sidebar from "../molecules/Sidebar";
import Header from "../atoms/Header";
import { FaSpinner } from "react-icons/fa";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const MainLayout: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await axios.get(`${backendUrl}/api/users/profile`, {
          withCredentials: true,
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setUser(null);
        setLoading(false);
        navigate("/signin");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface-50">
        <div className="flex flex-col items-center">
          <FaSpinner size={40} className="text-brand-600 mb-4 animate-spin" />
          <p className="text-surface-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface-50 text-surface-900 font-sans overflow-hidden">
      {user && <Sidebar role={user.role} />}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header />
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-auto mx-auto w-full animate-fadeIn">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
