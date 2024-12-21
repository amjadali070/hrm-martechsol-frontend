// src/components/BulkAttendanceForm.tsx

import React, { useState, FormEvent } from "react";
import SupportingModal from "./SupportingModal";

interface BulkAttendanceFormProps {
  onClose: () => void;
  onSubmit: (users: string[], date: string) => void;
}

const BulkAttendanceForm: React.FC<BulkAttendanceFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const [userIds, setUserIds] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const users = userIds
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "");
    if (users.length === 0 || !date) {
      alert("Please provide at least one user ID and a date.");
      return;
    }
    onSubmit(users, date);
  };

  return (
    <SupportingModal onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Bulk Attendance Processing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            User IDs (comma-separated)
          </label>
          <input
            type="text"
            name="userIds"
            value={userIds}
            onChange={(e) => setUserIds(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., user1_id,user2_id,user3_id"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors duration-300"
          >
            Process
          </button>
        </div>
      </form>
    </SupportingModal>
  );
};

export default BulkAttendanceForm;
