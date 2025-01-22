import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ResetPasswordModal from "./ResetPasswordModal";
import { FaUserShield } from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";

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
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${backendUrl}/api/users/getAllUsers`,
          {
            withCredentials: true,
            params: { limit: 100, page: 1 },
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

    fetchUsers();
  }, [backendUrl]);

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
            .toLowerCase()
            .includes(filters.department.toLowerCase())
        );
      }
      if (filters.role) {
        filtered = filtered.filter((user) =>
          user.role.toLowerCase().includes(filters.role.toLowerCase())
        );
      }
      if (filters.jobTitle) {
        filtered = filtered.filter((user) =>
          user.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase())
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
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <FaUserShield className="mr-2" /> User Password Manager
      </h1>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Filter by Name"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          placeholder="Filter by Department"
          className="p-2 border rounded"
        />

        <input
          type="text"
          name="jobTitle"
          value={filters.jobTitle}
          onChange={handleFilterChange}
          placeholder="Filter by Job Title"
          className="p-2 border rounded"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading users...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-purple-900 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Department</th>
                <th className="py-3 px-6 text-left">Job Title</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">{user.name}</td>
                    <td className="py-4 px-6">{user.department || "N/A"}</td>
                    <td className="py-4 px-6">{user.jobTitle || "N/A"}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => openResetModal(user)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
