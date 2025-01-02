// components/LeaveManagement.tsx

import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaInbox,
  FaSearch,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { LeaveRequest } from "../../types/LeaveRequest";
import EditLeaveRequestModal from "../atoms/EditLeaveRequestModal";
import { formatDate } from "../../utils/formatDate";
import useUser from "../../hooks/useUser";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
    // toast.error("Failed to fetch leave requests.");
    return [];
  }
};

const approveLeaveRequest = async (id: string, comments?: string) => {
  try {
    const { data } = await axios.patch(
      `${backendUrl}/api/leave-applications/${id}/approve`,
      { comments },
      { withCredentials: true }
    );
    toast.success("Leave request approved successfully");
    return data;
  } catch (error) {
    console.error("Error approving leave request", error);
    toast.error("Failed to approve leave request.");
    throw error;
  }
};

const rejectLeaveRequest = async (id: string, comments?: string) => {
  try {
    const { data } = await axios.patch(
      `${backendUrl}/api/leave-applications/${id}/reject`,
      { comments },
      { withCredentials: true }
    );
    toast.warning("Leave request rejected successfully");
    return data;
  } catch (error) {
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [approvedPage, setApprovedPage] = useState<number>(1);
  const [rejectedPage, setRejectedPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [modalType, setModalType] = useState<
    "approve" | "reject" | "edit" | "viewPDF" | null
  >(null);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );
  const [comment, setComment] = useState<string>("");
  const [newLeaveType, setNewLeaveType] = useState<string>("");
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const handlePagination = (
    data: LeaveRequest[],
    page: number,
    itemsPerPage: number
  ) => {
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handleApproveReject = (id: string, type: "approve" | "reject") => {
    setModalType(type);
    setSelectedRequest(leaveRequests.find((req) => req._id === id) || null);
  };

  const handleViewFile = (
    id: string,
    dataSource: "pending" | "approved" | "rejected"
  ) => {
    let request: LeaveRequest | undefined;

    switch (dataSource) {
      case "pending":
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

  const updateLeaveRequestsAfterEdit = (updatedRequest: LeaveRequest) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req._id === updatedRequest._id ? updatedRequest : req))
    );
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedRequest(null);
    setComment("");
    setNewLeaveType("");
    setSelectedPdfUrl("");
  };

  const filteredRequests = leaveRequests.filter(
    (request) =>
      (filters.name === "" ||
        (request.user.name ?? "")
          .toLowerCase()
          .includes(filters.name.toLowerCase())) &&
      (filters.leaveType === "All" || request.leaveType === filters.leaveType)
  );

  const paginatedLeaveRequests = handlePagination(
    filteredRequests,
    currentPage,
    itemsPerPage
  );
  const paginatedApprovedRequests = handlePagination(
    approvedRequests,
    approvedPage,
    itemsPerPage
  );
  const paginatedRejectedRequests = handlePagination(
    rejectedRequests,
    rejectedPage,
    itemsPerPage
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const totalApprovedPages = Math.ceil(approvedRequests.length / itemsPerPage);
  const totalRejectedPages = Math.ceil(rejectedRequests.length / itemsPerPage);

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Leave Management</h1>

      <div className="flex flex-wrap gap-4 mb-4 w-[50%]">
        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow min-w-[250px]">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow min-w-[250px]">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={filters.leaveType}
            onChange={(e) =>
              setFilters({ ...filters, leaveType: e.target.value })
            }
            className="w-full border-none focus:outline-none text-sm text-gray-600"
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
            {/* <option value="Unapproved Absence Without Pay">
              Unapproved Absence Without Pay
            </option> */}
          </select>
        </div>
      </div>

      {/* Pending Leave Requests */}
      <div className="overflow-x-auto mb-6">
        <h2 className="text-xl font-bold mb-4">Pending Leaves</h2>
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
          <thead className="bg-purple-900">
            <tr>
              {[
                "S.No",
                "Name",
                "Leave Type",
                "From",
                "To",
                "Reason",
                "File",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className={`px-3 py-2 text-sm font-medium text-white ${
                    header === "Actions" ? "text-center" : "text-left"
                  } ${header === "S.No" ? "text-center" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedLeaveRequests.length > 0 ? (
              paginatedLeaveRequests.map((request, index) => (
                <tr key={request._id} className="hover:bg-gray-100">
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.user.name}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.leaveType}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {formatDate(request.startDate)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {formatDate(request.endDate)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.reason}
                  </td>
                  <td
                    className="px-3 py-2 text-sm text-blue-600 cursor-pointer"
                    onClick={() => handleViewFile(request._id, "pending")}
                  >
                    {request.handoverDocument ? "View" : "No file"}
                  </td>
                  <td className="px-3 py-2 text-sm text-center">
                    <button
                      onClick={() => handleEdit(request._id)}
                      className="px-2 py-1 text-white bg-orange-500 rounded-full hover:bg-orange-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handleApproveReject(request._id, "approve")
                      }
                      className="px-2 py-1 text-white bg-green-500 rounded-full hover:bg-green-600 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproveReject(request._id, "reject")}
                      className="px-2 py-1 text-white bg-red-500 rounded-full hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {isLoading ? (
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FaSpinner
                        size={30}
                        className="text-blue-500 mb-2 animate-spin"
                      />
                    </div>
                  </td>
                ) : (
                  <td colSpan={8} className="text-center py-8 text-gray-500">
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
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Approved Leave Requests */}
      <div className="overflow-x-auto mb-6">
        <h2 className="text-xl font-bold mb-4">Approved Leaves</h2>
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
          <thead className="bg-green-600">
            <tr>
              {[
                "S.No",
                "Name",
                "Leave Type",
                "From",
                "To",
                "Last Day at Work",
                "Return to Work",
                "Total Days",
                "File",
                "Reason",
                "Comments",
              ].map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-sm font-medium text-white text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedApprovedRequests.length > 0 ? (
              paginatedApprovedRequests.map((request, index) => (
                <tr key={request._id} className="hover:bg-gray-100">
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {index + 1 + (approvedPage - 1) * itemsPerPage}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.user.name}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.leaveType}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {formatDate(request.startDate)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {formatDate(request.endDate)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {formatDate(request.lastDayToWork)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {formatDate(request.returnToWork)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.totalDays}
                  </td>
                  <td
                    className="px-3 py-2 text-sm text-blue-600 cursor-pointer"
                    onClick={() => handleViewFile(request._id, "approved")}
                  >
                    {request.handoverDocument ? "View" : "No file"}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.reason}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.comments}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {isLoading ? (
                  <td colSpan={11} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FaSpinner
                        size={30}
                        className="text-blue-500 mb-2 animate-spin"
                      />
                    </div>
                  </td>
                ) : (
                  <td colSpan={11} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FaInbox size={30} className="text-gray-400 mb-2" />
                      <span className="text-md font-medium">
                        No Approved Leaves Found.
                      </span>
                    </div>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
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
                approvedPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
              disabled={approvedPage === 1}
              onClick={() => setApprovedPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {approvedPage} of {totalApprovedPages}
            </span>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                approvedPage === totalApprovedPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={approvedPage === totalApprovedPages}
              onClick={() =>
                setApprovedPage((prev) =>
                  Math.min(prev + 1, totalApprovedPages)
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Rejected Leave Requests */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Rejected Leaves</h2>
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
          <thead className="bg-red-600">
            <tr>
              {[
                "S.No",
                "Name",
                "Leave Type",
                "From",
                "To",
                "Last Day at Work",
                "Return to Work",
                "Total Days",
                "File",
                "Reason",
                "Comments",
              ].map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-sm font-medium text-white text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRejectedRequests.length > 0 ? (
              paginatedRejectedRequests.map((request, index) => (
                <tr key={request._id} className="hover:bg-gray-100">
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {index + 1 + (rejectedPage - 1) * itemsPerPage}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.user.name}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.leaveType}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {formatDate(request.startDate)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {formatDate(request.endDate)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {formatDate(request.lastDayToWork)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {formatDate(request.returnToWork)}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.totalDays}
                  </td>
                  <td
                    className="px-3 py-2 text-sm text-blue-600 cursor-pointer"
                    onClick={() => handleViewFile(request._id, "rejected")}
                  >
                    {request.handoverDocument ? "View" : "No file"}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.reason}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {request.comments}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {isLoading ? (
                  <td colSpan={11} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FaSpinner
                        size={30}
                        className="text-blue-500 mb-2 animate-spin"
                      />
                    </div>
                  </td>
                ) : (
                  <td colSpan={11} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FaInbox size={30} className="text-gray-400 mb-2" />
                      <span className="text-md font-medium">
                        No Rejected Leaves Found.
                      </span>
                    </div>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
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
                rejectedPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
              disabled={rejectedPage === 1}
              onClick={() => setRejectedPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {rejectedPage} of {totalRejectedPages}
            </span>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                rejectedPage === totalRejectedPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={rejectedPage === totalRejectedPages}
              onClick={() =>
                setRejectedPage((prev) =>
                  Math.min(prev + 1, totalRejectedPages)
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View PDF Modal */}
      {modalType === "viewPDF" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[80%] h-[80%] relative">
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
                  value={newLeaveType || selectedRequest.leaveType}
                  onChange={(e) => setNewLeaveType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
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
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
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
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
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
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
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
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
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
