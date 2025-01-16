// src/components/AttendanceManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FaCalendarAlt,
  FaFilter,
  FaInbox,
  FaSpinner,
  FaSearch,
  FaUserTimes,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axiosInstance from "../../utils/axiosConfig";
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import MarkAbsentModal from "../atoms/MarkAbsentModal";

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

const getDayOfWeek = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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
  role: "normal" | "HR" | "manager" | "SuperAdmin";
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
  attendanceDate?: string; // new field from backend, if available
  createdAt: string;
  workLocation?: string;
  leaveApplication?: string | null;
}

interface ApiResponse {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  attendances: Attendance[];
}

// Use attendanceDate if present, otherwise fallback to createdAt.
const isDateInRange = (
  dateToCheck: string,
  start: Date | null,
  end: Date | null
) => {
  if (!start || !end) return true;
  const checkDate = new Date(dateToCheck);
  checkDate.setHours(0, 0, 0, 0);
  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(23, 59, 59, 999);
  return checkDate >= startDate && checkDate <= endDate;
};

const AttendanceManagement: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState<
    Attendance[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: userLoading } = useUser();
  const user_Id = user?._id;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [dateRange, setDateRange] = useState<string>("Today");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [searchName, setSearchName] = useState<string>("");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showMarkAbsentModal, setShowMarkAbsentModal] = useState(false);

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

  const getDateRange = useCallback(
    (range: string) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let start: Date | null = null;
      let end: Date | null = null;
      switch (range) {
        case "Today":
          start = today;
          end = new Date(today);
          end.setHours(23, 59, 59, 999);
          break;
        case "Yesterday":
          start = new Date(today);
          start.setDate(today.getDate() - 1);
          end = new Date(start);
          end.setHours(23, 59, 59, 999);
          break;
        case "This Week":
          start = new Date(today);
          start.setDate(
            today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
          );
          end = new Date(start);
          end.setDate(start.getDate() + 6);
          end.setHours(23, 59, 59, 999);
          break;
        case "This Month":
          start = new Date(today.getFullYear(), today.getMonth(), 1);
          end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          end.setHours(23, 59, 59, 999);
          break;
        case "Custom":
          if (fromDate && toDate) {
            start = new Date(fromDate);
            end = new Date(toDate);
            end.setHours(23, 59, 59, 999);
          }
          break;
        case "All":
        default:
          start = null;
          end = null;
      }
      return { start, end };
    },
    [fromDate, toDate]
  );

  // Fetch attendance from API
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

      const params: Record<string, any> = {
        page: 1,
        limit: 1000,
      };

      const { data } = await axiosInstance.get<ApiResponse>(
        `${backendUrl}/api/attendance`,
        { params }
      );

      let fetchedData = data.attendances || [];

      // Sort using attendanceDate (fallback to createdAt) descending
      fetchedData.sort((a, b) => {
        const dateA = new Date(a.attendanceDate || a.createdAt).getTime();
        const dateB = new Date(b.attendanceDate || b.createdAt).getTime();
        return dateB - dateA;
      });

      setAttendanceData(fetchedData);
    } catch (error: any) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance data.");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, user_Id]);

  useEffect(() => {
    let filteredData = attendanceData;
    const { start: startDate, end: endDate } = getDateRange(dateRange);

    if (startDate && endDate) {
      filteredData = filteredData.filter((record) =>
        isDateInRange(
          record.attendanceDate || record.createdAt,
          startDate,
          endDate
        )
      );
    }

    // Log to verify what is being filtered out
    console.log("Date Range:", startDate, endDate);
    console.log("Filtered Data:", filteredData);

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

    if (typeFilter !== "All") {
      filteredData = filteredData.filter(
        (record) => record.type === typeFilter
      );
    }

    setFilteredAttendanceData(filteredData);
  }, [
    attendanceData,
    dateRange,
    fromDate,
    toDate,
    jobTitleFilter,
    debouncedSearchName,
    typeFilter,
    getDateRange,
  ]);

  // Group filtered data by attendanceDate (or fallback to createdAt)
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [groupedAttendanceData, setGroupedAttendanceData] = useState<
    Record<string, Attendance[]>
  >({});

  useEffect(() => {
    const grouped: Record<string, Attendance[]> = {};
    filteredAttendanceData.forEach((record) => {
      const dateStr = record.attendanceDate || record.createdAt;
      const dateKey = new Date(dateStr).toISOString().split("T")[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(record);
    });

    const dates = Object.keys(grouped).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

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
    setCurrentPage(1);
  }, [filteredAttendanceData]);

  // Type Summary
  const [typeSummary, setTypeSummary] = useState<Record<string, number>>({});
  useEffect(() => {
    const summary: Record<string, number> = {};
    filteredAttendanceData.forEach((record) => {
      summary[record.type] = (summary[record.type] || 0) + 1;
    });
    setTypeSummary(summary);
  }, [filteredAttendanceData]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const currentDateKey = uniqueDates[currentPage - 1];
  const currentDateDisplay = currentDateKey
    ? formatDateWithWeekday(currentDateKey)
    : "";
  const currentDayDisplay = currentDateKey ? getDayOfWeek(currentDateKey) : "";
  const paginatedData = currentDateKey
    ? groupedAttendanceData[currentDateKey]
    : [];

  useEffect(() => {
    if (!userLoading && user_Id) {
      fetchAttendance();
    }
  }, [user_Id, fetchAttendance, userLoading]);

  return (
    <div className="w-full p-6 bg-gray-50 rounded-lg mb-8">
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <FaSpinner className="text-blue-500 mb-4 animate-spin" size={40} />
        </div>
      )}

      {!loading && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">
              Attendance Management
            </h2>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowMarkAbsentModal(true)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaUserTimes className="mr-2" />
                Mark Absent
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end items-left mb-3">
            {currentDateDisplay && currentDayDisplay && (
              <div className="text-md font-medium text-gray-700">
                <span className="font-semibold">Date: </span>
                {currentDateDisplay}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search by Name */}
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

            {/* From Date for Custom Range */}
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

            {/* To Date for Custom Range */}
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
                  {user?.role === "SuperAdmin" && (
                    <th className="py-3 px-4 text-center text-sm font-semibold text-white">
                      Location
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData && paginatedData.length > 0 ? (
                  paginatedData.map((record) => {
                    const displayDate =
                      record.attendanceDate || record.createdAt;
                    return (
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
                          {getDayOfWeek(displayDate)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {new Date(displayDate).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
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
                        {user?.role === "SuperAdmin" && (
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {record.workLocation || "N/A"}
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      className="py-6 px-4 text-center text-gray-500"
                      colSpan={user?.role === "SuperAdmin" ? 9 : 8}
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
      <MarkAbsentModal
        isOpen={showMarkAbsentModal}
        onClose={() => {
          setShowMarkAbsentModal(false);
          fetchAttendance();
        }}
      />
    </div>
  );
};

export default AttendanceManagement;
