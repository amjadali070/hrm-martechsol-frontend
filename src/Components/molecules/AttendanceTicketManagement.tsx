import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaFilter,
  FaInbox,
  FaEdit,
  FaEye,
  FaCheck,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import DocumentViewerModal from "../atoms/DocumentViewerModal";
import AttendanceTicketDetailModal from "../atoms/AttendanceTicketDetailModal";
import { toast } from "react-toastify";
import EditAttendanceModal from "../atoms/EditAttendanceModal";
import useUser from "../../hooks/useUser";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import LoadingSpinner from "../atoms/LoadingSpinner";

interface AttendanceTicket {
  _id: string;
  date: string;
  timeIn: string;
  timeOut: string;
  totalTime: string;
  user: {
    id: string;
    name: string;
    personalDetails: {
      abbreviatedJobTitle: string;
    };
  };
  workLocation: "Remote" | "On-site";
  comments: string;
  file: string | undefined;
  status: "Open" | "Approved" | "Rejected";
  approvedBy?: {
    name: string;
  };
}

const AttendanceTicketManagement: React.FC = () => {
  const { user } = useUser();
  const [attendanceTickets, setAttendanceTickets] = useState<AttendanceTicket[]>([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "All",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedTicket, setSelectedTicket] = useState<AttendanceTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<"image" | "pdf" | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [ticketToEdit, setTicketToEdit] = useState<AttendanceTicket | null>(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAttendanceTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get<AttendanceTicket[]>(
          `${backendUrl}/api/attendance-tickets/assigned`,
          { withCredentials: true }
        );

        setAttendanceTickets(response.data);
        setNotFound(response.data.length === 0);
      } catch (error) {
        console.error("Error fetching attendance tickets:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceTickets();
  }, [backendUrl]);

  const filteredTickets = attendanceTickets.filter((ticket) => {
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

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/attendance-tickets/${id}/status`,
        { status: action === "approve" ? "Approved" : "Rejected" },
        { withCredentials: true }
      );

      setAttendanceTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === id
            ? { ...ticket, status: response.data.ticket.status }
            : ticket
        )
      );

      toast.success(
        `Ticket ${action === "approve" ? "approved" : "rejected"} successfully.`
      );
    } catch (error: any) {
      console.error("Error updating attendance ticket status:", error);
      toast.error("Failed to update the ticket status.");
    }
  };

  const openModal = (ticket: AttendanceTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const openViewer = (fileUrl: string, fileName: string) => {
    if (!fileUrl) return;

    const fileType = fileUrl.split(".").pop()?.toLowerCase();
    const fileNameFromUrl = fileUrl.split("/").pop();

    setSelectedFileUrl(fileUrl);
    setSelectedFileName(fileName || fileNameFromUrl || "Unknown File");
    setSelectedFileType(fileType === "pdf" ? "pdf" : "image");
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setSelectedFileUrl(null);
    setSelectedFileName(null);
    setSelectedFileType(null);
  };

  const openEditModal = (ticket: AttendanceTicket) => {
    setTicketToEdit(ticket);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setTicketToEdit(null);
  };

  const handleEditSuccess = () => {
    // Re-fetch logic or local update
    const fetchAttendanceTickets = async () => {
        try {
          setLoading(true);
          const response = await axios.get<AttendanceTicket[]>(
            `${backendUrl}/api/attendance-tickets/assigned`,
            { withCredentials: true }
          );
  
          setAttendanceTickets(response.data);
          setNotFound(response.data.length === 0);
          toast.success("Attendance ticket updated successfully.");
        } catch (error) {
          console.error("Error fetching attendance tickets:", error);
          setNotFound(true);
        } finally {
          setLoading(false);
        }
      };
      fetchAttendanceTickets();
      closeEditModal();
  };

  // Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
      Rejected: "bg-rose-50 text-rose-600 border-rose-100",
      Open: "bg-blue-50 text-blue-600 border-blue-100",
    };
    const icons = {
      Approved: <FaCheckCircle size={12} />,
      Rejected: <FaTimesCircle size={12} />,
      Open: <FaClock size={12} />,
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
            <h2 className="text-xl font-bold text-gunmetal-900">Attendance Requests</h2>
            <p className="text-sm text-slate-grey-500">Manage time-off and attendance correction tickets</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
              {/* Filter Controls */}
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
                    <option value="Approved">Approved</option>
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
                "Job Title",
                "Approved By",
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
                   <LoadingSpinner size="lg" text="Loading tickets..." />
                </td>
              </tr>
            ) : notFound ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-alabaster-grey-50 rounded-full flex items-center justify-center mb-4 border border-platinum-200">
                         <FaInbox className="text-slate-grey-400 text-2xl" />
                    </div>
                    <span className="text-gunmetal-900 font-bold text-lg">No Tickets Found</span>
                    <p className="text-slate-grey-500 text-sm mt-1">Try adjusting your status or date filters.</p>
                  </div>
                </td>
              </tr>
            ) : currentTickets.length > 0 ? (
              currentTickets.map((ticket, index) => (
                <tr
                  key={ticket._id}
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
                        <span className="text-xs text-slate-grey-500">{ticket.user.personalDetails.abbreviatedJobTitle}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-grey-600">
                    {ticket.user.personalDetails.abbreviatedJobTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-grey-600">
                    {ticket.status === "Approved" && ticket.approvedBy
                      ? ticket.approvedBy.name
                      : "--"}
                  </td>
                  <td className="px-6 py-4">
                     <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4 pr-8">
                    <div className="flex items-center gap-2">
                        {/* Action Buttons */}
                        {ticket.status === "Open" && user && ticket.user.id !== user._id && (
                             <>
                                <button
                                    onClick={() => handleAction(ticket._id, "approve")}
                                    className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                                    title="Approve"
                                >
                                    <FaCheck size={14} />
                                </button>
                                <button
                                    onClick={() => handleAction(ticket._id, "reject")}
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
                        
                         {ticket.status === "Open" && user && (ticket.user.id === user._id || user.role === "SuperAdmin") && (
                             <button
                                onClick={() => openEditModal(ticket)}
                                className="p-2 bg-gunmetal-900 text-white rounded-lg hover:bg-gunmetal-800 transition-colors shadow-lg shadow-gunmetal-500/20"
                                title="Edit"
                             >
                                <FaEdit size={14} />
                             </button>
                         )}
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

      {/* Modals */}
      <AttendanceTicketDetailModal
        isOpen={isModalOpen}
        ticket={selectedTicket}
        onClose={closeModal}
        onOpenFile={openViewer}
      />

      <DocumentViewerModal
        isOpen={isViewerOpen}
        onClose={closeViewer}
        fileUrl={selectedFileUrl || ""}
        fileName={selectedFileName || ""}
        fileType={selectedFileType || "image"}
      />

      <EditAttendanceModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        ticket={ticketToEdit}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default AttendanceTicketManagement;
