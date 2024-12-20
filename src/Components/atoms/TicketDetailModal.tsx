import React from "react";
import {
  FaTimes,
  FaCalendar,
  FaUser,
  FaClipboardCheck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export type TicketStatus = "Rejected" | "Open" | "Closed"; // Adjusted to match your API response

interface User {
  name: string;
  abbreviatedJobTitle: string;
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

  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case "Closed":
        return {
          color: "bg-green-100 text-green-800 border-green-300",
          icon: <FaCheckCircle className="text-green-600 mr-2" />,
        };
      case "Open":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          icon: <FaClipboardCheck className="text-yellow-600 mr-2" />,
        };
      case "Rejected":
        return {
          color: "bg-red-100 text-red-800 border-red-300",
          icon: <FaTimesCircle className="text-red-600 mr-2" />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-300",
          icon: null,
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
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

  const statusStyle = getStatusStyle(status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
      aria-labelledby="ticket-details-title"
    >
      <div className="bg-white rounded-3xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-in-out">
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <h2
            id="ticket-details-title"
            className="text-2xl font-bold flex items-center"
          >
            Ticket Details
          </h2>
          <button
            onClick={onClose}
            aria-label="Close ticket details"
            className="text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-4">
              <FaCalendar className="text-blue-500 text-2xl" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Submitted On
                </p>
                <p className="font-semibold text-gray-800 text-lg">
                  {formatDate(date)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-4">
              <FaUser className="text-green-500 text-2xl" />
              <div className="flex-grow">
                <p className="text-xs text-gray-500 uppercase tracking-wider ml-1">
                  Employee
                </p>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 text-lg ml-1">
                    {user?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600 bg-white rounded px-2 py-1 inline-block">
                    {user?.abbreviatedJobTitle || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-4 col-span-1 md:col-span-2">
              {statusStyle.icon}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 ml-1">
                  Status
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center border ${statusStyle.color}`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Subject
            </h3>
            <p className="text-gray-700">{subject}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Message
            </h3>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
