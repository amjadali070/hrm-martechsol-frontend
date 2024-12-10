import React, { useState, useEffect, useRef } from "react";
import MarTechLogo from "../../assets/LogoMartechSol.png";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdOutlineMoreTime, MdOutlineTimerOff } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import useUser from "../../hooks/useUser";
import RouteDisplay from "./RouteDisplay";

const Header: React.FC = () => {
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { user, loading } = useUser(); // Destructure loading state
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const startTimer = (initialSeconds = 0) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    setTimer(initialSeconds);
  };

  const checkTimeLogStatus = async () => {
    // Only proceed if user is loaded and has an ID
    if (!user?._id) return;

    try {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const response = await axiosInstance.get(
        `${backendUrl}/api/time-log/${user._id}`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        }
      );

      const todayLogs = response.data;
      const activeLog = todayLogs.find(
        (log: { timeOut: string | null }) => !log.timeOut
      );

      if (activeLog) {
        setIsTimedIn(true);
        const elapsedTime = activeLog.timeIn
          ? Math.floor(
              (new Date().getTime() - new Date(activeLog.timeIn).getTime()) /
                1000
            )
          : 0;
        startTimer(elapsedTime);
      }
    } catch (error) {
      console.error("Error checking time log status:", error);
      toast.error("Failed to retrieve time log status");
    }
  };

  useEffect(() => {
    // Only check time log status when user is loaded
    if (!loading) {
      checkTimeLogStatus();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [loading, user]); // Add dependencies to re-run when user or loading changes

  const handleTimeToggle = async () => {
    // Ensure user ID is available before making the request
    if (!user?._id) {
      toast.error("User information not available");
      return;
    }

    try {
      if (isTimedIn) {
        const response = await axiosInstance.post(
          `${backendUrl}/api/time-log/out`,
          { userId: user._id }
        );
        if (response.status === 200) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsTimedIn(false);
          toast.warning("Successfully Timed Out.");
        }
      } else {
        const response = await axiosInstance.post(
          `${backendUrl}/api/time-log/in`,
          { userId: user._id }
        );
        if (response.status === 201) {
          setIsTimedIn(true);
          startTimer();
          toast.success("Successfully Timed In.");
        }
      }
    } catch (error) {
      console.error("Error logging time:", error);
      toast.error("An error occurred while trying to clock in/out.");
    }
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
    <header className="mt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center ml-2 sm:ml-2">
            <img
              src={MarTechLogo}
              alt="Company logo"
              className="h-6 w-auto sm:h-5 md:h-10"
            />
          </div>
          <div className="flex flex-wrap gap-1 justify-end items-center md:flex-nowrap md:space-x-3">
            <button
              className="p-2 rounded-full bg-purple-900 text-white hover:bg-purple-800 transition duration-300"
              aria-label="Notifications"
            >
              <IoNotificationsSharp size={20} />
            </button>

            {isTimedIn && (
              <div className="flex items-center">
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "200px",
                    height: "7px",
                    backgroundColor: "#22C55E",
                    borderRadius: "9999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${((timer % 3600) / 3600) * 100}%`,
                      background: "#22C55E",
                      transition: "width 0.5s ease-in-out",
                    }}
                  ></div>
                </div>

                <div
                  style={{
                    background: "#22C55E",
                    color: "white",
                    borderRadius: "9999px",
                    padding: "5px 16px",
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "pulse 1.5s infinite",
                  }}
                >
                  {formatTime(timer)}
                </div>
              </div>
            )}

            <button
              onClick={handleTimeToggle}
              className={`flex items-center w-25 gap-2 px-4 py-2 rounded-full text-white uppercase font-medium text-xs sm:text-xs md:text-base ${
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
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white uppercase font-medium text-xs sm:text-xs md:text-base hover:bg-neutral-800 transition duration-300"
            >
              <RiLogoutCircleRLine size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
      {/* <RouteDisplay /> */}
    </header>
  );
};

export default Header;
