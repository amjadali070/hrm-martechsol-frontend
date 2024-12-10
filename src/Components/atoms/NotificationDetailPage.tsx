import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Notification } from "../../hooks/useNotifications";

interface LocationState {
  notification: Notification;
}

const NotificationDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const notification = state?.notification;

  if (!notification) {
    navigate("/notifications");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:underline"
      >
        &larr; Back
      </button>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">{notification.title}</h1>
        <p className="text-gray-600 mb-4">
          {new Date(notification.timestamp).toLocaleString()}
        </p>
        <p className="text-gray-800">{notification.message}</p>
      </div>
    </div>
  );
};

export default NotificationDetail;
