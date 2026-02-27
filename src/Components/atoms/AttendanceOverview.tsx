import React, { useState, useEffect } from "react";
import { FaInbox, FaChevronRight } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosConfig";

interface TimeLog {
  _id: string;
  createdAt: string;
  timeIn: string;
  timeOut: string | null;
  duration: number;
  type: string;
}

interface AttendanceOverviewProps {
  onViewAll: () => void;
}

const statusColors: Record<string, string> = {
  Present: "bg-green-50 text-green-700 border border-green-200",
  Completed: "bg-green-50 text-green-700 border border-green-200",
  Absent: "bg-red-50 text-red-700 border border-red-200",
  "Late IN": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "Half Day": "bg-orange-50 text-orange-700 border border-orange-200",
  default: "bg-surface-50 text-surface-700 border border-surface-200",
};

const getDayOfWeek = (dateString: string) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(dateString);
  return days[date.getDay()];
};

const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({
  onViewAll,
}) => {
  const [attendanceRecords, setAttendanceRecords] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const user_Id = user?._id;

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user_Id) return;
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `/api/attendance/user/${user._id}`,
          {
            params: { limit: 5 },
          }
        );
        setAttendanceRecords(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [user_Id, user]);

  return (
    <section className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gunmetal-900 tracking-tight">
          Attendance Overview
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-gunmetal-600 hover:text-gunmetal-800 flex items-center gap-1 uppercase tracking-wider transition-colors"
        >
          View All <FaChevronRight size={8} />
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scroll">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <LoadingSpinner size="md" />
          </div>
        ) : attendanceRecords.length > 0 ? (
          <div className="w-full">
            <table className="w-full text-left text-sm">
              <thead className="bg-alabaster-grey-50 text-slate-grey-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-md font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">In</th>
                  <th className="px-4 py-3 font-medium">Out</th>
                  <th className="px-4 py-3 rounded-r-md text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-platinum-100">
                {attendanceRecords.map((record) => (
                  <tr
                    key={record._id}
                    className="hover:bg-alabaster-grey-50/50 transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                       <div className="flex flex-col">
                          <span className="font-semibold text-gunmetal-800 text-sm">
                            {new Date(record.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-slate-grey-400 text-xs font-medium">
                            {getDayOfWeek(record.createdAt)}
                          </span>
                       </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-gunmetal-600 text-xs font-medium">
                      {record.timeIn
                        ? new Date(record.timeIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : <span className="text-slate-grey-300">-</span>}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-gunmetal-600 text-xs font-medium">
                      {record.timeOut
                        ? new Date(record.timeOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : <span className="text-slate-grey-300">-</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`px-2.5 py-1 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                          statusColors[record.type] || statusColors["default"]
                        }`}
                      >
                        {record.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-grey-400">
            <FaInbox size={32} className="mb-3 opacity-30 text-gunmetal-300" />
            <p className="text-sm font-medium">No recent records found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AttendanceOverview;
