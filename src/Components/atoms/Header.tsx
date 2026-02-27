import React, { useState, useEffect, useRef } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineMoreTime, MdOutlineTimerOff } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useUser from "../../hooks/useUser";
import useNotifications from "../../hooks/useNotifications";
import NotificationModal from "./NotificationModal";
import axiosInstance from "../../utils/axiosConfig";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface-900/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full transform transition-all scale-100">
        <h3 className="text-lg font-bold text-surface-900 mb-2">
          Confirmation
        </h3>
        <p className="text-surface-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-surface-600 bg-surface-100 rounded-lg hover:bg-surface-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timeStatusChecked, setTimeStatusChecked] = useState(false);
  const [isTimeToggleLoading, setIsTimeToggleLoading] = useState(false);
  const [showTimeoutConfirm, setShowTimeoutConfirm] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const { notifications, unreadCount, markAsRead, fetchNotifications } =
    useNotifications(user?._id);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setTimer(initialSeconds);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  const checkActiveAttendance = async () => {
    if (!user?._id) return;
    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/attendance/user/${user._id}/active`,
        { withCredentials: true }
      );
      const activeLog = response.data;
      if (activeLog && activeLog.type !== "Absent") {
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
      setTimeStatusChecked(true);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const handleTimeToggle = async () => {
    if (isTimeToggleLoading) return;

    if (isTimedIn) {
      setShowTimeoutConfirm(true);
      return;
    }

    setIsTimeToggleLoading(true);
    if (!user?._id) return;

    try {
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
    } catch (error: any) {
      console.error("Error logging time:", error);
      toast.error(error.response?.data?.message || "Error logging time");
    } finally {
      setIsTimeToggleLoading(false);
    }
  };

  const handleConfirmTimeout = async () => {
    setIsTimeToggleLoading(true);
    setShowTimeoutConfirm(false);
    try {
      const response = await axiosInstance.post(
        `${backendUrl}/api/attendance/time-out`,
        { userId: user?._id },
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
    } catch (error: any) {
      console.error("Error logging time:", error);
      toast.error("Error logging time");
    } finally {
      setIsTimeToggleLoading(false);
    }
  };

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
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = async () => {
    await fetchNotifications();
    setIsModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-surface-200 shadow-sm">
      <div className="max-w-auto mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Welcome Message (Replaces Logo) */}
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-bold text-surface-900 hidden md:block">
              Welcome back,{" "}
              <span className="text-brand-600">
                {user?.name?.split(" ")[0]}
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-3 justify-end items-center">
            {/* Notification Button */}
            {!loading && user && (
              <>
                <button
                  onClick={handleOpenModal}
                  className="relative p-2.5 rounded-full text-surface-500 hover:bg-surface-100 hover:text-brand-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  aria-label="Notifications"
                >
                  <IoNotificationsOutline size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full"></span>
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

            {/* Timer and Time Actions */}
            {!loading && user && timeStatusChecked && (
              <div className="flex items-center gap-3 pl-3 border-l border-surface-200">
                {isTimedIn && (
                  <div className="hidden md:flex items-center bg-accent-500/10 px-3 py-1.5 rounded-lg border border-accent-500/20">
                    <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse mr-2"></div>
                    <span className="font-mono text-lg font-bold text-accent-600 tracking-wider">
                      {formatTime(timer)}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleTimeToggle}
                  disabled={isTimeToggleLoading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-brand-500/10 transition-all duration-300 transform active:scale-95 ${
                    isTimedIn
                      ? "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                      : "bg-brand-600 text-surface-900 hover:bg-brand-700 hover:shadow-brand-600/20"
                  }`}
                >
                  {isTimedIn ? (
                    <>
                      <MdOutlineTimerOff size={18} />
                      <span className="hidden sm:inline">Clock Out</span>
                    </>
                  ) : (
                    <>
                      <MdOutlineMoreTime size={18} />
                      <span className="hidden sm:inline">Clock In</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Logout Button */}
            {!loading && user && (
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-3 py-2 rounded-lg text-surface-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ml-1"
                title="Sign Out"
              >
                <RiLogoutCircleRLine
                  size={20}
                  className="group-hover:rotate-180 transition-transform duration-300"
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {showTimeoutConfirm && (
        <ConfirmModal
          message="Are you sure you want to clock out for the day?"
          onConfirm={handleConfirmTimeout}
          onCancel={() => setShowTimeoutConfirm(false)}
        />
      )}
    </header>
  );
};

export default Header;
