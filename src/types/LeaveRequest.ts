export interface LeaveRequest {
    _id: string; 
    user: { name: string; };
    leaveType: string;
    startDate: string;
    endDate: string;
    lastDayToWork: string;
    returnToWork: string;
    totalDays: number;
    handoverDocument?: string;
    reason: string;
    status: "Pending" | "Approved" | "Rejected";
    comments?: string;
  }