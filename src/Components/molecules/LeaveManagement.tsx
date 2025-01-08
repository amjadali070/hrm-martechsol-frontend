// components/LeaveManagement.tsx

import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaInbox,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaBriefcase,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdPending } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { LeaveRequest } from "../../types/LeaveRequest";
import EditLeaveRequestModal from "../atoms/EditLeaveRequestModal";
import { formatDate } from "../../utils/formatDate";
import useUser from "../../hooks/useUser";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Fetch Leave Requests based on User Role
const fetchLeaveRequests = async (userRole: string) => {
  try {
    const endpoint =
      userRole === "manager" || userRole === "SuperAdmin"
        ? `${backendUrl}/api/leave-applications/assigned`
        : `${backendUrl}/api/leave-applications`;
    const { data } = await axios.get(endpoint, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching leave requests", error);
    return [];
  }
};

// Approve Leave Request
const approveLeaveRequest = async (id: string, comments?: string) => {
  try {
    const { data } = await axios.patch(
      `${backendUrl}/api/leave-applications/${id}/approve`,
      { comments },
      { withCredentials: true }
    );
    toast.success("Leave request approved successfully");
    return data;
  } catch (error: any) {
    console.error("Error approving leave request", error);
    toast.error("Failed to approve leave request.");
    throw error;
  }
};

// Reject Leave Request
const rejectLeaveRequest = async (id: string, comments?: string) => {
  try {
    const { data } = await axios.patch(
      `${backendUrl}/api/leave-applications/${id}/reject`,
      { comments },
      { withCredentials: true }
    );
    toast.warning("Leave request rejected successfully");
    return data;
  } catch (error: any) {
    console.error("Error rejecting leave request", error);
    toast.error("Failed to reject leave request.");
    throw error;
  }
};

const LeaveManagement: React.FC = () => {
  const { user } = useUser();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<LeaveRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<LeaveRequest[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    leaveType: "All",
  });
  const [activeTab, setActiveTab] = useState<"open" | "approved" | "rejected">(
    "open"
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [modalType, setModalType] = useState<
    "approve" | "reject" | "edit" | "viewPDF" | null
  >(null);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );
  const [comment, setComment] = useState<string>("");
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch Leave Requests on Component Mount or User Role Change
  useEffect(() => {
    const loadLeaveRequests = async () => {
      if (!user) {
        return;
      }
      try {
        setIsLoading(true);
        const requests = await fetchLeaveRequests(user.role);
        const pendingRequests = requests.filter(
          (req: LeaveRequest) => req.status === "Pending"
        );
        const approvedReqs = requests.filter(
          (req: LeaveRequest) => req.status === "Approved"
        );
        const rejectedReqs = requests.filter(
          (req: LeaveRequest) => req.status === "Rejected"
        );

        setLeaveRequests(pendingRequests);
        setApprovedRequests(approvedReqs);
        setRejectedRequests(rejectedReqs);
      } catch (error) {
        toast.error("Error fetching leave requests");
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaveRequests();
  }, [user]);

  const handleConfirmAction = async () => {
    if (selectedRequest && modalType) {
      try {
        if (modalType === "approve") {
          const approvedRequest = await approveLeaveRequest(
            selectedRequest._id,
            comment
          );
          setApprovedRequests((prev) => [...prev, approvedRequest]);
          setLeaveRequests((prev) =>
            prev.filter((req) => req._id !== selectedRequest._id)
          );
        } else if (modalType === "reject") {
          const rejectedRequest = await rejectLeaveRequest(
            selectedRequest._id,
            comment
          );
          setRejectedRequests((prev) => [...prev, rejectedRequest]);
          setLeaveRequests((prev) =>
            prev.filter((req) => req._id !== selectedRequest._id)
          );
        }
        closeModal();
      } catch (error) {
        toast.error("Error confirming action");
      }
    }
  };
  // Handle Pagination
  const handlePagination = (
    data: LeaveRequest[],
    page: number,
    itemsPerPage: number
  ) => {
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Handle Approve/Reject Button Click
  const handleApproveReject = (id: string, type: "approve" | "reject") => {
    setModalType(type);
    setSelectedRequest(leaveRequests.find((req) => req._id === id) || null);
  };

  // Handle View File (PDF)
  const handleViewFile = (
    id: string,
    dataSource: "open" | "approved" | "rejected"
  ) => {
    let request: LeaveRequest | undefined;

    switch (dataSource) {
      case "open":
        request = leaveRequests.find((req) => req._id === id);
        break;
      case "approved":
        request = approvedRequests.find((req) => req._id === id);
        break;
      case "rejected":
        request = rejectedRequests.find((req) => req._id === id);
        break;
      default:
        request = undefined;
    }

    if (request && request.handoverDocument) {
      const fullPdfUrl = `${request.handoverDocument.replace(/\\/g, "/")}`;

      setSelectedPdfUrl(fullPdfUrl);
      setModalType("viewPDF");
    } else {
      toast.info("No document available");
    }
  };

  const handleEdit = (id: string | undefined) => {
    if (!id) {
      toast.error("Invalid request ID");
      return;
    }

    const request =
      leaveRequests.find((req) => req._id === id.toString()) || null;
    setSelectedRequest(request);
    setEditModalOpen(true);
  };

  // Update Leave Requests After Edit
  const updateLeaveRequestsAfterEdit = (updatedRequest: LeaveRequest) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req._id === updatedRequest._id ? updatedRequest : req))
    );
  };

  // Close Modal
  const closeModal = () => {
    setModalType(null);
    setSelectedRequest(null);
    setComment("");
    setSelectedPdfUrl("");
  };

  // Apply Filters to Current Tab's Data
  const getFilteredRequests = (): LeaveRequest[] => {
    let data: LeaveRequest[] = [];

    switch (activeTab) {
      case "open":
        data = leaveRequests;
        break;
      case "approved":
        data = approvedRequests;
        break;
      case "rejected":
        data = rejectedRequests;
        break;
      default:
        data = leaveRequests;
    }

    return data.filter(
      (request) =>
        (filters.name === "" ||
          (request.user.name ?? "")
            .toLowerCase()
            .includes(filters.name.toLowerCase())) &&
        (filters.leaveType === "All" || request.leaveType === filters.leaveType)
    );
  };

  // Get Paginated Data Based on Active Tab
  const paginatedData = handlePagination(
    getFilteredRequests(),
    currentPage,
    itemsPerPage
  );

  // Calculate Total Pages for Active Tab
  const totalPages = Math.ceil(getFilteredRequests().length / itemsPerPage);

  return (
    <div className="w-full p-6 bg-gray-100 rounded-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">
          Leave Management
        </h2>
      </div>

      <div className="flex space-x-4 mb-4">
        {[
          { name: "Open", key: "open", icon: <MdPending /> },
          { name: "Approved", key: "approved", icon: <FaCheckCircle /> },
          { name: "Rejected", key: "rejected", icon: <FaTimesCircle /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as "open" | "approved" | "rejected");
              setCurrentPage(1);
            }}
            className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.icon}
            <span className="ml-2">{tab.name}</span>
          </button>
        ))}
      </div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Search Input */}
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300 flex-grow min-w-[200px]">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="w-full focus:outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Leave Type Filter */}
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300 flex-grow min-w-[200px]">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={filters.leaveType}
            onChange={(e) =>
              setFilters({ ...filters, leaveType: e.target.value })
            }
            className="w-full focus:outline-none text-sm text-gray-700"
          >
            <option value="All">All Leave Types</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Annual Leave">Annual Leave</option>
            <option value="Maternity Leave">Maternity Leave</option>
            <option value="Paternity Leave">Paternity Leave</option>
            <option value="Bereavement Leave">Bereavement Leave</option>
            <option value="Hajj Leave">Hajj Leave</option>
            <option value="Unauthorized Leaves">Unauthorized Leaves</option>
          </select>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-purple-900 text-white">
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide rounded-tl-lg">
                S.No
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                Leave Type
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                From
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                To
              </th>
              {activeTab === "approved" || activeTab === "rejected" ? (
                <>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                    Last Day at Work
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                    Return to Work
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                    Total Days
                  </th>
                </>
              ) : null}
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                Reason
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                File
              </th>
              {activeTab === "open" ? (
                <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wide rounded-tr-lg">
                  Actions
                </th>
              ) : activeTab === "approved" || activeTab === "rejected" ? (
                <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wide rounded-tr-lg">
                  Comments
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((request, index) => (
                <tr
                  key={request._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-700 text-center">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {request.user.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {request.leaveType}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {formatDate(request.startDate)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {formatDate(request.endDate)}
                  </td>
                  {activeTab === "approved" || activeTab === "rejected" ? (
                    <>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {formatDate(request.lastDayToWork)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {formatDate(request.returnToWork)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {request.totalDays}
                      </td>
                    </>
                  ) : null}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {request.reason}
                  </td>
                  <td
                    className="py-3 px-4 text-sm text-blue-600 cursor-pointer"
                    onClick={() =>
                      handleViewFile(
                        request._id,
                        activeTab === "open"
                          ? "open"
                          : activeTab === "approved"
                          ? "approved"
                          : "rejected"
                      )
                    }
                  >
                    {request.handoverDocument ? "View" : "No File"}
                  </td>
                  {activeTab === "open" ? (
                    <td className="py-3 px-4 text-sm flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(request._id)}
                        className="flex items-center px-3 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleApproveReject(request._id, "approve")
                        }
                        className="flex items-center px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      >
                        <FaCheckCircle className="mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleApproveReject(request._id, "reject")
                        }
                        className="flex items-center px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <FaTimesCircle className="mr-1" />
                        Reject
                      </button>
                    </td>
                  ) : activeTab === "approved" || activeTab === "rejected" ? (
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {request.comments || "N/A"}
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                {isLoading ? (
                  <td
                    className="py-8 px-4 text-center text-gray-500"
                    colSpan={
                      activeTab === "open"
                        ? 10
                        : activeTab === "approved" || activeTab === "rejected"
                        ? 12
                        : 10
                    }
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FaSpinner
                        size={30}
                        className="text-blue-500 mb-2 animate-spin"
                      />
                    </div>
                  </td>
                ) : (
                  <td
                    className="py-8 px-4 text-center text-gray-500"
                    colSpan={
                      activeTab === "open"
                        ? 10
                        : activeTab === "approved" || activeTab === "rejected"
                        ? 12
                        : 10
                    }
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FaInbox size={30} className="text-gray-400 mb-2" />
                      <span className="text-md font-medium">
                        No Leave Requests Found.
                      </span>
                    </div>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        {/* Items Per Page */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show:</span>
          <select
            className="text-sm border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1); // Reset to first page when items per page changes
            }}
          >
            {[5, 10, 20].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <button
            className={`flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <FaChevronLeft className="mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
              currentPage === totalPages || totalPages === 0
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            {" "}
            Next
            <FaChevronRight className="ml-1" />
          </button>
        </div>
      </div>

      {/* View PDF Modal */}
      {modalType === "viewPDF" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] h-[90%] relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
            >
              <FaTimes size={24} />
            </button>
            <iframe
              src={selectedPdfUrl}
              className="w-full h-full rounded-lg"
              title="Handover Document"
            />
          </div>
        </div>
      )}

      {/* Approve/Reject/Edit Modal */}
      {modalType && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-lg font-bold mb-4">
              {modalType === "approve"
                ? "Approve Leave Request"
                : modalType === "reject"
                ? "Reject Leave Request"
                : "Edit Leave Request"}
            </h2>

            {modalType !== "edit" ? (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Name:</strong> {selectedRequest.user.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Leave Type:</strong> {selectedRequest.leaveType}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>From:</strong>{" "}
                    {formatDate(selectedRequest.startDate)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>To:</strong> {formatDate(selectedRequest.endDate)}
                  </p>
                  {modalType === "approve" && (
                    <>
                      <p className="text-sm text-gray-700">
                        <strong>Last Day at Work:</strong>{" "}
                        {formatDate(selectedRequest.lastDayToWork)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Return to Work:</strong>{" "}
                        {formatDate(selectedRequest.returnToWork)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Total Days:</strong> {selectedRequest.totalDays}
                      </p>
                    </>
                  )}
                  <p className="text-sm text-gray-700">
                    <strong>Reason:</strong> {selectedRequest.reason}
                  </p>
                </div>
                <textarea
                  placeholder="Add your comments"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                ></textarea>
              </div>
            ) : (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Leave Type
                </label>
                <select
                  value={selectedRequest.leaveType}
                  onChange={(e) =>
                    setSelectedRequest((prev) =>
                      prev ? { ...prev, leaveType: e.target.value } : null
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Leave Type</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                  <option value="Bereavement Leave">Bereavement Leave</option>
                  <option value="Hajj Leave">Hajj Leave</option>
                  <option value="Unauthorized Leaves">
                    Unauthorized Leaves
                  </option>
                  {/* Uncomment if needed */}
                  {/* <option value="Unapproved Absence Without Pay">
                    Unapproved Absence Without Pay
                  </option> */}
                </select>

                <label className="block mb-2 text-sm font-medium text-gray-700">
                  From
                </label>
                <input
                  type="date"
                  value={formatDate(selectedRequest.startDate)}
                  onChange={(e) =>
                    setSelectedRequest((prev) =>
                      prev ? { ...prev, startDate: e.target.value } : null
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">
                  To
                </label>
                <input
                  type="date"
                  value={formatDate(selectedRequest.endDate)}
                  onChange={(e) =>
                    setSelectedRequest((prev) =>
                      prev ? { ...prev, endDate: e.target.value } : null
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Last Day at Work
                </label>
                <input
                  type="date"
                  value={formatDate(selectedRequest.lastDayToWork)}
                  onChange={(e) =>
                    setSelectedRequest((prev) =>
                      prev ? { ...prev, lastDayToWork: e.target.value } : null
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Return to Work
                </label>
                <input
                  type="date"
                  value={formatDate(selectedRequest.returnToWork)}
                  onChange={(e) =>
                    setSelectedRequest((prev) =>
                      prev ? { ...prev, returnToWork: e.target.value } : null
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                {modalType === "edit" ? "Update" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Leave Request Modal */}
      {editModalOpen && selectedRequest && (
        <EditLeaveRequestModal
          selectedRequest={selectedRequest}
          closeModal={() => {
            setEditModalOpen(false);
            setSelectedRequest(null);
          }}
          updateLeaveRequests={updateLeaveRequestsAfterEdit}
        />
      )}
    </div>
  );
};

export default LeaveManagement;
