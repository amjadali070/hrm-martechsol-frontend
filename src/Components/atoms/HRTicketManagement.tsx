import React, { useState } from "react";
import { FaInbox } from "react-icons/fa";

interface HRTicket {
  id: number;
  date: string;
  category: string;
  subject: string;
  status: "Pending" | "Approved" | "Rejected";
}

const HRTicketManagement: React.FC = () => {
  const [hrTickets, setHRTickets] = useState<HRTicket[]>([
    {
      id: 1,
      date: "2024-11-20",
      category: "Leave",
      subject: "Request for Sick Leave",
      status: "Pending",
    },
    {
      id: 2,
      date: "2024-11-19",
      category: "Benefits",
      subject: "Request for Insurance Policy Details",
      status: "Rejected",
    },
    {
      id: 3,
      date: "2024-11-18",
      category: "Benefits",
      subject: "Request for Pension Plan Details",
      status: "Approved",
    },
    {
      id: 4,
      date: "2024-11-17",
      category: "Leave",
      subject: "Request for Annual Leave",
      status: "Pending",
    },
  ]);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "All",
    category: "All",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredTickets = hrTickets.filter((ticket) => {
    const ticketDate = new Date(ticket.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    const withinDateRange =
      (!fromDate || ticketDate >= fromDate) && (!toDate || ticketDate <= toDate);

    const matchesStatus = filters.status === "All" || ticket.status === filters.status;
    const matchesCategory = filters.category === "All" || ticket.category === filters.category;

    return withinDateRange && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = (id: number, action: "approve" | "reject") => {
    setHRTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, status: action === "approve" ? "Approved" : "Rejected" }
          : ticket
      )
    );
  };

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 mt-4 text-center">HR Tickets Management</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <label htmlFor="fromDate" className="text-gray-700 font-medium mt-3">
          From:
        </label>
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          placeholder="From"
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg"
        />
        <label htmlFor="fromDate" className="text-gray-700 font-medium mt-3">
          To:
        </label>
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          placeholder="To"
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="All">All Categories</option>
          <option value="Leave">Leave</option>
          <option value="Benefits">Benefits</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Tickets Table */}
      <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
        <thead className="bg-purple-900">
          <tr>
            {["S.No", "Date", "Category", "Subject", "Status", "Action"].map((header) => (
              <th key={header} className="px-3 py-2 text-left text-sm font-medium text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentTickets.length > 0 ? (
            currentTickets.map((ticket, index) => (
              <tr key={ticket.id} className="hover:bg-gray-100">
                <td className="px-3 py-2 text-sm text-gray-800">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-3 py-2 text-sm text-gray-800">{ticket.date}</td>
                <td className="px-3 py-2 text-sm text-gray-800">{ticket.category}</td>
                <td className="px-3 py-2 text-sm text-gray-800">{ticket.subject}</td>
                <td className="px-3 py-2 text-sm text-gray-800">{ticket.status}</td>
                <td className="px-3 py-2 text-sm text-left">
                  {ticket.status === "Pending" ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(ticket.id, "approve")}
                        className="px-2 py-1 text-white bg-green-600 rounded-full hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(ticket.id, "reject")}
                        className="px-2 py-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-sm ${
                        ticket.status === "Rejected"
                          ? "text-red-600"
                          : ticket.status === "Approved"
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <FaInbox size={40} className="text-gray-400 mb-2" />
                  <span className="text-md font-medium">No HR Tickets Found.</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Show:</span>
          <select
            className="text-sm border border-gray-300 rounded-md"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1); // Reset to the first page when items per page changes
            }}
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
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-black hover:bg-gray-300"
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
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
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

export default HRTicketManagement;