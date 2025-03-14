// src/components/atoms/EditAttendanceModal.tsx

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { formatAttendenceTicketTime } from "../../utils/formateTime";

interface AttendanceTicket {
  _id: string;
  date: string;
  timeIn: string;
  timeOut: string;
  totalTime: string;
  user: {
    id: string;
    name: string;
    personalDetails: {
      abbreviatedJobTitle: string;
    };
  };
  workLocation: "Remote" | "On-site";
  comments: string;
  file: string | undefined;
  status: "Open" | "Approved" | "Rejected";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticket: AttendanceTicket | null;
  onSuccess: () => void;
}

const EditAttendanceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  ticket,
  onSuccess,
}) => {
  const [date, setDate] = useState<string>("");
  const [timeIn, setTimeIn] = useState<string>("");
  const [timeOut, setTimeOut] = useState<string>("");
  const [workLocation, setWorkLocation] = useState<"Remote" | "On-site">(
    "Remote"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    if (ticket) {
      setDate(ticket.date.split("T")[0]); // Assuming ISO format
      setTimeIn(ticket.timeIn);
      setTimeOut(ticket.timeOut);
      setWorkLocation(ticket.workLocation);
      setError("");
      calculateDuration(ticket.timeIn, ticket.timeOut);
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  /**
   * Calculates the duration between timeIn and timeOut.
   * Assumes timeOut can be on the next day.
   */
  const calculateDuration = (inTime: string, outTime: string) => {
    const [inHours, inMinutes] = inTime.split(":").map(Number);
    const [outHours, outMinutes] = outTime.split(":").map(Number);

    let start = new Date();
    start.setHours(inHours, inMinutes, 0, 0);

    let end = new Date();
    end.setHours(outHours, outMinutes, 0, 0);

    // If end time is before or equal to start time, assume it's the next day
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    setDuration(`${diffHours} hours ${diffMinutes} minutes`);
  };

  /**
   * Handles form submission to update the attendance ticket.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!date || !timeIn || !timeOut || !workLocation) {
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate time formats (HH:MM)
    const timeFormatRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    if (!timeFormatRegex.test(timeIn) || !timeFormatRegex.test(timeOut)) {
      setError("Time In and Time Out must be in HH:MM format.");

      return;
    }

    setError("");

    // Calculate duration
    const [inHours, inMinutes] = timeIn.split(":").map(Number);
    const [outHours, outMinutes] = timeOut.split(":").map(Number);

    let start = new Date(date);
    start.setHours(inHours, inMinutes, 0, 0);

    let end = new Date(date);
    end.setHours(outHours, outMinutes, 0, 0);

    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    setLoading(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      await axios.put(
        `${backendUrl}/api/attendance-tickets/${ticket._id}/edit`,
        {
          date,
          timeIn,
          timeOut,
          workLocation,
        },
        { withCredentials: true }
      );

      toast.success("Attendance ticket updated successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error updating attendance ticket:", error);
      setError(
        error.response?.data?.message || "Failed to update attendance ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md mx-4 p-6 relative overflow-y-auto max-h-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Attendance Ticket</h2>

        {/* Display Existing Time In and Time Out */}
        <div className="mb-4">
          <p>
            <strong>Submitted Time In:</strong>{" "}
            {formatAttendenceTicketTime(ticket.timeIn)}
          </p>
          <p>
            <strong>Submitted Time Out:</strong>{" "}
            {formatAttendenceTicketTime(ticket.timeOut)}
          </p>
          <p>
            <strong>Calculated Duration:</strong> {duration}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                calculateDuration(e.target.value, timeOut);
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Time In */}
          <div>
            <label
              htmlFor="timeIn"
              className="block text-sm font-medium text-gray-700"
            >
              Time In<span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="timeIn"
              value={timeIn}
              onChange={(e) => {
                setTimeIn(e.target.value);
                calculateDuration(e.target.value, timeOut);
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Time Out */}
          <div>
            <label
              htmlFor="timeOut"
              className="block text-sm font-medium text-gray-700"
            >
              Time Out<span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="timeOut"
              value={timeOut}
              onChange={(e) => {
                setTimeOut(e.target.value);
                calculateDuration(timeIn, e.target.value);
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Work Location */}
          <div>
            <label
              htmlFor="workLocation"
              className="block text-sm font-medium text-gray-700"
            >
              Work Location<span className="text-red-500">*</span>
            </label>
            <select
              id="workLocation"
              value={workLocation}
              onChange={(e) =>
                setWorkLocation(e.target.value as "Remote" | "On-site")
              }
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Display Error Message */}
          {error && (
            <div className="text-red-500 text-sm">
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white ${
                loading
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? "Updating..." : "Update Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAttendanceModal;
