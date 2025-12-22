import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { format } from "date-fns";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { FaUserTimes, FaTimes, FaSearch, FaCheck } from "react-icons/fa";

interface MarkAbsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  _id: string;
  name: string;
  jobTitle?: string;
  department?: string; // Added for potential filter in future
}

const MarkAbsentModal: React.FC<MarkAbsentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/users/getAllUsers`
      );

      const userData = response.data;
      if (Array.isArray(userData)) {
        setUsers(userData);
      } else if (
        userData &&
        typeof userData === "object" &&
        Array.isArray(userData.users)
      ) {
        setUsers(userData.users);
      } else {
        console.error("Unexpected API response format:", userData);
        toast.error("Invalid data format received from server");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      setUsers([]);
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleMarkAbsent = async () => {
    if (selectedUsers.length === 0) {
      toast.warning("Please select at least one user");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${backendUrl}/api/attendance/mark-absent`,
        {
          userIds: selectedUsers,
          date: selectedDate,
        }
      );

      if (response.data.errors?.length > 0) {
        toast.warning(
          `Marked absent with ${response.data.errors.length} errors`
        );
      } else {
        toast.success("Successfully marked users as absent");
      }
      onClose();
    } catch (error) {
      console.error("Error marking users absent:", error);
      toast.error("Failed to mark users as absent");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-gunmetal-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-platinum-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-platinum-200 flex justify-between items-center bg-rose-50/50">
          <div className="flex items-center gap-3">
             <div className="bg-white p-2 rounded-lg text-rose-600 border border-rose-100 shadow-sm">
                <FaUserTimes />
             </div>
             <div>
                <h2 className="text-lg font-bold text-gunmetal-900">
                  Mark Absent
                </h2>
                <p className="text-xs text-slate-grey-500">
                   Record employee absence for a specific date.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scroll flex-1 flex flex-col">
            <div className="mb-6">
                <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-1.5">
                    Select Date
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm"
                />
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                 <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-1.5">
                    Select Employees
                </label>
                <div className="relative group mb-3">
                     <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                     <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-grey-400"
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
                                        className="peer appearance-none w-5 h-5 border-2 border-platinum-300 rounded checked:bg-rose-600 checked:border-rose-600 transition-colors cursor-pointer"
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
                 <div className="flex justify-between items-center mt-3 pt-2 text-xs text-slate-grey-500">
                    <span>{selectedUsers.length} employees selected</span>
                 </div>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-platinum-200 flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-grey-600 hover:text-gunmetal-800 transition-colors"
             >
                Cancel
            </button>
            <button
                onClick={handleMarkAbsent}
                disabled={loading || selectedUsers.length === 0}
                className="flex items-center px-6 py-2 bg-rose-600 text-white text-sm font-semibold rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>}
                Confirm Absences
            </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MarkAbsentModal;
