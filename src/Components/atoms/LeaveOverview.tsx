import React, { useEffect, useState } from "react";
import axios from "axios";

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

const getProgressBarColor = (percentage: number): string => {
  if (percentage < 50) {
    return "bg-green-500";
  } else if (percentage < 80) {
    return "bg-yellow-500";
  } else {
    return "bg-red-500";
  }
};

const LeaveOverview: React.FC = () => {
  const [leaveBalances, setLeaveBalances] = useState<LeaveType[]>(leaveTypes);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/leave-applications`,
          {
            withCredentials: true,
          }
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
  }, [backendUrl]);

  return (
    <section className="flex flex-col w-full md:w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col p-8 mx-auto w-full bg-white rounded-xl">
        <h2 className="text-2xl font-bold text-black">Available Leave Days</h2>
        {leaveBalances.map((leave, index) => {
          const usagePercentage = (leave.used / leave.total) * 100;
          const progressColor = getProgressBarColor(usagePercentage);

          return (
            <div key={index} className="mt-2">
              <div className="flex flex-wrap gap-5 justify-between max-md:max-w-full">
                <div className="text-md text-zinc-500">{leave.name}</div>
                <div className="text-md text-right text-zinc-600">
                  {leave.used} of {leave.total} day(s)
                </div>
              </div>
              <div
                className="flex shrink-0 h-5 bg-gray-200 rounded-full mt-2"
                aria-label={`${leave.name} usage: ${leave.used} out of ${leave.total} days`}
              >
                <div
                  className={`h-5 rounded-full ${progressColor}`}
                  style={{
                    width: `${usagePercentage > 100 ? 100 : usagePercentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LeaveOverview;
