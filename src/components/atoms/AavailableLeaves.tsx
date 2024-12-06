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

const AvailableLeaves: React.FC = () => {
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
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchLeaveData = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await axios.get(
          `${backendUrl}/api/leave-applications`,
          {
            withCredentials: true,
          }
        );
        const approvedLeaves = response.data.filter(
          (leave: LeaveDetail) => leave.status === "Approved"
        );

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
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchLeaveData();
  }, []);

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
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-black">
        Available Leaves
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20 mb-20">
          <FaSpinner
            size={30}
            className="animate-spin text-blue-600 mb-2"
            aria-hidden="true"
          />
          <h1 className="text-xl font-semibold text-black">Loading Data...</h1>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
              <thead>
                <tr>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-left">
                    Leave Type
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    Total
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    Used
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    Remaining
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaveBalances.map((leave) => (
                  <tr key={leave.type} className="hover:bg-gray-50">
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap">
                      {leave.type}
                    </td>
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 text-center">
                      {leave.total}
                    </td>
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 text-center">
                      {leave.used}
                    </td>
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 text-center">
                      {leave.total - leave.used}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-left mb-2 text-black">
            Used Leaves Details
          </h2>

          <div className="flex gap-4 mb-4 flex-nowrap overflow-x-auto">
            <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-300 flex-grow">
              <FaFilter className="text-gray-400 mr-3" />
              <select
                value={selectedLeaveType}
                onChange={(e) => setSelectedLeaveType(e.target.value)}
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
            <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-300 flex-grow">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <input
                type="text"
                value={
                  fromDate ? new Date(fromDate).toLocaleDateString() : "FROM"
                }
                onFocus={(e) => {
                  e.target.type = "date";
                  e.target.showPicker();
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = "text";
                    e.target.value = "FROM";
                  }
                }}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  if (e.target.value) {
                    e.target.type = "text";
                    e.target.value = new Date(
                      e.target.value
                    ).toLocaleDateString();
                  }
                }}
                className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
              />
            </div>

            {/* To Date Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-300 flex-grow">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <input
                type="text"
                value={toDate ? new Date(toDate).toLocaleDateString() : "TO"}
                onFocus={(e) => {
                  e.target.type = "date";
                  e.target.showPicker();
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = "text";
                    e.target.value = "TO";
                  }
                }}
                onChange={(e) => {
                  setToDate(e.target.value);
                  if (e.target.value) {
                    e.target.type = "text";
                    e.target.value = new Date(
                      e.target.value
                    ).toLocaleDateString();
                  }
                }}
                className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Leave Details Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md mb-6">
              <thead>
                <tr>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    S.No
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    Leave Type
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    Start Date
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    End Date
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    Status
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    Days
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedDetails.length > 0 ? (
                  paginatedDetails.map((detail, index) => (
                    <tr key={detail.id} className="hover:bg-gray-50">
                      <td className="text-sm text-gray-700 px-4 py-2 border border-gray-300 text-center">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 text-center">
                        {detail.leaveType}
                      </td>
                      <td className="text-sm text-gray-700 px-4 py-2 border border-gray-300 text-center">
                        {new Date(detail.startDate).toLocaleDateString()}
                      </td>
                      <td className="text-sm text-gray-700 px-4 py-2 border border-gray-300 text-center">
                        {new Date(detail.endDate).toLocaleDateString()}
                      </td>
                      <td className="text-sm text-gray-700 px-4 py-2 border border-gray-300 text-center">
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
                      <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 text-center">
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

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Show:</span>
              <select
                className="text-sm border border-gray-300 rounded-md p-0.5"
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

export default AvailableLeaves;
