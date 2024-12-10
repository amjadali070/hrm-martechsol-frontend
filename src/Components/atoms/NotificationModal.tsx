import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../hooks/useNotifications";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  markAsRead: (notificationId: string) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  markAsRead,
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const modalRef = useRef<HTMLDivElement>(null);

  const handleViewAllNotifications = () => {
    onClose();
    navigate("/notifications");
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === "unread") {
      markAsRead(notification.id);
    }

    navigate("/notification-detail", {
      state: {
        notification: {
          ...notification,
          timestamp: new Date(notification.timestamp).toLocaleString(),
        },
      },
    });

    onClose();
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach((notification) => {
      if (notification.status === "unread") {
        markAsRead(notification.id);
      }
    });
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notification) => notification.status === "unread")
      : notifications;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Debugging: Log notifications to verify they are received correctly
  useEffect(() => {
    if (isOpen) {
      console.log("Notifications received in modal:", notifications);
    }
  }, [isOpen, notifications]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-300"
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-modal-title"
      >
        <div ref={modalRef} className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 id="notification-modal-title" className="text-xl font-semibold">
              Notifications
            </h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Close Notification Modal"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${
                  filter === "all"
                    ? "bg-white text-black"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } transition-colors duration-200`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  filter === "unread"
                    ? "bg-white text-black"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } transition-colors duration-200`}
                onClick={() => setFilter("unread")}
              >
                Unread
              </button>
            </div>
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center text-sm text-gray-300 hover:text-white focus:outline-none transition-colors duration-200"
            >
              <svg
                className="h-5 w-5 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Mark All as Read
            </button>
          </div>

          <div
            className="flex-1 p-4 overflow-y-auto scrollbar-hide"
            tabIndex={0}
          >
            {filteredNotifications.length === 0 ? (
              <p className="text-center text-gray-400">No notifications.</p>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start p-3 mb-3 rounded-lg transition duration-200 cursor-pointer hover:opacity-90 ${
                    notification.status === "unread"
                      ? "bg-blue-600 border border-blue-600"
                      : "bg-gray-700 border border-gray-600"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3
                        className={`text-sm font-medium ${
                          notification.status === "unread"
                            ? "text-white"
                            : "text-gray-300"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleViewAllNotifications}
              className="w-full flex items-center justify-center bg-gray-300 text-black py-2 px-4 rounded-lg transition-colors duration-300 focus:outline-none"
            >
              View All Notifications
            </button>
          </div>
        </div>
      </div>

      <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
    </>
  );
};

export default NotificationModal;
