import React from "react";
import {
  FaTimes,
  FaCalendar,
  FaUser,
  FaClipboardCheck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export type TicketStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Open"
  | "Closed"; // Adjusted to match your API response

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
      case "Approved":
        return {
          color: "bg-green-100 text-green-800 border-green-300",
          icon: <FaCheckCircle className="text-green-600 mr-2" />,
        };
      case "Pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          icon: <FaClipboardCheck className="text-yellow-600 mr-2" />,
        };
      case "Rejected":
        return {
          color: "bg-red-100 text-red-800 border-red-300",
          icon: <FaTimesCircle className="text-red-600 mr-2" />,
        };
      case "Open":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-300",
          icon: <FaClipboardCheck className="text-blue-600 mr-2" />,
        };
      case "Closed":
        return {
          color: "bg-gray-100 text-gray-800 border-gray-300",
          icon: <FaClipboardCheck className="text-gray-600 mr-2" />,
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
      <div className="bg-white rounded-xl shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2
            id="ticket-details-title"
            className="text-2xl font-semibold text-gray-800"
          >
            Ticket Details
          </h2>
          <button
            onClick={onClose}
            aria-label="Close ticket details"
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-full p-2"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Section */}
            <div className="flex items-start space-x-3">
              <FaCalendar className="text-blue-500 text-2xl mt-1" />
              <div>
                <p className="text-sm text-gray-600">Submitted On</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(date)}
                </p>
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-start space-x-3">
              <FaUser className="text-green-500 text-2xl mt-1" />
              <div>
                <p className="text-sm text-gray-600">Employee</p>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 text-lg">
                    {user?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600 bg-gray-100 rounded px-2 py-1 inline-block">
                    {user?.abbreviatedJobTitle || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="flex items-start space-x-3 col-span-1 md:col-span-2">
              <div className="flex items-center">
                {statusStyle.icon}
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center border ${statusStyle.color}`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Subject
            </h3>
            <p className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700">
              {subject}
            </p>
          </div>

          {/* Message Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Message
            </h3>
            <div
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;
