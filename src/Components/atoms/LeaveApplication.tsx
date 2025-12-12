import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Like from "../../assets/like.png";
import axios from "axios";
import { 
  FaCalendarAlt, 
  FaRegCalendarAlt,
  FaFileAlt,
  FaPaperclip,
  FaPaperPlane,
  FaUndo,
  FaFileMedical,
  FaInfoCircle
} from "react-icons/fa";

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
        );
        setHandoverFile(null);
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB.");
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
      toast.error("Probationary employees cannot apply for standard leaves.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill all fields in the form.");
      return;
    }

    setIsSubmitting(true);

    try {
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
        toast.error(errorMsg);
      } else {
        toast.error("An unexpected error occurred");
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
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 flex flex-col mb-8 overflow-hidden">
        {/* Header */}
         <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200">
           <div className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
                  <FaRegCalendarAlt className="text-gunmetal-600 text-xl" />
              </div>
              <div>
                  <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                    Leave Application
                  </h2>
                  <p className="text-sm text-slate-grey-500">
                    Fill in the details below to request a leave.
                  </p>
              </div>
           </div>
        </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Leave Type */}
            <div className="flex flex-col">
                 <label htmlFor="leaveType" className="text-sm font-bold text-gunmetal-700 mb-2 flex items-center gap-1">
                    Leave Type <span className="text-rose-500">*</span>
                 </label>
                 <div className="relative group">
                    <FaFileAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                    <select
                        id="leaveType"
                        name="leaveType"
                        value={leaveType}
                        onChange={(e) => {
                            setLeaveType(e.target.value);
                            setHandoverFile(null);
                        }}
                        className={`w-full pl-9 pr-4 py-3 bg-white border ${
                            errors.leaveType ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-platinum-200 focus:border-gunmetal-500 focus:ring-gunmetal-500/20"
                        } rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-4 transition-all appearance-none cursor-pointer placeholder:text-slate-grey-400`}
                        >
                        <option value="">Select Leave Type</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                        <option value="Annual Leave">Annual Leave</option>
                    </select>
                </div>
                {errors.leaveType && (
                    <p className="mt-1.5 text-xs font-semibold text-rose-600 animate-in slide-in-from-left-1">{errors.leaveType}</p>
                )}
            </div>

            {/* Dates Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Start Date */}
                <div className="flex flex-col">
                    <label htmlFor="startDate" className="text-sm font-bold text-gunmetal-700 mb-2 flex items-center gap-1">
                        Start Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                        <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={`w-full pl-9 pr-4 py-3 bg-white border ${
                            errors.startDate ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-platinum-200 focus:border-gunmetal-500 focus:ring-gunmetal-500/20"
                        } rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-4 transition-all`}
                        />
                    </div>
                     {errors.startDate && (
                        <p className="mt-1.5 text-xs font-semibold text-rose-600 animate-in slide-in-from-left-1">{errors.startDate}</p>
                    )}
                </div>

                {/* End Date */}
                 <div className="flex flex-col">
                    <label htmlFor="endDate" className="text-sm font-bold text-gunmetal-700 mb-2 flex items-center gap-1">
                         End Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                        <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={`w-full pl-9 pr-4 py-3 bg-white border ${
                            errors.endDate ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-platinum-200 focus:border-gunmetal-500 focus:ring-gunmetal-500/20"
                        } rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-4 transition-all`}
                        />
                    </div>
                     {errors.endDate && (
                        <p className="mt-1.5 text-xs font-semibold text-rose-600 animate-in slide-in-from-left-1">{errors.endDate}</p>
                    )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Last Day */}
                <div className="flex flex-col">
                    <label htmlFor="lastDayToWork" className="text-sm font-bold text-gunmetal-700 mb-2 flex items-center gap-1">
                        Last Day of Work <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                         <input
                        type="date"
                        id="lastDayToWork"
                        name="lastDayToWork"
                        value={lastDayToWork}
                        onChange={(e) => setLastDayToWork(e.target.value)}
                        className={`w-full pl-9 pr-4 py-3 bg-white border ${
                            errors.lastDayToWork ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-platinum-200 focus:border-gunmetal-500 focus:ring-gunmetal-500/20"
                        } rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-4 transition-all`}
                        />
                    </div>
                     {errors.lastDayToWork && (
                        <p className="mt-1.5 text-xs font-semibold text-rose-600 animate-in slide-in-from-left-1">{errors.lastDayToWork}</p>
                    )}
                </div>

                {/* Return */}
                 <div className="flex flex-col">
                    <label htmlFor="returnToWork" className="text-sm font-bold text-gunmetal-700 mb-2 flex items-center gap-1">
                         Return to Work <span className="text-rose-500">*</span>
                    </label>
                   <div className="relative group">
                        <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                         <input
                        type="date"
                        id="returnToWork"
                        name="returnToWork"
                         value={returnToWork}
                        onChange={(e) => setReturnToWork(e.target.value)}
                         className={`w-full pl-9 pr-4 py-3 bg-white border ${
                            errors.returnToWork ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-platinum-200 focus:border-gunmetal-500 focus:ring-gunmetal-500/20"
                        } rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-4 transition-all`}
                        />
                    </div>
                    {errors.returnToWork && (
                        <p className="mt-1.5 text-xs font-semibold text-rose-600 animate-in slide-in-from-left-1">{errors.returnToWork}</p>
                    )}
                </div>
             </div>

             {/* Reason */}
             <div className="flex flex-col">
                 <label htmlFor="reason" className="text-sm font-bold text-gunmetal-700 mb-2 flex items-center gap-1">
                    Reason <span className="text-rose-500">*</span>
                 </label>
                 <textarea
                    id="reason"
                    name="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={`w-full p-4 bg-white border ${
                        errors.reason ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "border-platinum-200 focus:border-gunmetal-500 focus:ring-gunmetal-500/20"
                    } rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-4 transition-all placeholder:text-slate-grey-400`}
                    rows={4}
                    placeholder="Please explain the reason for your leave request..."
                 ></textarea>
                 {errors.reason && (
                    <p className="mt-1.5 text-xs font-semibold text-rose-600 animate-in slide-in-from-left-1">{errors.reason}</p>
                )}
             </div>

             {/* Attachment */}
             <div className="flex flex-col">
                 <label htmlFor="handoverFile" className="text-sm font-bold text-gunmetal-700 mb-2 flex items-center gap-1">
                     Attachment 
                     {leaveType === "Sick Leave" && <span className="text-rose-500">*</span>}
                     {leaveType === "Sick Leave" && <span className="text-xs font-normal text-slate-grey-500 ml-1">(Medical Certificate Required)</span>}
                 </label>
                 
                 <div className="relative">
                    <input
                        type="file"
                        id="handoverFile"
                        name="handoverFile"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf, .jpg, .jpeg, .png, .docx"
                    />
                    <label htmlFor="handoverFile" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-platinum-300 rounded-lg cursor-pointer bg-alabaster-grey-50 hover:bg-white hover:border-gunmetal-400 transition-all group">
                         <div className="flex flex-col items-center">
                            <FaPaperclip className="text-slate-grey-400 mb-2 group-hover:text-gunmetal-600 transition-colors" size={20} />
                            <span className="text-sm font-medium text-slate-grey-600 group-hover:text-gunmetal-800 transition-colors">
                                {handoverFile ? handoverFile.name : "Click to upload a document"}
                            </span>
                            {!handoverFile && <span className="text-xs text-slate-grey-400 mt-1">PDF, DOCX, JPG or PNG (Max 5MB)</span>}
                         </div>
                    </label>
                 </div>
                 
                  {errors.handoverFile && (
                    <p className="mt-1.5 text-xs font-semibold text-rose-600 animate-in slide-in-from-left-1">{errors.handoverFile}</p>
                )}

                 {handoverFile && handoverFile.type.startsWith("image/") && (
                    <div className="mt-4 p-2 border border-platinum-200 rounded-lg bg-alabaster-grey-50 inline-block w-fit">
                        <img
                        src={URL.createObjectURL(handoverFile)}
                        alt="Preview"
                        className="h-20 w-auto object-cover rounded"
                        />
                    </div>
                )}
             </div>

            {/* Actions */}
             <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-platinum-200">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center justify-center gap-2 px-8 py-3 bg-gunmetal-900 text-white text-sm font-bold rounded-lg hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20 hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 w-full sm:w-auto`}
                >
                    {isSubmitting ? (
                        <>Submitting...</>
                    ) : (
                        <>
                         <FaPaperPlane size={12} /> Submit Application
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-white border border-platinum-200 text-gunmetal-700 text-sm font-bold rounded-lg hover:bg-alabaster-grey-50 hover:text-gunmetal-900 transition-all shadow-sm w-full sm:w-auto"
                >
                    <FaUndo size={12} /> Reset
                </button>
             </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white p-8 rounded-2xl text-center w-full max-w-sm border border-platinum-200 shadow-2xl">
            <img
              src={Like}
              alt="Success"
              className="mx-auto mb-6 w-32 h-32 object-contain animate-in zoom-in spin-in-3"
            />
            <h3 className="text-xl font-bold text-gunmetal-900 mb-2">
              Application Submitted!
            </h3>
            <p className="text-sm text-slate-grey-600 mb-6 leading-relaxed">
              Your leave request has been sent for approval. You can track its status in the "Track Application" tab.
            </p>
            <button
              onClick={closeSuccessModal}
              className="w-full py-2.5 bg-gunmetal-900 text-white font-bold rounded-lg hover:bg-gunmetal-800 transition-all shadow-md"
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
