import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

interface StatsCardProps {
  label: string;
  value: number;
  colorClass: string;
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
    <div className="fixed inset-0 bg-gunmetal-900/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-11/12 md:w-1/2 p-6 shadow-2xl border border-platinum-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gunmetal-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-grey-400 hover:text-gunmetal-800 transition-colors"
          >
            <IoCloseCircle size={28} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh] custom-scroll">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-platinum-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-grey-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-grey-500 uppercase">Day</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-grey-500 uppercase">Time In</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-grey-500 uppercase">Time Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-platinum-100">
              {records.map((record, index) => (
                <tr key={index} className="hover:bg-alabaster-grey-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gunmetal-900">
                    {new Date(record.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-grey-600">
                    {new Date(record.createdAt).toLocaleDateString(undefined, {
                      weekday: "long",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gunmetal-700">
                    {record.timeIn
                      ? new Date(record.timeIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gunmetal-700">
                    {record.timeOut
                      ? new Date(record.timeOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {records.length === 0 && (
            <div className="py-8 text-center text-slate-grey-400 text-sm">No records found</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ label, value, colorClass, onClick }: StatsCardProps) => (
  <div
    className={`${colorClass} p-3 rounded-lg flex items-center justify-between cursor-pointer hover:shadow-sm hover:scale-[1.02] transition-all duration-200 border border-transparent hover:border-black/5`}
    onClick={onClick}
  >
    <h3 className="text-sm font-semibold truncate mr-2 opacity-90">{label}</h3>
    <p className="text-lg font-bold">
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
      colorClass: "bg-emerald-50 text-emerald-700",
      type: "Present",
    },
    {
      label: "Completed Days",
      value: statistics.completed || 0,
      colorClass: "bg-emerald-50 text-emerald-700",
      type: "Completed",
    },
    {
      label: "Absent Days",
      value: statistics.absent,
      colorClass: "bg-rose-50 text-rose-700",
      type: "Absent",
    },
    {
      label: "Late IN",
      value: statistics.lateArrivals,
      colorClass: "bg-amber-50 text-amber-700",
      type: "Late IN",
    },
    {
      label: "Early Out",
      value: statistics.earlyDepartures,
      colorClass: "bg-rose-50 text-rose-700",
      type: "Early Out",
    },
    {
      label: "Half Days",
      value: statistics.halfDays || 0,
      colorClass: "bg-orange-50 text-orange-700",
      type: "Half Day",
    },
    {
      label: "Late IN & Early Out",
      value: statistics.lateAndEarly || 0,
      colorClass: "bg-purple-50 text-purple-700",
      type: "Late IN and Early Out",
    },
  ];

  const leaveStats = [
    {
      label: "Casual Leaves",
      value: statistics.casualLeaves || 0,
      colorClass: "bg-blue-50 text-blue-700",
      type: "Casual Leave",
    },
    {
      label: "Sick Leaves",
      value: statistics.sickLeaves || 0,
      colorClass: "bg-teal-50 text-teal-700",
      type: "Sick Leave",
    },
    {
      label: "Annual Leaves",
      value: statistics.annualLeaves || 0,
      colorClass: "bg-indigo-50 text-indigo-700",
      type: "Annual Leave",
    },
    {
      label: "Hajj Leaves",
      value: statistics.hajjLeaves || 0,
      colorClass: "bg-cyan-50 text-cyan-700",
      type: "Hajj Leave",
    },
    {
      label: "Maternity Leaves",
      value: statistics.maternityLeaves || 0,
      colorClass: "bg-fuchsia-50 text-fuchsia-700",
      type: "Maternity Leave",
    },
    {
      label: "Paternity Leaves",
      value: statistics.paternityLeaves || 0,
      colorClass: "bg-teal-50 text-teal-700",
      type: "Paternity Leave",
    },
    {
      label: "Bereavement Leaves",
      value: statistics.bereavementLeaves || 0,
      colorClass: "bg-slate-50 text-slate-700",
      type: "Bereavement Leave",
    },
    {
      label: "Unauthorized Leaves",
      value: statistics.unauthorizedLeaves || 0,
      colorClass: "bg-rose-50 text-rose-800",
      type: "Unauthorized Leave",
    },
    {
      label: "Public Holidays",
      value: statistics.publicHolidays || 0,
      colorClass: "bg-sky-50 text-sky-700",
      type: "Public Holiday",
    },
  ];

  const attendanceRate = statistics.totalDays > 0 ? (
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
  ) : 0;

  const leaveRate = statistics.totalDays > 0 ? (
      (statistics.leaves / statistics.totalDays) * 100
  ) : 0;


  return (
    <div className="space-y-8">
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {mainStats.map((stat, index) => (
            <StatsCard
              key={`main-${index}`}
              label={stat.label}
              value={stat.value}
              colorClass={stat.colorClass}
              onClick={() => handleStatsCardClick(stat.label, stat.type)}
            />
          ))}
          {leaveStats.map((stat, index) => (
            <StatsCard
              key={`leave-${index}`}
              label={stat.label}
              value={stat.value}
              colorClass={stat.colorClass}
              onClick={() => handleStatsCardClick(stat.label, stat.type)}
            />
          ))}
        </div>
      </div>

      <div className="pt-2">
        <h2 className="text-lg font-bold text-gunmetal-900 mb-4 tracking-tight">
          Attendance Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-alabaster-grey-50 rounded-xl border border-platinum-200">
            <div className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider mb-1">Total Records</div>
            <p className="text-2xl font-bold text-gunmetal-900">
              {statistics.totalDays}
            </p>
          </div>
          <div className="p-4 bg-alabaster-grey-50 rounded-xl border border-platinum-200">
            <div className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider mb-1">Total Leaves</div>
            <p className="text-2xl font-bold text-blue-600">
              {statistics.leaves}
            </p>
          </div>
          <div className="p-4 bg-alabaster-grey-50 rounded-xl border border-platinum-200">
            <div className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider mb-1">Attendance Rate</div>
            <p className="text-2xl font-bold text-emerald-600">
              {attendanceRate.toFixed(1)}%
            </p>
          </div>
          <div className="p-4 bg-alabaster-grey-50 rounded-xl border border-platinum-200">
            <div className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider mb-1">Leave Rate</div>
            <p className="text-2xl font-bold text-purple-600">
              {leaveRate.toFixed(1)}%
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
