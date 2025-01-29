// src/components/UserAttendanceDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaFilter,
  FaInbox,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { toast } from "react-toastify";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
} from "date-fns";
import axiosInstance from "../../utils/axiosConfig";
import AttendanceStats from "./AttendanceStats";

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
}

interface AttendanceStats {
  totalDays: number;
  present: number;
  absent: number;
  leaves: number;
  averageWorkingHours: number;
  lateArrivals: number;
  earlyDepartures: number;
  onTime: number;
}

const statusColors: Record<string, string> = {
  Present: "bg-gray-400",
  Completed: "bg-green-500",
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

const UserAttendanceDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<Attendance[]>(
    []
  );
  const [dateRange, setDateRange] = useState<string>("This Month");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState<AttendanceStats>({
    totalDays: 0,
    present: 0,
    absent: 0,
    leaves: 0,
    averageWorkingHours: 0,
    lateArrivals: 0,
    earlyDepartures: 0,
    onTime: 0,
  });

  const itemsPerPage = 20;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUserAttendance = async () => {
      if (!backendUrl || !userId) return;

      setLoading(true);
      try {
        const [userResponse, attendanceResponse] = await Promise.all([
          axiosInstance.get(`${backendUrl}/api/attendance/users/${userId}`),
          axiosInstance.get(`${backendUrl}/api/attendance/user/${userId}`),
        ]);

        setUserDetails(userResponse.data);
        const sortedAttendance = attendanceResponse.data.sort(
          (a: Attendance, b: Attendance) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAttendanceData(sortedAttendance);
        calculateStatistics(sortedAttendance);
      } catch (error: any) {
        console.error("Error fetching user attendance:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        toast.error("Failed to fetch attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAttendance();
  }, [userId, backendUrl]);

  const calculateStatistics = (data: Attendance[]) => {
    const stats = {
      totalDays: data.length,
      present: 0,
      absent: 0,
      leaves: 0,
      averageWorkingHours: 0,
      lateArrivals: 0,
      earlyDepartures: 0,
      onTime: 0,
    };

    let totalHours = 0;

    data.forEach((record) => {
      if (record.type === "Present" || record.type === "Completed") {
        stats.present++;
        if (record.type === "Present") stats.onTime++;
      } else if (record.type === "Absent") stats.absent++;
      else if (record.type.includes("Leave")) stats.leaves++;

      if (record.type === "Late IN") stats.lateArrivals++;
      if (record.type === "Early Out") stats.earlyDepartures++;

      totalHours += record.duration / 3600;
    });

    stats.averageWorkingHours = totalHours / (stats.totalDays || 1);
    setStatistics(stats);
  };

  useEffect(() => {
    let filtered = [...attendanceData];

    // Apply date range filter
    const today = new Date();
    if (dateRange === "Custom" && fromDate && toDate) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.createdAt);
        return (
          recordDate >= new Date(fromDate) && recordDate <= new Date(toDate)
        );
      });
    } else if (dateRange === "This Month") {
      const start = startOfMonth(today);
      const end = endOfMonth(today);
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.createdAt);
        return recordDate >= start && recordDate <= end;
      });
    } else if (dateRange === "This Week") {
      const start = startOfWeek(today);
      const end = endOfWeek(today);
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.createdAt);
        return recordDate >= start && recordDate <= end;
      });
    } else if (dateRange === "This Year") {
      const start = startOfYear(today);
      const end = endOfYear(today);
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.createdAt);
        return recordDate >= start && recordDate <= end;
      });
    } else if (dateRange === "All") {
      // No filtering needed for all records
    }

    // Apply type filter
    if (typeFilter !== "All") {
      filtered = filtered.filter((record) => record.type === typeFilter);
    }

    setFilteredAttendance(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [attendanceData, dateRange, fromDate, toDate, typeFilter]);

  const paginatedData = filteredAttendance.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="text-blue-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <FaArrowLeft className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {userDetails?.name}'s Attendance
          </h1>
          <p className="text-gray-600">
            {userDetails?.personalDetails?.jobTitle}
          </p>
        </div>
      </div>

      <AttendanceStats statistics={statistics} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg">
          <h3 className="text-gray-600 text-sm mb-1">Present Days</h3>
          <p className="text-2xl font-bold text-green-600">
            {statistics.present}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h3 className="text-gray-600 text-sm mb-1">Absent Days</h3>
          <p className="text-2xl font-bold text-red-600">{statistics.absent}</p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h3 className="text-gray-600 text-sm mb-1">Leaves Taken</h3>
          <p className="text-2xl font-bold text-blue-600">
            {statistics.leaves}
          </p>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="bg-white p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Late Arrivals</p>
            <p className="text-xl font-bold text-yellow-500">
              {statistics.lateArrivals}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Early Departures</p>
            <p className="text-xl font-bold text-pink-500">
              {statistics.earlyDepartures}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Records</p>
            <p className="text-xl font-bold text-gray-700">
              {statistics.totalDays}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
          <FaCalendarAlt className="text-gray-400 mr-3" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full focus:outline-none text-sm text-gray-600"
          >
            <option value="This Month">This Month</option>
            <option value="This Week">This Week</option>
            <option value="This Year">This Year</option>
            <option value="All">All</option>
            <option value="Custom">Custom Range</option>
          </select>
        </div>

        {dateRange === "Custom" && (
          <>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg"
            />
          </>
        )}

        <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
          <FaFilter className="text-gray-400 mr-3" />
          <select
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
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto bg-white rounded-lg">
        <table className="w-full">
          <thead className="bg-purple-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">S.NO</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Day</th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Time In
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Time Out
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium">
                Location
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((record) => (
              <tr key={record._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">
                  {filteredAttendance.indexOf(record) + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(record.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(record.createdAt).toLocaleDateString(undefined, {
                    weekday: "long",
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.timeIn
                    ? new Date(record.timeIn).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.timeOut
                    ? new Date(record.timeOut).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {formatDuration(record.duration)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full text-white ${
                      statusColors[record.type]
                    }`}
                  >
                    {record.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {record.workLocation || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <FaInbox size={40} className="text-gray-400 mb-4" />
            <p className="text-gray-500">No attendance records found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            className={`flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg transition-colors ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft className="mr-2" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg transition-colors ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <FiChevronRight className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAttendanceDetails;
