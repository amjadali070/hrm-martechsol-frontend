import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { format } from "date-fns";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { FaUserPlus, FaTimes, FaSearch, FaCheck } from "react-icons/fa";

interface AddAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  _id: string;
  name: string;
  jobTitle?: string;
  department?: string;
}

const attendanceTypes = [
  "Completed",
  "Absent",
  "Late IN",
  "Early Out",
  "Half Day",
  "Late IN and Early Out",
  "Casual Leave",
  "Sick Leave",
  "Annual Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Bereavement Leave",
  "Absence Without Pay",
  "Public Holiday",
];

const workLocationTypes = ["On-site", "Remote", "Hybrid"];

const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [timeIn, setTimeIn] = useState<string | null>("09:00");
  const [timeOut, setTimeOut] = useState<string | null>("17:00");
  const [type, setType] = useState("Completed");
  const [workLocation, setWorkLocation] = useState("On-site");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedUsers([]);
      setDate(format(new Date(), "yyyy-MM-dd"));
      setTimeIn("09:00");
      setTimeOut("17:00");
      setType("Completed");
      setWorkLocation("On-site");
      setRemarks("");
      setSearchTerm("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    const leaveTypes = [
      "Absent",
      "Casual Leave",
      "Sick Leave",
      "Annual Leave",
      "Maternity Leave",
      "Paternity Leave",
      "Bereavement Leave",
      "Absence Without Pay",
      "Public Holiday",
    ];

    if (leaveTypes.includes(type)) {
      setTimeIn(null);
      setTimeOut(null);
    } else {
      setTimeIn(timeIn || "09:00");
      setTimeOut(timeOut || "17:00");
    }
  }, [type]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/users/getAllUsers`
      );
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data?.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      toast.warning("Please select at least one user");
      return;
    }

    setLoading(true);
    try {
      const combinedDateTime = (time: string | null) => {
        if (!time) return null;
        const [hours, minutes] = time.split(":");
        const dateTime = new Date(date);
        dateTime.setHours(parseInt(hours), parseInt(minutes), 0);
        return dateTime.toISOString();
      };

      const response = await axiosInstance.post(
        `${backendUrl}/api/attendance/add-users-attendance`,
        {
          userIds: selectedUsers,
          date,
          timeIn: timeIn ? combinedDateTime(timeIn) : null,
          timeOut: timeOut ? combinedDateTime(timeOut) : null,
          type,
          workLocation,
          remarks,
        }
      );

      if (response.data.errors?.length > 0) {
        toast.warning(
          `Added attendance with ${response.data.errors.length} errors`
        );
      } else {
        toast.success("Successfully added attendance records");
      }
      onClose();
    } catch (error) {
      console.error("Error adding attendance:", error);
      toast.error("Failed to add attendance records");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedUsers.length === 0) {
      toast.warning("Please select at least one user");
      return;
    }
    setStep(2);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-gunmetal-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-platinum-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-platinum-200 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
             <div className="bg-gunmetal-100 p-2 rounded-lg text-gunmetal-600">
                <FaUserPlus />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gunmetal-900">
                  {step === 1 ? "Select Employees" : "Attendance Details"}
                </h2>
                <p className="text-xs text-slate-grey-500">
                   {step === 1 ? "Choose employees to add attendance for." : "Configure time and status details."}
                </p>
             </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-grey-400 hover:text-gunmetal-700 transition-colors p-1 hover:bg-platinum-100 rounded-md"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scroll flex-1">
            {step === 1 ? (
            <div className="flex flex-col h-full">
                <div className="relative group mb-4">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
                    />
                </div>

                <div className="flex-1 overflow-y-auto border border-platinum-200 rounded-xl bg-alabaster-grey-50/30">
                     {filteredUsers.length > 0 ? (
                        <div className="divide-y divide-platinum-100">
                            {filteredUsers.map((user) => (
                                <label
                                key={user._id}
                                className={`flex items-center p-3 cursor-pointer transition-colors hover:bg-white ${selectedUsers.includes(user._id) ? 'bg-white' : ''}`}
                                >
                                <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user._id)}
                                        onChange={(e) => {
                                        setSelectedUsers((prev) =>
                                            e.target.checked
                                            ? [...prev, user._id]
                                            : prev.filter((id) => id !== user._id)
                                        );
                                        }}
                                        className="peer appearance-none w-5 h-5 border-2 border-platinum-300 rounded checked:bg-gunmetal-600 checked:border-gunmetal-600 transition-colors cursor-pointer"
                                    />
                                    <FaCheck className="absolute text-white text-[10px] opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-medium ${selectedUsers.includes(user._id) ? 'text-gunmetal-900' : 'text-gunmetal-700'}`}>{user.name}</span>
                                    <span className="text-xs text-slate-grey-500">{user.jobTitle || "No Job Title"}</span>
                                </div>
                                </label>
                            ))}
                        </div>
                     ) : (
                         <div className="flex flex-col items-center justify-center h-48 text-slate-grey-400">
                             <p className="text-sm">No employees found.</p>
                         </div>
                     )}
                </div>
                
                 <div className="flex justify-between items-center mt-4 pt-2 border-t border-platinum-100">
                    <span className="text-xs font-semibold text-gunmetal-600 bg-platinum-100 px-2 py-1 rounded">
                        {selectedUsers.length} Selected
                    </span>
                 </div>
            </div>
            ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-1.5">
                        Attendance Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all shadow-sm"
                    />
                </div>

                <div className="col-span-1 md:col-span-2">
                     <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-1.5">
                        Status Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                         className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                        {attendanceTypes.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                        ))}
                    </select>
                </div>

                {type !== "Absent" && (
                    <>
                    <div>
                         <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-1.5">
                            Time In
                        </label>
                        <input
                        type="time"
                        value={timeIn || ""}
                        onChange={(e) => setTimeIn(e.target.value)}
                         className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-1.5">
                            Time Out
                        </label>
                        <input
                        type="time"
                        value={timeOut || ""}
                        onChange={(e) => setTimeOut(e.target.value)}
                         className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all shadow-sm"
                        />
                    </div>
                </>
                )}

                <div className="col-span-1 md:col-span-2">
                     <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-1.5">
                        Work Location
                    </label>
                    <select
                        value={workLocation}
                        onChange={(e) => setWorkLocation(e.target.value)}
                         className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all shadow-sm appearance-none cursor-pointer"
                    >
                        {workLocationTypes.map((loc) => (
                        <option key={loc} value={loc}>
                            {loc}
                        </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                     <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-1.5">
                        Remarks (Optional)
                    </label>
                    <textarea
                        rows={2}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all shadow-sm resize-none"
                        placeholder="Add any notes..."
                    />
                </div>
            </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-platinum-200 flex justify-end gap-3">
             {step === 1 ? (
                 <>
                   <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-semibold text-slate-grey-600 hover:text-gunmetal-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={selectedUsers.length === 0}
                    className="px-6 py-2 bg-gunmetal-900 text-white text-sm font-semibold rounded-lg hover:bg-gunmetal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Next Step
                  </button>
                 </>
             ) : (
                <>
                  <button
                    onClick={() => setStep(1)}
                     className="px-4 py-2 text-sm font-semibold text-slate-grey-600 hover:text-gunmetal-800 transition-colors"
                  >
                    Back to Selection
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center px-6 py-2 bg-gunmetal-900 text-white text-sm font-semibold rounded-lg hover:bg-gunmetal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>}
                    Confirm Attendance
                  </button>
                </>
             )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddAttendanceModal;
