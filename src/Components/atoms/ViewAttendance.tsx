// src/components/ViewAttendance.tsx

import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaInbox, FaSpinner } from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig"; // Use the centralized axios instance
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify"; // For user-friendly notifications

const statusColors: Record<string, string> = {
  Present: "bg-green-500",
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
  "Absence Without Pay": "bg-red-900",
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
    | "Absence Without Pay"
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
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: userLoading } = useUser();
  const user_Id = user?._id;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
        // Display error message to the user
        const errorMessage =
          error.response?.data?.message || "Failed to fetch attendance data.";
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
  }, [fromDate, toDate, user_Id, userLoading]);

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
    <div className="w-full p-4 sm:p-6 bg-white rounded-lg mb-8">
      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center">
          <FaSpinner className="text-blue-500 mb-4 animate-spin" size={30} />
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
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-black">
            View Attendance
          </h2>

          {/* Filters */}
          <div className="flex gap-4 mb-4 flex-wrap sm:flex-nowrap overflow-x-auto">
            {/* From Date Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
                placeholder="FROM"
              />
            </div>

            {/* To Date Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
                placeholder="TO"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
              <FaFilter className="text-gray-400 mr-3" />
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
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
            <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
              <colgroup>
                <col style={{ width: "5%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    S.No
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Date
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Day
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Time In
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Time Out
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Total Time
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((record, index) => (
                    <tr
                      key={record._id}
                      className={`hover:bg-gray-50 ${
                        record.type === "Absent"
                          ? "bg-red-100"
                          : record.type === "Public Holiday"
                          ? "bg-sky-100"
                          : ""
                      }`}
                    >
                      {/* Serial Number */}
                      <td
                        className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${
                          record.type === "Absent" ? "text-black" : ""
                        }`}
                      >
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Date */}
                      <td
                        className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${
                          record.type === "Absent" ? "text-black" : ""
                        }`}
                      >
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>

                      {/* Day */}
                      <td
                        className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${
                          record.type === "Absent" ? "text-black" : ""
                        }`}
                      >
                        {getDayOfWeek(record.createdAt)}
                      </td>

                      {/* Time In */}
                      <td
                        className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${
                          record.type === "Absent" ? "text-black" : ""
                        }`}
                      >
                        {record.timeIn
                          ? new Date(record.timeIn).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>

                      {/* Time Out */}
                      <td
                        className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${
                          record.type === "Absent" ? "text-black" : ""
                        }`}
                      >
                        {record.timeOut
                          ? new Date(record.timeOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>

                      {/* Total Time */}
                      <td
                        className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${
                          record.type === "Absent" ? "text-black" : ""
                        }`}
                      >
                        {record.duration
                          ? formatDuration(record.duration)
                          : "N/A"}
                      </td>

                      {/* Type */}
                      <td className="py-2 px-1 border border-gray-200 text-center">
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
                  // No Records Found
                  <tr>
                    <td
                      className="py-4 px-2 text-sm text-gray-700 border border-gray-200 text-center"
                      colSpan={7}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <FaInbox size={30} className="text-gray-400 mb-2" />
                        <span className="text-md font-medium">
                          No records found.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            {/* Items Per Page Selector */}
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Show:</span>
              <select
                className="text-sm border border-gray-300 rounded-md p-0.5"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              >
                {[5, 10, 20].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center space-x-4">
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
                disabled={currentPage === 1}
                onClick={handlePrevious}
                aria-label="Go to previous page"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={handleNext}
                aria-label="Go to next page"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewAttendance;
