// src/pages/FullNotificationsPage.tsx
import React, { useState, useEffect } from "react";
import {
  IoCheckmarkCircle,
  IoMailUnreadOutline,
  IoMailOpenOutline,
  IoFilterSharp,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useNotifications, { Notification } from "../../hooks/useNotifications";
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const FullNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const { notifications, isLoading, markAllAsRead, markAsRead } =
    useNotifications(user?._id);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (!userLoading) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, user]);

  const handleMarkAllAsReadClick = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error("Failed to mark all notifications as read.");
    }
  };

  const handleFilterChange = (newFilter: "all" | "read" | "unread") => {
    setFilter(newFilter);
    setExpanded(false);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    return notification.status === filter;
  });

  const visibleNotifications = expanded
    ? filteredNotifications
    : filteredNotifications.slice(0, 5);

  const canExpand = filteredNotifications.length > 5;
  const showMore = canExpand && !expanded;
  const showLess = canExpand && expanded;

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === "unread") {
      await markAsRead(notification.id);
    }
    navigate("/notification-detail", { state: { notification } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">All Notifications</h1>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`flex items-center px-3 py-1 rounded-md transition-colors duration-200 ${
                filter === "all"
                  ? "bg-purple-900 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-pressed={filter === "all"}
            >
              <IoFilterSharp className="h-5 w-5 mr-1" aria-hidden="true" />
              <span>All</span>
            </button>
            <button
              onClick={() => handleFilterChange("unread")}
              className={`flex items-center px-3 py-1 rounded-md transition-colors duration-200 ${
                filter === "unread"
                  ? "bg-purple-900 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-pressed={filter === "unread"}
            >
              <IoMailUnreadOutline
                className="h-5 w-5 mr-1"
                aria-hidden="true"
              />
              <span>Unread</span>
            </button>
            <button
              onClick={() => handleFilterChange("read")}
              className={`flex items-center px-3 py-1 rounded-md transition-colors duration-200 ${
                filter === "read"
                  ? "bg-purple-900 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-pressed={filter === "read"}
            >
              <IoMailOpenOutline className="h-5 w-5 mr-1" aria-hidden="true" />
              <span>Read</span>
            </button>
          </div>

          <button
            onClick={handleMarkAllAsReadClick}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
            aria-label="Mark all notifications as read"
          >
            <IoCheckmarkCircle className="h-5 w-5 mr-2" aria-hidden="true" />
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="flex justify-center items-center">
              <FaSpinner className="text-blue-500 animate-spin" size={30} />
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center text-gray-500">
            No notifications available.
          </div>
        ) : (
          <div className="space-y-4">
            {visibleNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-lg border flex transition-transform transform hover:scale-105 cursor-pointer ${
                  notification.status === "unread"
                    ? "bg-blue-200 border-blue-300"
                    : "bg-gray-200 border-gray-300"
                }`}
              >
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3
                      className={`font-semibold text-lg ${
                        notification.status === "unread"
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-start space-x-4">
        {canExpand && (
          <>
            {showMore && (
              <button
                onClick={() => setExpanded(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                aria-label="Show more notifications"
              >
                More
              </button>
            )}
            {showLess && (
              <button
                onClick={() => setExpanded(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                aria-label="Show fewer notifications"
              >
                Less
              </button>
            )}
          </>
        )}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center px-6 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-800 transition-colors duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FullNotificationsPage;
