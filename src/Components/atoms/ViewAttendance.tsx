import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaInbox, FaSpinner } from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig"; // Centralized Axios instance
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify"; // For user-friendly notifications
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const statusColors: Record<string, string> = {
  // Present: "bg-gray-400", // changed from bg-green-500 to bg-gray-400
  Completed: "bg-green-500", // new type: Completed uses former present color
  Absent: "bg-red-600",
  "Late IN": "bg-yellow-500",
  "Half Day": "bg-orange-600",
  "Early Out": "bg-pink-500",
  "Late IN and Early Out": "bg-violet-700",
  "Casual Leave": "bg-blue-600",
  "Sick Leave": "bg-lime-600",
  "Annual Leave": "bg-purple-400",
  "Hajj Leave": "bg-cyan-500",
  "Maternity Leave": "bg-fuchsia-800",
  "Paternity Leave": "bg-teal-600",
  "Bereavement Leave": "bg-slate-700",
  "Unauthorized Leave": "bg-red-900",
  "Public Holiday": "bg-sky-700",
};

interface TimeLog {
  _id: string;
  user: string;
  timeIn: string | null;
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
  createdAt: string;
  leaveApplication?: string | null;
}

const ViewAttendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<TimeLog[]>([]);
  const [filteredData, setFilteredData] = useState<TimeLog[]>([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: userLoading } = useUser();
  const user_Id = user?._id;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        if (!user_Id) {
          throw new Error("User not found");
        }

        const { data } = await axiosInstance.get(
          `${backendUrl}/api/attendance/user/${user._id}`,
          {
            params: {
              startDate: fromDate || undefined,
              endDate: toDate || undefined,
            },
          }
        );

        setAttendanceData(data);
        setFilteredData(data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch attendance.";
        toast.error(errorMessage);
        console.error("Error fetching attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch attendance only when user is loaded and user_Id is available
    if (!userLoading && user_Id) {
      fetchAttendance();
    }
  }, [fromDate, toDate, user_Id, userLoading, backendUrl]);

  // Apply filters whenever attendanceData or filters change
  useEffect(() => {
    let data = [...attendanceData];

    // Filter by date range if both dates are selected
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      data = data.filter(
        (record) =>
          new Date(record.createdAt) >= start &&
          new Date(record.createdAt) <= end
      );
    }

    // Filter by attendance type
    if (typeFilter !== "All") {
      data = data.filter((record) => record.type === typeFilter);
    }

    setFilteredData(data);
    setCurrentPage(1); // Reset to first page when filters change
  }, [fromDate, toDate, typeFilter, attendanceData]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Format duration from seconds to "Xh Ym"
  const formatDuration = (seconds: number) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Get day of the week from date string
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

  return (
    <div className="w-full p-6 sm:p-8 bg-gradient-to-r from-gray-100 to-white rounded-lg mb-8">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FaSpinner className="text-indigo-500 mb-4 animate-spin" size={40} />
        </div>
      ) : (
        <>
          <div className="mt-2 flex justify-center mb-8">
            <div className="w-full">
              <div className="grid grid-cols-5 sm:grid-cols-5 gap-3">
                {Object.entries(statusColors).map(([type, color]) => (
                  <div
                    key={type}
                    className="flex items-center space-x-2 bg-gray-100 p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <span
                      className={`w-4 h-4 inline-block rounded-full ${color}`}
                    ></span>
                    <span className="text-gray-700 text-sm font-medium">
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-gray-800">
            View Attendance
          </h2>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8 items-start sm:items-center">
            {/* Date Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* From Date Filter */}
              <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
                <FaCalendarAlt className="text-black mr-3" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border-none focus:ring-0 text-sm text-gray-700"
                  placeholder="FROM"
                  aria-label="Filter from date"
                />
              </div>

              {/* To Date Filter */}
              <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
                <FaCalendarAlt className="text-black mr-3" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border-none focus:ring-0 text-sm text-gray-700"
                  placeholder="TO"
                  aria-label="Filter to date"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-200 w-full sm:w-auto">
              <FaFilter className="text-black mr-3" />
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border-none focus:ring-0 text-sm text-gray-700"
                aria-label="Filter by attendance type"
              >
                <option value="All">All Types</option>
                {Object.keys(statusColors).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-purple-900 text-white text-center">
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                    Day
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                    Time In
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                    Time Out
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                    Total Time
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((record, index) => (
                    <tr
                      key={record._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition-colors`}
                    >
                      {/* Serial Number */}
                      <td className="py-4 px-4 text-sm text-gray-700 text-center">
                        {indexOfFirstItem + index + 1}
                      </td>

                      <td className="py-4 px-4 text-sm text-gray-700 text-center">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4 text-sm text-gray-700 text-center">
                        {getDayOfWeek(record.createdAt)}
                      </td>

                      <td className="py-4 px-4 text-sm text-gray-700 text-center">
                        {record.timeIn
                          ? new Date(record.timeIn).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>

                      <td className="py-4 px-4 text-sm text-gray-700 text-center">
                        {record.timeOut
                          ? new Date(record.timeOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>

                      {/* Total Time */}
                      <td className="py-4 px-4 text-sm text-gray-700 text-center">
                        {record.duration
                          ? formatDuration(record.duration)
                          : "N/A"}
                      </td>

                      {/* Type */}
                      <td className="py-4 px-4 text-sm text-center">
                        <span
                          className={`inline-block px-3 py-1 text-sm font-medium rounded-full text-white ${
                            statusColors[record.type] || "bg-gray-400"
                          }`}
                        >
                          {record.type}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 px-4 text-sm text-gray-500 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <FaInbox size={40} className="text-gray-400 mb-4" />
                        <span className="text-lg font-medium">
                          No records found.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination and Items Per Page */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-3">Show:</span>
              <select
                className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 20].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className={`flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={currentPage === 1}
                onClick={handlePrevious}
              >
                <FiChevronLeft className="mr-2" />
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={`flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
                  currentPage === totalPages || totalPages === 0
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={handleNext}
              >
                Next
                <FiChevronRight className="ml-2" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewAttendance;
