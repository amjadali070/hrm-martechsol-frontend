import React from 'react';

interface AttendanceTicket {
  id: number;
  date: string;
  comments: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

interface AttendanceTicketOverviewProps {
  attendanceTickets: AttendanceTicket[];
  onViewAll: () => void;
}

const AttendanceTicketOverview: React.FC<AttendanceTicketOverviewProps> = ({ attendanceTickets, onViewAll }) => {
  return (
    <section className="flex flex-col w-full md:w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col p-6 mx-auto w-full bg-white rounded-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl sm:text-2xl font-bold text-black">Attendance Ticket Status</h2>
          <button
            onClick={onViewAll}
            className="mt-4 sm:mt-0 px-6 py-2 text-sm sm:text-base text-center text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors duration-300"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-purple-900">
              <tr>
                <th
                  scope="col"
                  className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-l-md"
                >
                  S.No
                </th>
                <th
                  scope="col"
                  className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-2 md:px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Comments
                </th>
                <th
                  scope="col"
                  className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-r-md"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceTickets.map((ticket, index) => (
                <tr key={ticket.id} className="hover:bg-gray-100">
                  <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                    {index + 1}
                  </td>
                  <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                    {ticket.date}
                  </td>
                  <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-left">
                    {ticket.comments}
                  </td>
                  <td className="px-2 md:px-4 py-2 whitespace-nowrap text-center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : ticket.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ticket.status}
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

export default AttendanceTicketOverview;