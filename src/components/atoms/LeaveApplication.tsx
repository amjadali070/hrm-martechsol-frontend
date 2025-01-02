// components/LeaveApplication.tsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Like from "../../assets/like.png";
import axios from "axios";

const LeaveApplication: React.FC = () => {
  const [leaveType, setLeaveType] = useState<string>("Annual Leave");
  const [startDate, setStartDate] = useState<string>(getTodayDate());
  const [endDate, setEndDate] = useState<string>(getTodayDate());
  const [lastDayToWork, setLastDayToWork] = useState<string>(
    getYesterdayDate()
  );
  const [returnToWork, setReturnToWork] = useState<string>(getTomorrowDate());
  const [reason, setReason] = useState<string>("");
  const [handoverFile, setHandoverFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{
    leaveType?: string;
    startDate?: string;
    endDate?: string;
    lastDayToWork?: string;
    returnToWork?: string;
    reason?: string;
    handoverFile?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [userLeases, setUserLeaves] = useState<any>({});
  const [jobStatus, setJobStatus] = useState<string>("");

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  function getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  function getYesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }

  function getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  useEffect(() => {
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      setReturnToWork(end.toISOString().split("T")[0]);
    }
  }, [endDate]);

  useEffect(() => {
    if (startDate) {
      const lastDay = new Date(startDate);
      lastDay.setDate(lastDay.getDate() - 1);
      setLastDayToWork(lastDay.toISOString().split("T")[0]);
    }
  }, [startDate]);

  useEffect(() => {
    // Fetch user details to get leave balances and job status
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users/profile`, {
          withCredentials: true,
        });
        setUserLeaves(response.data.leaves);
        setJobStatus(response.data.personalDetails.jobStatus);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };

    fetchUserDetails();
  }, [backendUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Please upload a PDF, JPG, PNG, or DOCX file.",
          {
            position: "top-center",
            autoClose: 3000,
          }
        );
        setHandoverFile(null);
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB.", {
          position: "top-center",
          autoClose: 3000,
        });
        setHandoverFile(null);
        return;
      }

      setHandoverFile(file);
    }
  };

  const validateForm = () => {
    const newErrors: {
      leaveType?: string;
      startDate?: string;
      endDate?: string;
      lastDayToWork?: string;
      returnToWork?: string;
      reason?: string;
      handoverFile?: string;
    } = {};

    if (!leaveType) newErrors.leaveType = "Please select a leave type.";
    if (!startDate) newErrors.startDate = "Start date is required.";
    if (!endDate) newErrors.endDate = "End date is required.";
    if (new Date(startDate) > new Date(endDate))
      newErrors.endDate = "End date cannot be before start date.";
    if (!lastDayToWork)
      newErrors.lastDayToWork = "Last day to work is required.";
    if (new Date(lastDayToWork) >= new Date(startDate))
      newErrors.lastDayToWork = "Last day to work must be before start date.";
    if (!returnToWork)
      newErrors.returnToWork = "Return to work date is required.";
    if (new Date(returnToWork) <= new Date(endDate))
      newErrors.returnToWork = "Return to work date must be after end date.";
    if (!reason.trim()) newErrors.reason = "Reason for leave is required.";

    // Mandatory file upload for Sick Leave
    if (leaveType === "Sick Leave" && !handoverFile) {
      newErrors.handoverFile = "Medical document is required for Sick Leave.";
    }

    // Additional Validation: Check leave balance for standard leaves
    const standardLeaves = ["Sick Leave", "Casual Leave", "Annual Leave"];
    if (standardLeaves.includes(leaveType) && jobStatus !== "Permanent") {
      newErrors.leaveType =
        "Probationary employees cannot apply for standard leaves.";
    }

    if (standardLeaves.includes(leaveType)) {
      const leaveKey = leaveType.toLowerCase().replace(" ", "");
      if (userLeases[leaveKey] === 0) {
        newErrors.leaveType = `You have exhausted your ${leaveType}.`;
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setLeaveType("Annual Leave");
    setStartDate(getTodayDate());
    setEndDate(getTodayDate());
    setLastDayToWork(getYesterdayDate());
    setReturnToWork(getTomorrowDate());
    setReason("");
    setHandoverFile(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (standardLeaves.includes(leaveType) && jobStatus === "Probation") {
      toast.error("Probationary employees cannot apply for standard leaves.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("leaveType", leaveType);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("lastDayToWork", lastDayToWork);
      formData.append("returnToWork", returnToWork);
      formData.append("reason", reason);

      if (handoverFile) {
        formData.append("handoverDocument", handoverFile);
      }

      await axios.post(`${backendUrl}/api/leave-applications`, formData, {
        withCredentials: true,
      });

      setShowSuccess(true);
      handleReset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "Failed to submit leave application";
        toast.error(errorMsg, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.error("An unexpected error occurred", {
          position: "top-center",
          autoClose: 3000,
        });
      }
      console.error("Error submitting leave application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
  };

  const standardLeaves = ["Sick Leave", "Casual Leave", "Annual Leave"];

  return (
    <div className="w-full md:p-8 bg-white rounded-lg mb-8">
      <h2 className="text-3xl font-bold text-center mb-4 text-purple-900">
        Leave Application
      </h2>
      <p className="text-center mb-6 text-gray-600">
        Fill in the required fields below to apply for leave.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="leaveType"
            className="block text-gray-700 font-medium mb-1"
          >
            Leave Type <span className="text-red-500">*</span>
          </label>
          <select
            id="leaveType"
            name="leaveType"
            value={leaveType}
            onChange={(e) => {
              setLeaveType(e.target.value);
              // Reset file when leave type changes
              setHandoverFile(null);
            }}
            className={`w-full p-3 border ${
              errors.leaveType ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            required
            aria-describedby={errors.leaveType ? "leaveType-error" : undefined}
          >
            <option value="">Select Leave Type</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Annual Leave">Annual Leave</option>
          </select>
          {errors.leaveType && (
            <p className="mt-1 text-sm text-red-600" id="leaveType-error">
              {errors.leaveType}
            </p>
          )}
        </div>

        {/* Start and End Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-gray-700 font-medium mb-1"
            >
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full p-3 border ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              required
              aria-describedby={
                errors.startDate ? "startDate-error" : undefined
              }
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600" id="startDate-error">
                {errors.startDate}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-gray-700 font-medium mb-1"
            >
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full p-3 border ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              required
              aria-describedby={errors.endDate ? "endDate-error" : undefined}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600" id="endDate-error">
                {errors.endDate}
              </p>
            )}
          </div>
        </div>

        {/* Last Day to Work and Return to Work */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Last Day to Work */}
          <div>
            <label
              htmlFor="lastDayToWork"
              className="block text-gray-700 font-medium mb-1"
            >
              Last Day to Work <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="lastDayToWork"
              name="lastDayToWork"
              value={lastDayToWork}
              onChange={(e) => setLastDayToWork(e.target.value)}
              className={`w-full p-3 border ${
                errors.lastDayToWork ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              required
              aria-describedby={
                errors.lastDayToWork ? "lastDayToWork-error" : undefined
              }
            />
            {errors.lastDayToWork && (
              <p className="mt-1 text-sm text-red-600" id="lastDayToWork-error">
                {errors.lastDayToWork}
              </p>
            )}
          </div>

          {/* Return to Work */}
          <div>
            <label
              htmlFor="returnToWork"
              className="block text-gray-700 font-medium mb-1"
            >
              Return to Work <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="returnToWork"
              name="returnToWork"
              value={returnToWork}
              onChange={(e) => setReturnToWork(e.target.value)}
              className={`w-full p-3 border ${
                errors.returnToWork ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              required
              aria-describedby={
                errors.returnToWork ? "returnToWork-error" : undefined
              }
            />
            {errors.returnToWork && (
              <p className="mt-1 text-sm text-red-600" id="returnToWork-error">
                {errors.returnToWork}
              </p>
            )}
          </div>
        </div>

        {/* Reason for Leave */}
        <div>
          <label
            htmlFor="reason"
            className="block text-gray-700 font-medium mb-1"
          >
            Reason for Leave <span className="text-red-500">*</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={`w-full p-3 border ${
              errors.reason ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
            rows={4}
            placeholder="Provide a brief reason for your leave"
            required
            aria-describedby={errors.reason ? "reason-error" : undefined}
          ></textarea>
          {errors.reason && (
            <p className="mt-1 text-sm text-red-600" id="reason-error">
              {errors.reason}
            </p>
          )}
        </div>

        {/* Attach Document */}
        <div>
          <label
            htmlFor="handoverFile"
            className="block text-gray-700 font-medium mb-1"
          >
            Attach Document{" "}
            {leaveType === "Sick Leave" && (
              <span className="text-red-500">*</span>
            )}
            {leaveType === "Sick Leave" && (
              <span className="text-sm text-gray-500 ml-2">
                (Medical certificate required)
              </span>
            )}
          </label>
          <input
            type="file"
            id="handoverFile"
            name="handoverFile"
            onChange={handleFileChange}
            className="w-full text-gray-700"
            accept=".pdf, .jpg, .jpeg, .png, .docx"
          />
          {errors.handoverFile && (
            <p className="mt-1 text-sm text-red-600" id="handoverFile-error">
              {errors.handoverFile}
            </p>
          )}
          {handoverFile && (
            <div className="mt-2 flex items-center">
              {handoverFile.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(handoverFile)}
                  alt="Handover Document Preview"
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
              )}
              <span className="text-sm text-gray-600">{handoverFile.name}</span>
            </div>
          )}
        </div>

        <div className="flex justify-start space-x-4">
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Reset
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center w-96">
            <img
              src={Like}
              alt="Success Icon"
              className="mx-auto mb-4 w-40 h-40 object-contain"
            />
            <h3 className="text-xl font-semibold mb-2 text-purple-900">
              Great Job!
            </h3>
            <p className="text-gray-700 mb-4">
              Your leave application would be reviewed by the admin.
            </p>
            <button
              onClick={closeSuccessModal}
              className="bg-purple-900 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApplication;
