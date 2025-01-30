import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

interface StatsCardProps {
  label: string;
  value: number;
  color: string;
  onClick: () => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  records: any[];
}

export interface StatisticsProps {
  present: number;
  completed: number;
  absent: number;
  lateArrivals: number;
  earlyDepartures: number;
  halfDays: number;
  lateAndEarly: number;
  casualLeaves: number;
  sickLeaves: number;
  annualLeaves: number;
  hajjLeaves: number;
  maternityLeaves: number;
  paternityLeaves: number;
  bereavementLeaves: number;
  unauthorizedLeaves: number;
  publicHolidays: number;
  totalDays: number;
  leaves: number;
}

interface AttendanceStatsProps {
  statistics: StatisticsProps;
  attendanceData: any[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, records }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-1/2 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoCloseCircle size={24} />
            {/* &times; */}
          </button>
        </div>
        <div className="overflow-y-auto max-h-96">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Day</th>
                <th className="px-4 py-2 text-left">Time In</th>
                <th className="px-4 py-2 text-left">Time Out</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(record.createdAt).toLocaleDateString(undefined, {
                      weekday: "long",
                    })}
                  </td>
                  <td className="px-4 py-2">
                    {record.timeIn
                      ? new Date(record.timeIn).toLocaleTimeString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {record.timeOut
                      ? new Date(record.timeOut).toLocaleTimeString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {records.length === 0 && (
            <p className="text-gray-500 text-center">No records found</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ label, value, color, onClick }: StatsCardProps) => (
  <div
    className={`${color} bg-opacity-15 p-1.5 rounded-lg flex items-center justify-between cursor-pointer hover:bg-opacity-25 transition-all`}
    onClick={onClick}
  >
    <h3 className="text-gray-700 text-sm font-medium ml-2">{label}</h3>
    <p className={`text-xl font-bold mr-2 ${color.replace("bg-", "text-")}`}>
      {value}
    </p>
  </div>
);

const AttendanceStats = ({
  statistics,
  attendanceData,
}: AttendanceStatsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalRecords, setModalRecords] = useState<any[]>([]);

  const handleStatsCardClick = (label: string, type: string) => {
    const filteredRecords = attendanceData.filter(
      (record) => record.type === type
    );
    setModalTitle(label);
    setModalRecords(filteredRecords);
    setIsModalOpen(true);
  };

  const mainStats = [
    {
      label: "Present Days",
      value: statistics.present || 0,
      color: "bg-green-500",
      type: "Present",
    },
    {
      label: "Completed Days",
      value: statistics.completed || 0,
      color: "bg-green-500",
      type: "Completed",
    },
    {
      label: "Absent Days",
      value: statistics.absent,
      color: "bg-red-600",
      type: "Absent",
    },
    {
      label: "Late IN",
      value: statistics.lateArrivals,
      color: "bg-yellow-500",
      type: "Late IN",
    },
    {
      label: "Early Out",
      value: statistics.earlyDepartures,
      color: "bg-pink-500",
      type: "Early Out",
    },
    {
      label: "Half Days",
      value: statistics.halfDays || 0,
      color: "bg-orange-600",
      type: "Half Day",
    },
    {
      label: "Late IN & Early Out",
      value: statistics.lateAndEarly || 0,
      color: "bg-violet-700",
      type: "Late IN and Early Out",
    },
  ];

  const leaveStats = [
    {
      label: "Casual Leaves",
      value: statistics.casualLeaves || 0,
      color: "bg-blue-600",
      type: "Casual Leave",
    },
    {
      label: "Sick Leaves",
      value: statistics.sickLeaves || 0,
      color: "bg-lime-600",
      type: "Sick Leave",
    },
    {
      label: "Annual Leaves",
      value: statistics.annualLeaves || 0,
      color: "bg-purple-400",
      type: "Annual Leave",
    },
    {
      label: "Hajj Leaves",
      value: statistics.hajjLeaves || 0,
      color: "bg-cyan-500",
      type: "Hajj Leave",
    },
    {
      label: "Maternity Leaves",
      value: statistics.maternityLeaves || 0,
      color: "bg-fuchsia-800",
      type: "Maternity Leave",
    },
    {
      label: "Paternity Leaves",
      value: statistics.paternityLeaves || 0,
      color: "bg-teal-600",
      type: "Paternity Leave",
    },
    {
      label: "Bereavement Leaves",
      value: statistics.bereavementLeaves || 0,
      color: "bg-slate-700",
      type: "Bereavement Leave",
    },
    {
      label: "Unauthorized Leaves",
      value: statistics.unauthorizedLeaves || 0,
      color: "bg-red-900",
      type: "Unauthorized Leave",
    },
    {
      label: "Public Holidays",
      value: statistics.publicHolidays || 0,
      color: "bg-sky-700",
      type: "Public Holiday",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {mainStats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              onClick={() => handleStatsCardClick(stat.label, stat.type)}
            />
          ))}
          {leaveStats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              value={stat.value}
              color={stat.color}
              onClick={() => handleStatsCardClick(stat.label, stat.type)}
            />
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Attendence Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Total Records</div>
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
              {(
                ((statistics.completed +
                  statistics.publicHolidays +
                  statistics.lateAndEarly +
                  statistics.lateArrivals +
                  statistics.present +
                  statistics.leaves +
                  statistics.earlyDepartures +
                  statistics.halfDays) /
                  statistics.totalDays) *
                100
              ).toFixed(1)}
              %
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        records={modalRecords}
      />
    </div>
  );
};
export default AttendanceStats;
