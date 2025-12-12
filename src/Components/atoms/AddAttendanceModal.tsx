import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";

interface AddAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  _id: string;
  name: string;
  jobTitle?: string;
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

  // Reset all states when modal is closed
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Handle attendance type change
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">
          {step === 1 ? "Select Users" : "Add Attendance Details"}
        </h2>

        {step === 1 ? (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="max-h-96 overflow-y-auto mb-4 border rounded">
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

            <div className="flex justify-between">
              <div className="text-sm text-gray-600">
                Selected users: {selectedUsers.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {attendanceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {type !== "Absent" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time In
                    </label>
                    <input
                      type="time"
                      value={timeIn || ""}
                      onChange={(e) => setTimeIn(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Out
                    </label>
                    <input
                      type="time"
                      value={timeOut || ""}
                      onChange={(e) => setTimeOut(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Location
                </label>
                <select
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {workLocationTypes.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Optional remarks..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Add Attendance"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddAttendanceModal;
