import React, { useState } from "react";
import MarTechLogo from "../../assets/LogoMartechSol.png";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdOutlineMoreTime, MdOutlineTimerOff } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosConfig";

const Header: React.FC = () => {
  const [isTimedIn, setIsTimedIn] = useState(false);
  const navigate = useNavigate();

  const handleTimeToggle = () => {
    setIsTimedIn((prevState) => !prevState);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center ml-2 sm:ml-2">
            <img
              src={MarTechLogo}
              alt="Company logo"
              className="h-6 w-auto sm:h-5 md:h-10"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-end items-center md:flex-nowrap md:space-x-4">
            <button
              className="p-2 rounded-full bg-purple-900 text-white hover:bg-purple-800 transition duration-300"
              aria-label="Notifications"
            >
              <IoNotificationsSharp size={20} />
            </button>

            <button
              onClick={handleTimeToggle}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-white uppercase font-medium text-xs sm:text-xs md:text-base ${
                isTimedIn
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isTimedIn ? (
                <MdOutlineTimerOff size={18} />
              ) : (
                <MdOutlineMoreTime size={18} />
              )}
              <span>{isTimedIn ? "Time Out" : "Time In"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-black text-white uppercase font-medium text-xs sm:text-xs md:text-base hover:bg-neutral-800 transition duration-300"
            >
              <RiLogoutCircleRLine size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;