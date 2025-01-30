import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaFilter,
  FaInbox,
  FaSpinner,
  FaEdit,
  FaEye,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import DocumentViewerModal from "../atoms/DocumentViewerModal";
import AttendanceTicketDetailModal from "../atoms/AttendanceTicketDetailModal";
import { toast } from "react-toastify";
import EditAttendanceModal from "../atoms/EditAttendanceModal";
import useUser from "../../hooks/useUser";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  const [attendanceTickets, setAttendanceTickets] = useState<
    AttendanceTicket[]
  >([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "All",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedTicket, setSelectedTicket] = useState<AttendanceTicket | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<
    "image" | "pdf" | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [ticketToEdit, setTicketToEdit] = useState<AttendanceTicket | null>(
    null
  );

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAttendanceTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get<AttendanceTicket[]>(
          `${backendUrl}/api/attendance-tickets/assigned`,
          {
            withCredentials: true,
          }
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
    const fetchAttendanceTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get<AttendanceTicket[]>(
          `${backendUrl}/api/attendance-tickets/assigned`,
          {
            withCredentials: true,
          }
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

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center ">
        Attendance Tickets Management
      </h2>
      <div className="grid gap-6 mb-6 sm:grid-cols-1 md:grid-cols-3">
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
          />
        </div>

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
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-300">
          <FaFilter className="text-black mr-3" />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full border-none focus:outline-none text-sm text-gray-700"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-purple-900">
            <tr>
              {[
                "S.No",
                "Date",
                "Name",
                "Job Title",
                "Approved By",
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
                <td colSpan={10} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaSpinner
                      size={40}
                      className="animate-spin text-blue-600 mb-2"
                      aria-hidden="true"
                    />
                  </div>
                </td>
              </tr>
            ) : notFound ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={40} className="text-gray-400 mb-4" />
                    <span className="text-lg font-medium">
                      No Attendance Tickets Found.
                    </span>
                  </div>
                </td>
              </tr>
            ) : currentTickets.length > 0 ? (
              currentTickets.map((ticket, index) => (
                <tr
                  key={ticket._id}
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
                    {ticket.user.personalDetails.abbreviatedJobTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {ticket.status === "Approved" && ticket.approvedBy
                      ? ticket.approvedBy.name
                      : "--"}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2 flex items-center justify-center">
                    {ticket.status === "Open" &&
                      user &&
                      ticket.user.id !== user._id && (
                        <>
                          <button
                            onClick={() => handleAction(ticket._id, "approve")}
                            className="flex items-center px-3 py-1 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors"
                            title="Approve"
                          >
                            <FaCheck className="mr-1" /> Approve
                          </button>
                          <button
                            onClick={() => handleAction(ticket._id, "reject")}
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

                    {ticket.status === "Open" &&
                      user &&
                      (ticket.user.id === user._id ||
                        user.role === "SuperAdmin") && (
                        <button
                          onClick={() => openEditModal(ticket)}
                          className="flex items-center px-3 py-1 bg-yellow-500 text-white text-sm rounded-full hover:bg-yellow-600 transition-colors"
                          title="Edit Ticket"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                      )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={40} className="text-gray-400 mb-4" />
                    <span className="text-lg font-medium">
                      No Attendance Tickets Found.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
