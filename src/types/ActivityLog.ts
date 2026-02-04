// Activity Log Types
export interface ActivityLog {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    personalDetails?: {
      department?: string;
      jobTitle?: string;
    };
  };
  action: ActivityAction;
  module: ActivityModule;
  targetId?: string;
  targetModel?: string;
  description: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  status: "SUCCESS" | "FAILURE";
  createdAt: string;
  updatedAt: string;
}

export type ActivityAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "STATUS_CHANGE"
  | "PASSWORD_CHANGE"
  | "PAYROLL_GENERATE"
  | "PAYROLL_PROCESS"
  | "PAYROLL_UPDATE"
  | "ATTENDANCE_MARK"
  | "ATTENDANCE_UPDATE"
  | "ATTENDANCE_DELETE"
  | "LEAVE_APPLY"
  | "LEAVE_APPROVE"
  | "LEAVE_REJECT"
  | "TICKET_CREATE"
  | "TICKET_UPDATE"
  | "NOTICE_CREATE"
  | "NOTICE_UPDATE"
  | "NOTICE_DELETE"
  | "HOLIDAY_CREATE"
  | "HOLIDAY_UPDATE"
  | "HOLIDAY_DELETE"
  | "VEHICLE_CREATE"
  | "VEHICLE_UPDATE"
  | "BLOG_CREATE"
  | "BLOG_UPDATE"
  | "BLOG_DELETE"
  | "OTHER";

export type ActivityModule =
  | "USER"
  | "PAYROLL"
  | "ATTENDANCE"
  | "LEAVE"
  | "TICKET"
  | "NOTICE"
  | "HOLIDAY"
  | "VEHICLE"
  | "BLOG"
  | "AUTH"
  | "OTHER";

export interface ActivityLogFilters {
  action?: string;
  module?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ActivityLogResponse {
  logs: ActivityLog[];
  currentPage: number;
  totalPages: number;
  totalLogs: number;
  pageSize: number;
}

export interface ActivityStats {
  totalLogs: number;
  actionStats: Array<{ _id: string; count: number }>;
  moduleStats: Array<{ _id: string; count: number }>;
  topUsers: Array<{
    _id: string;
    count: number;
    userName: string;
    userEmail: string;
  }>;
}
