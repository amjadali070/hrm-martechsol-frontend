import React from "react";

interface StatsCardProps {
  label: string;
  value: number;
  color: string;
}

interface StatisticsProps {
  present: number;
  completed?: number;
  absent: number;
  lateArrivals: number;
  earlyDepartures: number;
  halfDays?: number;
  lateAndEarly?: number;
  casualLeaves?: number;
  sickLeaves?: number;
  annualLeaves?: number;
  hajjLeaves?: number;
  maternityLeaves?: number;
  paternityLeaves?: number;
  bereavementLeaves?: number;
  unauthorizedLeaves?: number;
  publicHolidays?: number;
  totalDays: number;
  leaves: number;
}

const StatsCard = ({ label, value, color }: StatsCardProps) => (
  <div
    className={`${color} bg-opacity-15 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
  >
    <h3 className="text-gray-700 text-sm font-medium mb-1">{label}</h3>
    <p className={`text-2xl font-bold ${color.replace("bg-", "text-")}`}>
      {value}
    </p>
  </div>
);

const AttendanceStats = ({ statistics }: { statistics: StatisticsProps }) => {
  const mainStats = [
    { label: "Present Days", value: statistics.present, color: "bg-gray-400" },
    {
      label: "Completed Days",
      value: statistics.completed || 0,
      color: "bg-green-500",
    },
    { label: "Absent Days", value: statistics.absent, color: "bg-red-600" },
    {
      label: "Late Arrivals",
      value: statistics.lateArrivals,
      color: "bg-yellow-500",
    },
    {
      label: "Early Departures",
      value: statistics.earlyDepartures,
      color: "bg-pink-500",
    },
    {
      label: "Half Days",
      value: statistics.halfDays || 0,
      color: "bg-orange-600",
    },
    {
      label: "Late & Early",
      value: statistics.lateAndEarly || 0,
      color: "bg-violet-700",
    },
  ];

  const leaveStats = [
    {
      label: "Casual Leaves",
      value: statistics.casualLeaves || 0,
      color: "bg-blue-600",
    },
    {
      label: "Sick Leaves",
      value: statistics.sickLeaves || 0,
      color: "bg-lime-600",
    },
    {
      label: "Annual Leaves",
      value: statistics.annualLeaves || 0,
      color: "bg-purple-400",
    },
    {
      label: "Hajj Leaves",
      value: statistics.hajjLeaves || 0,
      color: "bg-cyan-500",
    },
    {
      label: "Maternity Leaves",
      value: statistics.maternityLeaves || 0,
      color: "bg-fuchsia-800",
    },
    {
      label: "Paternity Leaves",
      value: statistics.paternityLeaves || 0,
      color: "bg-teal-600",
    },
    {
      label: "Bereavement Leaves",
      value: statistics.bereavementLeaves || 0,
      color: "bg-slate-700",
    },
    {
      label: "Unauthorized Leaves",
      value: statistics.unauthorizedLeaves || 0,
      color: "bg-red-900",
    },
    {
      label: "Public Holidays",
      value: statistics.publicHolidays || 0,
      color: "bg-sky-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Attendance Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mainStats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Leave Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {leaveStats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Records</p>
            <p className="text-xl font-bold text-gray-700">
              {statistics.totalDays}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Leaves</p>
            <p className="text-xl font-bold text-blue-600">
              {statistics.leaves}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Attendance Rate</p>
            <p className="text-xl font-bold text-green-600">
              {((statistics.present / statistics.totalDays) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Leave Rate</p>
            <p className="text-xl font-bold text-purple-600">
              {((statistics.leaves / statistics.totalDays) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStats;
