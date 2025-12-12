import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaFilter, 
  FaInbox, 
  FaSpinner, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCommentAlt, 
  FaFileUpload, 
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaEye 
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/formatDate";
import useUser from "../../hooks/useUser";
import DocumentViewerModal from "./DocumentViewerModal";
import { formatAttendenceTicketTime } from "../../utils/formateTime";
import { truncateComment } from "../../utils/truncateComment";

interface User {
  _id: string;
  name: string;
  abbreviatedJobTitle: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  timeIn: string;
  timeOut: string;
  totalTime: string;
  comments: string;
  file?: string;
  fileName?: string;
  status: "Open" | "Approved" | "Rejected";
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

    const totalTimeStr = `${totalHours
      .toString()
      .padStart(2, "0")}:${totalMinutes.toString().padStart(2, "0")}`;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("date", selectedDate.toISOString());
    formDataToSubmit.append("timeIn", timeIn);
    formDataToSubmit.append("timeOut", timeOut);
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

      const newTicket: AttendanceRecord = response.data.attendanceTicket;
      setAttendanceList((prevList) => [newTicket, ...prevList]);
      setNotFound(false);
      setCurrentPage(1);

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

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 mb-8">
      {/* Header */}
      <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
            <FaClock className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Attendance Ticket
            </h2>
            <p className="text-sm text-slate-grey-500">
              Submit a request for attendance correction or update.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-8 border-b border-platinum-200">
        <h3 className="text-lg font-bold text-gunmetal-900 mb-6">Create New Ticket</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gunmetal-700 flex items-center gap-2">
                <FaCalendarAlt className="text-gunmetal-400" /> Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gunmetal-700 flex items-center gap-2">
                <FaMapMarkerAlt className="text-gunmetal-400" /> Location
              </label>
              <select
                name="workLocation"
                value={formData.workLocation}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none"
                required
              >
                <option value="">Select Location</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gunmetal-700 flex items-center gap-2">
                <FaClock className="text-gunmetal-400" /> Time In
              </label>
              <input
                type="time"
                name="timeIn"
                value={formData.timeIn}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gunmetal-700 flex items-center gap-2">
                <FaClock className="text-gunmetal-400" /> Time Out
              </label>
              <input
                type="time"
                name="timeOut"
                value={formData.timeOut}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div className="space-y-2">
                <label className="text-sm font-semibold text-gunmetal-700 flex items-center gap-2">
                  <FaCommentAlt className="text-gunmetal-400" /> Comments
                </label>
                <textarea
                  name="comments"
                  rows={2}
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Additional details..."
                  className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all resize-none"
                ></textarea>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-semibold text-gunmetal-700 flex items-center gap-2">
                  <FaFileUpload className="text-gunmetal-400" /> Attachment
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-600 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gunmetal-50 file:text-gunmetal-700 hover:file:bg-gunmetal-100"
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <p className="text-xs text-slate-grey-400 mt-1 pl-1">Max 5MB (JPG, PNG, PDF)</p>
                </div>
             </div>
          </div>

          <div className="flex justify-end">
             <button
              type="submit"
              className={`px-8 py-2.5 bg-gunmetal-900 text-white text-sm font-bold rounded-lg hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20 flex items-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Filter & List Section */}
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
           <h3 className="text-lg font-bold text-gunmetal-900">Request History</h3>
           
           <div className="relative group w-full md:w-64">
               <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <select
                 value={filteredStatus}
                 onChange={(e) => {
                   setFilteredStatus(e.target.value);
                   setCurrentPage(1);
                 }}
                 className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
               >
                 <option value="All">All Statuses</option>
                 <option value="Open">Open</option>
                 <option value="Approved">Approved</option>
                 <option value="Rejected">Rejected</option>
               </select>
           </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
          {loading && attendanceList.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-16">
               <FaSpinner className="animate-spin text-gunmetal-500 mb-3" size={28} />
               <p className="text-slate-grey-500 text-sm">Loading tickets...</p>
             </div>
          ) : notFound && !loading ? (
             <div className="flex flex-col items-center justify-center py-16 bg-alabaster-grey-50/50">
               <FaInbox size={40} className="text-slate-grey-300 mb-3" />
               <span className="text-sm font-medium text-slate-grey-500">No requests found.</span>
             </div>
          ) : (
            <table className="w-full text-left bg-white border-collapse">
              <thead className="bg-alabaster-grey-50">
                <tr>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 w-16 text-center">No.</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Date</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">In</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Out</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Duration</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 w-1/4">Details</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">File</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-platinum-100">
                {paginatedList.map((record, index) => (
                  <tr key={record._id} className="hover:bg-alabaster-grey-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm text-slate-grey-500 text-center font-mono">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gunmetal-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-grey-600 text-center font-mono">
                      {formatAttendenceTicketTime(record.timeIn)}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-grey-600 text-center font-mono">
                      {formatAttendenceTicketTime(record.timeOut)}
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-gunmetal-800 text-center font-mono bg-alabaster-grey-50/30">
                      {record.totalTime}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-grey-600 truncate max-w-xs" title={record.comments}>
                      {truncateComment(record.comments) || <span className="text-slate-grey-400 italic">No comments</span>}
                    </td>
                    <td className="py-4 px-4 text-center">
                       {record.file ? (
                         <button
                           onClick={() => handleViewFile(record.file!, record.fileName!)}
                           className="text-gunmetal-600 hover:text-gunmetal-900 transition-colors p-1.5 rounded-md hover:bg-platinum-100"
                           title="View Attachment"
                         >
                           <FaEye size={14} />
                         </button>
                       ) : (
                         <span className="text-slate-grey-300">-</span>
                       )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${
                          record.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : record.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}
                      >
                         {record.status === 'Approved' && <FaCheckCircle size={10} />}
                         {record.status === 'Rejected' && <FaTimesCircle size={10} />}
                         {record.status === 'Open' && <FaHourglassHalf size={10} />}
                         {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
           <div className="flex items-center gap-2 text-sm text-slate-grey-600 bg-alabaster-grey-50 px-3 py-1.5 rounded-lg border border-platinum-200">
              <span className="font-medium">Rows:</span>
              <select
                  className="bg-transparent border-none focus:outline-none font-semibold text-gunmetal-800 cursor-pointer"
                  value={itemsPerPage}
                  onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                  }}
              >
                  {[5, 10, 20].map((option) => (
                  <option key={option} value={option}>{option}</option>
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
                onClick={handlePrevious}
            >
                <FiChevronLeft size={16} />
            </button>
            
            <span className="text-xs font-semibold text-gunmetal-600 uppercase tracking-wide px-3">
                Page {currentPage} of {totalPages || 1}
            </span>
            
            <button
                className={`p-2 rounded-lg border border-platinum-200 transition-all ${
                currentPage === totalPages || totalPages === 0
                    ? "bg-alabaster-grey-50 text-slate-grey-300 cursor-not-allowed" 
                    : "bg-white text-gunmetal-600 hover:bg-platinum-50 hover:text-gunmetal-900 shadow-sm"
                    }`}
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={handleNext}
            >
                <FiChevronRight size={16} />
            </button>
          </div>
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
