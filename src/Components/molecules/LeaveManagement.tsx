// components/LeaveManagement.tsx

import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaInbox,
  FaSearch,
  FaTimes,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdPending, MdOutlineBeachAccess } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { LeaveRequest } from "../../types/LeaveRequest";
import EditLeaveRequestModal from "../atoms/EditLeaveRequestModal";
import { formatDate } from "../../utils/formatDate";
import useUser from "../../hooks/useUser";
import LoadingSpinner from "../atoms/LoadingSpinner";

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

  const totalPages = Math.ceil(getFilteredRequests().length / itemsPerPage);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
             <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
               <MdOutlineBeachAccess className="text-gunmetal-600 text-xl" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                    Leave Management
                </h2>
                <p className="text-sm text-slate-grey-500">
                    Review and manage employee time-off requests.
                </p>
             </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <input
                type="text"
                placeholder="Search by name..."
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
               />
            </div>
            
            <div className="relative group">
               <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <select
                value={filters.leaveType}
                onChange={(e) =>
                    setFilters({ ...filters, leaveType: e.target.value })
                }
                className="w-full sm:w-48 pl-9 pr-8 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
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
      </div>

      <div className="flex gap-2 mb-6 border-b border-platinum-200 pb-1">
        {[
          { name: "Pending", key: "open", icon: <MdPending className="mb-0.5" /> },
          { name: "Approved", key: "approved", icon: <FaCheckCircle className="mb-0.5" /> },
          { name: "Rejected", key: "rejected", icon: <FaTimesCircle className="mb-0.5" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as "open" | "approved" | "rejected");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
              activeTab === tab.key
                ? "border-gunmetal-900 text-gunmetal-900"
                : "border-transparent text-slate-grey-500 hover:text-gunmetal-700 hover:border-platinum-300"
            }`}
          >
            {tab.icon}
            {tab.name}
            <span className={`text-xs ml-1 px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-gunmetal-100' : 'bg-platinum-100'}`}>
                {
                    tab.key === 'open' ? leaveRequests.length : 
                    tab.key === 'approved' ? approvedRequests.length : 
                    rejectedRequests.length
                }
            </span>
          </button>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
        <table className="w-full text-left bg-white border-collapse">
          <thead className="bg-alabaster-grey-50">
            <tr>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">S.No</th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Employee</th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Type</th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Duration</th>
              {activeTab === "approved" || activeTab === "rejected" ? (
                <>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Timeline Details</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Days</th>
                </>
              ) : null}
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Reason</th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Document</th>
              {activeTab === "open" ? (
                <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Actions</th>
              ) : activeTab === "approved" || activeTab === "rejected" ? (
                <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Comments</th>
              ) : null}
            </tr>
          </thead>

          <tbody className="divide-y divide-platinum-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((request, index) => (
                <tr
                  key={request._id}
                  className="hover:bg-alabaster-grey-50/50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-slate-grey-500 font-mono text-center w-12">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-gunmetal-900 block">{request.user.name}</span>
                  </td>
                  <td className="py-4 px-4">
                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-alabaster-grey-100 text-slate-grey-600 border border-platinum-200">
                        {request.leaveType}
                     </span>
                  </td>
                  <td className="py-4 px-4">
                      <div className="flex flex-col text-sm text-slate-grey-600">
                          <span className="flex items-center gap-1"><FaCalendarAlt size={10} className="text-slate-grey-400" /> {formatDate(request.startDate)}</span>
                          <span className="text-xs text-slate-grey-400 pl-4">to {formatDate(request.endDate)}</span>
                      </div>
                  </td>
                  {activeTab === "approved" || activeTab === "rejected" ? (
                    <>
                      <td className="py-4 px-4 text-sm text-slate-grey-600">
                          <div className="flex flex-col gap-1 text-xs">
                             <span className="font-medium text-slate-grey-500">Last Day: <span className="text-gunmetal-700 font-normal">{formatDate(request.lastDayToWork)}</span></span>
                             <span className="font-medium text-slate-grey-500">Return: <span className="text-gunmetal-700 font-normal">{formatDate(request.returnToWork)}</span></span>
                          </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                          <span className="font-mono text-sm font-bold text-gunmetal-800">{request.totalDays}</span>
                      </td>
                    </>
                  ) : null}
                  <td className="py-4 px-4 text-sm text-slate-grey-600 max-w-[200px] truncate" title={request.reason}>
                    {request.reason}
                  </td>
                  <td
                    className="py-4 px-4 text-sm"
                  >
                    {request.handoverDocument ? (
                         <button 
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
                            className="flex items-center gap-1.5 text-gunmetal-600 hover:text-gunmetal-900 transition-colors font-medium text-xs border border-platinum-200 bg-white px-2 py-1 rounded shadow-sm hover:shadow"
                         >
                             <FaEye /> View PDF
                         </button>
                    ) : (
                        <span className="text-slate-grey-400 text-xs italic">No Attachment</span>
                    )}
                  </td>
                  {activeTab === "open" ? (
                    <td className="py-4 px-4 text-center">
                       <div className="flex justify-center items-center gap-2">
                            <button
                                onClick={() => handleEdit(request._id)}
                                className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded transition-colors"
                                title="Edit Request"
                            >
                                <FaEdit size={16} />
                            </button>
                            <button
                                onClick={() => handleApproveReject(request._id, "approve")}
                                className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition-colors"
                                title="Approve"
                            >
                                <FaCheckCircle size={16} />
                            </button>
                            <button
                                onClick={() => handleApproveReject(request._id, "reject")}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors"
                                title="Reject"
                            >
                                <FaTimesCircle size={16} />
                            </button>
                       </div>
                    </td>
                  ) : activeTab === "approved" || activeTab === "rejected" ? (
                    <td className="py-4 px-4 text-sm text-slate-grey-600 italic">
                      {request.comments || "N/A"}
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="py-12 px-4 text-center text-slate-grey-400"
                  colSpan={
                    activeTab === "open"
                      ? 10
                      : activeTab === "approved" || activeTab === "rejected"
                      ? 12
                      : 10
                  }
                >
                  <div className="flex flex-col items-center justify-center">
                    {isLoading ? (
                         <LoadingSpinner size="md" text="Loading requests..." />
                    ) : (
                         <>
                         <FaInbox size={32} className="opacity-50 mb-2" />
                         <span className="text-sm font-medium">No requests found.</span>
                         </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-grey-600 bg-alabaster-grey-50 px-3 py-1.5 rounded-lg border border-platinum-200">
          <span className="font-medium">Rows per page:</span>
          <select
            className="bg-transparent border-none focus:outline-none font-semibold text-gunmetal-800 cursor-pointer"
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

        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-lg border border-platinum-200 transition-all ${
              currentPage === 1 
                ? "bg-alabaster-grey-50 text-slate-grey-300 cursor-not-allowed" 
                : "bg-white text-gunmetal-600 hover:bg-platinum-50 hover:text-gunmetal-900 shadow-sm"
            }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <FaChevronLeft size={12} />
          </button>
          
          <span className="text-xs font-semibold text-gunmetal-600 uppercase tracking-wide px-2">
            Page {currentPage} of {totalPages || 1}
          </span>
          
          <button
            className={`p-2 rounded-lg border border-platinum-200 transition-all ${
              currentPage === totalPages || totalPages === 0
                ? "bg-alabaster-grey-50 text-slate-grey-300 cursor-not-allowed" 
                : "bg-white text-gunmetal-600 hover:bg-platinum-50 hover:text-gunmetal-900 shadow-sm"
            }`}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* View PDF Modal */}
      {modalType === "viewPDF" && (
        <div className="fixed inset-0 bg-gunmetal-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] relative flex flex-col shadow-2xl border border-platinum-200">
             <div className="flex justify-between items-center px-6 py-4 border-b border-platinum-200">
                <h3 className="font-bold text-gunmetal-900 text-lg">Document Viewer</h3>
                <button
                onClick={closeModal}
                className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors bg-platinum-50 rounded-full p-2"
                >
                <FaTimes size={18} />
                </button>
            </div>
            <div className="flex-1 bg-alabaster-grey-50 overflow-hidden relative rounded-b-xl">
                 <iframe
                src={selectedPdfUrl}
                className="w-full h-full"
                title="Handover Document"
                />
            </div>
          </div>
        </div>
      )}

      {/* Approve/Reject/Edit Modal */}
      {modalType && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg relative shadow-2xl border border-platinum-200 animate-in fade-in zoom-in duration-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-grey-400 hover:text-gunmetal-900 transition-colors"
            >
              <FaTimes size={20} />
            </button>
            
            <div className={`mb-6 flex items-center gap-3 pb-4 border-b border-platinum-100`}>
                 <div className={`p-2 rounded-lg ${
                     modalType === 'approve' ? 'bg-emerald-50 text-emerald-600' : 
                     modalType === 'reject' ? 'bg-rose-50 text-rose-600' : 
                     'bg-amber-50 text-amber-600'
                 }`}>
                     {modalType === 'approve' ? <FaCheckCircle size={24} /> : 
                     modalType === 'reject' ? <FaTimesCircle size={24} /> : 
                     <FaEdit size={24} />}
                 </div>
                <h2 className="text-xl font-bold text-gunmetal-900">
                {modalType === "approve"
                    ? "Approve Request"
                    : modalType === "reject"
                    ? "Reject Request"
                    : "Edit Request"}
                </h2>
            </div>
            
            {(modalType === "approve" || modalType === "reject") ? (
              <div>
                  <div className="mb-6 space-y-2 bg-alabaster-grey-50 p-4 rounded-lg border border-platinum-100">
                    <div className="flex justify-between">
                        <span className="text-sm text-slate-grey-500">Employee:</span>
                        <span className="text-sm font-semibold text-gunmetal-900">{selectedRequest.user.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-slate-grey-500">Leave Type:</span>
                        <span className="text-sm font-medium text-gunmetal-900">{selectedRequest.leaveType}</span>
                    </div>
                    <div className="flex justify-between">
                         <span className="text-sm text-slate-grey-500">Duration:</span>
                         <span className="text-sm font-mono text-gunmetal-700">{formatDate(selectedRequest.startDate)} — {formatDate(selectedRequest.endDate)}</span>
                    </div>
                    <div className="flex justify-between border-t border-platinum-200 pt-2 mt-2">
                        <span className="text-sm text-slate-grey-500">Total Days:</span>
                        <span className="text-sm font-bold text-gunmetal-900">{selectedRequest.totalDays}</span>
                    </div>
                  </div>
                
                <label className="block text-sm font-bold text-slate-grey-500 uppercase tracking-wide mb-2">
                    {modalType === 'reject' ? 'Rejection Reason (Required)' : 'Comments (Optional)'}
                </label>
                <textarea
                  placeholder="Add your notes here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-platinum-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all min-h-[100px] resize-none"
                ></textarea>
                
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 text-slate-grey-600 font-medium hover:text-gunmetal-900 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmAction}
                        className={`px-6 py-2 text-white font-semibold rounded-lg shadow-sm transition-all text-sm ${
                            modalType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                        }`}
                    >
                        Confirm Action
                    </button>
                </div>
              </div>
            ) : null} {/* The 'edit' case is handled via the separate EditLeaveRequestModal component rendered outside this block but triggered by same state logic structure in original code - keeping consistent */}

          </div>
        </div>
      )}

      {/* Edit Leave Request Modal - Rendered separately as in original design */}
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
