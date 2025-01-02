import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaFilter, FaInbox, FaSpinner } from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import DocumentViewerModal from "../atoms/DocumentViewerModal";
import AttendanceTicketDetailModal from "../atoms/AttendanceTicketDetailModal";
import { toast } from "react-toastify";
import EditAttendanceModal from "../atoms/EditAttendanceModal"; // Import the updated modal
import useUser from "../../hooks/useUser"; // Adjust the path as necessary
import { formatAttendenceTicketTime } from "../../utils/formateTime";

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
}

const AttendanceTicketManagement: React.FC = () => {
  const { user, loading: userLoading } = useUser(); // Fetch user data
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

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // State for edit modal
  const [ticketToEdit, setTicketToEdit] = useState<AttendanceTicket | null>(
    null
  ); // Selected ticket to edit

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
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  // Open and Close Modals
  const openModal = (ticket: AttendanceTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const openViewer = (fileUrl: string, fileName: string) => {
    if (!fileUrl) return; // Ensure the file URL exists

    const fileType = fileUrl.split(".").pop()?.toLowerCase(); // Extract file extension
    const fileNameFromUrl = fileUrl.split("/").pop(); // Extract file name from URL

    setSelectedFileUrl(fileUrl); // Set the full file URL
    setSelectedFileName(fileName || fileNameFromUrl || "Unknown File"); // Use the provided fileName or fallback
    setSelectedFileType(fileType === "pdf" ? "pdf" : "image"); // Determine file type
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
    // Refresh the attendance tickets or update state accordingly
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
    <div className="w-full p-4 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 mt-4 text-center">
        Attendance Tickets Management
      </h2>
      <div className="grid gap-4 mb-4 sm:grid-cols-1 md:grid-cols-3">
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
              e.target.value = new Date(e.target.value).toLocaleDateString();
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

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
              e.target.value = new Date(e.target.value).toLocaleDateString();
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
          <thead className="bg-purple-900">
            <tr>
              {[
                "S.No",
                "Date",
                "Name",
                "Job Title",
                "Time In",
                "Time Out",
                "Total Time",
                "Work Location",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-sm font-medium text-white text-center"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaSpinner
                      size={30}
                      className="text-blue-500 animate-spin"
                    />
                  </div>
                </td>
              </tr>
            ) : notFound ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={30} className="text-gray-400 mb-2" />
                    <span className="text-md font-medium">
                      No Attendance Tickets Found.
                    </span>
                  </div>
                </td>
              </tr>
            ) : currentTickets.length > 0 ? (
              currentTickets.map((ticket, index) => (
                <tr key={ticket._id} className="hover:bg-gray-100">
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
                    {ticket.user.personalDetails.abbreviatedJobTitle}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {formatAttendenceTicketTime(ticket.timeIn)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {formatAttendenceTicketTime(ticket.timeOut)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {ticket.totalTime}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {ticket.workLocation}
                  </td>

                  <td className="px-3 py-2 text-center space-x-2 flex items-center justify-center">
                    {ticket.status === "Open" && (
                      <>
                        <button
                          onClick={() => handleAction(ticket._id, "approve")}
                          className="px-1.5 py-0.5 text-xs text-white bg-green-600 rounded-full hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(ticket._id, "reject")}
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

                    {/* Conditionally render "Edit" button */}
                    {ticket.status === "Open" &&
                      user &&
                      (ticket.user.id === user._id ||
                        user.role === "SuperAdmin") && (
                        <button
                          onClick={() => openEditModal(ticket)}
                          className="px-1.5 py-0.5 text-xs text-white bg-yellow-600 rounded-full hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                      )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={30} className="text-gray-400 mb-2" />
                    <span className="text-md font-medium">
                      No Attendance Tickets Found.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
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

      {/* Attendance Ticket Detail Modal */}
      <AttendanceTicketDetailModal
        isOpen={isModalOpen}
        ticket={selectedTicket}
        onClose={closeModal}
        onOpenFile={openViewer}
      />

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isViewerOpen}
        onClose={closeViewer}
        fileUrl={selectedFileUrl || ""}
        fileName={selectedFileName || ""}
        fileType={selectedFileType || "image"}
      />

      {/* Edit Attendance Modal */}
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
