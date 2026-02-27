import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { FaPlaneDeparture, FaNotesMedical, FaUserClock, FaUmbrellaBeach } from "react-icons/fa";

interface LeaveType {
  name: string;
  used: number;
  total: number;
  isCompleted: boolean;
}

interface LeaveApplication {
  leaveType: string;
  status: string;
  totalDays: number;
}

const leaveTypes: LeaveType[] = [
  { name: "Annual Leave", used: 0, total: 14, isCompleted: false },
  { name: "Sick Leave", used: 0, total: 8, isCompleted: false },
  { name: "Casual Leave", used: 0, total: 10, isCompleted: false },
];

const getLeaveIcon = (name: string) => {
  switch (name) {
    case "Annual Leave":
      return <FaPlaneDeparture size={16} />;
    case "Sick Leave":
      return <FaNotesMedical size={16} />;
    case "Casual Leave":
      return <FaUserClock size={16} />;
    default:
      return <FaUmbrellaBeach size={16} />;
  }
};

const getIconStyles = (name: string) => {
   switch (name) {
    case "Annual Leave":
      return "bg-indigo-50 text-indigo-600 border-indigo-100";
    case "Sick Leave":
      return "bg-teal-50 text-teal-600 border-teal-100";
    case "Casual Leave":
      return "bg-blue-50 text-blue-600 border-blue-100";
    default:
      return "bg-gunmetal-50 text-gunmetal-600 border-gunmetal-100";
  }
}

const getProgressColor = (name: string, percentage: number) => {
    if (percentage >= 100) return "bg-rose-500 shadow-rose-200";
    if (percentage > 75) return "bg-amber-500 shadow-amber-200";
    
     switch (name) {
        case "Annual Leave":
        return "bg-indigo-500 shadow-indigo-200";
        case "Sick Leave":
        return "bg-teal-500 shadow-teal-200";
        case "Casual Leave":
        return "bg-blue-500 shadow-blue-200";
        default:
        return "bg-gunmetal-500 shadow-gunmetal-200";
    }
}


const LeaveOverview: React.FC = () => {
  const [leaveBalances, setLeaveBalances] = useState<LeaveType[]>(leaveTypes);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/leave-applications`
        );

        const leaveApplications: LeaveApplication[] = response.data;

        const updatedBalances = leaveTypes.map((leaveType) => {
          const approvedLeaves = leaveApplications.filter(
            (leave) =>
              leave.leaveType === leaveType.name && leave.status === "Approved"
          );

          const usedDays = approvedLeaves.reduce(
            (sum, leave) => sum + leave.totalDays,
            0
          );

          return {
            ...leaveType,
            used: usedDays,
            isCompleted: usedDays >= leaveType.total,
          };
        });

        setLeaveBalances(updatedBalances);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    fetchLeaveData();
  }, []);

  return (
    <section className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gunmetal-900 tracking-tight">
          Leave Balance
        </h2>
        <span className="text-[10px] font-bold text-slate-grey-500 bg-alabaster-grey-50 px-2 py-1 rounded border border-platinum-200 uppercase tracking-wide">
           FY {new Date().getFullYear()}
        </span>
      </div>
      
      <div className="flex flex-col gap-6 flex-1">
        {leaveBalances.map((leave, index) => {
          const used = leave.used;
          const total = leave.total;
          const remaining = Math.max(0, total - used);
          // Ensure percentage doesn't exceed 100 visually for bar
          const usagePercentage = Math.min((used / total) * 100, 100); 
          
          const progressClass = getProgressColor(leave.name, usagePercentage);

          return (
            <div key={index} className="flex flex-col gap-2.5 group">
              {/* Header Row */}
              <div className="flex justify-between items-end">
                 <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105 duration-200 ${getIconStyles(leave.name)}`}>
                       {getLeaveIcon(leave.name)}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-gunmetal-900 leading-tight">{leave.name}</span>
                       <span className="text-[10px] font-medium text-slate-grey-400 uppercase tracking-wide mt-0.5">
                          Total Allowance: <span className="text-gunmetal-700 font-mono font-bold">{total}</span>
                       </span>
                    </div>
                 </div>
                 
                 <div className="text-right">
                    <span className={`block text-xl font-bold font-mono leading-none tracking-tight ${remaining === 0 ? 'text-rose-500' : 'text-gunmetal-900'}`}>{remaining}</span>
                    <span className="text-[9px] font-bold text-slate-grey-400 uppercase tracking-wider block mt-0.5">Available</span>
                 </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative">
                  <div className="h-2 w-full bg-alabaster-grey-100 rounded-full overflow-hidden border border-platinum-100 shadow-inner">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${progressClass}`}
                        style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                  
                  {/* Tooltip-like percentage indicator */}
                  <div className="flex justify-between items-center mt-1.5 px-0.5">
                      <span className="text-[9px] font-bold text-slate-grey-400 uppercase tracking-wider">Used: {used}</span>
                      <span className="text-[9px] font-bold text-slate-grey-500">{Math.round((used/total)*100)}%</span>
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LeaveOverview;
