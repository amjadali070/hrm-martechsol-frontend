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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${backendUrl}/api/users/getAllUsers`,
          {
            withCredentials: true,
            params: { limit: 100, page: 1 }, // Adjust pagination as needed
          }
        );
        console.log("Fetched Users:", response.data.users); // For debugging
        setUsers(response.data.users);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError(
          err.response?.data?.message || "Failed to fetch users. Try again."
        );
        toast.error(
          err.response?.data?.message || "Failed to fetch users. Try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
      // Optionally, you can remove the user from the list or update state
      closeResetModal();
    } catch (err: any) {
      console.error("Error resetting password:", err);
      toast.error(
        err.response?.data?.message || "Failed to reset password. Try again."
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <FaUserShield className="mr-2" /> User Password Manager
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading users...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                {/* <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Role</th> */}
                <th className="py-3 px-6 text-left">Department</th>
                <th className="py-3 px-6 text-left">Job Title</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">{user.name}</td>
                    {/* <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6 capitalize">{user.role}</td> */}
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
