import React, { useState } from "react";

const TicketStatus: React.FC = () => {
  interface Ticket {
    id: number;
    date: string;
    from: string;
    subject: string;
    status: string;
  }

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1,
      date: "2024-11-01",
      from: "John Doe",
      subject: "Issue with login",
      status: "Open",
    },
    {
      id: 2,
      date: "2024-11-02",
      from: "Jane Smith",
      subject: "Request for password reset",
      status: "Closed",
    },
    {
      id: 3,
      date: "2024-11-03",
      from: "Alice Johnson",
      subject: "System not responding",
      status: "Open",
    },
    {
      id: 4,
      date: "2024-11-04",
      from: "Bob Brown",
      subject: "Bug in the dashboard",
      status: "Closed",
    },
  ]);

  const [filteredStatus, setFilteredStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const filteredTickets =
    filteredStatus === "All"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filteredStatus);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    <div className="w-full p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg md:text-xl font-bold text-black">
          Ticket Status
        </h2>
        <div className="flex items-center space-x-2 mb-3">
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
        {filteredTickets.length > 0 ? (
          <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md mb-6">
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  S.No
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  Date
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  From
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  Subject
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  Status
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map((ticket, index) => (
                <tr key={ticket.id}>
                  <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                    {ticket.date}
                  </td>
                  <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                    {ticket.from}
                  </td>
                  <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                    {ticket.subject}
                  </td>
                  <td
                    className={`text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center ${
                      ticket.status === "Open"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {ticket.status}
                  </td>
                  <td
                    className="text-sm px-4 py-2 border border-gray-300 whitespace-nowrap text-center text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 text-sm py-6">
            No tickets available
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
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
                : "bg-blue-600 text-white hover:bg-blue-600"
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
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-xl font-bold mb-6 text-purple-900 border-b border-gray-300 pb-2">
              Ticket Details
            </h3>
            <div className="space-y-4">
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
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    selectedTicket.status === "Open"
                      ? "text-green-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  {selectedTicket.status}
                </span>
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-5 py-2 text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketStatus;
