import React, { useState } from 'react';

const AttendanceTicket: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState([
    {
      id: 1,
      date: '6/28/2024',
      timeIn: '12:00 PM',
      timeOut: '8:30 PM',
      totalTime: '08:30:00',
      comments: 'I forgot to clock in.',
      file: 'No File',
      managerStatus: 'Approved',
    },
    {
      id: 2,
      date: '6/15/2024',
      timeIn: '12:00 PM',
      timeOut: '8:30 PM',
      totalTime: '08:30:00',
      comments: 'I forgot to clock out.',
      file: 'No File',
      managerStatus: 'Pending',
    },
    {
      id: 3,
      date: '6/10/2024',
      timeIn: '12:00 PM',
      timeOut: '8:30 PM',
      totalTime: '08:30:00',
      comments: 'Missed clock-in time.',
      file: 'No File',
      managerStatus: 'Rejected',
    },
  ]);

  const [filteredStatus, setFilteredStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const filteredAttendanceList =
    filteredStatus === 'All'
      ? attendanceList
      : attendanceList.filter((record) => record.managerStatus === filteredStatus);

  const totalPages = Math.ceil(filteredAttendanceList.length / itemsPerPage);
  const paginatedList = filteredAttendanceList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tableClass =
    'w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md shadow-sm mb-6';
  const thClass =
    'bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center';
  const tdClass =
    'text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mt-2 mb-3 text-black">
        Submit New Attendance Ticket
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Date</label>
          <input
            type="date"
            name="date"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Work From Home</label>
          <select
            name="workFromHome"
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Select Option --</option>
            <option value="Half Day">Half Day</option>
            <option value="Full Day">Full Day</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time In</label>
          <input
            type="time"
            name="timeIn"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time Out</label>
          <input
            type="time"
            name="timeOut"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Comments</label>
        <textarea
          name="comments"
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select File</label>
        <input type="file" className="w-full p-2 border border-gray-300 rounded-md" />
      </div>
      <button className="px-6 py-2 bg-purple-700 text-white rounded-md shadow-md hover:bg-purple-800 transition-all">
        Submit
      </button>

      <div className="flex justify-between items-center mb-4 mt-6">
        <h2 className="text-lg md:text-xl font-bold text-black">List</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="status" className="text-sm font-medium text-gray-700">
            Filter by Status:
          </label>
          <select
            id="status"
            value={filteredStatus}
            onChange={(e) => {
              setFilteredStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="p-1 border border-gray-300 rounded-md"
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>S.No</th>
              <th className={thClass}>Date</th>
              <th className={thClass}>Time In</th>
              <th className={thClass}>Time Out</th>
              <th className={thClass}>Total Time</th>
              <th className={thClass}>Comments</th>
              <th className={thClass}>File</th>
              <th className={thClass}>Manager Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.map((record, index) => (
              <tr key={record.id}>
                <td className={tdClass}>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td className={tdClass}>{record.date}</td>
                <td className={tdClass}>{record.timeIn}</td>
                <td className={tdClass}>{record.timeOut}</td>
                <td className={tdClass}>{record.totalTime}</td>
                <td className={`${tdClass} text-blue-600 cursor-pointer`}>
                  {record.comments}
                </td>
                <td className={tdClass}>{record.file}</td>
                <td
                  className={`${tdClass} ${
                    record.managerStatus === 'Approved'
                      ? 'text-green-600'
                      : record.managerStatus === 'Pending'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {record.managerStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1 ? 'bg-gray-300' : 'bg-gray-500 text-white'
            }`}
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTicket;