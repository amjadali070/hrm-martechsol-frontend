import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaFilter } from 'react-icons/fa';

interface LeaveDetail {
  date: string;
  status: string;
  days: number;
}

interface LeaveRecord {
  type: string;
  used: number;
  total: number;
  details: LeaveDetail[];
}

const AvailableLeaves: React.FC = () => {
  const [leaveData] = useState<LeaveRecord[]>([
    {
      type: 'Sick Leave',
      used: 4,
      total: 8,
      details: [
        { date: '2024-01-03', status: 'Approved', days: 2 },
        { date: '2024-01-15', status: 'Approved', days: 2 },
      ],
    },
    {
      type: 'Casual Leave',
      used: 8,
      total: 10,
      details: [
        { date: '2024-01-05', status: 'Approved', days: 4 },
        { date: '2024-01-20', status: 'Approved', days: 4 },
      ],
    },
    {
      type: 'Annual Leave',
      used: 14,
      total: 14,
      details: [
        { date: '2024-01-10', status: 'Approved', days: 7 },
        { date: '2024-01-18', status: 'Approved', days: 7 },
      ],
    },
  ]);

  const leaveDetails: { type: string; date: string; status: string; days: number }[] =
    leaveData.flatMap((record) =>
      record.details.map((detail) => ({
        type: record.type,
        date: detail.date,
        status: detail.status,
        days: detail.days,
      }))
    );

  const [selectedLeaveType, setSelectedLeaveType] = useState<string>('All');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [filteredDetails, setFilteredDetails] = useState<
    { type: string; date: string; status: string; days: number }[]
  >([]);

  useEffect(() => {
    let data = [...leaveDetails];

    if (selectedLeaveType !== 'All') {
      data = data.filter((detail) => detail.type === selectedLeaveType);
    }

    if (selectedStatus !== 'All') {
      data = data.filter((detail) => detail.status === selectedStatus);
    }

    if (fromDate) {
      const from = new Date(fromDate);
      data = data.filter((detail) => new Date(detail.date) >= from);
    }
    if (toDate) {
      const to = new Date(toDate);
      data = data.filter((detail) => new Date(detail.date) <= to);
    }

    setFilteredDetails(data);
    setCurrentPage(1);
  }, [selectedLeaveType, selectedStatus, fromDate, toDate, leaveDetails]);

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

  const statusColors: Record<string, string> = {
    Approved: 'bg-green-200',
    Rejected: 'bg-red-200',
    Pending: 'bg-yellow-200',
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-black">
        Available Leaves
      </h2>

      <div className="overflow-x-auto mb-8">
        <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
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
            {leaveData.map((leave) => (
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

      <h4 className="text-2xl font-bold text-black mb-4">Used Leave Details</h4>
      <div className="grid gap-4 mb-3 sm:grid-cols-1 md:grid-cols-4">
        <div className="flex items-center bg-white rounded-lg  px-3 py-2 shadow-sm border border-gray-300">
          <FaFilter className="text-gray-400 mr-3" />
          <select
            value={selectedLeaveType}
            onChange={(e) => setSelectedLeaveType(e.target.value)}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="All">All Leave Types</option>
            {leaveData.map((leave) => (
              <option key={leave.type} value={leave.type}>
                {leave.type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-300">
          <FaCalendarAlt className="text-gray-400 mr-3" />
          <input
            type="text"
            value={fromDate ? new Date(fromDate).toLocaleDateString() : "FROM"}
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
                e.target.value = new Date(e.target.value).toLocaleDateString();
              }
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-300">
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
                e.target.value = new Date(e.target.value).toLocaleDateString();
              }
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-300">
          <FaFilter className="text-gray-400 mr-3" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="All">All Statuses</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md mb-6">
        <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr>
              <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                S.No
              </th>
              <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                Leave Type
              </th>
              <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                Date
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
                <tr key={`${detail.type}-${detail.date}`} className="hover:bg-gray-50">
                  <td className="text-sm text-gray-700 px-4 py-2 border border-gray-300 text-center">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 text-center">
                    {detail.type}
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-2 border border-gray-300 text-center">
                    {new Date(detail.date).toLocaleDateString()}
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-2 border border-gray-300 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        detail.status === 'Approved'
                          ? 'text-green-600'
                          : detail.status === 'Rejected'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {detail.status}
                    </span>
                  </td>
                  <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 text-center">
                    {detail.days}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="py-4 px-4 text-sm text-gray-700 border border-gray-300 text-center"
                  colSpan={5}
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
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-black hover:bg-gray-300'
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
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-600'
            }`}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailableLeaves;