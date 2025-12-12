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
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  subMonths,
} from "date-fns";
import axiosInstance from "../../utils/axiosConfig";
import AttendanceStats, { StatisticsProps } from "./AttendanceStats";

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
  const [statistics, setStatistics] = useState<StatisticsProps>({
    totalDays: 0,
    present: 0,
    absent: 0,
    leaves: 0,
    lateArrivals: 0,
    earlyDepartures: 0,
    completed: 0,
    halfDays: 0,
    casualLeaves: 0,
    sickLeaves: 0,
    annualLeaves: 0,
    hajjLeaves: 0,
    maternityLeaves: 0,
    paternityLeaves: 0,
    bereavementLeaves: 0,
    unauthorizedLeaves: 0,
    publicHolidays: 0,
    lateAndEarly: 0,
  });

  const itemsPerPage = 31;
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
      lateArrivals: 0,
      earlyDepartures: 0,
      completed: 0,
      lateAndEarly: 0,
      halfDays: 0,
      casualLeaves: 0,
      sickLeaves: 0,
      annualLeaves: 0,
      hajjLeaves: 0,
      maternityLeaves: 0,
      paternityLeaves: 0,
      bereavementLeaves: 0,
      unauthorizedLeaves: 0,
      publicHolidays: 0,
    } as StatisticsProps;

    data.forEach((record) => {
      if (record.type === "Present") stats.present++;
      if (record.type === "Absent") stats.absent++;
      if (record.type.includes("Leave")) stats.leaves++;
      if (record.type === "Late IN") stats.lateArrivals++;
      if (record.type === "Early Out") stats.earlyDepartures++;
      if (record.type === "Completed") stats.completed++;
      if (record.type === "Half Day") stats.halfDays++;
      if (record.type === "Casual Leave") stats.casualLeaves++;
      if (record.type === "Sick Leave") stats.sickLeaves++;
      if (record.type === "Annual Leave") stats.annualLeaves++;
      if (record.type === "Hajj Leave") stats.hajjLeaves++;
      if (record.type === "Maternity Leave") stats.maternityLeaves++;
      if (record.type === "Paternity Leave") stats.paternityLeaves++;
      if (record.type === "Bereavement Leave") stats.bereavementLeaves++;
      if (record.type === "Unauthorized Leave") stats.unauthorizedLeaves++;
      if (record.type === "Public Holiday") stats.publicHolidays++;
      if (record.type === "Late IN and Early Out") {
        stats.lateAndEarly++;
      }
    });

    setStatistics(stats);
  };

  useEffect(() => {
    let filtered = [...attendanceData];

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
    } else if (dateRange === "Last Month") {
      const start = startOfMonth(subMonths(today, 1));
      const end = endOfMonth(subMonths(today, 1));
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
    }

    if (typeFilter !== "All") {
      filtered = filtered.filter((record) => record.type === typeFilter);
    }

    setFilteredAttendance(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);

    calculateStatistics(filtered);
  }, [attendanceData, dateRange, fromDate, toDate, typeFilter]);

  const paginatedData = filteredAttendance.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <FaSpinner className="text-gunmetal-600 animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-grey-400 hover:text-gunmetal-800 hover:bg-platinum-100 rounded-lg transition-all"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gunmetal-900 tracking-tight">
             {userDetails?.name}
          </h1>
          <p className="text-sm font-medium text-slate-grey-500">
             {userDetails?.personalDetails?.jobTitle} • Attendance Record
          </p>
        </div>
      </div>

      <AttendanceStats
        statistics={statistics}
        attendanceData={filteredAttendance}
      />

    {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-8">
        <div className="relative group">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
            <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
            >
                <option value="This Month">This Month</option>
                <option value="Last Month">Last Month</option>
                <option value="This Week">This Week</option>
                <option value="This Year">This Year</option>
                <option value="All">All Time</option>
                <option value="Custom">Custom Range</option>
            </select>
        </div>

        {dateRange === "Custom" ? (
          <div className="flex gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:border-gunmetal-500"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:border-gunmetal-500"
            />
          </div>
        ) : (
            <div className="hidden md:block"></div>
        )}

        <div className="relative group">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
            <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
            >
                <option value="All">All Statuses</option>
                {/* Dynamically get types from the styles helper, ensuring we cover keys generally used */}
                {["Present", "Absent", "Late IN", "Early Out", "Half Day", "Casual Leave", "Sick Leave", "Annual Leave"].map((type) => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-xl border border-platinum-200 shadow-sm mb-6">
         <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white">
            <thead className="bg-alabaster-grey-50 border-b border-platinum-200">
                <tr>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">#</th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Day</th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Time In</th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Time Out</th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Duration</th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Location</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-platinum-100">
                {paginatedData.map((record, index) => (
                <tr key={record._id} className="hover:bg-alabaster-grey-50/50 transition-colors">
                    <td className="py-3 px-4 text-xs font-mono text-slate-grey-400">
                        {((currentPage - 1) * itemsPerPage) + index + 1}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gunmetal-900">
                    {new Date(record.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-grey-600">
                    {new Date(record.createdAt).toLocaleDateString(undefined, {
                        weekday: "long",
                    })}
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-gunmetal-700">
                    {record.timeIn
                        ? new Date(record.timeIn).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-gunmetal-700">
                    {record.timeOut
                        ? new Date(record.timeOut).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm font-mono font-bold text-gunmetal-900">
                        {formatDuration(record.duration)}
                    </td>
                    <td className="py-3 px-4">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${
                        getStatusStyles(record.type)
                        }`}
                    >
                        {record.type}
                    </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-grey-500">
                    {record.workLocation || "-"}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

            {paginatedData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-grey-400">
                    <FaInbox size={32} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">No attendance records found</p>
                </div>
            )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-platinum-200 shadow-sm p-1">
                <button
                    className={`p-2 rounded-md transition-colors ${
                    currentPage === 1 ? "text-slate-grey-300 cursor-not-allowed" : "text-gunmetal-600 hover:bg-platinum-100"
                    }`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <FiChevronLeft size={18} />
                </button>
                <span className="text-xs font-mono font-medium px-4 text-gunmetal-700 border-x border-platinum-100">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className={`p-2 rounded-md transition-colors ${
                    currentPage === totalPages
                        ? "text-slate-grey-300 cursor-not-allowed"
                        : "text-gunmetal-600 hover:bg-platinum-100"
                    }`}
                    onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                >
                    <FiChevronRight size={18} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserAttendanceDetails;
