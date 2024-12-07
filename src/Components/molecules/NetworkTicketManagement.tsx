import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaInbox, FaCalendarAlt, FaFilter, FaSpinner } from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import TicketDetailModal from "../atoms/TicketDetailModal";

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
        const response = await axios.get(`${backendUrl}/api/network-tickets/`, {
          withCredentials: true,
        });
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
    } catch (error) {
      console.error("Error updating ticket status:", error);
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
    <div className="w-full p-4 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 mt-4 text-center">
        Network Tickets Management
      </h2>

      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 w-full">
          {/* Date Filters and Status Selectors */}
          <div className="flex-grow min-w-[200px]">
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
              <FaCalendarAlt className="text-gray-400 mr-2" />
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
                  e.target.value = new Date(
                    e.target.value
                  ).toLocaleDateString();
                }}
                className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex-grow min-w-[200px]">
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
              <FaCalendarAlt className="text-gray-400 mr-2" />
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
                  e.target.value = new Date(
                    e.target.value
                  ).toLocaleDateString();
                }}
                className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex-grow min-w-[200px]">
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
              <FaFilter className="text-gray-400 mr-2" />
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full border-none focus:outline-none text-sm text-gray-600"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
          <thead className="bg-purple-900">
            <tr>
              {[
                "S.No",
                "Date",
                "User Name",
                "Job Title",
                "Subject",
                "Status",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-center text-sm font-medium text-white"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  <div className="w-full bg-white rounded-lg flex justify-center items-center">
                    <FaSpinner
                      size={30}
                      className="text-blue-500 animate-spin"
                    />
                  </div>
                </td>
              </tr>
            ) : notFound ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={30} className="text-gray-400 mb-2" />
                    <span className="text-md font-medium">
                      No Network Tickets Found.
                    </span>
                  </div>
                </td>
              </tr>
            ) : currentTickets.length > 0 ? (
              currentTickets.map((ticket, index) => (
                <tr key={ticket.id} className="hover:bg-gray-100">
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {formatDate(ticket.date)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {ticket.user.name}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {ticket.user.abbreviatedJobTitle}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {ticket.subject}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {ticket.status}
                  </td>
                  <td className="px-3 py-2 text-center space-x-2 flex items-center justify-center">
                    {ticket.status === "Open" && (
                      <>
                        <button
                          onClick={() => handleAction(ticket.id, "approve")}
                          className="px-1.5 py-0.5 text-xs text-white bg-green-600 rounded-full hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(ticket.id, "reject")}
                          className="px-1.5 py-0.5 text-xs text-white bg-red-600 rounded-full hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {ticket.status !== "Open" && (
                      <span
                        className={`text-xs mr-2 ${
                          ticket.status === "Rejected"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    )}

                    <button
                      onClick={() => openModal(ticket)}
                      className="px-1.5 py-0.5 text-xs text-white bg-blue-600 rounded-full hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={30} className="text-gray-400 mb-2" />
                    <span className="text-md font-medium">
                      No Network Tickets Found.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Show:</span>
          <select
            className="text-sm border border-gray-300 rounded-md"
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
        <div className="flex items-center space-x-4">
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <TicketDetailModal
        isOpen={isModalOpen}
        ticket={selectedTicket}
        onClose={closeModal}
      />
    </div>
  );
};

export default NetworkTicketManagement;
