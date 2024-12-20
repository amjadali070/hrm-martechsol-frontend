// src/types/attendance.ts

export type AttendanceType =
  | "Present"
  | "Absent"
  | "Late IN"
  | "Half Day"
  | "Early Out"
  | "Late IN and Early Out"
  | "Casual Leave"
  | "Sick Leave"
  | "Annual Leave"
  | "Hajj Leave"
  | "Maternity Leave"
  | "Paternity Leave"
  | "Bereavement Leave"
  | "Unauthorized Leave"
  | "Public Holiday";

export interface TimeLog {
  _id: string;
  createdAt: string;
  timeIn: string | null;
  timeOut: string | null;
  duration: number;
  type: AttendanceType;
  remarks?: string; // Added remarks field
}
