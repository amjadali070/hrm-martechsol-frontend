import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaFilter} from 'react-icons/fa';
import axios from 'axios';
import useUser from '../../hooks/useUser';

const statusColors: Record<string, string> = {
  'Present': 'bg-green-400',
  'Absent': 'bg-red-400',
  'Late IN': 'bg-yellow-400',
  'Half Day': 'bg-orange-400',
  'Early Out': 'bg-pink-400',
  'Late IN and Early Out': 'bg-red-400',
  'Casual Leave': 'bg-blue-400',
  'Sick Leave': 'bg-green-500',
  'Annual Leave': 'bg-purple-400',
  'Unapproved Absence Without Pay': 'bg-red-500',
  'Public Holiday': 'bg-gray-400'
};

interface TimeLog {
  _id: string;
  user: string;
  timeIn: string;
  timeOut: string | null;
  duration: number;
  type: 
    | 'Present'
    | 'Absent'
    | 'Late IN'
    | 'Half Day'
    | 'Early Out'
    | 'Late IN and Early Out'
    | 'Casual Leave'
    | 'Sick Leave'
    | 'Annual Leave'
    | 'Unapproved Absence Without Pay'
    | 'Public Holiday';
  createdAt: string;
  leaveApplication?: string | null;
}

const ViewAttendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<TimeLog[]>([]);
  const [filteredData, setFilteredData] = useState<TimeLog[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const user = useUser();
  const user_Id = user.user?._id;

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/time-log/${user_Id}`, {
          withCredentials: true,
          params: { 
            startDate: fromDate, 
            endDate: toDate 
          },
        });
        setAttendanceData(data);
        setFilteredData(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Detailed error:', error.response ? error.response.data : error.message);
        } else {
          console.error('Error:', error);
        }
      }
    };
     
    if (user_Id) {
      fetchAttendance();
    }
  }, [fromDate, toDate, backendUrl, user_Id]);

  useEffect(() => {
    let data = [...attendanceData];

    if (fromDate && toDate) {
      data = data.filter(
        (record) =>
          new Date(record.createdAt) >= new Date(fromDate) &&
          new Date(record.createdAt) <= new Date(toDate)
      );
    }

    if (typeFilter !== 'All') {
      data = data.filter((record) => record.type === typeFilter);
    }

    setFilteredData(data);
    setCurrentPage(1);
  }, [fromDate, toDate, typeFilter, attendanceData]);

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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getDayOfWeek = (dateString: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-lg mb-8">
      <div className="mt-6 flex justify-center mb-8">
        <div className="w-full sm:w-2/3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(statusColors).map(([type, color]) => (
              <div
                key={type}
                className="flex items-center space-x-2 bg-gray-50 p-2 border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                <span className={`w-4 h-4 inline-block rounded-full ${color}`}></span>
                <span className="text-gray-700 text-sm font-medium">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-black">View Attendance</h2>

      <div className="grid gap-4 mb-3 sm:grid-cols-1 md:grid-cols-4">

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

        {/* To Date Input */}
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
            id="typeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
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

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
           <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <thead>
            <tr>
              <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">S.No</th>
              <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">Date</th>
              <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">Day</th>
              <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">Time In</th>
              <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">Time Out</th>
              <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">Total Time</th>
              <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">Type</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((record, index) => (
                <tr 
                  key={record._id} 
                  className={`hover:bg-gray-50 ${record.type === 'Absent' ? 'hover:bg-red-200 bg-red-200' : ''}`}
                >
                  <td className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${record.type === 'Absent' ? 'text-black' : ''}`}>
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${record.type === 'Absent' ? 'text-black' : ''}`}>
                    {new Date(record.createdAt).toLocaleDateString()}
                  </td>
                  <td className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${record.type === 'Absent' ? 'text-black' : ''}`}>
                    {getDayOfWeek(record.createdAt)}
                  </td>
                  <td className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${record.type === 'Absent' ? 'text-black' : ''}`}>
                    {record.timeIn ? new Date(record.timeIn).toLocaleTimeString() : 'N/A'}
                  </td>
                  <td className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${record.type === 'Absent' ? 'text-black' : ''}`}>
                    {record.timeOut ? new Date(record.timeOut).toLocaleTimeString() : 'N/A'}
                  </td>
                  <td className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${record.type === 'Absent' ? 'text-black' : ''}`}>
                    {record.duration ? formatDuration(record.duration) : 'N/A'}
                  </td>
                  <td className="py-2 px-1 border border-gray-200 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                        statusColors[record.type] || 'bg-gray-400 text-gray-800'
                      }`}
                    >
                      {record.type}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="py-4 px-2 text-sm text-gray-700 border border-gray-200 text-center"
                  colSpan={7}
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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