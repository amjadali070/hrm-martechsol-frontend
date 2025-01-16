import React, { useState, useEffect } from "react";
import { FaSpinner, FaInbox } from "react-icons/fa";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosConfig";

interface TimeLog {
  _id: string;
  createdAt: string;
  timeIn: string;
  timeOut: string | null;
  duration: number;
  type:
    | "Present"
    | "Completed"
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
}

interface AttendanceOverviewProps {
  onViewAll: () => void;
}

// Updated status colors made consistent with your original ViewAttendance color scheme:
// Here we assume that "Completed" should show in the same green as originally used for "Present" ("bg-green-100 text-green-800")
// and that any record still marked as "Present" should use a neutral gray.
const statusColors: Record<string, string> = {
  Present: "bg-gray-100 text-gray-800",
  Completed: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
  "Late IN": "bg-yellow-100 text-yellow-800",
  "Half Day": "bg-orange-100 text-orange-800",
  "Early Out": "bg-pink-100 text-pink-800",
  "Late IN and Early Out": "bg-violet-100 text-violet-800",
  "Casual Leave": "bg-blue-100 text-blue-800",
  "Sick Leave": "bg-lime-100 text-lime-800",
  "Annual Leave": "bg-purple-100 text-purple-800",
  "Hajj Leave": "bg-cyan-100 text-cyan-800",
  "Maternity Leave": "bg-fuchsia-100 text-fuchsia-800",
  "Paternity Leave": "bg-teal-100 text-teal-800",
  "Bereavement Leave": "bg-slate-100 text-slate-800",
  "Unauthorized Leave": "bg-red-200 text-red-900",
  "Public Holiday": "bg-sky-100 text-sky-800",
};

const getDayOfWeek = (dateString: string) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user_Id) return;
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `${backendUrl}/api/attendance/user/${user._id}`,
          {
            withCredentials: true,
            params: {
              limit: 3,
            },
          }
        );
        // Take the first 3 attendance records
        setAttendanceRecords(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [user_Id, backendUrl, user]);

  return (
    <section className="flex flex-col w-full md:w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col p-6 mx-auto w-full bg-white rounded-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl sm:text-2xl font-bold text-black">
            Attendance Overview
          </h2>
          <button
            onClick={onViewAll}
            className="mt-4 sm:mt-0 px-6 py-2 text-sm sm:text-base text-center text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors duration-300"
          >
            View All
          </button>
        </div>
        {loading ? (
          <div
            className="flex justify-center items-center"
            style={{ height: "180px" }}
          >
            <FaSpinner className="text-blue-500 animate-spin" size={30} />
          </div>
        ) : attendanceRecords.length > 0 ? (
          <div className="overflow-x-auto" style={{ height: "180px" }}>
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-purple-900">
                <tr>
                  <th className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-l-md">
                    Date
                  </th>
                  <th className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Time In
                  </th>
                  <th className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Time Out
                  </th>
                  <th className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-r-md">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-100">
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                      {getDayOfWeek(record.createdAt)}
                    </td>
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                      {record.timeIn
                        ? new Date(record.timeIn).toLocaleTimeString()
                        : "N/A"}
                    </td>
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                      {record.timeOut
                        ? new Date(record.timeOut).toLocaleTimeString()
                        : "N/A"}
                    </td>
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[record.type] ||
                          "bg-gray-100 text-gray-800"
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
          <div
            className="flex flex-col items-center justify-center"
            style={{ height: "180px" }}
          >
            <FaInbox size={30} className="text-gray-400 mb-2" />
            <span className="text-md font-medium">
              No recent attendance records found.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default AttendanceOverview;
