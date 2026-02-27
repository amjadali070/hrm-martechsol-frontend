import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ResetPasswordModal from "./ResetPasswordModal";
import { FaUserShield, FaSearch, FaFilter } from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";
import { FiRefreshCw } from "react-icons/fi";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  jobTitle: string;
  fullJobTitle: string;
}

const UserPasswordManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({
    name: "",
    department: "",
    role: "",
    jobTitle: "",
  });
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchUsers();
  }, [backendUrl]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/users/getAllUsers`,
        {
          withCredentials: true,
          params: { limit: 1000, page: 1 },
        }
      );
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = users;
      if (filters.name) {
        filtered = filtered.filter((user) =>
          user.name.toLowerCase().includes(filters.name.toLowerCase())
        );
      }
      if (filters.department) {
        filtered = filtered.filter((user) =>
          user.department
            ?.toLowerCase()
            .includes(filters.department.toLowerCase())
        );
      }
      if (filters.jobTitle) {
        filtered = filtered.filter((user) =>
          user.jobTitle?.toLowerCase().includes(filters.jobTitle.toLowerCase())
        );
      }
      setFilteredUsers(filtered);
    };

    applyFilters();
  }, [filters, users]);

  const openResetModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeResetModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleResetPassword = async (newPassword: string) => {
    if (!selectedUser) return;

    try {
      await axiosInstance.put(
        `${backendUrl}/api/users/${selectedUser._id}/reset-password`,
        { newPassword },
        { withCredentials: true }
      );
      toast.success(`Password reset successfully for ${selectedUser.name}`);
      closeResetModal();
    } catch (err: any) {
      console.error("Error resetting password:", err);
      toast.error("Failed to reset password.");
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gunmetal-50 p-2.5 rounded-lg border border-platinum-200">
             <FaUserShield className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                User Password Manager
            </h1>
            <p className="text-sm text-slate-grey-500">
                Manage and reset employee access credentials securely.
            </p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center px-4 py-2 bg-white border border-platinum-200 text-gunmetal-600 rounded-lg hover:bg-platinum-50 hover:text-gunmetal-900 transition-all text-sm font-medium shadow-sm"
        >
          <FiRefreshCw className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh List
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="relative group">
           <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
           <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Search by Name"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
           />
        </div>
        
        <div className="relative group">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
            <input
            type="text"
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            placeholder="Filter by Department"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
            />
        </div>

        <div className="relative group">
             <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
             <input
                type="text"
                name="jobTitle"
                value={filters.jobTitle}
                onChange={handleFilterChange}
                placeholder="Filter by Job Title"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
            />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
           <div className="w-8 h-8 border-4 border-gunmetal-200 border-t-gunmetal-600 rounded-full animate-spin mb-4"></div>
           <p className="text-slate-grey-500 font-medium">Loading user records...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-center">
            {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-platinum-200 shadow-sm">
           <div className="overflow-x-auto">
              <table className="w-full table-auto bg-white">
                <thead className="bg-alabaster-grey-50 border-b border-platinum-200">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-6 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Department</th>
                    <th className="py-3 px-6 text-left text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Job Title</th>
                    <th className="py-3 px-6 text-right text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-platinum-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-12 px-6 text-center text-slate-grey-400"
                      >
                         <p className="font-medium text-sm">No users found matching your search.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-alabaster-grey-50/50 transition-colors"
                      >
                        <td className="py-3 px-6">
                            <div className="font-semibold text-gunmetal-900 text-sm">{user.name}</div>
                            <div className="text-xs text-slate-grey-500">{user.email || "No email"}</div>
                        </td>
                        <td className="py-3 px-6 text-sm text-slate-grey-600">{user.department || "N/A"}</td>
                        <td className="py-3 px-6 text-sm text-slate-grey-600">{user.jobTitle || "N/A"}</td>
                        <td className="py-3 px-6 text-right">
                          <button
                            onClick={() => openResetModal(user)}
                            className="inline-flex items-center px-3 py-1.5 bg-white border border-platinum-200 text-gunmetal-700 text-xs font-bold rounded-lg hover:bg-gunmetal-900 hover:text-white hover:border-gunmetal-900 transition-all shadow-sm"
                          >
                             <FiRefreshCw className="mr-1.5" />
                             Reset
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {selectedUser && (
        <ResetPasswordModal
          isOpen={isModalOpen}
          onClose={closeResetModal}
          onReset={handleResetPassword}
          userName={selectedUser.name}
        />
      )}
    </div>
  );
};

export default UserPasswordManager;
