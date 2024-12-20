import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaCar,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";

interface AssignVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onAssign: () => void;
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
    personalDetails: {
      fullJobTitle: string;
    };
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
}

const AssignVehicleModal: React.FC<AssignVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onAssign,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/users/getAllUsers`,
        {
          params: {
            limit: 1000,
          },
        }
      );
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

  const handleAssign = async () => {
    if (!selectedUser) {
      toast.error("Please select a user to assign the vehicle.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put(
        `${backendUrl}/api/vehicles/${vehicle._id}/assign`,
        {
          userId: selectedUser,
        }
      );
      toast.success("Vehicle assigned successfully.");
      onAssign();
      onClose();
    } catch (err: any) {
      console.error("Error assigning vehicle:", err);
      setError(err.response?.data?.message || "Failed to assign vehicle.");
      toast.error(err.response?.data?.message || "Failed to assign vehicle.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 ease-in-out">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl flex items-center">
          <FaCar className="mr-3 w-8 h-8" />
          <h2 className="text-2xl font-bold">Assign Vehicle</h2>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Vehicle Information */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-2">
              <FaCar className="mr-2 text-blue-600" />
              <p className="font-semibold text-lg">
                {vehicle.make} {vehicle.model}
              </p>
            </div>
            <p className="text-gray-600">
              Registration No: {vehicle.registrationNo}
            </p>
          </div>

          {/* Current Assignment */}
          {vehicle.assignedTo && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-center">
              <FaUsers className="mr-2 text-yellow-600" />
              <div>
                <p className="font-semibold">Currently Assigned To</p>
                <p className="text-gray-700">
                  {vehicle.assignedTo.name} (
                  {vehicle.assignedTo.personalDetails.fullJobTitle})
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700 flex items-center">
              <FaTimesCircle className="mr-2 text-red-500" />
              {error}
            </div>
          )}

          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaUsers className="mr-2 text-blue-600" />
              Select User to Assign
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">Select a User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.jobTitle} | {user.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-200 flex items-center"
          >
            <FaTimesCircle className="mr-2" /> Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={loading}
            className={`px-6 py-2 text-white rounded-full flex items-center transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <FaCheckCircle className="mr-2" /> Assign
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignVehicleModal;
