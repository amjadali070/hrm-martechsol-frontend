import React, { useState } from 'react';

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

const AavailableLeaves: React.FC = () => {
  const [leaveData, setLeaveData] = useState<LeaveRecord[]>([
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
    {
      type: 'Other Leave',
      used: 2,
      total: 5,
      details: [
        { date: '2024-02-01', status: 'Pending', days: 1 },
        { date: '2024-02-05', status: 'Approved', days: 1 },
      ],
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(2);

  // Pagination logic
  const totalPages = Math.ceil(leaveData.length / rowsPerPage);
  const paginatedData = leaveData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const tableClass =
  'w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md mb-6';
  const thClass =
    'bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center';
  const tdClass =
    'text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center';
  const firstRow =
    'text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap';

  return (
    <div className="w-full p-6 bg-white rounded-lg mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-black">
        Available Leaves
      </h2>
      
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <thead>
            <tr>
              <th className='bg-purple-900 text-white text-sm font-semibold text-left px-4 py-2 border border-gray-300'>Leave Type</th>
              <th className={thClass}>Total</th>
              <th className={thClass}>Used</th>
              <th className={thClass}>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.map((leave) => (
              <tr key={leave.type}>
                <td className={firstRow}>{leave.type}</td>
                <td className={tdClass}>{leave.total}</td>
                <td className={tdClass}>{leave.used}</td>
                <td
                  className={tdClass}
                >
                  {leave.total - leave.used}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className="text-lg font-bold text-black mb-4">Leave Details</h4>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md mb-6">
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <thead>
            <tr>
              <th className="bg-purple-900 text-white text-sm font-semibold text-left px-4 py-2 border border-gray-300">
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
            {paginatedData.map((leave) => (
              <tr key={leave.type}>
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

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Show:</span>
          <select
            className="text-sm border border-gray-300 rounded-md p-0.5"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
          >
            {[5, 10, 20].map((option) => (
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
              currentPage === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-600'
            }`}
            disabled={currentPage === totalPages}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AavailableLeaves;