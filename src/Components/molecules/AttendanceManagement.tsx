// src/components/AttendanceManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FaCalendarAlt,
  FaFilter,
  FaInbox,
  FaSpinner,
  FaSearch,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // Added for pagination icons
import axiosInstance from "../../utils/axiosConfig";
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import {
  startOfDay,
  endOfDay,
  startOfYesterday,
  endOfYesterday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

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
  "Unauthorized Leave": "bg-red-900",
  "Public Holiday": "bg-sky-700",
};

const formatDuration = (seconds: number) => {
  if (!seconds) return "N/A";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

// Helper function to get the day of the week
const getDayOfWeek = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to format date with weekday (if needed elsewhere)
const formatDateWithWeekday = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

interface User {
  _id: string;
  name: string;
  email: string;
  personalDetails?: {
    jobTitle: string;
  };
}

interface Attendance {
  _id: string;
  user: User;
  timeIn: string | null;
  timeOut: string | null;
  duration: number;
  type: string;
  createdAt: string;
  leaveApplication?: string | null;
}

interface ApiResponse {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  attendances: Attendance[];
}

const AttendanceManagement: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState<
    Attendance[]
  >([]);

  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: userLoading } = useUser();
  const user_Id = user?._id;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [dateRange, setDateRange] = useState<string>("Today"); // New state for date range
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [searchName, setSearchName] = useState<string>("");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const jobTitleOptions = [
    "Executive",
    "Senior Executive",
    "Assistant Manager",
    "Associate Manager",
    "Manager",
    "Senior Manager",
    "Assistant Vice President",
    "Associate Vice President",
    "Vice President",
    "Senior Vice President",
    "President",
    "Head of Department",
    "Head Of Project Management",
    "Chief Executive Officer",
  ];

  const debouncedSearchName = useDebounce(searchName, 300);

  // New States for Grouped Data
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [groupedAttendanceData, setGroupedAttendanceData] = useState<
    Record<string, Attendance[]>
  >({});

  // New State for Type Summary
  const [typeSummary, setTypeSummary] = useState<Record<string, number>>({});

  const getDateRange = (range: string) => {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (range) {
      case "Today": {
        const currentDate = today.toISOString().split("T")[0];
        start = end = new Date(currentDate);
        break;
      }
      case "Yesterday": {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().split("T")[0];
        start = end = new Date(yesterdayDate);
        break;
      }
      case "This Week":
        start = startOfWeek(today, { weekStartsOn: 1 });
        end = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case "This Month": {
        // Get first day of current month
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        // Get last day of current month
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      }
      case "All": {
        start = null;
        end = null;
        break;
      }
      default:
        start = null;
        end = null;
    }

    // Format dates for API - ensures we get YYYY-MM-DD format consistently
    const formatDate = (date: Date | null) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    };
  };

  useEffect(() => {
    if (dateRange !== "Custom") {
      const { startDate, endDate } = getDateRange(dateRange);
      setFromDate(startDate);
      setToDate(endDate);
    }
  }, [dateRange]);

  const fetchAttendance = useCallback(async () => {
    if (!backendUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (!user_Id) {
        throw new Error("User not found");
      }

      const params: Record<string, any> = {};

      if (fromDate) params.startDate = fromDate;
      if (toDate) params.endDate = toDate;
      if (typeFilter && typeFilter !== "All") params.types = typeFilter;

      // Reset pagination to first page on new fetch
      params.page = 1;
      params.limit = 1000;

      console.log("Fetching attendance with params:", params);

      const { data } = await axiosInstance.get<ApiResponse>(
        `${backendUrl}/api/attendance`,
        {
          params,
        }
      );
      let fetchedData = data.attendances || [];

      // Sort fetched data by createdAt descending, then timeIn ascending
      fetchedData.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        if (dateA !== dateB) {
          return dateB - dateA; // Descending date
        }
        const timeA = a.timeIn ? new Date(a.timeIn).getTime() : 0;
        const timeB = b.timeIn ? new Date(b.timeIn).getTime() : 0;
        return timeA - timeB; // Ascending timeIn
      });

      setAttendanceData(fetchedData);
    } catch (error: any) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance data.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, user_Id, fromDate, toDate, typeFilter]);

  useEffect(() => {
    if (!userLoading && user_Id) {
      fetchAttendance();
    }
  }, [user_Id, fromDate, toDate, typeFilter, fetchAttendance, userLoading]);

  useEffect(() => {
    let filteredData = attendanceData;

    if (jobTitleFilter !== "All") {
      filteredData = filteredData.filter(
        (log) => log.user.personalDetails?.jobTitle === jobTitleFilter
      );
    }

    if (debouncedSearchName.trim() !== "") {
      const searchLower = debouncedSearchName.toLowerCase();
      filteredData = filteredData.filter((log) =>
        log.user.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredAttendanceData(filteredData);
  }, [attendanceData, jobTitleFilter, debouncedSearchName]);

  // Group filtered data by date
  useEffect(() => {
    const grouped: Record<string, Attendance[]> = {};
    filteredAttendanceData.forEach((record) => {
      const dateKey = new Date(record.createdAt).toISOString().split("T")[0]; // Use YYYY-MM-DD as key
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(record);
    });

    // Sort the unique dates descending
    const dates = Object.keys(grouped).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    // Sort records within each date by timeIn ascending
    dates.forEach((date) => {
      grouped[date].sort((a, b) => {
        const timeA = a.timeIn ? new Date(a.timeIn).getTime() : 0;
        const timeB = b.timeIn ? new Date(b.timeIn).getTime() : 0;
        return timeA - timeB;
      });
    });

    setGroupedAttendanceData(grouped);
    setUniqueDates(dates);
    setTotalPages(dates.length);
    setCurrentPage(1); // Reset to first page whenever filters change
  }, [filteredAttendanceData]);

  // Compute Type Summary
  useEffect(() => {
    const summary: Record<string, number> = {};
    filteredAttendanceData.forEach((record) => {
      if (summary[record.type]) {
        summary[record.type]++;
      } else {
        summary[record.type] = 1;
      }
    });
    setTypeSummary(summary);
  }, [filteredAttendanceData]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Get records for the current page's date
  const currentDateKey = uniqueDates[currentPage - 1];
  const currentDateDisplay = currentDateKey
    ? formatDateWithWeekday(currentDateKey)
    : "";
  const currentDayDisplay = currentDateKey ? getDayOfWeek(currentDateKey) : "";
  const paginatedData = currentDateKey
    ? groupedAttendanceData[currentDateKey]
    : [];

  return (
    <div className="w-full p-6 bg-gray-50 rounded-lg mb-8">
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <FaSpinner className="text-blue-500 mb-4 animate-spin" size={40} />
        </div>
      )}

      {!loading && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">
              Attendance Management
            </h2>

            {currentDateDisplay && currentDayDisplay && (
              <div className="text-md font-medium text-gray-700">
                <span className="font-semibold">Date: </span>
                {currentDateDisplay}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Name */}
            <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
              <FaSearch className="text-gray-400 mr-3" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full focus:outline-none text-sm text-gray-600"
                placeholder="Search by name"
              />
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <select
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full focus:outline-none text-sm text-gray-600"
              >
                <option value="Today">Today</option>
                <option value="All">All Dates</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {/* From Date - Only enabled if Custom is selected */}
            {dateRange === "Custom" && (
              <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
                <FaCalendarAlt className="text-gray-400 mr-3" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full focus:outline-none text-sm text-gray-600"
                  placeholder="FROM"
                />
              </div>
            )}

            {/* To Date - Only enabled if Custom is selected */}
            {dateRange === "Custom" && (
              <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
                <FaCalendarAlt className="text-gray-400 mr-3" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full focus:outline-none text-sm text-gray-600"
                  placeholder="TO"
                />
              </div>
            )}

            {/* Type Filter */}
            <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
              <FaFilter className="text-gray-400 mr-3" />
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full focus:outline-none text-sm text-gray-600"
              >
                <option value="All">All Types</option>
                {Object.keys(statusColors).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Title Filter */}
            <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
              <FaFilter className="text-gray-400 mr-3" />
              <select
                id="jobTitleFilter"
                value={jobTitleFilter}
                onChange={(e) => setJobTitleFilter(e.target.value)}
                className="w-full focus:outline-none text-sm text-gray-600"
              >
                <option value="All">All Job Titles</option>
                {jobTitleOptions.length > 0 ? (
                  jobTitleOptions.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))
                ) : (
                  <option disabled>No Job Titles Available</option>
                )}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white rounded-lg overflow-hidden">
              <thead className="bg-purple-900">
                <tr>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-white">
                    Name
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-white">
                    Job Title
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-white">
                    Day
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-white">
                    Date
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-white">
                    Time In
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-white">
                    Time Out
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-white">
                    Total Time
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold text-white">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData && paginatedData.length > 0 ? (
                  paginatedData.map((record) => (
                    <tr
                      key={record._id}
                      className="hover:bg-gray-100 transition-colors text-center"
                    >
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {record.user.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {record.user.personalDetails?.jobTitle || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {getDayOfWeek(record.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {new Date(record.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {record.timeIn
                          ? new Date(record.timeIn).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {record.timeOut
                          ? new Date(record.timeOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {formatDuration(record.duration)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${
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
                      className="py-6 px-4 text-center text-gray-500"
                      colSpan={8}
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

          {/* Pagination Controls */}
          {uniqueDates.length > 0 && (
            <div className="flex justify-center items-center mt-6 space-x-4">
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
          )}

          {/* Summary Section */}
          {Object.keys(typeSummary).length > 0 && (
            <div className="rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Summary
              </h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(typeSummary).map(([type, count]) => (
                  <span
                    key={type}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
                      statusColors[type] || "bg-gray-400"
                    }`}
                  >
                    {type}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceManagement;
