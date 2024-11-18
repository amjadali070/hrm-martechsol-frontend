import React from 'react';

interface AttendanceRecord {
  date: string;
  timeIn: string;
  timeOut: string;
  totalTime: string;
  status: string;
}

interface AttendanceOverviewProps {
  attendanceRecords: AttendanceRecord[];
  onViewAll: () => void;
}

const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({ attendanceRecords, onViewAll }) => {
  return (
    <section className="flex flex-col w-6/12">
      <div className="flex flex-col p-6 mx-auto w-full bg-white rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl sm:text-2xl font-bold text-black">Attendance Overview</h2>
          <button
            onClick={onViewAll}
            className="mt-4 sm:mt-0 px-6 py-2 text-sm sm:text-base text-center text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors duration-300"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Time In
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Time Out
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Total Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((record, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-100 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.timeIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.timeOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.totalTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
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
      </div>
    </section>
  );
};

export default AttendanceOverview;