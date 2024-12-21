// TicketManagement.tsx

import React, { useState, useEffect } from "react";
import {
  FaUserClock,
  FaBriefcase,
  FaClipboardList,
  FaNetworkWired,
  FaSpinner,
} from "react-icons/fa";
import AttendanceTicketManagement from "./AttendanceTicketManagement";
import HRTicketManagement from "./HRTicketManagement";
import AdminTicketManagement from "./AdminTicketManagement";
import NetworkTicketManagement from "./NetworkTicketManagement";
import useUser from "../../hooks/useUser";

interface TicketType {
  label: string;
  path: "Attendance" | "HR" | "Admin" | "Network";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  visibleTo: string[];
}

const ticketTypes: TicketType[] = [
  {
    label: "Attendance",
    path: "Attendance",
    icon: FaUserClock,
    visibleTo: ["manager", "SuperAdmin"],
  },
  {
    label: "HR",
    path: "HR",
    icon: FaBriefcase,
    visibleTo: ["HR", "SuperAdmin"],
  },
  {
    label: "Admin",
    path: "Admin",
    icon: FaClipboardList,
    visibleTo: ["SuperAdmin"],
  },
  {
    label: "Network",
    path: "Network",
    icon: FaNetworkWired,
    visibleTo: ["SuperAdmin"],
  },
];

const TicketManagement: React.FC = () => {
  const { user, loading } = useUser();
  const role = user?.role || "";
  const [selectedTicketType, setSelectedTicketType] = useState<
    "Attendance" | "HR" | "Admin" | "Network" | null
  >(null);

  const availableTicketTypes = ticketTypes.filter((ticket) =>
    ticket.visibleTo.includes(role)
  );

  useEffect(() => {
    if (availableTicketTypes.length === 1 && !selectedTicketType) {
      setSelectedTicketType(availableTicketTypes[0].path);
    }
  }, [availableTicketTypes, selectedTicketType]);

  if (loading) {
    return (
      <div className="w-full p-20 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FaSpinner size={30} className="text-blue-500 mb-4 animate-spin" />
        </div>
      </div>
    );
  }

  if (availableTicketTypes.length === 0) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          You do not have access to any ticket types.
        </h1>
      </div>
    );
  }

  if (availableTicketTypes.length === 1 && selectedTicketType) {
    return (
      <>
        {selectedTicketType === "Attendance" && <AttendanceTicketManagement />}
        {selectedTicketType === "HR" && <HRTicketManagement />}
        {selectedTicketType === "Admin" && <AdminTicketManagement />}
        {selectedTicketType === "Network" && <NetworkTicketManagement />}
      </>
    );
  }

  return (
    <div className="w-full bg-white flex items-center justify-center p-6 rounded-lg">
      {!selectedTicketType ? (
        <div className="w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Select Ticket Type
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {availableTicketTypes.map((ticket) => {
              const Icon = ticket.icon;
              const colorClasses = {
                Attendance: {
                  bg: "bg-blue-50",
                  border: "border-blue-200",
                  hoverBorder: "hover:border-blue-400",
                  text: "text-blue-600",
                  title: "text-blue-700",
                },
                HR: {
                  bg: "bg-green-50",
                  border: "border-green-200",
                  hoverBorder: "hover:border-green-400",
                  text: "text-green-600",
                  title: "text-green-700",
                },
                Admin: {
                  bg: "bg-purple-50",
                  border: "border-purple-200",
                  hoverBorder: "hover:border-purple-400",
                  text: "text-purple-600",
                  title: "text-purple-700",
                },
                Network: {
                  bg: "bg-orange-50",
                  border: "border-orange-200",
                  hoverBorder: "hover:border-orange-400",
                  text: "text-orange-600",
                  title: "text-orange-700",
                },
              };

              const colors =
                colorClasses[ticket.label as keyof typeof colorClasses];

              return (
                <div
                  key={ticket.path}
                  onClick={() => setSelectedTicketType(ticket.path)}
                  className={`flex flex-col items-center justify-center ${colors.bg} border-2 ${colors.border} hover:${colors.hoverBorder} hover:shadow-lg p-6 rounded-lg cursor-pointer transition duration-200`}
                >
                  <Icon size={70} className={colors.text} />
                  <h2 className={`mt-4 text-xl font-semibold ${colors.title}`}>
                    {ticket.label} Tickets Status
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm text-center">
                    {getTicketDescription(ticket.label)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-start">
          {" "}
          {/* Change items-center to items-start */}
          {selectedTicketType === "Attendance" && (
            <AttendanceTicketManagement />
          )}
          {selectedTicketType === "HR" && <HRTicketManagement />}
          {selectedTicketType === "Admin" && <AdminTicketManagement />}
          {selectedTicketType === "Network" && <NetworkTicketManagement />}
          <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500"
            onClick={() => setSelectedTicketType(null)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

const getTicketDescription = (type: string): string => {
  const descriptions: { [key: string]: string } = {
    Attendance:
      "Manage attendance-related tickets, including work-from-home requests.",
    HR: "Manage HR-related tickets such as leave requests and benefits inquiries.",
    Admin:
      "Manage admin-related tickets, including system issues and requests.",
    Network: "Manage network-related tickets, including connectivity issues.",
  };
  return descriptions[type] || "Manage your tickets effectively.";
};

export default TicketManagement;
