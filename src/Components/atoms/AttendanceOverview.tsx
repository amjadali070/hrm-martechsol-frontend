import React, { useState, useEffect } from "react";
import { FaSpinner, FaInbox, FaCalendarAlt, FaFilter } from "react-icons/fa";
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

// Updated status colors:
// - "Present" now uses a gray palette.
// - "Completed" uses a green palette.
const statusColors: Record<string, string> = {
  Present: "bg-gray-400 text-white", // changed from bg-green-500 to bg-gray-400
  Completed: "bg-green-500 text-white", // new type: Completed uses former present color
  Absent: "bg-red-600 text-white",
  "Late IN": "bg-yellow-500 text-white",
  "Half Day": "bg-orange-600 text-white",
  "Early Out": "bg-pink-500 text-white",
  "Late IN and Early Out": "bg-violet-700 text-white",
  "Casual Leave": "bg-blue-600 text-white",
  "Sick Leave": "bg-lime-600 text-white",
  "Annual Leave": "bg-purple-400 text-white",
  "Hajj Leave": "bg-cyan-500 text-white",
  "Maternity Leave": "bg-fuchsia-800 text-white",
  "Paternity Leave": "bg-teal-600 text-white",
  "Bereavement Leave": "bg-slate-700 text-white",
  "Unauthorized Leave": "bg-red-900 text-white",
  "Public Holiday": "bg-sky-700 text-white",
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
        // Ensure that we only take the first 3 records
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
