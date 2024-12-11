import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { toast } from "react-toastify";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  status: "unread" | "read";
}

const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchNotifications = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${backendUrl}/api/notices`, {
        withCredentials: true,
      });

      const fetchedNotifications: Notification[] = response.data.notices.map(
        (notice: any) => ({
          id: notice._id,
          title: notice.subject,
          message: notice.paragraph,
          timestamp: notice.date,
          status: notice.status.toLowerCase(),
        })
      );

      setNotifications(fetchedNotifications);

      const unread = fetchedNotifications.filter(
        (notice) => notice.status === "unread"
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to retrieve notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axiosInstance.patch(
        `${backendUrl}/api/notices/${notificationId}/status`,
        { status: "Read" },
        { withCredentials: true }
      );

      setNotifications((prevNotifications) =>
        prevNotifications.map((notice) =>
          notice.id === notificationId ? { ...notice, status: "read" } : notice
        )
      );

      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to update notification status");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch(
        `${backendUrl}/api/notices/mark-all-read`,
        {},
        { withCredentials: true }
      );

      setNotifications((prevNotifications) =>
        prevNotifications.map((notice) => ({
          ...notice,
          status: "read",
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to update notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};

export default useNotifications;
