import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaFilter,
  FaCheck,
  FaTimes,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaRegCircle,
  FaClipboardList
} from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import TicketDetailModal from "../atoms/TicketDetailModal";
import { toast } from "react-toastify";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import LoadingSpinner from "../atoms/LoadingSpinner";

export interface AdminTicket {
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

const AdminTicketManagement: React.FC = () => {
  const [adminTickets, setAdminTickets] = useState<AdminTicket[]>([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "All",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAdminTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/admin-tickets/all`,
          { withCredentials: true }
        );
        setAdminTickets(response.data);
        setNotFound(response.data.length === 0);
      } catch (error) {
        console.error("Error fetching Admin tickets:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminTickets();
  }, [backendUrl]);

  const filteredTickets = adminTickets.filter((ticket) => {
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
        `${backendUrl}/api/admin-tickets/${id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setAdminTickets((prev) =>
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

  const openModal = (ticket: AdminTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const StatusBadge = ({ status }: { status: string }) => {
     const styles = {
      Closed: "bg-emerald-50 text-emerald-600 border-emerald-100",
      Rejected: "bg-rose-50 text-rose-600 border-rose-100",
      Open: "bg-purple-50 text-purple-600 border-purple-100", // Using Purple for Admin Tasks
    };
    const icons = {
      Closed: <FaCheckCircle size={12} />,
      Rejected: <FaTimesCircle size={12} />,
      Open: <FaRegCircle size={12} />,
    };

    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status as keyof typeof styles] || styles.Open}`}>
        {icons[status as keyof typeof icons] || icons.Open}
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-platinum-200 overflow-hidden">
      <div className="p-6 border-b border-platinum-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 flex items-center gap-2">
                Admin Requests
            </h2>
            <p className="text-sm text-slate-grey-500">Facility management and administrative tasks</p>
          </div>
          
           <div className="flex flex-col sm:flex-row gap-3">
               <div className="relative group">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-hover:text-gunmetal-500 transition-colors" />
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                    className="pl-10 pr-4 py-2 bg-alabaster-grey-50 border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all w-full sm:w-auto"
                  />
               </div>
               <div className="relative group">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-hover:text-gunmetal-500 transition-colors" />
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                    className="pl-10 pr-4 py-2 bg-alabaster-grey-50 border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all w-full sm:w-auto"
                  />
               </div>
               <div className="relative group">
                  <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-hover:text-gunmetal-500 transition-colors" />
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="pl-10 pr-8 py-2 bg-alabaster-grey-50 border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all appearance-none cursor-pointer w-full sm:w-auto"
                  >
                    <option value="All">All Status</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
               </div>
          </div>
      </div>

       <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-alabaster-grey-50 border-b border-platinum-200">
            <tr>
              {[
                "S.No",
                "Date",
                "Employee",
                "Dept.",
                 "Subject",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-left first:pl-8 last:pr-8"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-platinum-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                   <LoadingSpinner size="lg" text="Loading Admin tickets..." />
                </td>
              </tr>
            ) : notFound ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-alabaster-grey-50 rounded-full flex items-center justify-center mb-4 border border-platinum-200">
                         <FaClipboardList className="text-slate-grey-400 text-2xl" />
                    </div>
                    <span className="text-gunmetal-900 font-bold text-lg">No Tickets Found</span>
                  </div>
                </td>
              </tr>
            ) : currentTickets.length > 0 ? (
              currentTickets.map((ticket, index) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-alabaster-grey-50 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-grey-600 pl-8">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gunmetal-900">
                    {formatDate(ticket.date)}
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                        <span className="text-sm font-bold text-gunmetal-900">{ticket.user.name}</span>
                        <span className="text-xs text-slate-grey-500">{ticket.user.abbreviatedJobTitle}</span>
                     </div>
                  </td>
                   <td className="px-6 py-4 text-sm text-slate-grey-600">
                    <span className="bg-platinum-100 text-slate-grey-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {ticket.user.department}
                    </span>
                  </td>
                   <td className="px-6 py-4 text-sm text-gunmetal-900 font-medium truncate max-w-[200px]">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4">
                     <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4 pr-8">
                    <div className="flex items-center gap-2">
                        {/* Action Buttons */}
                        {ticket.status === "Open" && (
                             <>
                                <button
                                    onClick={() => handleAction(ticket.id, "approve")}
                                    className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                                    title="Close/Resolve"
                                >
                                    <FaCheck size={14} />
                                </button>
                                <button
                                    onClick={() => handleAction(ticket.id, "reject")}
                                    className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                                    title="Reject"
                                >
                                    <FaTimes size={14} />
                                </button>
                             </>
                        )}

                        <button
                            onClick={() => openModal(ticket)}
                            className="p-2 bg-white border border-platinum-200 text-gunmetal-600 rounded-lg hover:bg-gunmetal-50 hover:border-gunmetal-300 transition-all shadow-sm"
                            title="View Details"
                        >
                            <FaEye size={14} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      </div>

       {/* Pagination Footer */}
       <div className="bg-white border-t border-platinum-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-grey-600">Rows per page:</span>
            <select
                className="bg-alabaster-grey-50 border border-platinum-200 text-sm rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gunmetal-500"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
            >
                {[5, 10, 20, 50].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
         </div>

         <div className="flex items-center gap-2">
             <button
                className="p-2 rounded-lg border border-platinum-200 text-slate-grey-600 hover:bg-alabaster-grey-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={currentPage === 1}
                onClick={handlePrevious}
             >
                <FiChevronLeft />
             </button>
             <span className="text-sm font-bold text-gunmetal-900 px-2">
                Page {currentPage} of {totalPages || 1}
             </span>
             <button
                className="p-2 rounded-lg border border-platinum-200 text-slate-grey-600 hover:bg-alabaster-grey-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={handleNext}
             >
                <FiChevronRight />
             </button>
         </div>
      </div>

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

export default AdminTicketManagement;
