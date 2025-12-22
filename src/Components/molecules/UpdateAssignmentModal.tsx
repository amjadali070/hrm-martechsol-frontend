// src/components/UpdateAssignmentModal.tsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosConfig";

interface UpdateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onUpdateAssignment: () => void;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  registrationNo: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const UpdateAssignmentModal: React.FC<UpdateAssignmentModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onUpdateAssignment,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>(
    vehicle.assignedTo ? vehicle.assignedTo._id : ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users to assign
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/getAllUsers", {
        params: {
          limit: 1000, // Adjust as needed
        },
      });
      setUsers(response.data.users);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users.");
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const handleReassign = async () => {
    if (!selectedUser) {
      toast.error("Please select a user to reassign the vehicle.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put(`/vehicles/${vehicle._id}/reassign`, {
        newUserId: selectedUser,
      });
      toast.success("Vehicle reassigned successfully.");
      onUpdateAssignment();
      onClose();
    } catch (err: any) {
      console.error("Error reassigning vehicle:", err);
      setError(err.response?.data?.message || "Failed to reassign vehicle.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1050] overflow-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Reassign Vehicle</h2>
        <p className="mb-2">
          <strong>Vehicle:</strong> {vehicle.make} {vehicle.model} (
          {vehicle.registrationNo})
        </p>
        {vehicle.assignedTo && (
          <p className="mb-4">
            <strong>Currently Assigned To:</strong> {vehicle.assignedTo.name} (
            {vehicle.assignedTo.email})
          </p>
        )}
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select New User
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={handleReassign}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-full ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {loading ? "Reassigning..." : "Reassign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAssignmentModal;
