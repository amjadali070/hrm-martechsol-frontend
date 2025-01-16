import React, { useState, useEffect, FormEvent, useMemo } from "react";
import { FaSpinner, FaEdit, FaTrash } from "react-icons/fa";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosConfig";
import { AttendanceType, TimeLog } from "../../types/attendance";
import BulkAttendanceForm from "./BulkAttendanceForm";
import SupportingModal from "./SupportingModal";

interface AttendanceManagerProps {}

interface TimeLogExtended extends TimeLog {
  userName: string;
}

const statusColors: Record<AttendanceType, string> = {
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
  "Late IN": "bg-yellow-100 text-yellow-800",
  "Half Day": "bg-orange-100 text-orange-800",
  "Early Out": "bg-pink-100 text-pink-800",
  "Late IN and Early Out": "bg-violet-100 text-violet-800",
  "Casual Leave": "bg-blue-100 text-blue-800",
  "Sick Leave": "bg-lime-100 text-lime-800",
  "Annual Leave": "bg-purple-100 text-purple-800",
  "Hajj Leave": "bg-cyan-100 text-cyan-800",
  "Maternity Leave": "bg-fuchsia-100 text-fuchsia-800",
  "Paternity Leave": "bg-teal-100 text-teal-800",
  "Bereavement Leave": "bg-slate-100 text-slate-800",
  "Unauthorized Leave": "bg-red-200 text-red-900",
  "Public Holiday": "bg-sky-100 text-sky-800",
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const getDayOfWeek = (dateString: string) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateString);
  return days[date.getDay()];
};

const AttendanceManager: React.FC<AttendanceManagerProps> = () => {
  const { user, loading: userLoading } = useUser();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Tab state: "active", "edit", or "deleted"
  const [activeTab, setActiveTab] = useState<"active" | "edit" | "deleted">(
    "active"
  );

  // Data states:
  const [allAttendanceRecords, setAllAttendanceRecords] = useState<
    TimeLogExtended[]
  >([]);
  const [filteredAttendanceRecords, setFilteredAttendanceRecords] = useState<
    TimeLogExtended[]
  >([]);
  const [deletedRecords, setDeletedRecords] = useState<TimeLogExtended[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states:
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<TimeLogExtended | null>(
    null
  );
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);

  // Pagination (for active and edit tabs)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(50);

  // Filter states (applies to active and edit tabs)
  const [filterUserName, setFilterUserName] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");

  // Bulk selection (active tab only)
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);

  // Fetch records based on tab selection:
  useEffect(() => {
    if (!userLoading) {
      if (activeTab === "active" || activeTab === "edit") {
        fetchAllAttendanceRecords();
      } else if (activeTab === "deleted") {
        fetchDeletedAttendanceRecords();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLoading, activeTab]);

  const fetchAllAttendanceRecords = async () => {
    if (!user) {
      setLoading(false);
      setError("User not authenticated.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/attendance?limit=10000`,
        { withCredentials: true }
      );
      let attendances: any[] = [];
      if (response.data && Array.isArray(response.data.attendances)) {
        attendances = response.data.attendances;
      } else if (Array.isArray(response.data)) {
        attendances = response.data;
      } else {
        console.warn("Unexpected response shape:", response.data);
        attendances = response.data;
      }
      attendances = attendances.map((record: any) => ({
        ...record,
        userName: record.user?.name || "Unknown",
      }));
      setAllAttendanceRecords(attendances);
      setFilteredAttendanceRecords(attendances);
      // Clear selection in active tab
      setSelectedRecords([]);
    } catch (err: any) {
      console.error("Error fetching attendance records:", err);
      setError(
        err.response?.data?.message || "Failed to fetch attendance records."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedAttendanceRecords = async () => {
    if (!user) {
      setLoading(false);
      setError("User not authenticated.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/attendance/deleted`,
        { withCredentials: true }
      );
      let attendances: any[] = [];
      if (response.data && Array.isArray(response.data)) {
        attendances = response.data;
      } else {
        console.warn("Unexpected response shape:", response.data);
        attendances = response.data;
      }
      attendances = attendances.map((record: any) => ({
        ...record,
        userName: record.user?.name || "Unknown",
      }));
      setDeletedRecords(attendances);
    } catch (err: any) {
      console.error("Error fetching deleted attendance records:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch deleted attendance records."
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter active/edit records based on user name and date
  useEffect(() => {
    if (activeTab === "active" || activeTab === "edit") {
      let filtered = allAttendanceRecords;
      if (filterUserName.trim() !== "") {
        filtered = filtered.filter((record) =>
          record.userName.toLowerCase().includes(filterUserName.toLowerCase())
        );
      }
      if (filterDate !== "") {
        const selectedDate = new Date(filterDate);
        filtered = filtered.filter((record) => {
          const recordDate = new Date(record.createdAt);
          return (
            recordDate.getFullYear() === selectedDate.getFullYear() &&
            recordDate.getMonth() === selectedDate.getMonth() &&
            recordDate.getDate() === selectedDate.getDate()
          );
        });
      }
      setFilteredAttendanceRecords(filtered);
      setCurrentPage(1);
    }
  }, [filterUserName, filterDate, allAttendanceRecords, activeTab]);

  // Memoize paginated data (for active/edit tabs)
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAttendanceRecords.slice(startIndex, startIndex + pageSize);
  }, [filteredAttendanceRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAttendanceRecords.length / pageSize);

  // Helpers for bulk selection in active tab:
  const toggleSelection = (recordId: string) => {
    setSelectedRecords((prev) =>
      prev.includes(recordId)
        ? prev.filter((id) => id !== recordId)
        : [...prev, recordId]
    );
  };

  const isAllSelected = useMemo(
    () =>
      paginatedRecords.length > 0 &&
      paginatedRecords.every((record) => selectedRecords.includes(record._id)),
    [paginatedRecords, selectedRecords]
  );

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRecords((prev) =>
        prev.filter(
          (id) => !paginatedRecords.find((record) => record._id === id)
        )
      );
    } else {
      const newSelected = paginatedRecords
        .map((record) => record._id)
        .filter((id) => !selectedRecords.includes(id));
      setSelectedRecords((prev) => [...prev, ...newSelected]);
    }
  };

  // Action handlers
  const handleTimeIn = async () => {
    if (!user?._id) {
      alert("User not authenticated.");
      return;
    }
    try {
      await axiosInstance.post(
        `${backendUrl}/api/attendance/time-in`,
        { userId: user._id },
        { withCredentials: true }
      );
      fetchAllAttendanceRecords();
      alert("Time In logged successfully.");
    } catch (err: any) {
      console.error("Error logging time in:", err);
      alert(err.response?.data?.message || "Failed to log Time In.");
    }
  };

  const handleTimeOut = async () => {
    if (!user?._id) {
      alert("User not authenticated.");
      return;
    }
    try {
      await axiosInstance.post(
        `${backendUrl}/api/attendance/time-out`,
        { userId: user._id },
        { withCredentials: true }
      );
      fetchAllAttendanceRecords();
      alert("Time Out logged successfully.");
    } catch (err: any) {
      console.error("Error logging time out:", err);
      alert(err.response?.data?.message || "Failed to log Time Out.");
    }
  };

  const openEditModal = (record: TimeLogExtended) => {
    setCurrentRecord(record);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setCurrentRecord(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (recordId: string) => {
    if (
      !window.confirm("Are you sure you want to delete this attendance record?")
    )
      return;
    try {
      await axiosInstance.delete(`${backendUrl}/api/attendance/${recordId}`, {
        withCredentials: true,
      });
      if (activeTab === "active" || activeTab === "edit") {
        fetchAllAttendanceRecords();
      } else {
        fetchDeletedAttendanceRecords();
      }
      alert("Attendance record deleted successfully.");
    } catch (err: any) {
      console.error("Error deleting attendance record:", err);
      alert(
        err.response?.data?.message || "Failed to delete attendance record."
      );
    }
  };

  // Handle bulk deletion (only for active tab)
  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete the selected attendance records?"
      )
    )
      return;
    try {
      await Promise.all(
        selectedRecords.map((recordId) =>
          axiosInstance.delete(`${backendUrl}/api/attendance/${recordId}`, {
            withCredentials: true,
          })
        )
      );
      alert("Selected attendance records deleted successfully.");
      setSelectedRecords([]);
      fetchAllAttendanceRecords();
    } catch (err: any) {
      console.error("Error deleting selected records:", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete selected attendance records."
      );
    }
  };

  // Permanently delete all soft-deleted records (deleted tab)
  const handlePermanentDeleteAll = async () => {
    if (
      !window.confirm(
        "This action cannot be undone. Are you sure you want to permanently delete all deleted attendance records from the database?"
      )
    )
      return;
    try {
      await axiosInstance.delete(`${backendUrl}/api/attendance/deleted`, {
        withCredentials: true,
      });
      alert(
        "All deleted attendance records have been permanently removed from the database."
      );
      fetchDeletedAttendanceRecords();
    } catch (err: any) {
      console.error("Error permanently deleting records:", err);
      alert(
        err.response?.data?.message ||
          "Failed to permanently delete attendance records."
      );
    }
  };

  // Handle edit submission from modal.
  // Use the new endpoint /api/attendance/edit/:id when in the "edit" tab.
  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentRecord) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const getField = (name: string): string =>
      formData.get(name)?.toString().trim() || "";
    const date = getField("date");
    const timeInField = getField("timeIn");
    const timeOutField = getField("timeOut");
    const typeField = getField("type");
    const remarksField = getField("remarks");

    if (!date) {
      alert("Date is required.");
      return;
    }
    let combinedTimeIn: string | null = null;
    if (timeInField !== "") {
      const potentialTimeIn = new Date(`${date}T${timeInField}:00`);
      if (isNaN(potentialTimeIn.getTime())) {
        alert("Invalid Time In value.");
        return;
      }
      combinedTimeIn = potentialTimeIn.toISOString();
    }
    let combinedTimeOut: string | null = null;
    if (timeOutField !== "") {
      let potentialTimeOut = new Date(`${date}T${timeOutField}:00`);
      if (isNaN(potentialTimeOut.getTime())) {
        alert("Invalid Time Out value.");
        return;
      }
      if (combinedTimeIn) {
        const timeInDate = new Date(combinedTimeIn);
        if (potentialTimeOut < timeInDate) {
          potentialTimeOut.setDate(potentialTimeOut.getDate() + 1);
        }
      }
      combinedTimeOut = potentialTimeOut.toISOString();
    }
    const updatedData: Partial<TimeLog> = {
      timeIn: combinedTimeIn,
      timeOut: combinedTimeOut,
      type: typeField as AttendanceType,
      remarks: remarksField,
    };

    try {
      // Use the "edit" endpoint if in "edit" tab; otherwise use the standard update endpoint.
      const patchEndpoint =
        activeTab === "edit"
          ? `${backendUrl}/api/attendance/edit/${currentRecord._id}`
          : `${backendUrl}/api/attendance/${currentRecord._id}`;
      await axiosInstance.patch(patchEndpoint, updatedData, {
        withCredentials: true,
      });
      // Refresh records accordingly
      if (activeTab === "active" || activeTab === "edit") {
        fetchAllAttendanceRecords();
      }
      closeEditModal();
      alert("Attendance record updated successfully.");
    } catch (err: any) {
      console.error("Error updating attendance record:", err);
      alert(
        err.response?.data?.message || "Failed to update attendance record."
      );
    }
  };

  const openBulkModal = () => {
    setIsBulkModalOpen(true);
  };

  const closeBulkModal = () => {
    setIsBulkModalOpen(false);
  };

  const handleBulkSubmit = async (users: string[], date: string) => {
    try {
      await axiosInstance.post(
        `${backendUrl}/api/attendance/bulk`,
        { users, date },
        { withCredentials: true }
      );
      fetchAllAttendanceRecords();
      closeBulkModal();
      alert("Bulk attendance processed successfully.");
    } catch (err: any) {
      console.error("Error processing bulk attendance:", err);
      alert(
        err.response?.data?.message || "Failed to process bulk attendance."
      );
    }
  };

  return (
    <section className="flex flex-col w-full p-4">
      <div className="bg-white rounded-xl p-6">
        {/* Tab Headers */}
        <div className="mb-4 flex border-b">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === "active"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            Active Attendances
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === "edit"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            Edit Records
          </button>
          <button
            onClick={() => setActiveTab("deleted")}
            className={`px-4 py-2 -mb-px font-semibold ${
              activeTab === "deleted"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            Deleted Attendances
          </button>
        </div>

        {/* Content for Active and Edit tabs */}
        {(activeTab === "active" || activeTab === "edit") && (
          <>
            {activeTab === "active" && (
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Attendance Manager
                </h2>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <button
                    onClick={handleTimeIn}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                  >
                    Time In
                  </button>
                  <button
                    onClick={handleTimeOut}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    Time Out
                  </button>
                  {user?.role && ["test"].includes(user.role) && (
                    <button
                      onClick={openBulkModal}
                      className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-300"
                    >
                      Bulk Process
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* Filter Section */}
            <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
              <div className="flex-1 mb-4 md:mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by User Name
                </label>
                <input
                  type="text"
                  value={filterUserName}
                  onChange={(e) => setFilterUserName(e.target.value)}
                  placeholder="Enter user name"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
            {activeTab === "active" &&
              user?.role &&
              ["test"].includes(user.role) &&
              selectedRecords.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                  >
                    Delete Selected ({selectedRecords.length})
                  </button>
                </div>
              )}
            {loading ? (
              <div
                className="flex justify-center items-center"
                style={{ height: "200px" }}
              >
                <FaSpinner className="text-blue-500 animate-spin" size={30} />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-800">
                    <tr>
                      {activeTab === "active" &&
                        user?.role &&
                        ["test"].includes(user.role) && (
                          <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-l-md">
                            <input
                              type="checkbox"
                              checked={isAllSelected}
                              onChange={toggleSelectAll}
                            />
                          </th>
                        )}
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        User Name
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Time In
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Time Out
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Status
                      </th>
                      {user?.role && ["test"].includes(user.role) && (
                        <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-r-md">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedRecords.length > 0 ? (
                      paginatedRecords.map((record) => (
                        <tr key={record._id} className="hover:bg-gray-100">
                          {activeTab === "active" &&
                            user?.role &&
                            ["test"].includes(user.role) && (
                              <td className="px-4 py-2 whitespace-nowrap text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedRecords.includes(record._id)}
                                  onChange={() => toggleSelection(record._id)}
                                />
                              </td>
                            )}
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {record.userName}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {getDayOfWeek(record.createdAt)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {record.timeIn
                              ? new Date(record.timeIn).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {record.timeOut
                              ? new Date(record.timeOut).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {formatDuration(record.duration)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-center">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                statusColors[record.type] ||
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {record.type}
                            </span>
                          </td>
                          {user?.role && ["test"].includes(user.role) && (
                            <td className="px-4 py-2 whitespace-nowrap text-center space-x-2">
                              {/* Edit icon present in both "active" and "edit" tabs */}
                              <button
                                onClick={() => openEditModal(record)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              {activeTab === "active" && (
                                <button
                                  onClick={() => handleDelete(record._id)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={
                            user?.role && ["test"].includes(user.role) ? 9 : 8
                          }
                          className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center"
                        >
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {/* Pagination for active and edit tabs */}
            {!loading && filteredAttendanceRecords.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Content for Deleted Attendances Tab */}
        {activeTab === "deleted" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Deleted Attendances
              </h2>
              {user?.role && ["test"].includes(user.role) && (
                <button
                  onClick={handlePermanentDeleteAll}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                >
                  Permanently Delete All
                </button>
              )}
            </div>
            {loading ? (
              <div
                className="flex justify-center items-center"
                style={{ height: "200px" }}
              >
                <FaSpinner className="text-blue-500 animate-spin" size={30} />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        User Name
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Time In
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Time Out
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Status
                      </th>
                      {user?.role && ["test"].includes(user.role) && (
                        <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deletedRecords.length > 0 ? (
                      deletedRecords.map((record) => (
                        <tr key={record._id} className="hover:bg-gray-100">
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {record.userName}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {getDayOfWeek(record.createdAt)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {record.timeIn
                              ? new Date(record.timeIn).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {record.timeOut
                              ? new Date(record.timeOut).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                            {formatDuration(record.duration)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-center">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                statusColors[record.type] ||
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {record.type}
                            </span>
                          </td>
                          {user?.role && ["test"].includes(user.role) && (
                            <td className="px-4 py-2 whitespace-nowrap text-center">
                              <button
                                onClick={() => handleDelete(record._id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={
                            user?.role && ["test"].includes(user.role) ? 8 : 7
                          }
                          className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center"
                        >
                          No deleted attendance records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Attendance Modal */}
      {isEditModalOpen && currentRecord && (
        <SupportingModal onClose={closeEditModal}>
          <h2 className="text-xl font-bold mb-4">Edit Attendance</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                defaultValue={
                  currentRecord.createdAt
                    ? new Date(currentRecord.createdAt)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time In
              </label>
              <input
                type="time"
                name="timeIn"
                placeholder="--:--"
                defaultValue={
                  currentRecord.timeIn
                    ? new Date(currentRecord.timeIn).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : ""
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time Out
              </label>
              <input
                type="time"
                name="timeOut"
                placeholder="--:--"
                defaultValue={
                  currentRecord.timeOut
                    ? new Date(currentRecord.timeOut).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : ""
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                name="type"
                defaultValue={currentRecord.type}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late IN">Late IN</option>
                <option value="Half Day">Half Day</option>
                <option value="Early Out">Early Out</option>
                <option value="Late IN and Early Out">
                  Late IN and Early Out
                </option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Hajj Leave">Hajj Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
                <option value="Bereavement Leave">Bereavement Leave</option>
                <option value="Unauthorized Leave">Unauthorized Leave</option>
                <option value="Public Holiday">Public Holiday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <textarea
                name="remarks"
                defaultValue={currentRecord.remarks || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                maxLength={500}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Save
              </button>
            </div>
          </form>
        </SupportingModal>
      )}

      {/* Bulk Attendance Modal */}
      {isBulkModalOpen && (
        <BulkAttendanceForm
          onClose={closeBulkModal}
          onSubmit={handleBulkSubmit}
        />
      )}
    </section>
  );
};

export default AttendanceManager;
