import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaTimes,
  FaInbox,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaRegCalendarCheck,
  FaEye,
  FaDownload,
  FaExclamationCircle
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useUser from "../../hooks/useUser";
import axios from "axios";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/formatDate";

interface LeaveApplication {
  _id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  lastDayToWork: string;
  returnToWork: string;
  totalDays: number;
  handoverDocument: string;
  reason: string;
  comments: string | null;
  status: "Pending" | "Approved" | "Rejected";
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface LeaveApplicationDetailModalProps {
  isOpen: boolean;
  application: LeaveApplication | null;
  onClose: () => void;
  onOpenFile: (filePath: string) => void;
}

const LeaveApplicationDetailModal: React.FC<LeaveApplicationDetailModalProps> = ({ isOpen, application, onClose, onOpenFile }) => {
  if (!isOpen || !application) return null;

  const getStatusConfig = (status: "Pending" | "Approved" | "Rejected") => {
    switch (status) {
      case "Approved":
        return {
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <FaCheckCircle className="text-emerald-600 mr-2" />,
          label: "Approved",
        };
      case "Rejected":
        return {
          color: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <FaTimesCircle className="text-rose-600 mr-2" />,
          label: "Rejected",
        };
      default:
        return {
          color: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <FaExclamationCircle className="text-amber-600 mr-2" />,
          label: "Pending",
        };
    }
  };

  const statusConfig = getStatusConfig(application.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl border border-platinum-200 flex flex-col max-h-[90vh]">
         {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-platinum-200 bg-alabaster-grey-50 rounded-t-xl">
            <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${statusConfig.color.split(' ')[0]}`}>
                    <FaFileAlt className={`${statusConfig.color.split(' ')[1]}`} />
                 </div>
                 <div>
                    <h2 className="text-lg font-bold text-gunmetal-900">Leave Details</h2>
                    <p className="text-xs text-slate-grey-500 font-medium">ID: {application._id ? application._id.slice(-6).toUpperCase() : 'N/A'}</p>
                 </div>
            </div>
            <button
                onClick={onClose}
                className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors p-1"
            >
                <FaTimes size={18} />
            </button>
        </div>

        <div className="p-6 overflow-y-auto bg-white">
           {/* Status Banner */}
           <div className={`flex items-center justify-between p-4 rounded-xl border mb-6 ${statusConfig.color}`}>
                <div className="flex items-center font-bold">
                    {statusConfig.icon}
                    <span className="text-sm">{statusConfig.label}</span>
                </div>
                {application.totalDays > 0 && (
                    <span className="text-xs font-bold bg-white/50 px-2 py-1 rounded">
                        {application.totalDays} Day{application.totalDays !== 1 ? 's' : ''}
                    </span>
                )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 rounded-xl border border-platinum-200 bg-alabaster-grey-50/50">
                    <p className="text-xs font-bold text-slate-grey-500 uppercase mb-1">Leave Type</p>
                    <p className="text-sm font-bold text-gunmetal-900">{application.leaveType}</p>
                </div>
                <div className="p-4 rounded-xl border border-platinum-200 bg-alabaster-grey-50/50">
                     <p className="text-xs font-bold text-slate-grey-500 uppercase mb-1">Duration</p>
                     <div className="flex items-center gap-2 text-sm font-bold text-gunmetal-900">
                        <FaCalendarAlt className="text-slate-grey-400 text-xs" />
                        {formatDate(application.startDate)}
                         <span className="text-slate-grey-400 font-normal">to</span>
                        {formatDate(application.endDate)}
                     </div>
                </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="flex flex-col">
                    <p className="text-xs font-bold text-slate-grey-500 uppercase mb-1 flex items-center gap-1"><FaClock className="text-xs" /> Last Day of Work</p>
                    <p className="text-sm font-mono text-gunmetal-800">{formatDate(application.lastDayToWork)}</p>
                 </div>
                 <div className="flex flex-col">
                    <p className="text-xs font-bold text-slate-grey-500 uppercase mb-1 flex items-center gap-1"><FaClock className="text-xs" /> Return to Work</p>
                    <p className="text-sm font-mono text-gunmetal-800">{formatDate(application.returnToWork)}</p>
                 </div>
           </div>

           <div className="mb-6">
                <h4 className="text-sm font-bold text-gunmetal-900 mb-2 uppercase tracking-wide">Reason</h4>
                <div className="p-4 border border-platinum-200 rounded-xl bg-alabaster-grey-50 text-slate-grey-700 text-sm leading-relaxed">
                    {application.reason || "No reason provided."}
                </div>
           </div>

            {application.comments && (
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-gunmetal-900 mb-2 uppercase tracking-wide">Admin Comments</h4>
                     <div className="p-4 border border-l-4 border-platinum-200 border-l-gunmetal-500 rounded-r-xl bg-alabaster-grey-50 text-slate-grey-700 text-sm leading-relaxed">
                        {application.comments}
                    </div>
                </div>
            )}

            {application.handoverDocument && (
                <div className="flex items-center justify-between p-4 rounded-xl border border-platinum-200 bg-alabaster-grey-50/50 hover:bg-alabaster-grey-50 transition-colors">
                    <div className="flex items-center gap-3">
                         <div className="bg-white p-2 rounded-lg border border-platinum-200 shadow-sm text-gunmetal-500">
                             <FaFileAlt />
                         </div>
                         <div>
                             <p className="text-sm font-bold text-gunmetal-900">Attachment</p>
                             <p className="text-xs text-slate-grey-500">Document uploaded by user</p>
                         </div>
                    </div>
                    <button
                        onClick={() => onOpenFile(`${application.handoverDocument.replace(/\\/g, "/")}`)}
                        className="p-2 text-gunmetal-600 hover:text-gunmetal-900 hover:bg-platinum-100 rounded-lg transition-all"
                        title="View Document"
                    >
                        <FaDownload />
                    </button>
                </div>
            )}
        </div>
         <div className="p-6 border-t border-platinum-200 bg-white rounded-b-xl flex justify-end">
               <button
                onClick={onClose}
                className="px-6 py-2 bg-white border border-platinum-200 text-gunmetal-700 font-semibold rounded-lg hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm text-sm"
               >
                Close
               </button>
         </div>
      </div>
    </div>
  );
};

const TrackApplication: React.FC = () => {
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterLeaveType, setFilterLeaveType] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      if (!user?._id) return;
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `${backendUrl}/api/leave-applications/user/${user._id}`,
          { withCredentials: true }
        );
        const data = response.data;
        if (response.status === 200) {
          setLeaveApplications(data);
        } else {
          setError(data.message || "Failed to fetch leave applications.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error("Error fetching leave applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveApplications();
  }, [user?._id]);

  const leaveTypes = ["All", ...new Set(leaveApplications.map((app) => app.leaveType))];

  const filteredApplications = leaveApplications.filter((app) => {
    const matchesStatus = filterStatus === "All" ? true : app.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesLeaveType = filterLeaveType === "All" ? true : app.leaveType === filterLeaveType;
    const matchesSearch = app.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) || app.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === "All" ? true : new Date(app.startDate).getMonth() + 1 === parseInt(selectedMonth);
    const matchesDateFrom = dateFrom ? new Date(app.endDate) >= new Date(dateFrom) : true;
    const matchesDateTo = dateTo ? new Date(app.endDate) <= new Date(dateTo) : true;
    return matchesStatus && matchesLeaveType && matchesSearch && matchesMonth && matchesDateFrom && matchesDateTo;
  });

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages, currentPage]);

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleViewFile = (app: LeaveApplication) => {
    if (app.handoverDocument) {
      const fullPdfUrl = `${app.handoverDocument.replace(/\\/g, "/")}`;
      window.open(fullPdfUrl, "_blank");
    } else {
      toast.info("No document available");
    }
  };

  const handleViewApplicationDetails = (app: LeaveApplication) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const onOpenFile = (filePath: string) => {
    window.open(filePath, "_blank");
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 flex flex-col mb-8 p-6">
        {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
             <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
               <FaRegCalendarCheck className="text-gunmetal-600 text-xl" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                    Track Applications
                </h2>
                <p className="text-sm text-slate-grey-500">
                    Monitor the status of your leave requests.
                </p>
             </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
         <div className="relative group">
           <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
           <select
            value={filterStatus}
            onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
            }}
             className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="relative group">
           <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
           <select
            value={filterLeaveType}
            onChange={(e) => {
                setFilterLeaveType(e.target.value);
                setCurrentPage(1);
            }}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            {leaveTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="relative group">
           <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
           <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
          />
        </div>

        <div className="relative group">
           <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
           <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Months</option>
            {Array.from({length: 12}).map((_, i) => (
                <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
        </div>

        <div className="relative group">
           <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
           <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
          />
        </div>

        <div className="relative group">
           <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
           <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
             className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
          />
        </div>
      </div>

      {loading ? (
         <div className="flex flex-col items-center justify-center h-48">
            <LoadingSpinner size="md" />
            <span className="text-sm text-slate-grey-500 mt-3">Loading applications...</span>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-platinum-200 rounded-xl bg-alabaster-grey-50/50">
             <FaInbox size={48} className="text-slate-grey-300 mb-3" />
            <h3 className="text-lg font-bold text-gunmetal-800">No applications found</h3>
            <p className="text-slate-grey-500 text-sm mt-1">
                 There are no leave applications matching your criteria.
            </p>
        </div>
      ) : (
        <>
            <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
                <table className="w-full text-left bg-white border-collapse">
                <thead className="bg-alabaster-grey-50">
                    <tr>
                    <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Leave Type</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Start Date</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">End Date</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Days</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Attachment</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-platinum-100">
                    {currentApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-alabaster-grey-50/50 transition-colors">
                        <td className="py-4 px-4 text-sm font-semibold text-gunmetal-900">
                             {app.leaveType}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-grey-600 font-mono">
                            {formatDate(app.startDate)}
                        </td>
                         <td className="py-4 px-4 text-sm text-slate-grey-600 font-mono">
                            {formatDate(app.endDate)}
                        </td>
                         <td className="py-4 px-4 text-sm text-gunmetal-900 font-bold text-center">
                            {app.totalDays}
                        </td>
                        <td className="py-4 px-4 text-center">
                           {app.handoverDocument ? (
                                <button
                                     onClick={() => handleViewFile(app)}
                                     className="text-gunmetal-600 hover:text-gunmetal-900 transition-colors p-2 bg-platinum-50 rounded-lg hover:bg-platinum-100"
                                     title="View Attachment"
                                >
                                    <FaFileAlt />
                                </button>
                           ) : (
                               <span className="text-slate-grey-400 text-xs italic">None</span>
                           )}
                        </td>
                        <td className="py-4 px-4 text-center">
                             <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                app.status === "Approved"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : app.status === "Pending"
                                    ? "bg-amber-50 text-amber-700 border-amber-100"
                                    : "bg-rose-50 text-rose-700 border-rose-100"
                                }`}
                            >
                                {app.status === "Approved" && <FaCheckCircle size={10} />}
                                {app.status === "Pending" && <FaExclamationCircle size={10} />}
                                {app.status === "Rejected" && <FaTimesCircle size={10} />}
                                {app.status}
                            </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                           <button
                                onClick={() => handleViewApplicationDetails(app)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-platinum-200 text-gunmetal-600 rounded-lg hover:bg-gunmetal-900 hover:text-white transition-all font-medium text-xs shadow-sm group"
                            >
                                <FaEye className="group-hover:text-white transition-colors" /> View
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

             {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
             <div className="flex items-center gap-2 text-sm text-slate-grey-600 bg-alabaster-grey-50 px-3 py-1.5 rounded-lg border border-platinum-200">
                <span className="font-medium">Rows:</span>
                <select
                    className="bg-transparent border-none focus:outline-none font-semibold text-gunmetal-800 cursor-pointer"
                    value={rowsPerPage}
                    onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
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
        </>
      )}

      <LeaveApplicationDetailModal
        isOpen={isModalOpen}
        application={selectedApplication}
        onClose={closeModal}
        onOpenFile={onOpenFile}
      />
    </div>
  );
};

export default TrackApplication;
