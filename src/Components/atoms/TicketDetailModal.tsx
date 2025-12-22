import React from "react";
import {
  FaTimes,
  FaCalendar,
  FaClipboardCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelopeOpenText,
  FaBuilding,
} from "react-icons/fa";

export type TicketStatus = "Rejected" | "Open" | "Closed";

interface User {
  name: string;
  abbreviatedJobTitle: string;
  department?: string; // Optional if not always present
}

interface Ticket {
  id: string;
  date: string;
  subject: string;
  message: string;
  status: TicketStatus;
  user: User;
}

interface TicketDetailModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
}

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  isOpen,
  ticket,
  onClose,
}) => {
  if (!isOpen || !ticket) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const {
    date,
    user,
    status,
    subject = "No Subject",
    message = "No Message",
  } = ticket;

  const getStatusBadge = (status: TicketStatus) => {
    const styles = {
      Closed: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Rejected: "bg-rose-50 text-rose-700 border-rose-100",
      Open: "bg-blue-50 text-blue-700 border-blue-100",
    };
    const icons = {
      Closed: <FaCheckCircle className="mr-1.5" size={12} />,
      Rejected: <FaTimesCircle className="mr-1.5" size={12} />,
      Open: <FaClipboardCheck className="mr-1.5" size={12} />,
    };

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

  return (
    <div
      className="fixed inset-0 z-[1050] flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm p-4 animate-fadeIn"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-platinum-200 flex flex-col max-h-[90vh] overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-platinum-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-gunmetal-50 p-2.5 rounded-xl text-gunmetal-600">
              <FaEnvelopeOpenText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gunmetal-900">
                Ticket Details
              </h2>
              <p className="text-xs text-slate-grey-500 font-bold uppercase tracking-wide">
                ID: {ticket.id.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors bg-platinum-50 hover:bg-platinum-100 p-2 rounded-full"
            aria-label="Close Modal"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 bg-alabaster-grey-50/50 space-y-6">
          {/* User & Meta Info Card */}
          <div className="bg-white rounded-xl p-5 border border-platinum-200 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 relative z-10">
              {/* Employee Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gunmetal-100 flex items-center justify-center text-gunmetal-600 font-bold text-lg ring-4 ring-alabaster-grey-50 shrink-0">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-grey-400 uppercase tracking-wide mb-1">
                    Requested By
                  </p>
                  <h3 className="text-lg font-bold text-gunmetal-900 leading-tight mb-1">
                    {user?.name || "Unknown"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-grey-600">
                    <span className="bg-platinum-100 px-2 py-0.5 rounded text-xs font-semibold">
                      {user?.abbreviatedJobTitle || "N/A"}
                    </span>
                    {user?.department && (
                      <span className="flex items-center gap-1">
                        <FaBuilding size={10} className="text-slate-grey-400" />
                        {user.department}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Date & Status */}
              <div className="flex flex-col items-end gap-3 min-w-[140px]">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-grey-400 uppercase tracking-wide mb-1">
                    Submitted
                  </p>
                  <div className="flex items-center justify-end gap-2 text-gunmetal-900 font-medium text-sm">
                    <FaCalendar className="text-gunmetal-400" />
                    {formatDate(date)}
                  </div>
                </div>
                <div>{getStatusBadge(status)}</div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="bg-white rounded-xl border border-platinum-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-platinum-100 bg-alabaster-grey-50 flex items-center gap-2">
              <span className="font-bold text-gunmetal-900 text-sm uppercase tracking-wide">
                Subject:
              </span>
              <span className="text-slate-grey-700 font-medium text-sm">
                {subject}
              </span>
            </div>
            <div className="p-6">
              <h4 className="text-xs font-bold text-slate-grey-400 uppercase tracking-wide mb-3">
                Description / Message
              </h4>
              <div className="prose prose-sm max-w-none text-slate-grey-700 leading-relaxed bg-alabaster-grey-50 p-4 rounded-lg border border-platinum-100">
                <div dangerouslySetInnerHTML={{ __html: message }} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-platinum-200 bg-white rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-alabaster-grey-50 border border-platinum-200 text-gunmetal-700 font-bold rounded-xl hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
