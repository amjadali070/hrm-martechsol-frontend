import React from "react";
import {
  FaTimes,
  FaCalendar,
  FaUser,
  FaTags,
  FaClipboardCheck,
} from "react-icons/fa";

export type TicketStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Open"
  | "Closed"; // Adjusted to match your API response

interface TicketDetailModalProps {
  isOpen: boolean;
  ticket: any | null; // Use a generic type for tickets
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
          icon: <FaClipboardCheck className="text-green-600 mr-2" />,
        };
      case "Pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-300",
          icon: <FaClipboardCheck className="text-yellow-600 mr-2" />,
        };
      case "Rejected":
        return {
          color: "bg-red-100 text-red-800 border-red-300",
          icon: <FaClipboardCheck className="text-red-600 mr-2" />,
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
    issueType = "N/A",
    category = "N/A",
  } = ticket;

  const statusStyle = getStatusStyle(status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="flex items-center space-x-3">
              <FaCalendar className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-600">Submitted On</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(date)}
                </p>
              </div>
            </div>

            {/* User */}
            <div className="flex items-center space-x-3">
              <FaUser className="text-green-500 text-xl" />
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

            {/* Issue Type / Category */}
            <div className="flex items-center space-x-3">
              <FaTags className="text-pink-500 text-xl" />
              <div>
                <p className="text-sm text-gray-600">
                  {issueType ? "Issue Type" : "Category"}
                </p>
                <p className="font-semibold text-gray-800">
                  {issueType || category}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                {statusStyle.icon}
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${statusStyle.color}`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Subject
            </h3>
            <p className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-700">
              {subject}
            </p>
          </div>

          {/* Message */}
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
