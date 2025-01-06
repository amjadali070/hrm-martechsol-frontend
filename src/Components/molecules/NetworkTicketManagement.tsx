import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaInbox,
  FaCalendarAlt,
  FaFilter,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import TicketDetailModal from "../atoms/TicketDetailModal";
import { toast } from "react-toastify";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export interface NetworkTicket {
  id: string;
  date: string;
  user: {
    name: string;
    department: string;
    abbreviatedJobTitle: string;
  };
  subject: string;
  message: string;
  status: "Open" | "Closed" | "Rejected";
}

const NetworkTicketManagement: React.FC = () => {
  const [networkTickets, setNetworkTickets] = useState<NetworkTicket[]>([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "All",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<NetworkTicket | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchNetworkTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/network-tickets/all`,
          {
            withCredentials: true,
          }
        );
        setNetworkTickets(response.data);
        setNotFound(response.data.length === 0);
      } catch (error) {
        console.error("Error fetching Network tickets:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkTickets();
  }, [backendUrl]);

  const filteredTickets = networkTickets.filter((ticket) => {
    const ticketDate = new Date(ticket.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    const withinDateRange =
      (!fromDate || ticketDate >= fromDate) &&
      (!toDate || ticketDate <= toDate);

    const matchesStatus =
      filters.status === "All" || ticket.status === filters.status;

    return withinDateRange && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const newStatus = action === "approve" ? "Closed" : "Rejected";
    try {
      await axios.put(
        `${backendUrl}/api/network-tickets/${id}/status`,
        { status: newStatus },
        {
          withCredentials: true,
        }
      );
      setNetworkTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === id ? { ...ticket, status: newStatus } : ticket
        )
      );
      toast.success(
        `Ticket ${action === "approve" ? "approved" : "rejected"} successfully.`
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Failed to update the ticket status.");
    }
  };

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const openModal = (ticket: NetworkTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Network Tickets Management
      </h2>

      {/* Filters Section */}
      <div className="grid gap-6 mb-6 sm:grid-cols-1 md:grid-cols-3">
        {/* From Date */}
        <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
          <FaCalendarAlt className="text-black mr-3" />
          <input
            type="text"
            value={
              filters.fromDate
                ? new Date(filters.fromDate).toLocaleDateString()
                : "FROM"
            }
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
              setFilters({ ...filters, fromDate: e.target.value });
              e.target.type = "text";
              e.target.value = new Date(e.target.value).toLocaleDateString();
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400"
            placeholder="From Date"
          />
        </div>

        {/* To Date */}
        <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
          <FaCalendarAlt className="text-black mr-3" />
          <input
            type="text"
            value={
              filters.toDate
                ? new Date(filters.toDate).toLocaleDateString()
                : "TO"
            }
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
              setFilters({ ...filters, toDate: e.target.value });
              e.target.type = "text";
              e.target.value = new Date(e.target.value).toLocaleDateString();
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400"
            placeholder="To Date"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
          <FaFilter className="text-black mr-3" />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full border-none focus:outline-none text-sm text-gray-700"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-purple-900 sticky top-0">
            <tr>
              {[
                "S.No",
                "Date",
                "User Name",
                "Department",
                "Job Title",
                "Subject",
                "Status",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-sm font-medium text-white uppercase tracking-wider text-center"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaSpinner
                      size={40}
                      className="text-purple-500 animate-spin mb-4"
                    />
                    <span className="text-lg">Loading Network Tickets...</span>
                  </div>
                </td>
              </tr>
            ) : notFound ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={40} className="text-gray-400 mb-4" />
                    <span className="text-lg font-medium">
                      No Network Tickets Found.
                    </span>
                  </div>
                </td>
              </tr>
            ) : currentTickets.length > 0 ? (
              currentTickets.map((ticket, index) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {formatDate(ticket.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {ticket.user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {ticket.user.department}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {ticket.user.abbreviatedJobTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ticket.status === "Open"
                          ? "bg-blue-100 text-blue-800"
                          : ticket.status === "Closed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2 flex items-center justify-center">
                    {ticket.status === "Open" && (
                      <>
                        <button
                          onClick={() => handleAction(ticket.id, "approve")}
                          className="flex items-center px-3 py-1 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors"
                          title="Approve"
                        >
                          <FaCheck className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(ticket.id, "reject")}
                          className="flex items-center px-3 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors"
                          title="Reject"
                        >
                          <FaTimes className="mr-1" /> Reject
                        </button>
                      </>
                    )}

                    {ticket.status !== "Open" && (
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          ticket.status === "Rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    )}

                    <button
                      onClick={() => openModal(ticket)}
                      className="flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors"
                      title="View Details"
                    >
                      <FaEye className="mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={40} className="text-gray-400 mb-4" />
                    <span className="text-lg font-medium">
                      No Network Tickets Found.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination and Items Per Page */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-3">Show:</span>
          <select
            className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className={`flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={currentPage === 1}
            onClick={handlePrevious}
          >
            <FiChevronLeft className="mr-2" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
              currentPage === totalPages || totalPages === 0
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={handleNext}
          >
            Next
            <FiChevronRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {isModalOpen && selectedTicket && (
        <TicketDetailModal
          isOpen={isModalOpen}
          ticket={selectedTicket}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default NetworkTicketManagement;
