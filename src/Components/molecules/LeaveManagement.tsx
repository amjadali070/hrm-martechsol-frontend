import React, { useState, useEffect } from "react";
import { FaInbox } from "react-icons/fa";

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
}

const LeaveManagement: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    leaveType: "All",
    status: "All",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [actionVisible, setActionVisible] = useState<number | null>(null);
  const [modalType, setModalType] = useState<"approve" | "reject" | "edit" | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [comment, setComment] = useState<string>("");

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
      status: "Approved",
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

  const handleApproveReject = (id: number, type: "approve" | "reject") => {
    setModalType(type);
    setSelectedRequest(leaveRequests.find((req) => req.id === id) || null);
  };

  const handleEdit = (id: number) => {
    setModalType("edit");
    setSelectedRequest(leaveRequests.find((req) => req.id === id) || null);
  };

  const handleConfirmAction = () => {
    if (modalType === "approve" || modalType === "reject") {
      setLeaveRequests((prev) =>
        prev.map((request) =>
          request.id === selectedRequest?.id
            ? { ...request, status: modalType === "approve" ? "Approved" : "Rejected" }
            : request
        )
      );
    } else if (modalType === "edit" && selectedRequest) {
      setLeaveRequests((prev) =>
        prev.map((request) => (request.id === selectedRequest.id ? selectedRequest : request))
      );
    }
    closeModal();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedRequest(null);
    setComment("");
  };

  const filteredRequests = leaveRequests.filter(
    (request) =>
      (filters.name === "" ||
        request.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.leaveType === "All" || request.leaveType === filters.leaveType) &&
      (filters.status === "All" || request.status === filters.status)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Leave Management</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={filters.leaveType}
          onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="All">All Leave Types</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Annual Leave">Annual Leave</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
          <thead className="bg-purple-900">
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
                "Reason",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 text-left text-sm font-medium text-white"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRequests.length > 0 ? (
              currentRequests.map((request, index) => (
                <tr key={request.id} className="hover:bg-gray-100">
                  <td className="px-3 py-2 text-sm text-gray-800">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.leaveType}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.startDate}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.endDate}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.lastDayAtWork}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.returnToWork}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.totalDays}</td>
                  <td className="px-3 py-2 text-sm text-gray-800">{request.reason}</td>
                  <td className="px-3 py-2 text-sm text-center text-gray-800">
                    {request.status}
                  </td>
                  <td className="px-3 py-2 text-sm text-center">
                    <button
                      onClick={() => console.log(`Edit Leave Request: ${request.id}`)}
                      className="px-2 py-1 text-white bg-green-600 rounded-full hover:bg-green-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                   className="text-center py-8 text-gray-500"
                >
                <div className="flex flex-col items-center justify-center">
                  <FaInbox size={40} className="text-gray-400 mb-2" />
                  <span className="text-md font-medium"> No Leave Found.</span>
                </div>
               </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
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
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded-full ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded-full ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
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
              <>
                <textarea
                  placeholder="Add your comments"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                ></textarea>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <div>
                <input
                  type="text"
                  value={selectedRequest.name}
                  onChange={(e) =>
                    setSelectedRequest((prev) => ({
                      ...prev!,
                      name: e.target.value,
                    }))
                  }
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                />
                <textarea
                  value={selectedRequest.reason}
                  onChange={(e) =>
                    setSelectedRequest((prev) => ({
                      ...prev!,
                      reason: e.target.value,
                    }))
                  }
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                ></textarea>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;