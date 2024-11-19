import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface LeaveApplication {
  id: string;
  leaveType: string;
  from: string;
  to: string;
  lastDayAtWork: string;
  returnToWork: string;
  totalDays: number;
  reason: string;
  reliefOfficer: string;
  comments: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const TrackApplication: React.FC = () => {

  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const dummyData: LeaveApplication[] = [
    // Data for 2023
    {
      id: '1',
      leaveType: 'Annual Leave',
      from: '2023-01-10',
      to: '2023-01-15',
      lastDayAtWork: '2023-01-09',
      returnToWork: '2023-01-16',
      totalDays: 6,
      reason: 'Family trip.',
      reliefOfficer: 'Officer A',
      comments: 'Approved for annual leave.',
      status: 'Approved',
    },
    {
      id: '2',
      leaveType: 'Sick Leave',
      from: '2023-02-05',
      to: '2023-02-07',
      lastDayAtWork: '2023-02-04',
      returnToWork: '2023-02-08',
      totalDays: 3,
      reason: 'Flu symptoms.',
      reliefOfficer: 'Officer B',
      comments: null,
      status: 'Approved',
    },
    {
      id: '3',
      leaveType: 'Casual Leave',
      from: '2023-03-12',
      to: '2023-03-13',
      lastDayAtWork: '2023-03-11',
      returnToWork: '2023-03-14',
      totalDays: 2,
      reason: 'Personal commitments.',
      reliefOfficer: 'Officer C',
      comments: 'Short leave approved.',
      status: 'Approved',
    },
    {
      id: '4',
      leaveType: 'Annual Leave',
      from: '2023-04-15',
      to: '2023-04-20',
      lastDayAtWork: '2023-04-14',
      returnToWork: '2023-04-21',
      totalDays: 6,
      reason: 'Vacation.',
      reliefOfficer: 'Officer D',
      comments: null,
      status: 'Pending',
    },
    {
      id: '5',
      leaveType: 'Sick Leave',
      from: '2023-05-03',
      to: '2023-05-06',
      lastDayAtWork: '2023-05-02',
      returnToWork: '2023-05-07',
      totalDays: 4,
      reason: 'Medical rest.',
      reliefOfficer: 'Officer E',
      comments: 'Get well soon.',
      status: 'Approved',
    },
    {
      id: '6',
      leaveType: 'Casual Leave',
      from: '2023-06-18',
      to: '2023-06-20',
      lastDayAtWork: '2023-06-17',
      returnToWork: '2023-06-21',
      totalDays: 3,
      reason: 'Travel for personal reasons.',
      reliefOfficer: 'Officer F',
      comments: 'Limited leave balance.',
      status: 'Rejected',
    },
    {
      id: '7',
      leaveType: 'Annual Leave',
      from: '2023-07-25',
      to: '2023-07-30',
      lastDayAtWork: '2023-07-24',
      returnToWork: '2023-07-31',
      totalDays: 6,
      reason: 'Family event.',
      reliefOfficer: 'Officer G',
      comments: null,
      status: 'Approved',
    },
    {
      id: '8',
      leaveType: 'Sick Leave',
      from: '2023-08-10',
      to: '2023-08-12',
      lastDayAtWork: '2023-08-09',
      returnToWork: '2023-08-13',
      totalDays: 3,
      reason: 'Health checkup.',
      reliefOfficer: 'Officer H',
      comments: 'Doctor’s note required.',
      status: 'Pending',
    },
    {
      id: '9',
      leaveType: 'Casual Leave',
      from: '2023-09-05',
      to: '2023-09-07',
      lastDayAtWork: '2023-09-04',
      returnToWork: '2023-09-08',
      totalDays: 3,
      reason: 'Family emergency.',
      reliefOfficer: 'Officer I',
      comments: null,
      status: 'Approved',
    },
    {
      id: '10',
      leaveType: 'Annual Leave',
      from: '2023-10-12',
      to: '2023-10-18',
      lastDayAtWork: '2023-10-11',
      returnToWork: '2023-10-19',
      totalDays: 7,
      reason: 'Overseas travel.',
      reliefOfficer: 'Officer J',
      comments: 'Enjoy your time off.',
      status: 'Approved',
    },
    {
      id: '11',
      leaveType: 'Sick Leave',
      from: '2023-11-20',
      to: '2023-11-21',
      lastDayAtWork: '2023-11-19',
      returnToWork: '2023-11-22',
      totalDays: 2,
      reason: 'Fever and cold.',
      reliefOfficer: 'Officer K',
      comments: 'Take care.',
      status: 'Approved',
    },
    {
      id: '12',
      leaveType: 'Casual Leave',
      from: '2023-12-27',
      to: '2023-12-29',
      lastDayAtWork: '2023-12-26',
      returnToWork: '2023-12-30',
      totalDays: 3,
      reason: 'Year-end celebrations.',
      reliefOfficer: 'Officer L',
      comments: null,
      status: 'Approved',
    },
  
    // Data for 2024 (Retaining initial entries and adding more)
    {
      id: '13',
      leaveType: 'Annual Leave',
      from: '2024-01-14',
      to: '2024-01-18',
      lastDayAtWork: '2024-01-13',
      returnToWork: '2024-01-19',
      totalDays: 5,
      reason: 'Family function.',
      reliefOfficer: 'Officer M',
      comments: 'Approved leave.',
      status: 'Approved',
    },
    {
      id: '14',
      leaveType: 'Sick Leave',
      from: '2024-02-23',
      to: '2024-02-25',
      lastDayAtWork: '2024-02-22',
      returnToWork: '2024-02-26',
      totalDays: 3,
      reason: 'Dental surgery recovery.',
      reliefOfficer: 'Officer N',
      comments: 'Pending approval.',
      status: 'Pending',
    },
    {
      id: '15',
      leaveType: 'Casual Leave',
      from: '2024-03-03',
      to: '2024-03-04',
      lastDayAtWork: '2024-03-02',
      returnToWork: '2024-03-05',
      totalDays: 2,
      reason: 'Personal reasons.',
      reliefOfficer: 'Officer O',
      comments: 'Short leave granted.',
      status: 'Approved',
    },
    {
      id: '16',
      leaveType: 'Annual Leave',
      from: '2024-04-09',
      to: '2024-04-12',
      lastDayAtWork: '2024-04-08',
      returnToWork: '2024-04-13',
      totalDays: 4,
      reason: 'Family gathering.',
      reliefOfficer: 'Officer P',
      comments: 'Enjoy!',
      status: 'Approved',
    },
    {
      id: '17',
      leaveType: 'Casual Leave',
      from: '2024-05-15',
      to: '2024-05-16',
      lastDayAtWork: '2024-05-14',
      returnToWork: '2024-05-17',
      totalDays: 2,
      reason: 'Urgent home repairs.',
      reliefOfficer: 'Officer Q',
      comments: null,
      status: 'Rejected',
    },
  ];

  useEffect(() => {
    const fetchDummyData = async () => {
      setLoading(true);
      setError('');
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setApplications(dummyData);
      } catch (err: any) {
        console.error('Error fetching dummy applications:', err);
        setError('Failed to load leave applications. Please try again.');
        toast.error('Failed to load leave applications. Please try again.', {
          position: 'top-center',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDummyData();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      filterStatus === 'All' ? true : app.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      app.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reliefOfficer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMonth =
      selectedMonth === 'All'
        ? true
        : new Date(app.from).getMonth() + 1 === parseInt(selectedMonth);

    const matchesDateFrom = dateFrom
      ? new Date(app.from) >= new Date(dateFrom)
      : true;
    const matchesDateTo = dateTo
      ? new Date(app.to) <= new Date(dateTo)
      : true;

    return matchesStatus && matchesSearch && matchesMonth && matchesDateFrom && matchesDateTo;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg mt-1 mb-1">
      <h2 className="text-3xl font-bold text-center mb-6 text-purple-900">Track Leave Applications</h2>

      <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">

        <div className="flex items-center space-x-2">
          <label htmlFor="filterStatus" className="text-gray-700 font-medium">
            Filter by Status:
          </label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="searchTerm" className="text-gray-700 font-medium">
            Search:
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Leave Type"
            className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="selectedMonth" className="text-gray-700 font-medium">
            Filter by Month:
          </label>
          <select
            id="selectedMonth"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setCurrentPage(1);
            }}
            className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="dateFrom" className="text-gray-700 font-medium">
            From:
          </label>
          <input
            type="date"
            id="dateFrom"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <label htmlFor="dateTo" className="text-gray-700 font-medium">
            To:
          </label>
          <input
            type="date"
            id="dateTo"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-purple-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span className="ml-3 text-purple-600 font-semibold">Loading...</span>
        </div>
      )}

      {error && (
        <div className="text-red-600 text-center mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          {filteredApplications.length > 0 ? (
            <>
              <table className="min-w-full bg-white table-fixed border-collapse">
                <thead>
                  <tr>
                    <th className="py-2 px-2 bg-purple-900 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      Leave Type
                    </th>
                    <th className="py-2 px-2 bg-purple-900 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      From
                    </th>
                    <th className="py-2 px-2 bg-purple-900 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      To
                    </th>
                    <th className="py-2 px-2 bg-purple-900 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-200 truncate">
                      Last Day at Work
                    </th>
                    <th className="py-2 px-2 bg-purple-900 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-200 truncate">
                      Return to Work
                    </th>
                    <th className="py-2 px-2 bg-purple-900  text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-200 truncate">
                      Total Days
                    </th>
                    <th className="py-2 px-2 bg-purple-900  text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      Reason
                    </th>
                    <th className="py-2 px-2 bg-purple-900  text-left text-xs font-medium text-white uppercase tracking-wide border border-gray-200 truncate">
                      Relief Officer
                    </th>
                    <th className="py-2 px-2 bg-purple-900  text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      Comments
                    </th>
                    <th className="py-2 px-2 bg-purple-900  text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentApplications.map((app, index) => (
                    <tr key={app.id} className={`hover:bg-gray-50 bg-white`}>
                      <td className="py-2 px-2 text-sm text-gray-700 truncate border border-gray-200">
                        {app.leaveType}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 truncate border border-gray-200">
                        {app.from}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 truncate border border-gray-200">
                        {app.to}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 truncate border border-gray-200">
                        {app.lastDayAtWork}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 truncate border border-gray-200">
                        {app.returnToWork}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200">
                        {app.totalDays}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200">
                        {app.reason}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 truncate border border-gray-200">
                        {app.reliefOfficer}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200">
                        {app.comments ? app.comments : 'N/A'}
                      </td>
                      <td className="py-2 px-2 text-sm border border-gray-200">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            app.status === 'Approved'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                          aria-label={`Status: ${app.status}`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end items-center mt-4 space-x-4">
                
              <div className="flex items-center space-x-2 mb-2 mt-2">
                <label htmlFor="itemsPerPage" className="text-gray-700 font-medium">
                    Show:
                </label>
                <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                    }}
                    className="p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                </select>
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                  aria-label="Previous Page"
                >
                  Previous
                </button>

                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === number
                          ? 'bg-purple-700 text-white'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                      aria-label={`Go to page ${number}`}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                  aria-label="Next Page"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">No leave applications found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackApplication;