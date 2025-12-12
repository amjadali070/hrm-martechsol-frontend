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
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "Sick Leave":
      return "bg-rose-50 text-rose-600 border-rose-100";
    case "Casual Leave":
      return "bg-amber-50 text-amber-600 border-amber-100";
    default:
      return "bg-gunmetal-50 text-gunmetal-600 border-gunmetal-100";
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
        <span className="text-xs font-medium text-slate-grey-400 bg-alabaster-grey-50 px-2 py-1 rounded border border-platinum-200">
           {new Date().getFullYear()}
        </span>
      </div>
      
      <div className="flex flex-col gap-5 flex-1">
        {leaveBalances.map((leave, index) => {
          const used = leave.used;
          const total = leave.total;
          const remaining = total - used;
          const usagePercentage = Math.min((used / total) * 100, 100);
          
          let progressColor = "bg-emerald-500";
          if (usagePercentage > 50) progressColor = "bg-amber-500";
          if (usagePercentage > 85) progressColor = "bg-rose-500";

          return (
            <div key={index} className="flex flex-col gap-3 group">
              {/* Header Row */}
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${getIconStyles(leave.name)}`}>
                       {getLeaveIcon(leave.name)}
                    </div>
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-gunmetal-800">{leave.name}</span>
                       <span className="text-[10px] font-medium text-slate-grey-400 uppercase tracking-wide">
                          Allowed: <span className="text-gunmetal-600 font-mono">{total}</span>
                       </span>
                    </div>
                 </div>
                 
                 <div className="text-right">
                    <span className={`block text-lg font-bold font-mono leading-none ${remaining === 0 ? 'text-rose-500' : 'text-gunmetal-900'}`}>{remaining}</span>
                    <span className="text-[9px] font-bold text-slate-grey-400 uppercase tracking-wider">Days Left</span>
                 </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2.5 w-full bg-alabaster-grey-100 rounded-full overflow-hidden border border-platinum-200">
                 {/* Optional: Pattern background for empty space */}
                 <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 50%, #e2e8f0 50%, #e2e8f0 75%, transparent 75%, transparent)', backgroundSize: '8px 8px'}}></div>
                 
                 <div
                   className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${progressColor}`}
                   style={{ width: `${usagePercentage}%` }}
                 />
              </div>
              
              <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-grey-400 tracking-wider">
                 <span>0</span>
                 <span>{Math.round(usagePercentage)}% Used</span>
                 <span>{total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LeaveOverview;
