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
} from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/formateTime";

export type AttendanceTicketStatus =
  | "Open"
  | "Closed"
  | "Rejected"
  | "Approved";

interface AttendanceTicket {
  _id: string; // Change 'id' to '_id'
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
  status: "Open" | "Closed" | "Rejected" | "Approved"; // Added "Approved"
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

  const getStatusConfig = (status: AttendanceTicketStatus) => {
    switch (status) {
      case "Closed":
        return {
          color: "bg-green-50 text-green-800 border-green-200",
          icon: <FaCheckCircle className="text-green-600 mr-2" />,
          label: "Approved",
        };
      case "Approved": // Handle "Approved" explicitly
        return {
          color: "bg-green-50 text-green-800 border-green-200",
          icon: <FaCheckCircle className="text-green-600 mr-2" />,
          label: "Approved",
        };
      case "Rejected":
        return {
          color: "bg-red-50 text-red-800 border-red-200",
          icon: <FaTimesCircle className="text-red-600 mr-2" />,
          label: "Rejected",
        };
      default:
        return {
          color: "bg-blue-50 text-blue-800 border-blue-200",
          icon: null,
          label: "Pending",
        };
    }
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

  const statusConfig = getStatusConfig(status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-3xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-hidden transform transition-transform duration-300 scale-100 origin-center">
        <div className="bg-purple-900 p-4 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <FaFileAlt className="mr-3" /> Attendance Ticket Details
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
            {/* Submission Details */}
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

            {/* Employee Details */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-4">
              <FaUser className="text-green-500 text-2xl" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider ml-1">
                  Employee
                </p>
                <p className="font-bold text-gray-900 text-lg ml-1">
                  {user?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-600 bg-white rounded px-2 py-1 inline-block mt-1">
                  {user.personalDetails.abbreviatedJobTitle || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-4">
              <FaClock className="text-purple-500 text-2xl" />
              <div>
                <div className="flex justify-between">
                  <p className="text-gray-500 uppercase">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Time In:{" "}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatTime(timeIn)}
                    </span>
                  </p>
                  <p className="text-gray-500 uppercase ml-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Time Out:{" "}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatTime(timeOut)}
                    </span>
                  </p>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-gray-500 uppercase tracking-wider">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Total Time:{" "}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {totalTime}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-4">
              <FaMapMarkerAlt className="text-teal-500 text-2xl" />
              <div className="flex-grow">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Work Location
                </p>
                <p className="font-semibold text-gray-800">{workLocation}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 ml-2">
                  Status
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${statusConfig.color}`}
                >
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <FaFileAlt className="mr-2 text-gray-500" /> Comments
            </h3>
            <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
              {comments || "No additional comments provided."}
            </p>
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-gray-600 flex items-center">
              <FaFileAlt className="mr-2 text-gray-500" />
              {file ? "Attachment available" : "No attachment"}
            </p>
            {file && (
              <button
                onClick={() =>
                  onOpenFile(`/${file}`, file.split("\\").pop() || "")
                }
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-full text-sm transition-colors flex items-center"
              >
                View Attachment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTicketDetailModal;
