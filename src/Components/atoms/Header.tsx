// src/components/Header.tsx

import React, { useState } from 'react';
import MarTechLogo from '../../assets/LogoMartechSol.png';
import { IoNotificationsSharp } from 'react-icons/io5';
import { MdOutlineMoreTime, MdOutlineTimerOff } from 'react-icons/md';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FiMenu, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';

const Header: React.FC = () => {
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleTimeToggle = () => {
    setIsTimedIn((prevState) => !prevState);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/users/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className=" text-gray-900">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          <div className="flex items-center">
            <img src={MarTechLogo} alt="Company logo" className="h-12 w-auto" />
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              className="bg-purple-900 p-3 rounded-full text-white hover:bg-purple-800 transition-colors duration-300"
              aria-label="Notifications"
            >
              <IoNotificationsSharp size={24} />
            </button>

            <button
              onClick={handleTimeToggle}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-white transition-colors duration-300 ${
                isTimedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
              aria-pressed={isTimedIn}
            >
              {isTimedIn ? (
                <MdOutlineTimerOff size={22} />
              ) : (
                <MdOutlineMoreTime size={22} />
              )}
              <span className='text-lg'>{isTimedIn ? 'Time Out' : 'Time In'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-6 py-3 bg-neutral-700 text-white rounded-full hover:bg-neutral-600 transition-colors duration-300"
            >
              <RiLogoutCircleRLine size={22} />
              <span className='text-lg'>Log Out</span>
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-900 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-800 text-white px-6 pb-4">
          <div className="flex flex-col space-y-4 mt-4">
            <button
              className="bg-purple-900 p-3 rounded-full hover:bg-purple-800 transition-colors duration-300"
              aria-label="Notifications"
            >
              <IoNotificationsSharp size={24} />
            </button>

            <button
              onClick={() => {
                handleTimeToggle();
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-full transition-colors duration-300 ${
                isTimedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
              aria-pressed={isTimedIn}
            >
              {isTimedIn ? (
                <MdOutlineTimerOff size={24} />
              ) : (
                <MdOutlineMoreTime size={24} />
              )}
              <span>{isTimedIn ? 'Time Out' : 'Time In'}</span>
            </button>

            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-full transition-colors duration-300"
            >
              <RiLogoutCircleRLine size={24} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;