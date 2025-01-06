// Header.tsx

import React, { useState, useEffect, useRef } from "react";
import MarTechLogo from "../../assets/LogoMartechSol.png";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdOutlineMoreTime, MdOutlineTimerOff } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useUser from "../../hooks/useUser";
import useNotifications from "../../hooks/useNotifications";
import NotificationModal from "./NotificationModal";
import axiosInstance from "../../utils/axiosConfig";

const Header: React.FC = () => {
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timeStatusChecked, setTimeStatusChecked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const { notifications, unreadCount, markAsRead, fetchNotifications } =
    useNotifications(user?._id);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Formats seconds into HH:MM:SS format.
   * @param seconds Number of seconds.
   * @returns Formatted time string.
   */
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  /**
   * Starts the timer with an initial count.
   * @param initialSeconds Initial seconds to start the timer.
   */
  const startTimer = (initialSeconds = 0) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimer(initialSeconds);

    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  /**
   * Checks the current active attendance status of the user.
   */
  const checkActiveAttendance = async () => {
    if (!user?._id) return;

    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/attendance/user/${user._id}/active`,
        { withCredentials: true }
      );

      const activeLog = response.data;
      if (activeLog && activeLog.type !== "Absent") {
        // Additional check
        setIsTimedIn(true);
        const elapsedTime = activeLog.timeIn
          ? Math.floor(
              (new Date().getTime() - new Date(activeLog.timeIn).getTime()) /
                1000
            )
          : 0;
        startTimer(elapsedTime);
      } else {
        setIsTimedIn(false);
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error("Error fetching active attendance:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to retrieve active attendance status";
        toast.error(errorMessage);
      }
      setIsTimedIn(false);
    } finally {
      setTimeStatusChecked(true);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      checkActiveAttendance();
    } else if (!loading && !user) {
      // If user is not fetched (null) after loading,
      // mark time status as checked so we don't wait indefinitely.
      setTimeStatusChecked(true);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  /**
   * Handles toggling between Time In and Time Out.
   */
  const handleTimeToggle = async () => {
    if (!user?._id) {
      toast.error("User information not available");
      return;
    }

    try {
      if (isTimedIn) {
        const response = await axiosInstance.post(
          `${backendUrl}/api/attendance/time-out`,
          { userId: user._id },
          { withCredentials: true }
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
          `${backendUrl}/api/attendance/time-in`,
          { userId: user._id },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setIsTimedIn(true);
          startTimer();
          toast.success("Successfully Timed In.");
        }
      }
    } catch (error: any) {
      console.error("Error logging time:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while trying to clock in/out.";
      toast.error(errorMessage);
    }
  };

  /**
   * Handles logging out the user.
   */
  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        `${backendUrl}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/login");
      toast.success("Logged out successfully.");
    } catch (error: any) {
      console.error("Logout failed:", error);
      const errorMessage =
        error.response?.data?.message || "Logout failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  /**
   * Opens the notification modal.
   */
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  /**
   * Closes the notification modal and fetches updated notifications.
   */
  const handleCloseModal = async () => {
    await fetchNotifications();
    setIsModalOpen(false);
  };

  return (
    <header className="mt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Company Logo */}
          <div className="flex items-center ml-2 sm:ml-2">
            <img
              src={MarTechLogo}
              alt="Company logo"
              className="h-6 w-auto sm:h-5 md:h-10"
            />
          </div>

          <div className="flex flex-wrap gap-1 justify-end items-center md:flex-nowrap md:space-x-3">
            {/* Notification Button */}
            {!loading && user && (
              <>
                <button
                  onClick={handleOpenModal}
                  className="relative p-2 rounded-full bg-purple-900 text-white hover:bg-purple-800 transition duration-300"
                  aria-label="Notifications"
                >
                  <IoNotificationsSharp size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  notifications={notifications}
                  markAsRead={async (notificationId: string) => {
                    await markAsRead(notificationId);
                    await fetchNotifications();
                  }}
                />
              </>
            )}

            {/* Render timer and time buttons only after time status is checked */}
            {!loading && user && timeStatusChecked && (
              <>
                {/* Timer Display when Timed In */}
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

                {/* Time In/Out Button */}
                <button
                  onClick={handleTimeToggle}
                  className={`flex items-center w-25 gap-2 px-4 py-2 rounded-full text-white uppercase font-medium text-xs sm:text-xs md:text-base ${
                    isTimedIn
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isTimedIn ? (
                    <>
                      <MdOutlineTimerOff size={18} />
                      <span>Time Out</span>
                    </>
                  ) : (
                    <>
                      <MdOutlineMoreTime size={18} />
                      <span>Time In</span>
                    </>
                  )}
                </button>
              </>
            )}

            {/* Logout Button */}
            {!loading && user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white uppercase font-medium text-xs sm:text-xs md:text-base hover:bg-neutral-800 transition duration-300"
              >
                <RiLogoutCircleRLine size={18} />
                <span>Log Out</span>
              </button>
            )}

            {loading && <div className="text-gray-500"></div>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
