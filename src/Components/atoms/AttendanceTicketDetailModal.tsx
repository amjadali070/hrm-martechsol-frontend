import React from "react";
import {
  FaTimes,
  FaCalendar,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaClipboardList,
  FaBuilding,
} from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import { formatAttendenceTicketTime } from "../../utils/formateTime";

export type AttendanceTicketStatus =
  | "Open"
  | "Closed" // Treated same as Approved often in UI logic
  | "Rejected"
  | "Approved";

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
  status: AttendanceTicketStatus;
}

interface AttendanceTicketDetailModalProps {
  isOpen: boolean;
  ticket: AttendanceTicket | null;
  onClose: () => void;
  onOpenFile: (filePath: string, fileName: string) => void;
}

const AttendanceTicketDetailModal: React.FC<
  AttendanceTicketDetailModalProps
> = ({ isOpen, ticket, onClose, onOpenFile }) => {
  if (!isOpen || !ticket) return null;

  const getStatusBadge = (status: AttendanceTicketStatus) => {
    const styles = {
      Approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Closed: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Rejected: "bg-rose-50 text-rose-700 border-rose-100",
      Open: "bg-blue-50 text-blue-700 border-blue-100",
    };
    const icons = {
      Approved: <FaCheckCircle className="mr-1.5" size={12} />,
      Closed: <FaCheckCircle className="mr-1.5" size={12} />,
      Rejected: <FaTimesCircle className="mr-1.5" size={12} />,
      Open: <FaClock className="mr-1.5" size={12} />,
    };

    const normalizeStatus = status === "Closed" ? "Approved" : status;
    
    return (
      <span
        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center border ${
          styles[status] || styles.Open
        }`}
      >
        {icons[status] || icons.Open}
        {status}
      </span>
    );
  };

  const {
    date,
    user,
    status,
    timeIn,
    timeOut,
    totalTime,
    workLocation,
    comments,
    file,
  } = ticket;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-platinum-200 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-platinum-200 bg-white">
          <div className="flex items-center gap-3">
             <div className="bg-gunmetal-50 p-2.5 rounded-xl text-gunmetal-600">
                 <FaClipboardList size={20} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gunmetal-900">Attendance Request</h2>
                <p className="text-xs text-slate-grey-500 font-bold uppercase tracking-wide">
                    ID: {ticket._id.slice(-6).toUpperCase()}
                </p>
             </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors bg-platinum-50 hover:bg-platinum-100 p-2 rounded-full"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 bg-alabaster-grey-50/50 space-y-6">
            
            {/* Top Row: User & Status */}
            <div className="bg-white rounded-xl p-5 border border-platinum-200 shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-gunmetal-100 flex items-center justify-center text-gunmetal-600 font-bold text-lg ring-4 ring-alabaster-grey-50">
                        {user?.name?.charAt(0) || "U"}
                     </div>
                     <div>
                        <p className="text-xs font-bold text-slate-grey-400 uppercase tracking-wide">Employee</p>
                        <h3 className="text-lg font-bold text-gunmetal-900">{user?.name}</h3>
                        <p className="text-sm text-slate-grey-600 flex items-center gap-1">
                           <FaBuilding size={10} className="text-slate-grey-400" />
                           {user?.personalDetails?.abbreviatedJobTitle}
                        </p>
                     </div>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(status)}
                      <span className="text-xs font-bold text-slate-grey-400 flex items-center gap-1">
                          <FaCalendar size={10} />
                          {formatDate(date)}
                      </span>
                 </div>
            </div>

            {/* Time & Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Time Card */}
                <div className="bg-white p-5 rounded-xl border border-platinum-200 shadow-sm relative overflow-hidden group">
                     {/* Decor */}
                     <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                         <FaClock size={60} className="text-gunmetal-900 transform rotate-12" />
                     </div>

                     <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <FaClock className="text-gunmetal-500" /> Time Log
                     </h4>
                     
                     <div className="space-y-3 relative z-10">
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-grey-600 font-medium">Time In</span>
                             <span className="font-mono font-bold text-gunmetal-900 bg-alabaster-grey-50 px-2 py-1 rounded border border-platinum-100">
                                 {formatAttendenceTicketTime(timeIn)}
                             </span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-sm text-slate-grey-600 font-medium">Time Out</span>
                             <span className="font-mono font-bold text-gunmetal-900 bg-alabaster-grey-50 px-2 py-1 rounded border border-platinum-100">
                                 {formatAttendenceTicketTime(timeOut)}
                             </span>
                         </div>
                         <div className="pt-2 mt-2 border-t border-platinum-100 flex justify-between items-center">
                             <span className="text-sm font-bold text-gunmetal-700">Total Duration</span>
                             <span className="font-mono font-bold text-emerald-600">{totalTime}</span>
                         </div>
                     </div>
                </div>

                {/* Location & Meta Card */}
                <div className="bg-white p-5 rounded-xl border border-platinum-200 shadow-sm flex flex-col justify-between">
                     <div>
                        <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-gunmetal-500" /> Work Details
                        </h4>
                        <div className="mb-4">
                             <p className="text-sm text-slate-grey-600 mb-1">Work Location</p>
                             <p className="font-bold text-gunmetal-900 text-lg flex items-center gap-2">
                                 {workLocation === 'Remote' ? (
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                 ) : (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                 )}
                                 {workLocation}
                             </p>
                        </div>
                     </div>
                </div>
            </div>

            {/* Comments & Attachments */}
            <div className="space-y-4">
                <div className="bg-white p-5 rounded-xl border border-platinum-200 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-2">Employee Comments</h4>
                    <div className="bg-alabaster-grey-50 p-3 rounded-lg border border-platinum-100 text-sm text-slate-grey-700 leading-relaxed italic">
                        "{comments || "No comments provided."}"
                    </div>
                </div>

                {file && (
                    <div className="bg-white p-4 rounded-xl border border-platinum-200 shadow-sm flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                 <FaFileAlt size={18} />
                             </div>
                             <div>
                                 <p className="text-sm font-bold text-gunmetal-900">Attached Document</p>
                                 <p className="text-xs text-slate-grey-500">Evidence/Proof</p>
                             </div>
                         </div>
                         <button
                            onClick={() => onOpenFile(file, file.split('/').pop() || 'document')}
                            className="bg-gunmetal-900 text-white hover:bg-gunmetal-800 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-gunmetal-500/20 flex items-center gap-2"
                         >
                             <FaDownload size={12} /> View File
                         </button>
                    </div>
                )}
            </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-platinum-200 bg-white rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-alabaster-grey-50 border border-platinum-200 text-gunmetal-700 font-bold rounded-xl hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm text-sm"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default AttendanceTicketDetailModal;
