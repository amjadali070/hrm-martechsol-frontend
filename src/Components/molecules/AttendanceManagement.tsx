import React, { useState, useEffect, useCallback } from "react";
import {
  FaCalendarAlt,
  FaFilter,
  FaInbox,
  FaSearch,
  FaUserTimes,
  FaUserPlus,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axiosInstance from "../../utils/axiosConfig";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import MarkAbsentModal from "../atoms/MarkAbsentModal";
// import { Link } from "react-router-dom";
import AddAttendanceModal from "../atoms/AddAttendanceModal";
import LoadingSpinner from "../atoms/LoadingSpinner";

// Helper for status styles
const getStatusStyles = (status: string) => {
  const styles: Record<string, string> = {
    Present: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    Completed: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    Absent: "bg-rose-50 text-rose-600 ring-rose-200",
    "Late IN": "bg-amber-50 text-amber-600 ring-amber-200",
    "Half Day": "bg-orange-50 text-orange-600 ring-orange-200",
    "Early Out": "bg-rose-50 text-rose-600 ring-rose-200",
    "Late IN and Early Out": "bg-purple-50 text-purple-600 ring-purple-200",
    "Casual Leave": "bg-blue-50 text-blue-600 ring-blue-200",
    "Sick Leave": "bg-teal-50 text-teal-600 ring-teal-200",
    "Annual Leave": "bg-indigo-50 text-indigo-600 ring-indigo-200",
    "Hajj Leave": "bg-cyan-50 text-cyan-600 ring-cyan-200",
    "Maternity Leave": "bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-200",
    "Paternity Leave": "bg-sky-50 text-sky-600 ring-sky-200",
    "Bereavement Leave": "bg-slate-50 text-slate-600 ring-slate-200",
    "Unauthorized Leave": "bg-red-50 text-red-700 ring-red-200",
    "Public Holiday": "bg-sky-50 text-sky-700 ring-sky-200",
  };
  return styles[status] || "bg-gunmetal-50 text-gunmetal-600 ring-gunmetal-200";
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

const AttendanceManagement: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState<
    Attendance[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: userLoading } = useUser();
  const user_Id = user?._id;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<string>("Today");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [searchName, setSearchName] = useState<string>("");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showMarkAbsentModal, setShowMarkAbsentModal] = useState(false);
  const [showAddAttendanceModal, setShowAddAttendanceModal] = useState(false);

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

  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [groupedAttendanceData, setGroupedAttendanceData] = useState<
    Record<string, Attendance[]>
  >({});

  // New State for Type Summary
  const [typeSummary, setTypeSummary] = useState<Record<string, number>>({});

  const isDateInRange = (
    dateToCheck: string,
    start: Date | null,
    end: Date | null
  ) => {
    if (!start || !end) return true; // If no date range is specified, include all dates

    const checkDate = new Date(dateToCheck);
    checkDate.setHours(0, 0, 0, 0);

    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    return checkDate >= startDate && checkDate <= endDate;
  };

  // Memoized getDateRange function
  const getDateRange = useCallback(
    (range: string) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let start: Date | null = null;
      let end: Date | null = null;

      switch (range) {
        case "Today": {
          start = today;
          end = new Date(today);
          end.setHours(23, 59, 59, 999);
          break;
        }
        case "Yesterday": {
          start = new Date(today);
          start.setDate(today.getDate() - 1);
          end = new Date(start);
          end.setHours(23, 59, 59, 999);
          break;
        }
        case "This Week": {
          start = new Date(today);
          start.setDate(
            today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
          ); // Start from Monday
          end = new Date(today);
          end.setDate(start.getDate() + 6); // End on Sunday
          end.setHours(23, 59, 59, 999);
          break;
        }
        case "This Month": {
          start = new Date(today.getFullYear(), today.getMonth(), 1);
          end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          end.setHours(23, 59, 59, 999);
          break;
        }
        case "Last Month": {
          start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          end = new Date(today.getFullYear(), today.getMonth(), 0);
          end.setHours(23, 59, 59, 999);
          break;
        }
        case "Custom": {
          if (fromDate && toDate) {
            start = new Date(fromDate);
            end = new Date(toDate);
            end.setHours(23, 59, 59, 999);
          }
          break;
        }
        case "All":
        default:
          start = null;
          end = null;
      }

      return { start, end };
    },
    [fromDate, toDate]
  );

  useEffect(() => {
    let filteredData = attendanceData;
    const { start: startDate, end: endDate } = getDateRange(dateRange);

    // Apply date range filter
    if (startDate && endDate) {
      filteredData = filteredData.filter((record) =>
        isDateInRange(record.createdAt, startDate, endDate)
      );
    }

    // Apply job title filter
    if (jobTitleFilter !== "All") {
      filteredData = filteredData.filter(
        (log) => log.user.personalDetails?.jobTitle === jobTitleFilter
      );
    }

    // Apply name search filter
    if (debouncedSearchName.trim() !== "") {
      const searchLower = debouncedSearchName.toLowerCase();
      filteredData = filteredData.filter((log) =>
        log.user.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
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
    getDateRange, // Include getDateRange in dependencies
  ]);

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

      fetchedData.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
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
    if (!userLoading && user_Id) {
      fetchAttendance();
    }
  }, [user_Id, fromDate, toDate, typeFilter, fetchAttendance, userLoading]);

  useEffect(() => {
    const grouped: Record<string, Attendance[]> = {};
    filteredAttendanceData.forEach((record) => {
      const dateKey = new Date(record.createdAt).toISOString().split("T")[0];
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

  const currentDateKey = uniqueDates[currentPage - 1];
  const currentDateDisplay = currentDateKey
    ? formatDateWithWeekday(currentDateKey)
    : "";
  const currentDayDisplay = currentDateKey ? getDayOfWeek(currentDateKey) : "";
  const paginatedData = currentDateKey
    ? groupedAttendanceData[currentDateKey]
    : [];

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      {loading && (
        <LoadingSpinner className="min-h-[400px]" size="lg" text="Loading attendance records..." />
      )}

      {!loading && (
        <>
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                Attendance Management
              </h2>
              <p className="text-sm text-slate-grey-500 mt-1">
                Monitor and manage employee attendance records.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAddAttendanceModal(true)}
                className="flex items-center px-4 py-2 bg-gunmetal-900 text-white rounded-lg hover:bg-gunmetal-800 transition-all font-medium text-sm shadow-sm"
              >
                <FaUserPlus className="mr-2" size={14} />
                Add Entry
              </button>
              <button
                onClick={() => setShowMarkAbsentModal(true)}
                className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all font-medium text-sm shadow-sm"
              >
                <FaUserTimes className="mr-2" size={14} />
                Mark Absent
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200">
             <div className="flex items-center gap-2 mb-2 md:mb-0">
                 <div className="w-1 h-8 bg-gunmetal-500 rounded-full"></div>
                 {currentDateDisplay && (
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-grey-400">Viewing Date</span>
                        <span className="text-sm font-bold text-gunmetal-900">{currentDateDisplay}</span>
                    </div>
                 )}
             </div>
             
             {/* Pagination Controls */}
              {uniqueDates.length > 0 && (
                <div className="flex items-center bg-white rounded-lg border border-platinum-200 shadow-sm p-1">
                  <button
                    className={`p-2 rounded-md transition-colors ${
                      currentPage === 1 ? "text-slate-grey-300 cursor-not-allowed" : "text-gunmetal-600 hover:bg-platinum-100"
                    }`}
                    disabled={currentPage === 1}
                    onClick={handlePrevious}
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <span className="text-xs font-mono font-medium px-4 text-gunmetal-700 border-x border-platinum-100 min-w-[100px] text-center">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    className={`p-2 rounded-md transition-colors ${
                      currentPage === totalPages || totalPages === 0
                        ? "text-slate-grey-300 cursor-not-allowed"
                        : "text-gunmetal-600 hover:bg-platinum-100"
                    }`}
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={handleNext}
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              )}
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative group">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
                placeholder="Search employee..."
              />
            </div>

            <div className="relative group">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
              <select
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="All">All Dates</option>
                <option value="Custom">Custom Range</option>
              </select>
            </div>

            <div className="relative group">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {Object.keys(getStatusStyles("")).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
              <select
                id="jobTitleFilter"
                value={jobTitleFilter}
                onChange={(e) => setJobTitleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
              >
                <option value="All">All Job Titles</option>
                {jobTitleOptions.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          
           {dateRange === "Custom" && (
              <div className="flex gap-4 mb-6 animate-fadeIn">
                 <div className="flex-1">
                     <label className="block text-xs font-bold text-slate-grey-500 mb-1 uppercase tracking-wide">From Date</label>
                     <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:border-gunmetal-500"
                      />
                 </div>
                 <div className="flex-1">
                     <label className="block text-xs font-bold text-slate-grey-500 mb-1 uppercase tracking-wide">To Date</label>
                     <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:border-gunmetal-500"
                      />
                 </div>
              </div>
            )}

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-platinum-200 shadow-sm mb-6">
            <div className="overflow-x-auto">
                <table className="w-full table-auto bg-white">
                <thead className="bg-alabaster-grey-50 border-b border-platinum-200">
                    <tr>
                    <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                        Employee
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                        Job Title
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                        Date
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                        Time In
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                        Time Out
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                        Total
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                        Status
                    </th>

                    {user?.role === "SuperAdmin" && (
                        <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                        Location
                        </th>
                    )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-platinum-100">
                    {paginatedData && paginatedData.length > 0 ? (
                    paginatedData.map((record) => (
                        <tr
                        key={record._id}
                        className="hover:bg-alabaster-grey-50/50 transition-colors"
                        >
                        <td className="py-3 px-4">
                            <span
                            onClick={() => navigate(`/attendance/user/${record.user._id}`)}
                            className="text-sm font-semibold text-gunmetal-900 hover:text-gunmetal-600 transition-colors cursor-pointer"
                            >
                            {record.user.name}
                            </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-grey-600">
                            {record.user.personalDetails?.jobTitle || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-grey-600">
                            {new Date(record.createdAt).toLocaleDateString(
                            undefined,
                            {
                                month: "short",
                                day: "numeric",
                            }
                            )}
                            <span className="text-xs text-slate-grey-400 block">{getDayOfWeek(record.createdAt)}</span>
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-center text-gunmetal-700">
                            {record.timeIn
                            ? new Date(record.timeIn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "--:--"}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-center text-gunmetal-700">
                            {record.timeOut
                            ? new Date(record.timeOut).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "--:--"}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-center font-semibold text-gunmetal-900 bg-alabaster-grey-50/30">
                            {formatDuration(record.duration)}
                        </td>
                        <td className="py-3 px-4 text-center">
                            <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${
                                getStatusStyles(record.type)
                            }`}
                            >
                            {record.type}
                            </span>
                        </td>

                        {user?.role === "SuperAdmin" && (
                            <td className="py-3 px-4 text-sm text-slate-grey-600">
                            {record.workLocation || "N/A"}
                            </td>
                        )}
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td
                        className="py-12 px-4 text-center"
                        colSpan={user?.role === "SuperAdmin" ? 8 : 7}
                        >
                        <div className="flex flex-col items-center justify-center text-slate-grey-400">
                            <FaInbox size={32} className="mb-3 opacity-30" />
                            <span className="text-sm font-medium">
                            No attendance records found.
                            </span>
                        </div>
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
          </div>

          {Object.keys(typeSummary).length > 0 && (
            <div className="bg-alabaster-grey-50 rounded-xl p-5 border border-platinum-200">
              <h3 className="text-sm font-bold text-gunmetal-900 uppercase tracking-wide mb-4">
                Daily Breakdown
              </h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(typeSummary).map(([type, count]) => (
                  <div
                    key={type}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white border-platinum-200 shadow-sm text-xs font-bold"
                  >
                     <span className={`w-2 h-2 rounded-full ${getStatusStyles(type).match(/bg-[a-z]+-50/)?.[0].replace('-50', '-500') || 'bg-gray-500'}`}></span>
                    <span className="text-gunmetal-700">{type}</span>
                    <span className="ml-1 bg-alabaster-grey-50 px-1.5 rounded text-gunmetal-900 border border-platinum-100">{count}</span>
                  </div>
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
      <AddAttendanceModal
        isOpen={showAddAttendanceModal}
        onClose={() => {
          setShowAddAttendanceModal(false);
          fetchAttendance();
        }}
      />
    </div>
  );
};

export default AttendanceManagement;
