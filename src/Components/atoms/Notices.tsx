import React, { useState } from 'react';
import { IoIosCloseCircle } from "react-icons/io";

const Notices: React.FC = () => {
  const [notices, setNotices] = useState([
    {
      id: 1,
      date: '2024-11-15',
      subject: 'Annual Holiday Announcement',
      status: 'Read',
      paragraph: 'The office will remain closed on the 25th of December for the annual holiday.',
    },
    {
      id: 2,
      date: '2024-11-10',
      subject: 'Policy Update Notification',
      status: 'Unread',
      paragraph: 'Please review the updated company policies available in the HR portal.',
    },
    {
      id: 3,
      date: '2024-11-05',
      subject: 'Team Meeting Schedule',
      status: 'Read',
      paragraph: 'The team meeting is scheduled for Monday at 10 AM in the main conference room.',
    },
    {
      id: 4,
      date: '2024-11-01',
      subject: 'New Project Launch Details',
      status: 'Unread',
      paragraph: 'The new project launch details are now available in the project management tool.',
    },
  ]);

  const [filteredStatus, setFilteredStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const filteredNotices =
    filteredStatus === 'All'
      ? notices
      : notices.filter((notice) => notice.status.toLowerCase() === filteredStatus.toLowerCase());

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const openNotice = (notice: any) => {
    setSelectedNotice(notice);
    setNotices((prev) =>
      prev.map((n) =>
        n.id === notice.id ? { ...n, status: 'Read' } : n
      )
    );
  };

  const closeModal = () => {
    setSelectedNotice(null);
  };

  const tableClass =
    'w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md mb-6';
  const thClass =
    'bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center';
  const tdClass =
    'text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center';

  return (
    <div className="w-full p-6 bg-white rounded-lg mb-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mt-2 mb-3 text-black">
        Notices
      </h2>

      <div className="flex justify-between items-center mb-4 mt-1">
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
            <option value="Read">Read</option>
            <option value="Unread">Unread</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr>
              <th className={thClass}>S.No</th>
              <th className={thClass}>Date</th>
              <th className={thClass}>Subject</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedNotices.map((notice, index) => (
              <tr key={notice.id}>
                <td className={tdClass}>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td className={tdClass}>{notice.date}</td>
                <td
                  className={`text-sm px-4 py-2 border border-gray-300 whitespace-nowrap text-center text-blue-600 cursor-pointer hover:underline`}
                  onClick={() => openNotice(notice)}
                >
                  {notice.subject}
                </td>
                <td
                  className={`${tdClass} ${
                    notice.status === 'Read' ? 'text-green-600' : 'text-blue-600 font-semibold'
                  }`}
                >
                  {notice.status}
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

      {selectedNotice && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-blue-600 hover:text-blue-500"
            >
              <IoIosCloseCircle size={28}/>
            </button>
            <p className="text-xl font-bold text-purple-900 mb-4">
              {selectedNotice.subject}
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Date:</strong> {selectedNotice.date}
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Message:</strong> {selectedNotice.paragraph}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;