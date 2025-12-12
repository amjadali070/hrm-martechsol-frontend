import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaInbox, FaSpinner, FaHistory } from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const statusColors: Record<string, string> = {
  Completed: "bg-emerald-500",
  Present: "bg-emerald-500",
  Absent: "bg-rose-600",
  "Late IN": "bg-amber-500",
  "Half Day": "bg-orange-600",
  "Early Out": "bg-pink-500",
  "Late IN and Early Out": "bg-violet-700",
  "Casual Leave": "bg-blue-600",
  "Sick Leave": "bg-lime-600",
  "Annual Leave": "bg-purple-500",
  "Hajj Leave": "bg-cyan-500",
  "Maternity Leave": "bg-fuchsia-800",
  "Paternity Leave": "bg-teal-600",
  "Bereavement Leave": "bg-slate-700",
  "Unauthorized Leave": "bg-rose-900",
  "Public Holiday": "bg-sky-700",
};

interface TimeLog {
  _id: string;
  user: string;
  timeIn: string | null;
  timeOut: string | null;
  duration: number;
  type: string;
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

    if (!userLoading && user_Id) {
      fetchAttendance();
    }
  }, [fromDate, toDate, user_Id, userLoading, backendUrl]);

  // Apply filters
  useEffect(() => {
    let data = [...attendanceData];

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      data = data.filter(
        (record) =>
          new Date(record.createdAt) >= start &&
          new Date(record.createdAt) <= end
      );
    }

    if (typeFilter !== "All") {
      data = data.filter((record) => record.type === typeFilter);
    }

    setFilteredData(data);
    setCurrentPage(1);
  }, [fromDate, toDate, typeFilter, attendanceData]);

  // Pagination
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

  const formatDuration = (seconds: number) => {
    if (!seconds) return "N/A";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
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

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 flex flex-col mb-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
            <FaHistory className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              View Attendance
            </h2>
            <p className="text-sm text-slate-grey-500">
              Check your attendance history and details.
            </p>
          </div>
        </div>
      </div>

       {/* Legend */}
       <div className="mb-8 p-4 bg-alabaster-grey-50 rounded-xl border border-platinum-200">
            <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-3">Status Legend</h4>
            <div className="flex flex-wrap gap-3">
                {Object.entries(statusColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-platinum-200 shadow-sm">
                    <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
                    <span className="text-xs font-medium text-slate-grey-600">{type}</span>
                  </div>
                ))}
            </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FaSpinner className="text-gunmetal-500 mb-4 animate-spin" size={40} />
          <p className="text-slate-grey-500 font-medium">Loading attendance records...</p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
             {/* From Date */}
            <div className="relative group">
               <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
                placeholder="From Date"
              />
            </div>

            {/* To Date */}
            <div className="relative group">
               <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
                placeholder="To Date"
              />
            </div>

            {/* Type Filter */}
            <div className="relative group">
               <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <select
                 value={typeFilter}
                 onChange={(e) => setTypeFilter(e.target.value)}
                 className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
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

          {currentData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-platinum-200 rounded-xl bg-alabaster-grey-50/50">
                <FaInbox size={48} className="text-slate-grey-300 mb-3" />
                <h3 className="text-lg font-bold text-gunmetal-800">No records found</h3>
                <p className="text-slate-grey-500 text-sm mt-1">
                    Try adjusting your filters to see more results.
                </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
                <table className="w-full text-left bg-white border-collapse">
                  <thead className="bg-alabaster-grey-50">
                    <tr>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center w-16">No.</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Date</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Day</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">In</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Out</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Duration</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-platinum-100">
                    {currentData.map((record, index) => (
                      <tr key={record._id} className="hover:bg-alabaster-grey-50/50 transition-colors">
                        <td className="py-4 px-4 text-sm text-slate-grey-500 text-center font-mono">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-gunmetal-900 whitespace-nowrap">
                            {new Date(record.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-grey-600">
                           {getDayOfWeek(record.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-grey-700 font-mono text-center">
                           {record.timeIn
                            ? new Date(record.timeIn).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-grey-700 font-mono text-center">
                           {record.timeOut
                            ? new Date(record.timeOut).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                        <td className="py-4 px-4 text-sm text-gunmetal-900 font-bold font-mono text-center">
                           {record.duration ? formatDuration(record.duration) : "-"}
                        </td>
                        <td className="py-4 px-4 text-center">
                            <span
                            className={`inline-block px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm whitespace-nowrap ${
                                statusColors[record.type] || "bg-gray-400"
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

               {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                 <div className="flex items-center gap-2 text-sm text-slate-grey-600 bg-alabaster-grey-50 px-3 py-1.5 rounded-lg border border-platinum-200">
                    <span className="font-medium">Rows:</span>
                    <select
                        className="bg-transparent border-none focus:outline-none font-semibold text-gunmetal-800 cursor-pointer"
                        value={itemsPerPage}
                        onChange={(e) => {
                        setItemsPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                        }}
                    >
                        {[5, 10, 20].map((option) => (
                        <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                <button
                    className={`p-2 rounded-lg border border-platinum-200 transition-all ${
                    currentPage === 1 
                        ? "bg-alabaster-grey-50 text-slate-grey-300 cursor-not-allowed" 
                        : "bg-white text-gunmetal-600 hover:bg-platinum-50 hover:text-gunmetal-900 shadow-sm"
                    }`}
                    disabled={currentPage === 1}
                    onClick={handlePrevious}
                >
                    <FiChevronLeft size={16} />
                </button>
                
                <span className="text-xs font-semibold text-gunmetal-600 uppercase tracking-wide px-3">
                    Page {currentPage} of {totalPages || 1}
                </span>
                
                <button
                    className={`p-2 rounded-lg border border-platinum-200 transition-all ${
                    currentPage === totalPages || totalPages === 0
                        ? "bg-alabaster-grey-50 text-slate-grey-300 cursor-not-allowed" 
                        : "bg-white text-gunmetal-600 hover:bg-platinum-50 hover:text-gunmetal-900 shadow-sm"
                    }`}
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={handleNext}
                >
                    <FiChevronRight size={16} />
                </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ViewAttendance;
