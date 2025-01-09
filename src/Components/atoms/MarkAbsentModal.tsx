import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";

interface MarkAbsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  _id: string;
  name: string;
  jobTitle?: string;
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

      // Add type checking and data validation
      const userData = response.data;
      if (Array.isArray(userData)) {
        setUsers(userData);
      } else if (
        userData &&
        typeof userData === "object" &&
        Array.isArray(userData.users)
      ) {
        // Handle case where users might be nested in a 'users' property
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

  // Ensure users is an array before filtering
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Mark Users as Absent</h2>

        <div className="mb-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="max-h-60 overflow-y-auto mb-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center p-2 hover:bg-gray-100"
            >
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
                className="mr-3"
              />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-600">
                  {user.jobTitle || "No title"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleMarkAbsent}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Mark Absent"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAbsentModal;
