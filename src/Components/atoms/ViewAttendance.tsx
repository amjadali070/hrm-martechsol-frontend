import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaFilter } from 'react-icons/fa';
import axios from 'axios';

const statusColors: Record<string, string> = {
  'Late IN': 'bg-yellow-400',
  'Half Day': 'bg-orange-400',
  'Early Out': 'bg-pink-400',
  'Late In and Early Out': 'bg-red-400',
  'Absent': 'bg-gray-400',
  'Casual leave': 'bg-blue-400',
  'Sick leave': 'bg-green-400',
  'Annual Leave': 'bg-purple-400',
};

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
    | 'Annual Leave';
}

const parseTime = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatMinutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const determineAttendanceStatus = (
  timeIn: string, 
  timeOut: string, 
  leaveType?: 'Casual leave' | 'Sick leave' | 'Annual Leave'
): Attendance['status'] => {
  if (leaveType) return leaveType;

  if (!timeIn || !timeOut) return 'Absent';

  const timeInMinutes = parseTime(timeIn);
  const timeOutMinutes = parseTime(timeOut);
  const totalDurationMinutes = timeOutMinutes - timeInMinutes;

  const lateInThreshold = parseTime('18:15');
  const isLateIn = timeInMinutes > lateInThreshold;

  const minDurationThreshold = 6 * 60;
  const maxHalfDayThreshold = 7 * 60;
  const isEarlyOut = totalDurationMinutes < minDurationThreshold;

  if (isLateIn && isEarlyOut) return 'Late In and Early Out';
  if (isLateIn) return 'Late IN';
  if (isEarlyOut) return 'Early Out';
  if (totalDurationMinutes >= minDurationThreshold && totalDurationMinutes < maxHalfDayThreshold) return 'Half Day';

  return 'Absent';
};

const ViewAttendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [filteredData, setFilteredData] = useState<Attendance[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/time-log/attendance`, {
          withCredentials: true,
          params: { startDate: fromDate, endDate: toDate, status: statusFilter },
        });

        const processedData = data.map((record: Omit<Attendance, 'status'> & { leaveType?: 'Casual leave' | 'Sick leave' | 'Annual Leave' }) => ({
          ...record,
          status: determineAttendanceStatus(
            record.timeIn, 
            record.timeOut, 
            record.leaveType
          )
        }));

        setAttendanceData(processedData);
        setFilteredData(processedData);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };
    
    fetchAttendance();
  }, [fromDate, toDate]);

  useEffect(() => {
    let data = [...attendanceData];

    if (fromDate && toDate) {
      data = data.filter(
        (record) =>
          new Date(record.date) >= new Date(fromDate) &&
          new Date(record.date) <= new Date(toDate)
      );
    }

    if (statusFilter !== 'All') {
      data = data.filter((record) => record.status === statusFilter);
    }

    setFilteredData(data);
  }, [fromDate, toDate, statusFilter, attendanceData]);

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

      <div className="grid gap-4 mb-3 sm:grid-cols-1 md:grid-cols-3">

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
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="All">All Status</option>
            {Object.keys(statusColors).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
        <colgroup>
            <col style={{ width: '3%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr>
              <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                S.No
              </th>
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
            {currentData.length > 0 ? (
              currentData.map((record, index) => (
                <tr 
                  key={record.id} 
                  className={`hover:bg-gray-50 ${record.status === 'Absent' ?  'hover:bg-red-200 bg-red-200' : ''}`}
                >
                  <td className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${record.status === 'Absent' ? 'text-black' : ''}`}>
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${record.status === 'Absent' ? 'text-black' : ''}`}>
                    {record.date}
                  </td>
                  <td className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${record.status === 'Absent' ? 'text-black' : ''}`}>
                    {record.timeIn || 'N/A'}
                  </td>
                  <td className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${record.status === 'Absent' ? 'text-black' : ''}`}>
                    {record.timeOut || 'N/A'}
                  </td>
                  <td className={`py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center ${record.status === 'Absent' ? 'text-black' : ''}`}>
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
              ))
            ) : (
              <tr>
                <td
                  className="py-4 px-2 text-sm text-gray-700 border border-gray-200 text-center"
                  colSpan={6}
                >
                  No records found.
                </td>
              </tr>
            )}
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
