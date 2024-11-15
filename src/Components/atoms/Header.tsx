import React, { useState } from 'react';
import MarTechLogo from '../../assets/LogoMartechSol.png';
import { IoNotificationsSharp } from "react-icons/io5";
import { MdOutlineMoreTime, MdOutlineTimerOff } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

const Header: React.FC = () => {
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTimeToggle = () => {
    setIsTimedIn((prevState) => !prevState);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className=" text-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-5">
        <div className="flex justify-between h-18 items-center">
          <div className="flex-shrink-0">
            <img
              src={MarTechLogo}
              alt="Company logo"
              className="h-15 w-auto sm:h-12"
            />
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex-shrink-0 bg-purple-900 rounded-full p-3 hover:bg-purple-800 transition-colors duration-200">
              <IoNotificationsSharp size={24} />
            </div>

            <button
              onClick={handleTimeToggle}
              className={`flex items-center gap-2.5 px-4 p-3.5 rounded-full transition-colors duration-300 ${
                isTimedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
              aria-pressed={isTimedIn}
            >
              {isTimedIn ? (
                <MdOutlineTimerOff size={24} />
              ) : (
                <MdOutlineMoreTime size={24} />
              )}
              <span className="hidden sm:inline">{isTimedIn ? 'Time Out' : 'Time In'}</span>
            </button>

            <button className="flex items-center gap-2.5 px-4 p-3.5 bg-neutral-700 hover:bg-neutral-600 rounded-full transition-colors duration-200">
              <FaSignOutAlt size={24} />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-800 px-4 pb-4">
          <div className="flex flex-col space-y-3 mt-4">
            <div className="flex-shrink-0 bg-purple-900 rounded-full p-3 hover:bg-purple-800 transition-colors duration-200">
              <IoNotificationsSharp size={24} />
            </div>

            <button
              onClick={() => {
                handleTimeToggle();
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full transition-colors duration-300 ${
                isTimedIn ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
              aria-pressed={isTimedIn}
            >
              {isTimedIn ? (
                <MdOutlineTimerOff size={20} />
              ) : (
                <MdOutlineMoreTime size={20} />
              )}
              <span> {isTimedIn ? 'Time Out' : 'Time In'}</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-full transition-colors duration-200"
            >
              <FaSignOutAlt size={20} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;