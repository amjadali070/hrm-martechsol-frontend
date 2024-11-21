import React, { useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Ticket {
  id: number;
  date: string;
  issueType: string;
  subject: string;
  status: 'Open' | 'Closed';
}

const AdminTicket: React.FC = () => {
  const [formData, setFormData] = useState({
    issueType: '',
    subject: '',
    details: '',
  });

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 1, date: '2024-11-01', issueType: 'System Access Request', subject: 'Request for admin access', status: 'Open' },
    { id: 2, date: '2024-11-02', issueType: 'Hardware Issue', subject: 'Laptop battery not working', status: 'Closed' },
    { id: 3, date: '2024-11-03', issueType: 'Software Installation', subject: 'Install MS Office', status: 'Open' },
  ]);

  const [filteredStatus, setFilteredStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const issueTypes = [
    'System Access Request',
    'Hardware Issue',
    'Software Installation',
    'Other',
  ];

  // Filter tickets by status
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

  const handleDetailsChange = (value: string) => {
    setFormData({ ...formData, details: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = {
      id: tickets.length + 1,
      date: new Date().toISOString().split('T')[0],
      issueType: formData.issueType,
      subject: formData.subject,
      status: 'Open',
    };
    setTickets([newTicket, ...tickets]);
    setFormData({ issueType: '', subject: '', details: '' });
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
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-black">Submit Admin Ticket</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">
            Issue Type
          </label>
          <select
            id="issueType"
            name="issueType"
            value={formData.issueType}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">-- Select Issue Type --</option>
            {issueTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
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
          <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
            Details
          </label>
          <ReactQuill
            value={formData.details}
            onChange={handleDetailsChange}
            theme="snow"
            placeholder="Provide detailed information about the issue..."
            className="bg-white rounded-md"
            style={{ height: '200px' }}
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all w-auto font-semibold mt-12"
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
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">Issue Type</th>
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
                  <td className="text-sm text-gray-800 px-4 py-2 border text-center">{ticket.issueType}</td>
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
              <strong>Issue Type:</strong> {selectedTicket.issueType}
            </p>
            <p>
              <strong>Subject:</strong> {selectedTicket.subject}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={selectedTicket.status === 'Open' ? 'text-green-600' : 'text-red-600'}>
                {selectedTicket.status}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTicket;
