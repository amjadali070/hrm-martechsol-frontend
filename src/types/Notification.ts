export interface Notification {
  id: number | string;
  title: string;
  message: string;
  timestamp: string;
  status: "unread" | "read";
}
