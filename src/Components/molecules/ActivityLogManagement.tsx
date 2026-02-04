import React, { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaFilter,
  FaSpinner,
  FaInbox,
  FaFileExport,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  ActivityLog,
  ActivityLogFilters,
  ActivityLogResponse,
} from "../../types/ActivityLog";

const ActivityLogManagement: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  // Filters
  const [filters, setFilters] = useState<ActivityLogFilters>({
    action: "ALL",
    module: "ALL",
    userId: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";

  // Action and Module options
  const actionOptions = [
    "ALL",
    "CREATE",
    "UPDATE",
    "DELETE",
    "LOGIN",
    "LOGOUT",
    "STATUS_CHANGE",
    "PASSWORD_CHANGE",
    "PAYROLL_GENERATE",
    "PAYROLL_PROCESS",
    "PAYROLL_UPDATE",
    "ATTENDANCE_MARK",
    "ATTENDANCE_UPDATE",
    "LEAVE_APPLY",
    "LEAVE_APPROVE",
    "LEAVE_REJECT",
    "TICKET_CREATE",
    "NOTICE_CREATE",
    "BLOG_CREATE",
  ];

  const moduleOptions = [
    "ALL",
    "USER",
    "PAYROLL",
    "ATTENDANCE",
    "LEAVE",
    "TICKET",
    "NOTICE",
    "HOLIDAY",
    "VEHICLE",
    "BLOG",
    "AUTH",
  ];

  const fetchActivityLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };

      if (filters.action && filters.action !== "ALL")
        params.action = filters.action;
      if (filters.module && filters.module !== "ALL")
        params.module = filters.module;
      if (filters.userId) params.userId = filters.userId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.search) params.search = filters.search;

      const response = await axiosInstance.get<ActivityLogResponse>(
        `${backendUrl}/api/activity-logs`,
        {
          params,
          withCredentials: true,
        },
      );

      setLogs(response.data.logs);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalLogs(response.data.totalLogs);
      setPageSize(response.data.pageSize);
    } catch (error: any) {
      console.error("Error fetching activity logs:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch activity logs",
      );
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, currentPage, pageSize, filters]);

  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

  const handleFilterChange = (
    field: keyof ActivityLogFilters,
    value: string,
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleExportToExcel = async () => {
    try {
      toast.info("Preparing export...");

      const params: any = {};
      if (filters.action && filters.action !== "ALL")
        params.action = filters.action;
      if (filters.module && filters.module !== "ALL")
        params.module = filters.module;
      if (filters.userId) params.userId = filters.userId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.search) params.search = filters.search;

      const response = await axiosInstance.get<{ logs: ActivityLog[] }>(
        `${backendUrl}/api/activity-logs/export`,
        {
          params,
          withCredentials: true,
        },
      );

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Activity Logs");

      // Define columns
      worksheet.columns = [
        { header: "S.No", key: "sno", width: 8 },
        { header: "Date & Time", key: "timestamp", width: 20 },
        { header: "User", key: "user", width: 25 },
        { header: "Department", key: "department", width: 20 },
        { header: "Action", key: "action", width: 18 },
        { header: "Module", key: "module", width: 15 },
        { header: "Description", key: "description", width: 50 },
        { header: "IP Address", key: "ipAddress", width: 18 },
        { header: "Status", key: "status", width: 12 },
      ];

      // Style header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF7B2CBF" },
      };
      worksheet.getRow(1).font = { color: { argb: "FFFFFFFF" }, bold: true };

      // Add data
      response.data.logs.forEach((log, index) => {
        worksheet.addRow({
          sno: index + 1,
          timestamp: new Date(log.createdAt).toLocaleString(),
          user: log.user.name,
          department: log.user.personalDetails?.department || "N/A",
          action: log.action,
          module: log.module,
          description: log.description,
          ipAddress: log.ipAddress || "N/A",
          status: log.status,
        });
      });

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        column.alignment = { vertical: "middle", horizontal: "left" };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(
        blob,
        `Activity_Logs_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      toast.success("Activity logs exported successfully!");
    } catch (error: any) {
      console.error("Error exporting logs:", error);
      toast.error("Failed to export activity logs");
    }
  };

  const getActionBadgeColor = (action: string) => {
    const colors: { [key: string]: string } = {
      CREATE: "bg-green-100 text-green-800",
      UPDATE: "bg-blue-100 text-blue-800",
      DELETE: "bg-red-100 text-red-800",
      LOGIN: "bg-purple-100 text-purple-800",
      LOGOUT: "bg-gray-100 text-gray-800",
      STATUS_CHANGE: "bg-yellow-100 text-yellow-800",
      PASSWORD_CHANGE: "bg-orange-100 text-orange-800",
      PAYROLL_GENERATE: "bg-indigo-100 text-indigo-800",
      PAYROLL_PROCESS: "bg-indigo-100 text-indigo-800",
      PAYROLL_UPDATE: "bg-blue-100 text-blue-800",
      ATTENDANCE_MARK: "bg-teal-100 text-teal-800",
      ATTENDANCE_UPDATE: "bg-cyan-100 text-cyan-800",
      LEAVE_APPLY: "bg-pink-100 text-pink-800",
      LEAVE_APPROVE: "bg-green-100 text-green-800",
      LEAVE_REJECT: "bg-red-100 text-red-800",
    };
    return colors[action] || "bg-gray-100 text-gray-800";
  };

  const getModuleBadgeColor = (module: string) => {
    const colors: { [key: string]: string } = {
      USER: "bg-blue-100 text-blue-800",
      PAYROLL: "bg-green-100 text-green-800",
      ATTENDANCE: "bg-purple-100 text-purple-800",
      LEAVE: "bg-yellow-100 text-yellow-800",
      TICKET: "bg-orange-100 text-orange-800",
      NOTICE: "bg-pink-100 text-pink-800",
      HOLIDAY: "bg-teal-100 text-teal-800",
      VEHICLE: "bg-indigo-100 text-indigo-800",
      BLOG: "bg-cyan-100 text-cyan-800",
      AUTH: "bg-red-100 text-red-800",
    };
    return colors[module] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
            Activity Log Management
          </h2>
          <p className="text-sm text-slate-grey-500 mt-1">
            Monitor and track all system activities and user actions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportToExcel}
            className="flex items-center px-4 py-2 bg-gunmetal-900 text-white rounded-lg hover:bg-gunmetal-800 transition-all font-medium text-sm shadow-sm"
            disabled={isLoading || logs.length === 0}
          >
            <FaFileExport className="mr-2" size={14} />
            Export Data
          </button>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative group">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
            placeholder="Search description..."
          />
        </div>

        <div className="relative group">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            value={filters.action}
            onChange={(e) => handleFilterChange("action", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            {actionOptions.map((action) => (
              <option key={action} value={action}>
                {action.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            value={filters.module}
            onChange={(e) => handleFilterChange("module", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            {moduleOptions.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
          />
        </div>

        <div className="relative group">
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
          />
        </div>

        <div className="relative group">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
            <option value={200}>200 per page</option>
          </select>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="overflow-hidden rounded-xl border border-platinum-200 shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white">
            <thead className="bg-alabaster-grey-50 border-b border-platinum-200">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                  S.No
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3 px-4 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-platinum-100">
              {isLoading ? (
                <tr>
                  <td
                    className="py-8 px-4 text-center text-slate-grey-500"
                    colSpan={7}
                  >
                    <div className="flex flex-col items-center">
                      <FaSpinner
                        size={40}
                        className="text-gunmetal-500 mb-4 animate-spin"
                      />
                      <span className="text-lg font-medium text-gunmetal-900">
                        Loading activity logs...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr
                    key={log._id}
                    className="hover:bg-alabaster-grey-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-slate-grey-600">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-grey-600">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div>
                        <p className="font-semibold text-gunmetal-900">
                          {log.user.name}
                        </p>
                        <p className="text-xs text-slate-grey-500">
                          {log.user.personalDetails?.department || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(
                          log.action,
                        )}`}
                      >
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleBadgeColor(
                          log.module,
                        )}`}
                      >
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-grey-600 max-w-md">
                      {log.description}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-grey-600">
                      {log.ipAddress || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="py-8 px-4 text-center text-slate-grey-500"
                    colSpan={7}
                  >
                    <div className="flex flex-col items-center text-slate-grey-400">
                      <FaInbox size={32} className="mb-3 opacity-30" />
                      <span className="text-sm font-medium">
                        No activity logs found.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 bg-alabaster-grey-50 rounded-b-xl border-t border-platinum-200">
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-gunmetal-500 rounded-full"></div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-grey-400">
                  Viewing Records
                </span>
                <span className="text-sm font-bold text-gunmetal-900">
                  {logs.length} of {totalLogs} total
                </span>
              </div>
            </div>

            <div className="flex items-center bg-white rounded-lg border border-platinum-200 shadow-sm p-1">
              <button
                className={`p-2 rounded-md transition-colors ${
                  currentPage === 1
                    ? "text-slate-grey-300 cursor-not-allowed"
                    : "text-gunmetal-600 hover:bg-platinum-100"
                }`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogManagement;
