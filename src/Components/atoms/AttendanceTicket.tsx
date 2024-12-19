// components/AttendanceTicket.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilter, FaInbox, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/formatDate";
import useUser from "../../hooks/useUser";
import DocumentViewerModal from "./DocumentViewerModal";
import { formatTime } from "../../utils/formateTime";

interface User {
  _id: string;
  name: string;
  abbreviatedJobTitle: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  timeIn?: string; // Made optional
  timeOut?: string; // Made optional
  totalTime: string;
  comments: string;
  file?: string;
  fileName?: string;
  status: "Open" | "Approved" | "Rejected"; // Updated statuses
  workLocation: string;
  user: User;
}

const AttendanceTicket: React.FC = () => {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    date: string;
    timeIn: string;
    timeOut: string;
    comments: string;
    file: File | null;
    workLocation: string;
  }>({
    date: "",
    timeIn: "",
    timeOut: "",
    comments: "",
    file: null,
    workLocation: "",
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    name: string;
    type: "image" | "pdf";
  } | null>(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const user = useUser();
  const userId = user.user?._id;

  useEffect(() => {
    const fetchAttendanceTickets = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await axios.get<AttendanceRecord[]>(
          `${backendUrl}/api/attendance-tickets/user/${userId}`,
          {
            withCredentials: true,
          }
        );
        console.log("Fetched Tickets:", response.data);

        setAttendanceList(response.data);
        setNotFound(response.data.length === 0);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceTickets();
  }, [backendUrl, userId]);

  const filteredAttendanceList =
    filteredStatus === "All"
      ? attendanceList
      : attendanceList.filter((record) => record.status === filteredStatus);

  const totalPages = Math.ceil(filteredAttendanceList.length / itemsPerPage);
  const paginatedList = filteredAttendanceList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(selected.type)) {
        toast.error("Only JPG, PNG, and PDF files are allowed.");
        return;
      }

      if (selected.size > maxSize) {
        toast.error("File size must be less than 5MB.");
        return;
      }

      setFormData({ ...formData, file: selected });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { date, timeIn, timeOut, comments, workLocation, file } = formData;

    if (!date || !timeIn || !timeOut || !workLocation) {
      toast.error("Date, Time In, Time Out, and Work Location are required.");
      return;
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const [timeInHour, timeInMinute] = timeIn.split(":").map(Number);
    const timeInDate = new Date(selectedDate);
    timeInDate.setHours(timeInHour, timeInMinute, 0, 0);

    const [timeOutHour, timeOutMinute] = timeOut.split(":").map(Number);
    const timeOutDate = new Date(selectedDate);
    timeOutDate.setHours(timeOutHour, timeOutMinute, 0, 0);

    if (timeOutDate <= timeInDate) {
      timeOutDate.setDate(timeOutDate.getDate() + 1);
    }

    const totalTimeMs = timeOutDate.getTime() - timeInDate.getTime();

    const totalHours = Math.floor(totalTimeMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(
      (totalTimeMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    const totalTimeStr = `${totalHours}h ${totalMinutes}m`;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("date", selectedDate.toISOString());

    // **Updated Lines: Send ISO Strings for timeIn and timeOut**
    formDataToSubmit.append("timeIn", timeInDate.toISOString());
    formDataToSubmit.append("timeOut", timeOutDate.toISOString());

    formDataToSubmit.append("totalTime", totalTimeStr);
    formDataToSubmit.append("comments", comments || "");
    formDataToSubmit.append("workLocation", workLocation);
    if (userId) {
      formDataToSubmit.append("userId", userId);
    }

    if (file) {
      formDataToSubmit.append("attendanceTicket", file);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/attendance-tickets`,
        formDataToSubmit,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Assuming the response contains the newly created attendance ticket
      const newTicket: AttendanceRecord = response.data.attendanceTicket;

      // Update the attendance list by adding the new ticket at the top
      setAttendanceList((prevList) => [newTicket, ...prevList]);

      // Set notFound to false since there's at least one ticket now
      setNotFound(false);

      // Reset to the first page to show the new ticket
      setCurrentPage(1);

      // Reset form data
      setFormData({
        date: "",
        timeIn: "",
        timeOut: "",
        comments: "",
        file: null,
        workLocation: "",
      });

      toast.success("Attendance ticket submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting ticket:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit attendance ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = (filePath: string, fileName: string) => {
    const fileUrl = `${backendUrl}/${filePath}`;
    const fileType = fileUrl.endsWith(".pdf") ? "pdf" : "image";
    setSelectedFile({ url: fileUrl, name: fileName, type: fileType });
    setModalOpen(true);
  };

  const thClass =
    "bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center";
  const tdClass =
    "text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center";

  return (
    <div className="w-full p-6 bg-white rounded-lg mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mt-2 mb-3 text-black">
        Submit New Attendance Ticket
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Work Location
            </label>
            <select
              name="workLocation"
              value={formData.workLocation}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Work Location</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option> {/* Added Hybrid option */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time In
            </label>
            <input
              type="time"
              name="timeIn"
              value={formData.timeIn}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time Out
            </label>
            <input
              type="time"
              name="timeOut"
              value={formData.timeOut}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Comments
          </label>
          <textarea
            name="comments"
            rows={3}
            value={formData.comments}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select File
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            accept=".jpg,.jpeg,.png,.pdf" // Restrict file types
          />
        </div>
        <button
          type="submit"
          className={`px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="flex justify-between items-center mb-3 mt-6">
        <h2 className="text-lg md:text-xl font-bold text-black">
          Ticket Status
        </h2>
        <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border border-gray-300">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={filteredStatus}
            onChange={(e) => {
              setFilteredStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option> {/* Changed to 'Open' */}
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-10 mb-10">
            <FaSpinner
              size={30}
              className="animate-spin text-blue-600 mb-2"
              aria-hidden="true"
            />
          </div>
        ) : notFound ? (
          <div className="flex flex-col items-center">
            <FaInbox size={30} className="text-gray-400 mb-4" />
            <span className="text-lg font-medium">No tickets available</span>
          </div>
        ) : paginatedList.length > 0 ? (
          <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className={thClass}>S.No</th>
                <th className={thClass}>Date</th>
                <th className={thClass}>Time In</th>
                <th className={thClass}>Time Out</th>
                <th className={thClass}>Total Time</th>
                <th className={thClass}>Comments</th>
                <th className={thClass}>File</th>
                <th className={thClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((record, index) => (
                <tr key={record._id}>
                  <td className={tdClass}>
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className={tdClass}>{formatDate(record.date)}</td>
                  <td className={tdClass}>{formatTime(record.timeIn)}</td>
                  <td className={tdClass}>{formatTime(record.timeOut)}</td>
                  <td className={tdClass}>{record.totalTime}</td>
                  <td className={`${tdClass} text-blue-600 cursor-pointer`}>
                    {record.comments || "No Comments"}
                  </td>
                  <td className={tdClass}>
                    {record.file ? (
                      <button
                        onClick={() =>
                          handleViewFile(record.file!, record.fileName!)
                        }
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    ) : (
                      "No File"
                    )}
                  </td>
                  <td
                    className={`${tdClass} ${
                      record.status === "Rejected"
                        ? "text-red-600"
                        : record.status === "Approved"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {record.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center">
            <FaInbox size={30} className="text-gray-400 mb-4" />
            <span className="text-lg font-medium">No tickets available</span>
          </div>
        )}
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
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>

      <DocumentViewerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        fileUrl={selectedFile?.url || ""}
        fileName={selectedFile?.name || ""}
        fileType={selectedFile?.type || "image"}
      />
    </div>
  );
};

export default AttendanceTicket;
