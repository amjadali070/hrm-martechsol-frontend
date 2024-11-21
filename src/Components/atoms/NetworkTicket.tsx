import React, { useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Ticket {
  id: number;
  date: string;
  from: string;
  subject: string;
  status: string;
}

const NetworkTicket: React.FC = () => {
  const [formData, setFormData] = useState({
    deptTo: '',
    subject: '',
    message: '',
  });

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 1, date: '2024-11-01', from: 'John Doe', subject: 'Issue with login', status: 'Open' },
    { id: 2, date: '2024-11-02', from: 'Jane Smith', subject: 'Request for password reset', status: 'Closed' },
    { id: 3, date: '2024-11-03', from: 'Alice Johnson', subject: 'System not responding', status: 'Open' },
    { id: 4, date: '2024-11-04', from: 'Bob Brown', subject: 'Bug in the dashboard', status: 'Closed' },
  ]);

  const [filteredStatus, setFilteredStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const departments = ['IT Support', 'Network Operations', 'Infrastructure Team', 'Security Team'];

  // Derived filtered tickets
  const filteredTickets =
    filteredStatus === 'All'
      ? tickets
      : tickets.filter((ticket) => ticket.status === filteredStatus);

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMessageChange = (value: string) => {
    setFormData({ ...formData, message: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add new ticket to the list (mocking backend behavior)
    const newTicket: Ticket = {
      id: tickets.length + 1,
      date: new Date().toISOString().split('T')[0],
      from: 'You',
      subject: formData.subject,
      status: 'Open',
    };
    setTickets([newTicket, ...tickets]);
    setFormData({ deptTo: '', subject: '', message: '' });
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-black">Submit Network Ticket</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="deptTo" className="block text-sm font-medium text-gray-700 mb-2">
            Department To
          </label>
          <select
            id="deptTo"
            name="deptTo"
            value={formData.deptTo}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter the subject"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <ReactQuill
            value={formData.message}
            onChange={handleMessageChange}
            theme="snow"
            placeholder="Write your message here..."
            className="bg-white rounded-md"
            style={{ height: '200px' }}
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-600 transition-all w-auto font-semibold mt-12"
        >
          Submit
        </button>
      </form>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-black">Ticket Status</h2>
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
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {paginatedTickets.length > 0 ? (
          <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
            <colgroup>
                <col style={{ width: '5%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '30%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
            </colgroup>
            <thead>
              <tr>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">S.No</th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">Date</th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">From</th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">Subject</th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">Status</th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map((ticket, index) => (
                <tr key={ticket.id}>
                  <td className="text-sm text-gray-800 px-4 py-2 border text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td className="text-sm text-gray-800 px-4 py-2 border text-center">{ticket.date}</td>
                  <td className="text-sm text-gray-800 px-4 py-2 border text-center">{ticket.from}</td>
                  <td className="text-sm text-gray-800 px-4 py-2 border text-center">{ticket.subject}</td>
                  <td
                    className={`text-sm px-4 py-2 border text-center ${
                      ticket.status === 'Open' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {ticket.status}
                  </td>
                  <td
                    className="text-sm px-4 py-2 border text-blue-600 cursor-pointer hover:underline text-center"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No tickets available</p>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Show:</span>
          <select
            className="text-sm border border-gray-300 rounded-md"
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
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={currentPage === totalPages}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg relative">
          <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-blue-600 hover:text-blue-500 transition duration-200"
            >
              <IoCloseCircle size={28} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-purple-900">Ticket Details</h3>
            <p>
              <strong>Date:</strong> {selectedTicket.date}
            </p>
            <p>
              <strong>From:</strong> {selectedTicket.from}
            </p>
            <p>
              <strong>Subject:</strong> {selectedTicket.subject}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={selectedTicket.status === 'Open' ? 'text-green-600' : 'text-red-600'}
              >
                {selectedTicket.status}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkTicket;