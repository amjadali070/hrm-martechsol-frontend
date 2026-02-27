import React, { useState, useEffect } from "react";
import {
  FaUserClock,
  FaBriefcase,
  FaClipboardList,
  FaNetworkWired,
  FaArrowLeft,
  FaTicketAlt,
} from "react-icons/fa";
import AttendanceTicketManagement from "./AttendanceTicketManagement";
import HRTicketManagement from "./HRTicketManagement";
import AdminTicketManagement from "./AdminTicketManagement";
import NetworkTicketManagement from "./NetworkTicketManagement";
import useUser from "../../hooks/useUser";
import LoadingSpinner from "../atoms/LoadingSpinner";

interface TicketType {
  label: string;
  path: "Attendance" | "HR" | "Admin" | "Network";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  visibleTo: string[];
  description: string;
  colorTheme: string;
}

const ticketTypes: TicketType[] = [
  {
    label: "Attendance",
    path: "Attendance",
    icon: FaUserClock,
    visibleTo: ["HR", "manager", "SuperAdmin"],
    description: "Handle attendance corrections and work-from-home requests.",
    colorTheme: "blue",
  },
  {
    label: "HR",
    path: "HR",
    icon: FaBriefcase,
    visibleTo: ["HR", "SuperAdmin"],
    description: "Manage grievances, policy questions, and benefits inquiries.",
    colorTheme: "emerald",
  },
  {
    label: "Admin",
    path: "Admin",
    icon: FaClipboardList,
    visibleTo: ["SuperAdmin"],
    description: "Oversee system administration and facility management tasks.",
    colorTheme: "purple",
  },
  {
    label: "Network",
    path: "Network",
    icon: FaNetworkWired,
    visibleTo: ["SuperAdmin"],
    description: "Resolve connectivity, hardware, and IT infrastructure issues.",
    colorTheme: "orange",
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
      <LoadingSpinner className="h-[60vh]" size="xl" text="Initializing Dashboard..." />
    );
  }

  if (availableTicketTypes.length === 0) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-platinum-200 p-12 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-alabaster-grey-50 rounded-full flex items-center justify-center mb-6 mx-auto border border-platinum-200">
                 <FaBriefcase className="text-slate-grey-400 text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-gunmetal-900 mb-3">Access Restricted</h1>
            <p className="text-slate-grey-500 leading-relaxed">
            You do not have the necessary permissions to view the ticket management dashboard.
            </p>
        </div>
      </div>
    );
  }

  // Active View
  if (selectedTicketType) {
    return (
      <div className="w-full min-h-[85vh] flex flex-col animate-fadeIn">
         {availableTicketTypes.length > 1 && (
             <div className="bg-white border-b border-platinum-200 px-8 py-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-4">
                     <button 
                      onClick={() => setSelectedTicketType(null)}
                      className="w-10 h-10 rounded-full bg-alabaster-grey-50 flex items-center justify-center text-slate-grey-600 hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm border border-platinum-200"
                     >
                         <FaArrowLeft size={16} />
                     </button>
                     <div>
                        <h2 className="text-lg font-bold text-gunmetal-900 flex items-center gap-2">
                             {selectedTicketType} Management
                        </h2>
                        <span className="text-xs font-medium text-slate-grey-500">Return to Dashboard</span>
                     </div>
                 </div>
                 
                 {/* Optional: Add quick stats or toggle here if needed */}
             </div>
         )}
         
         <div className="flex-1 p-6 bg-alabaster-grey-50">
            {selectedTicketType === "Attendance" && <AttendanceTicketManagement />}
            {selectedTicketType === "HR" && <HRTicketManagement />}
            {selectedTicketType === "Admin" && <AdminTicketManagement />}
            {selectedTicketType === "Network" && <NetworkTicketManagement />}
         </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="w-full p-8 min-h-[85vh] bg-alabaster-grey-50">
      <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-platinum-200 mb-6">
                <FaTicketAlt className="text-gunmetal-900 text-2xl" />
            </div>
            <h1 className="text-4xl font-extrabold text-gunmetal-900 mb-4 tracking-tight">
                Ticket Management Center
            </h1>
            <p className="text-slate-grey-500 text-lg max-w-2xl mx-auto">
                Centralized hub for managing support requests, grievances, and operational workflows across departments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            {availableTicketTypes.map((ticket) => {
              const Icon = ticket.icon;
            
              return (
                <div
                  key={ticket.path}
                  onClick={() => setSelectedTicketType(ticket.path)}
                  className="group relative bg-white border border-platinum-200 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-gunmetal-500/10 hover:-translate-y-1 hover:border-gunmetal-300 overflow-hidden"
                >
                  {/* Decorative Background Pattern */}
                  <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform translate-x-10 -translate-y-10">
                      <Icon size={200} className="text-gunmetal-900" />
                  </div>

                  <div className="relative flex items-start gap-6">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner 
                          ${ticket.colorTheme === 'blue' ? 'bg-blue-50 text-blue-600' : 
                            ticket.colorTheme === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                            ticket.colorTheme === 'purple' ? 'bg-purple-50 text-purple-600' :
                            'bg-orange-50 text-orange-600'
                          }
                      `}>
                          <Icon size={36} />
                      </div>
                      
                      <div className="flex-1 pt-2">
                          <h2 className="text-2xl font-bold text-gunmetal-900 mb-2 group-hover:text-gunmetal-700 transition-colors">
                            {ticket.label}
                          </h2>
                          <p className="text-slate-grey-500 text-sm leading-relaxed mb-6">
                            {ticket.description}
                          </p>
                          
                          <div className="flex items-center gap-2 text-sm font-bold text-gunmetal-900 group-hover:underline decoration-2 underline-offset-4">
                              Access Module <FaArrowLeft className="rotate-180 text-xs transition-transform group-hover:translate-x-1" />
                          </div>
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

export default TicketManagement;
