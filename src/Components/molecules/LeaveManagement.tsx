import React, { useState, useEffect } from "react";
import { FaFilter, FaInbox, FaSearch } from "react-icons/fa";

interface LeaveRequest {
  id: number;
  name: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  lastDayAtWork: string;
  returnToWork: string;
  totalDays: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  comments?: string;
}

const LeaveManagement: React.FC = () => {
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
  const [modalType, setModalType] = useState<"approve" | "reject" | "edit" | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [comment, setComment] = useState<string>("");
  const [newLeaveType, setNewLeaveType] = useState<string>("");

  const dummyData: LeaveRequest[] = [
    {
      id: 1,
      name: "John Doe",
      leaveType: "Sick Leave",
      startDate: "2024-11-10",
      endDate: "2024-11-12",
      lastDayAtWork: "2024-11-09",
      returnToWork: "2024-11-13",
      totalDays: 3,
      reason: "Fever and rest",
      status: "Pending",
    },
    {
      id: 2,
      name: "Jane Smith",
      leaveType: "Casual Leave",
      startDate: "2024-11-15",
      endDate: "2024-11-16",
      lastDayAtWork: "2024-11-14",
      returnToWork: "2024-11-17",
      totalDays: 2,
      reason: "Family event",
      status: "Pending",
    },
    {
      id: 3,
      name: "Michael Johnson",
      leaveType: "Annual Leave",
      startDate: "2024-12-01",
      endDate: "2024-12-15",
      lastDayAtWork: "2024-11-30",
      returnToWork: "2024-12-16",
      totalDays: 15,
      reason: "Vacation",
      status: "Pending",
    },
  ];

  useEffect(() => {
    setLeaveRequests(dummyData);
  }, []);

  const handlePagination = (
    data: LeaveRequest[],
    page: number,
    itemsPerPage: number
  ) => {
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handleApproveReject = (id: number, type: "approve" | "reject") => {
    setModalType(type);
    setSelectedRequest(leaveRequests.find((req) => req.id === id) || null);
  };

  const handleEdit = (id: number) => {
    setModalType("edit");
    const request = leaveRequests.find((req) => req.id === id) || null;
    setSelectedRequest(request);
    setNewLeaveType(request?.leaveType || "");
  };

  const handleConfirmAction = () => {
    if (selectedRequest && modalType) {
      if (modalType === "approve" || modalType === "reject") {
        const updatedRequest: LeaveRequest = {
          ...selectedRequest,
          status: modalType === "approve" ? "Approved" : "Rejected",
          comments: comment,
        };

        setLeaveRequests((prev) => prev.filter((req) => req.id !== selectedRequest.id));
        if (modalType === "approve") {
          setApprovedRequests((prev) => [...prev, updatedRequest]);
        } else {
          setRejectedRequests((prev) => [...prev, updatedRequest]);
        }
      } else if (modalType === "edit") {
        setLeaveRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequest.id ? { ...req, leaveType: newLeaveType } : req
          )
        );
      }
      closeModal();
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedRequest(null);
    setComment("");
    setNewLeaveType("");
  };

  const filteredRequests = leaveRequests.filter(
    (request) =>
      (filters.name === "" ||
        request.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.leaveType === "All" || request.leaveType === filters.leaveType)
  );

  const paginatedLeaveRequests = handlePagination(filteredRequests, currentPage, itemsPerPage);
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
        <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-300 flex-grow min-w-[250px]">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-300 flex-grow min-w-[250px]">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={filters.leaveType}
            onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="All">All Leave Types</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Annual Leave">Annual Leave</option>
          </select>
        </div>
      </div> 

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
        <thead className="bg-purple-900">
          <tr>
          {["S.No", "Name", "Leave Type", "From", "To", "Reason", "Actions"].map((header) => (
              <th
                key={header}
                className={`px-3 py-2 text-sm font-medium text-white ${
                  header === "Actions" ? "text-center" : "text-left"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

          <tbody>
            {paginatedLeaveRequests.length > 0 ? (
              paginatedLeaveRequests.map((request, index) => (
                <tr key={request.id} className="hover:bg-gray-100">
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.leaveType}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.startDate}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.endDate}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.reason}</td>
                  <td className="px-3 py-2 text-sm text-center">
                    <button
                      onClick={() => handleEdit(request.id)}
                      className="px-2 py-1 text-white bg-orange-500 rounded-full hover:bg-orange-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleApproveReject(request.id, "approve")}
                      className="px-2 py-1 text-white bg-green-500 rounded-full hover:bg-green-600 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproveReject(request.id, "reject")}
                      className="px-2 py-1 text-white bg-red-500 rounded-full hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={40} className="text-gray-400 mb-2" />
                    <span className="text-md font-medium">No Leave Requests Found.</span>
                  </div>
                </td>
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Approved Leaves</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
          <thead className="bg-green-600">
            <tr>
              {["S.No", "Name", "Leave Type", "From", "To", "Last Day at Work", "Return to Work", "Total Days", "Reason", "Comments"].map((header) => (
                <th key={header} className="px-3 py-2 text-sm font-medium text-white text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {approvedRequests.length > 0 ? (
              approvedRequests.map((request, index) => (
                <tr key={request.id} className="hover:bg-gray-100">
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">{index + 1}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.leaveType}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.startDate}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.endDate}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.lastDayAtWork}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.returnToWork}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.totalDays}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.reason}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.comments}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={40} className="text-gray-400 mb-2" />
                    <span className="text-md font-medium">No Approved Leaves.</span>
                  </div>
                </td>
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Rejected Leaves</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
          <thead className="bg-red-600">
            <tr>
              {["S.No", "Name", "Leave Type", "From", "To", "Last Day at Work", "Return to Work", "Total Days", "Reason", "Comments"].map((header) => (
                <th key={header} className="px-3 py-2 text-sm font-medium text-white text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rejectedRequests.length > 0 ? (
              rejectedRequests.map((request, index) => (
                <tr key={request.id} className="hover:bg-gray-100">
                  <td className="px-3 py-2 text-sm text-gray-800 text-center">{index + 1}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.leaveType}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.startDate}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.endDate}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.lastDayAtWork}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.returnToWork}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.totalDays}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.reason}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.comments}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={40} className="text-gray-400 mb-2" />
                    <span className="text-md font-medium"> No Rejected Leaves.</span>
                  </div>
                </td>
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
      </div>

      {modalType && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
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
                    <strong>Name:</strong> {selectedRequest.name}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Leave Type:</strong> {selectedRequest.leaveType}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>From:</strong> {selectedRequest.startDate}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>To:</strong> {selectedRequest.endDate}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Last Day at Work:</strong> {selectedRequest.lastDayAtWork}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Return to Work:</strong> {selectedRequest.returnToWork}
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
                  value={newLeaveType}
                  onChange={(e) => setNewLeaveType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                </select>

                <label className="block mb-2 text-sm font-medium text-gray-700">
                  From
                </label>
                <input
                  type="date"
                  value={selectedRequest.startDate}
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
                  value={selectedRequest.endDate}
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
                  value={selectedRequest.lastDayAtWork}
                  onChange={(e) =>
                    setSelectedRequest((prev) =>
                      prev ? { ...prev, lastDayAtWork: e.target.value } : null
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                />

                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Return to Work
                </label>
                <input
                  type="date"
                  value={selectedRequest.returnToWork}
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



    </div>
  );
};

export default LeaveManagement;