import React, { useState } from "react";
import {
  FaUserClock,
  FaBriefcase,
  FaClipboardList,
  FaNetworkWired,
} from "react-icons/fa";
import AttendanceTicketManagement from "./AttendanceTicketManagement";
import HRTicketManagement from "./HRTicketManagement";
import AdminTicketManagement from "./AdminTicketManagement";
import NetworkTicketManagement from "./NetworkTicketManagement";

const TicketManagement: React.FC = () => {
  const [selectedTicketType, setSelectedTicketType] = useState<
    "Attendance" | "HR" | "Admin" | "Network" | null
  >(null);

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      {!selectedTicketType ? (
        <div className="w-full p-6 rounded-lg">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Select Ticket Type
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div
              onClick={() => setSelectedTicketType("Attendance")}
              className="flex flex-col items-center justify-center bg-blue-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg p-6 rounded-lg cursor-pointer transition duration-200"
            >
              <FaUserClock size={70} className="text-blue-600" />
              <h2 className="mt-4 text-xl font-semibold text-blue-700">
                Attendance Tickets Status
              </h2>
              <p className="text-gray-500 mt-2 text-sm text-center">
                Manage attendance-related tickets, including work-from-home
                requests.
              </p>
            </div>
            <div
              onClick={() => setSelectedTicketType("HR")}
              className="flex flex-col items-center justify-center bg-green-50 border-2 border-green-200 hover:border-green-400 hover:shadow-lg p-6 rounded-lg cursor-pointer transition duration-200"
            >
              <FaBriefcase size={70} className="text-green-600" />
              <h2 className="mt-4 text-xl font-semibold text-green-700">
                HR Tickets Status
              </h2>
              <p className="text-gray-500 mt-2 text-sm text-center">
                Manage HR-related tickets such as leave requests and benefits
                inquiries.
              </p>
            </div>
            <div
              onClick={() => setSelectedTicketType("Admin")}
              className="flex flex-col items-center justify-center bg-purple-50 border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg p-6 rounded-lg cursor-pointer transition duration-200"
            >
              <FaClipboardList size={70} className="text-purple-600" />
              <h2 className="mt-4 text-xl font-semibold text-purple-700">
                Admin Tickets Status
              </h2>
              <p className="text-gray-500 mt-2 text-sm text-center">
                Manage admin-related tickets, including system issues and
                requests.
              </p>
            </div>
            <div
              onClick={() => setSelectedTicketType("Network")}
              className="flex flex-col items-center justify-center bg-orange-50 border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg p-6 rounded-lg cursor-pointer transition duration-200"
            >
              <FaNetworkWired size={70} className="text-orange-600" />
              <h2 className="mt-4 text-xl font-semibold text-orange-700">
                Network Tickets Status
              </h2>
              <p className="text-gray-500 mt-2 text-sm text-center">
                Manage network-related tickets, including connectivity issues.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {selectedTicketType === "Attendance" && (
            <div>
              <AttendanceTicketManagement />
            </div>
          )}
          {selectedTicketType === "HR" && (
            <div>
              <HRTicketManagement />
            </div>
          )}
          {selectedTicketType === "Admin" && (
            <div>
              <AdminTicketManagement />
            </div>
          )}
          {selectedTicketType === "Network" && (
            <div>
              <NetworkTicketManagement />
            </div>
          )}
          <button
            className="mt-1 ml-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500"
            onClick={() => setSelectedTicketType(null)}
          >
            Back
          </button>
        </>
      )}
    </div>
  );
};

export default TicketManagement;
