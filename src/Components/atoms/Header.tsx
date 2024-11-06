// frontend/src/atoms/Header.tsx

import React, { useContext } from 'react';
import { IoCallSharp } from "react-icons/io5";
import { FaClock } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../organisms/AuthContext';
import { FaUserCircle } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

interface HeaderProps {
  logo: string;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ logo, title }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout', {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <header className="flex flex-col gap-2 py-2 px-2 w-full">
      {/* Top Bar: Logo, Dashboard Title and User Info */}
      <div className="flex flex-col md:flex-row justify-between py-4 px-6 items-center bg-blue-50 rounded-xl border border-solid border-slate-300">
        <div className="flex items-center gap-4">
          {/* {logo && (
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto"
            />
          )} */}
          <h1 className="text-xl font-medium text-zinc-800">{title || 'Dashboard'}</h1>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <span className="text-lg font-medium text-zinc-800">
            {user ? user.name : 'Loading...'}
          </span>
          <FaUserCircle className="w-7 h-7 md:w-8 md:h-8" />
          {/* Logout Button
          <button
            onClick={handleLogout}
            className="ml-4 text-black hover:text-black flex items-center"
          >
            <IoLogOut className="w-6 h-6 mr-1" />
            <span className="hidden md:inline">Logout</span>
          </button> */}
        </div>
      </div>

      {/* Bottom Bar: Contact and Availability Information */}
      <div className="flex flex-col md:flex-row justify-between items-start mt-5 space-y-4 md:space-y-0">
        {/* TOLL FREE Section */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 text-white rounded-full p-2">
            <IoCallSharp className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="text-lg md:text-xl">
            <div className="text-zinc-600">TOLL FREE</div>
            <div className="font-medium text-zinc-800">727-761-4082</div>
          </div>
        </div>

        {/* Divider: Visible on medium and larger screens */}
        <div className="hidden md:block border-l h-12 border-slate-300 mx-6"></div>

        {/* REQUEST A CALL Section */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 text-white rounded-full p-2">
            <IoCallSharp className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="text-lg md:text-xl">
            <div className="text-zinc-600">REQUEST A CALL</div>
          </div>
        </div>

        {/* Divider: Visible on medium and larger screens */}
        <div className="hidden md:block border-l h-12 border-slate-300 mx-6"></div>

        {/* AVAILABLE Section */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 text-white rounded-full p-2">
            <FaClock className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="text-lg md:text-xl">
            <div className="text-zinc-600">AVAILABLE</div>
            <div className="font-medium text-zinc-800">Mon-Fri (12:00AM–11:59PM EST)</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;