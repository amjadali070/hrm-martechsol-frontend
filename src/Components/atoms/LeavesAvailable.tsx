import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaSpinner } from "react-icons/fa";
import axios from "axios";

interface LeaveDetail {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  totalDays: number;
}

interface LeaveBalance {
  type: string;
  used: number;
  total: number;
}

const LeavesAvailable: React.FC = () => {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([
    { type: "Sick Leave", used: 0, total: 8 },
    { type: "Casual Leave", used: 0, total: 10 },
    { type: "Annual Leave", used: 0, total: 14 },
  ]);
  const [leaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("All");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchLeaveData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/leave-applications`,
          {
            withCredentials: true,
          }
        );
        // Filter approved leaves only
        const approvedLeaves = response.data.filter(
          (leave: LeaveDetail) => leave.status === "Approved"
        );

        // Update leave balances with used days
        const updatedBalances = leaveBalances.map((balance) => {
          const usedDays = approvedLeaves
            .filter((leave: LeaveDetail) => leave.leaveType === balance.type)
            .reduce(
              (sum: number, leave: LeaveDetail) => sum + leave.totalDays,
              0
            );
          return { ...balance, used: usedDays };
        });

        setLeaveBalances(updatedBalances);
        setLeaveDetails(approvedLeaves);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter leave details based on leave type and date range
  const filteredDetails = leaveDetails.filter((detail) => {
    const matchesLeaveType =
      selectedLeaveType === "All" || detail.leaveType === selectedLeaveType;
    const matchesFromDate =
      !fromDate || new Date(detail.startDate) >= new Date(fromDate);
    const matchesToDate =
      !toDate || new Date(detail.endDate) <= new Date(toDate);
    return matchesLeaveType && matchesFromDate && matchesToDate;
  });

  const totalPages = Math.ceil(filteredDetails.length / rowsPerPage);
  const paginatedDetails = filteredDetails.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg mb-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Available Leaves
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FaSpinner size={30} className="animate-spin text-blue-600 mb-4" />
        </div>
      ) : (
        <>
          {/* Available Leaves Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full table-fixed border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-purple-900 text-white text-center uppercase tracking-wider text-sm font-semibold">
                  <th className="py-3 px-4 border border-gray-300">
                    Leave Type
                  </th>
                  <th className="py-3 px-4 border border-gray-300">Total</th>
                  <th className="py-3 px-4 border border-gray-300">Used</th>
                  <th className="py-3 px-4 border border-gray-300">
                    Remaining
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaveBalances.map((leave) => (
                  <tr
                    key={leave.type}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-800 border border-gray-300 text-center whitespace-nowrap">
                      {leave.type}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 border border-gray-300 text-center">
                      {leave.total}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 border border-gray-300 text-center">
                      {leave.used}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 border border-gray-300 text-center">
                      {leave.total - leave.used}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-left mb-4 text-gray-800">
            Used Leaves Details
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            {/* Leave Type Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
              <FaFilter className="text-gray-400 mr-3" />
              <select
                value={selectedLeaveType}
                onChange={(e) => {
                  setSelectedLeaveType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
              >
                <option value="All">All Leave Types</option>
                {leaveBalances.map((leave) => (
                  <option key={leave.type} value={leave.type}>
                    {leave.type}
                  </option>
                ))}
              </select>
            </div>

            {/* From Date Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
                placeholder="FROM"
              />
            </div>

            {/* To Date Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
                placeholder="TO"
              />
            </div>
          </div>

          {/* Used Leaves Details Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse bg-white rounded-lg overflow-hidden mb-6">
              <thead>
                <tr className="bg-purple-900 text-white text-center uppercase tracking-wider text-sm font-semibold">
                  <th className="py-3 px-4 border border-gray-300">S.No</th>
                  <th className="py-3 px-4 border border-gray-300">
                    Leave Type
                  </th>
                  <th className="py-3 px-4 border border-gray-300">
                    Start Date
                  </th>
                  <th className="py-3 px-4 border border-gray-300">End Date</th>
                  <th className="py-3 px-4 border border-gray-300">Status</th>
                  <th className="py-3 px-4 border border-gray-300">Days</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDetails.length > 0 ? (
                  paginatedDetails.map((detail, index) => (
                    <tr
                      key={detail.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300 text-center">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 border border-gray-300 text-center">
                        {detail.leaveType}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300 text-center">
                        {new Date(detail.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300 text-center">
                        {new Date(detail.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 border border-gray-300 text-center">
                        <span
                          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                            detail.status === "Approved"
                              ? "text-green-600"
                              : detail.status === "Rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {detail.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 border border-gray-300 text-center">
                        {detail.totalDays}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-4 px-4 text-sm text-gray-700 border border-gray-300 text-center"
                      colSpan={6}
                    >
                      No leave details found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Show:</span>
              <select
                className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                {[2, 5, 10].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <button
                className={`px-4 py-2 rounded-full text-sm ${
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
                className={`px-4 py-2 rounded-full text-sm ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-600"
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

export default LeavesAvailable;
