import React, { useState, useEffect } from 'react';

interface Attendance {
  id: string;
  date: string;
  timeIn: string;
  timeOut: string;
  totalTime: string;
  status:
    | 'Late IN'
    | 'Half Day'
    | 'Early Out'
    | 'Late In and Early Out'
    | 'Absent'
    | 'Casual leave'
    | 'Sick leave'
    | 'Annual Leave'
    | 'Work from Home (Full Day)'
    | 'Work From Home (Half Day)';
}

const ViewAttendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [filteredData, setFilteredData] = useState<Attendance[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<'This Week' | 'All'>('All');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const statusColors: Record<string, string> = {
    'Late IN': 'bg-yellow-400',
    'Half Day': 'bg-orange-400',
    'Early Out': 'bg-pink-400',
    'Late In and Early Out': 'bg-red-400',
    Absent: 'bg-gray-400',
    'Casual leave': 'bg-blue-400',
    'Sick leave': 'bg-green-400',
    'Annual Leave': 'bg-purple-400',
  };

  const dummyData: Attendance[] = [
    {
      id: '1',
      date: '2024-11-19',
      timeIn: '09:30 AM',
      timeOut: '05:30 PM',
      totalTime: '8 hours',
      status: 'Late IN',
    },
    {
      id: '4',
      date: '2024-11-16',
      timeIn: '-',
      timeOut: '-',
      totalTime: '-',
      status: 'Absent',
    },
    {
      id: '2',
      date: '2024-11-18',
      timeIn: '08:30 AM',
      timeOut: '02:00 PM',
      totalTime: '5.5 hours',
      status: 'Half Day',
    },
    {
      id: '3',
      date: '2024-11-17',
      timeIn: '10:00 AM',
      timeOut: '05:00 PM',
      totalTime: '7 hours',
      status: 'Late In and Early Out',
    },
    {
      id: '5',
      date: '2024-11-15',
      timeIn: '-',
      timeOut: '-',
      totalTime: '-',
      status: 'Casual leave',
    },  
    {
      id: '6',
      date: '2024-11-14',
      timeIn: '09:30 AM',
      timeOut: '05:30 PM',
      totalTime: '8 hours',
      status: 'Early Out',
    },
  ];

  useEffect(() => {
    setAttendanceData(dummyData);
    setFilteredData(dummyData);
  }, []);

  useEffect(() => {
    let data = [...attendanceData];

    if (fromDate && toDate) {
      data = data.filter(
        (record) =>
          new Date(record.date) >= new Date(fromDate) &&
          new Date(record.date) <= new Date(toDate)
      );
    }

    if (searchTerm) {
      data = data.filter((record) =>
        record.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === 'This Week') {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      data = data.filter((record) => new Date(record.date) >= weekStart);
    }

    setFilteredData(data);
  }, [fromDate, toDate, searchTerm, filter, attendanceData]);

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

  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-lg mb-8">
      <div className="mt-6 flex justify-center mb-8">
        <div className="w-full sm:w-2/3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(statusColors).map(([status, color]) => (
              <div
                key={status}
                className="flex items-center space-x-2 bg-gray-50 p-2 border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                <span className={`w-4 h-4 inline-block rounded-full ${color}`}></span>
                <span className="text-gray-700 text-sm font-medium">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-black">View Attendance</h2>

      <div className="flex flex-wrap justify-between items-center mb-6 space-y-4 sm:space-y-0">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
        <label htmlFor="fromDate" className="text-gray-700 font-medium">
            From:
        </label>
        <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full sm:w-auto p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        </div>
        <div className="flex items-center space-x-2">
        <label htmlFor="toDate" className="text-gray-700 font-medium">
            To:
        </label>
        <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full sm:w-auto p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        </div>
      </div>

      <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2">
          <label htmlFor="search" className="text-gray-700 font-medium">
            Search:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Status"
            className="w-full sm:w-auto p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <label htmlFor="filter" className="text-gray-700 font-medium">
          Filter:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'This Week' | 'All')}
          className="w-full sm:w-auto p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="All">All</option>
          <option value="This Week">This Week</option>
        </select>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
            
        <thead>
          <tr>
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
              Total Time
            </th>
            <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                {record.date}
              </td>
              <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                {record.timeIn}
              </td>
              <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                {record.timeOut}
              </td>
              <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                {record.totalTime}
              </td>
              <td className="py-2 px-1 border border-gray-200 text-center">
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    statusColors[record.status] || 'bg-gray-400 text-gray-800'
                  }`}
                >
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center">
        <span className="text-sm text-gray-700 mr-2">Show:</span>
        <select
          className="text-sm border border-gray-300 rounded-md p-0.5"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
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

export default ViewAttendance;