// src/components/AttendanceManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FaCalendarAlt,
  FaFilter,
  FaInbox,
  FaSpinner,
  FaSearch,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";

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

interface User {
  _id: string;
  name: string;
  email: string;
  personalDetails?: {
    jobTitle: string;
  };
}

interface TimeLog {
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
  timeLogs: TimeLog[];
}

const AttendanceManagement: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<TimeLog[]>([]);
  const [filteredAttendanceData, setFilteredAttendanceData] = useState<
    TimeLog[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: userLoading } = useUser();
  const user_Id = user?._id;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [searchName, setSearchName] = useState<string>("");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // New state for items per page

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
    "Lead Generation",
  ];

  const debouncedSearchName = useDebounce(searchName, 300);

  const fetchAttendance = useCallback(async () => {
    if (!backendUrl) {
      toast.error("Backend URL is not defined.");
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

      // Removed jobTitleFilter and searchName from params
      // They will be handled on the frontend

      // Pagination parameters
      params.page = 1; // Always fetch from the first page when primary filters change
      params.limit = 1000; // Fetch a large number to handle frontend pagination

      const { data } = await axiosInstance.get<ApiResponse>(
        `${backendUrl}/api/time-log`,
        {
          params,
        }
      );

      let fetchedData = data.timeLogs;

      setAttendanceData(fetchedData);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch attendance data.";
      toast.error(errorMessage);
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, user_Id, fromDate, toDate, typeFilter]);

  // Fetch attendance data when primary filters change
  useEffect(() => {
    if (!userLoading && user_Id) {
      fetchAttendance();
    }
  }, [user_Id, fromDate, toDate, typeFilter, fetchAttendance, userLoading]);

  // Apply secondary filters (jobTitleFilter and debouncedSearchName) when attendanceData or filters change
  useEffect(() => {
    let filteredData = attendanceData;

    // Apply Job Title Filter
    if (jobTitleFilter !== "All") {
      filteredData = filteredData.filter(
        (log) => log.user.personalDetails?.jobTitle === jobTitleFilter
      );
    }

    // Apply Search Name Filter
    if (debouncedSearchName.trim() !== "") {
      const searchLower = debouncedSearchName.toLowerCase();
      filteredData = filteredData.filter((log) =>
        log.user.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredAttendanceData(filteredData);
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page after filtering
  }, [attendanceData, jobTitleFilter, debouncedSearchName, itemsPerPage]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const paginatedData = filteredAttendanceData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-lg mb-8">
      {loading && (
        <div className="p-20 flex flex-col items-center justify-center">
          <FaSpinner className="text-blue-500 mb-4 animate-spin" size={30} />
        </div>
      )}

      {!loading && (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-black">
            Attendance Management
          </h2>

          {/* Filters Container */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* From Date Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-1 min-w-[150px]">
              <FaCalendarAlt className="text-gray-400 mr-3 flex-shrink-0" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  // setCurrentPage(1); // Removed because currentPage is managed in filtering useEffect
                }}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
                placeholder="FROM"
              />
            </div>

            {/* To Date Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-1 min-w-[150px]">
              <FaCalendarAlt className="text-gray-400 mr-3 flex-shrink-0" />
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                }}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
                placeholder="TO"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-1 min-w-[150px]">
              <FaFilter className="text-gray-400 mr-3 flex-shrink-0" />
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                }}
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

            {/* Search Name Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-1 min-w-[150px]">
              <FaSearch className="text-gray-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  // setCurrentPage(1); // Removed because currentPage is managed in filtering useEffect
                }}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
                placeholder="Search Name"
              />
            </div>

            {/* Job Title Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-1 min-w-[150px]">
              <FaFilter className="text-gray-400 mr-3 flex-shrink-0" />
              <select
                id="jobTitleFilter"
                value={jobTitleFilter}
                onChange={(e) => {
                  setJobTitleFilter(e.target.value);
                  // setCurrentPage(1); // Removed because currentPage is managed in filtering useEffect
                }}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
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

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
              <colgroup>
                <col style={{ width: "20%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Name
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Job Title
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Date
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Time In
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Time Out
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {record.user.name}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {record.user.personalDetails?.jobTitle || "N/A"}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {record.timeIn
                          ? new Date(record.timeIn).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {record.timeOut
                          ? new Date(record.timeOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-2 px-2 border border-gray-200 text-center">
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
                      className="py-4 px-2 text-sm text-gray-700 border border-gray-200 text-center"
                      colSpan={6}
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

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            {/* Items Per Page Selector */}
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Show:</span>
              <select
                className="text-sm border border-gray-300 rounded-md"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  // setCurrentPage(1); // Handled in filtering useEffect
                }}
              >
                {[5, 10, 20].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-4">
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
                disabled={currentPage === 1}
                onClick={handlePrevious}
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

export default AttendanceManagement;
