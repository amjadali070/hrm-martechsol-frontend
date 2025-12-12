import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../hooks/useNotifications";
import { FaTimes, FaCheckDouble, FaChevronRight, FaBell } from "react-icons/fa";

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
      // If the click is on the backdrop (which is this wrapper div when portal is used properly with structure below)
      // or if it's strictly outside the modalRef
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[99] bg-gunmetal-900/40 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
        onClick={onClose}
      ></div>

      <div
        className="fixed inset-y-0 right-0 z-[100] w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out border-l border-platinum-200 h-[100dvh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-modal-title"
      >
        <div ref={modalRef} className="flex flex-col h-full w-full">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-platinum-200 bg-white shrink-0">
            <h2 id="notification-modal-title" className="text-lg font-bold text-gunmetal-900 tracking-tight flex items-center gap-2">
              Notifications
              {notifications.filter(n => n.status === "unread").length > 0 && (
                <span className="text-xs bg-gunmetal-100 text-gunmetal-600 px-2.5 py-0.5 rounded-full font-bold">
                  {notifications.filter(n => n.status === "unread").length}
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-grey-400 hover:text-gunmetal-800 transition-colors focus:outline-none p-1 rounded-full hover:bg-platinum-100"
              aria-label="Close Notification Modal"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Filters & Actions */}
          <div className="flex justify-between items-center px-6 py-3 border-b border-platinum-100 bg-alabaster-grey-50 shrink-0">
            <div className="flex space-x-1 bg-white p-1 rounded-lg border border-platinum-200 shadow-sm">
              <button
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  filter === "all"
                    ? "bg-gunmetal-900 text-white shadow-sm"
                    : "text-slate-grey-500 hover:text-gunmetal-700 hover:bg-slate-50"
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  filter === "unread"
                    ? "bg-gunmetal-900 text-white shadow-sm"
                    : "text-slate-grey-500 hover:text-gunmetal-700 hover:bg-slate-50"
                }`}
                onClick={() => setFilter("unread")}
              >
                Unread
              </button>
            </div>
            
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center text-xs font-semibold text-slate-grey-500 hover:text-gunmetal-700 transition-colors gap-1.5 px-2 py-1 rounded hover:bg-platinum-100"
            >
              <FaCheckDouble size={10} />
              Mark all read
            </button>
          </div>

          {/* Content */}
          <div
            className="flex-1 px-4 py-4 overflow-y-auto custom-scroll bg-alabaster-grey-50/30 min-h-0"
            tabIndex={0}
          >
             {notifications.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-slate-grey-400">
                    <div className="w-16 h-16 rounded-full bg-platinum-50 border border-platinum-100 flex items-center justify-center mb-4">
                        <FaBell size={24} className="text-slate-grey-300" />
                    </div>
                    <p className="text-sm font-semibold text-slate-grey-600">No notifications</p>
                    <p className="text-xs text-slate-grey-400 mt-1">You're all caught up!</p>
                 </div>
             ) : filteredNotifications.length === 0 ?  (
                <div className="flex flex-col items-center justify-center h-full text-slate-grey-400">
                    <p className="text-sm font-medium">No unread notifications</p>
                 </div>
             ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                        <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`group relative p-4 rounded-xl transition-all duration-200 cursor-pointer border ${
                            notification.status === "unread"
                            ? "bg-white border-gunmetal-100 shadow-sm ring-1 ring-gunmetal-50"
                            : "bg-white/50 border-transparent hover:bg-white hover:border-platinum-200 hover:shadow-sm"
                        }`}
                        >
                            {notification.status === "unread" && (
                                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-rose-500 ring-4 ring-white shadow-sm"></div>
                            )}
                            
                            <div className="pr-4">
                                <h3
                                    className={`text-sm font-bold mb-1.5 ${
                                    notification.status === "unread"
                                        ? "text-gunmetal-900"
                                        : "text-slate-grey-600"
                                    }`}
                                >
                                    {notification.title}
                                </h3>
                                <p className="text-xs text-slate-grey-600 leading-relaxed mb-3 line-clamp-2">
                                     {notification.message}
                                </p>
                                <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-slate-grey-400 bg-platinum-50 px-1.5 py-0.5 rounded border border-platinum-100">
                                    {new Date(notification.timestamp).toLocaleString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-platinum-200 bg-white shrink-0">
            <button
              onClick={handleViewAllNotifications}
              className="w-full flex items-center justify-center gap-2 bg-gunmetal-900 hover:bg-gunmetal-800 text-white py-3 px-4 rounded-xl transition-all duration-200 text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md"
            >
              View Full History <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default NotificationModal;
