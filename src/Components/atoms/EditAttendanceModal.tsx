import React, { useState, useEffect } from "react";
import { FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSpinner, FaSave, FaExclamationCircle } from "react-icons/fa";
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
  const [workLocation, setWorkLocation] = useState<"Remote" | "On-site">("Remote");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    if (ticket) {
      setDate(ticket.date.split("T")[0]); 
      setTimeIn(ticket.timeIn);
      setTimeOut(ticket.timeOut);
      setWorkLocation(ticket.workLocation);
      setError("");
      calculateDuration(ticket.timeIn, ticket.timeOut);
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const calculateDuration = (inTime: string, outTime: string) => {
    if (!inTime || !outTime) return;
    const [inHours, inMinutes] = inTime.split(":").map(Number);
    const [outHours, outMinutes] = outTime.split(":").map(Number);

    let start = new Date();
    start.setHours(inHours, inMinutes, 0, 0);

    let end = new Date();
    end.setHours(outHours, outMinutes, 0, 0);

    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    setDuration(`${diffHours} hrs ${diffMinutes} mins`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !timeIn || !timeOut || !workLocation) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      await axios.put(
        `${backendUrl}/api/attendance-tickets/${ticket._id}/edit`,
        { date, timeIn, timeOut, workLocation },
        { withCredentials: true }
      );

      toast.success("Attendance updated successfully!");
      onSuccess();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to update ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-platinum-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-platinum-200 bg-white">
          <div className="flex items-center gap-3">
             <div className="bg-gunmetal-50 p-2 rounded-xl text-gunmetal-600">
                 <FaClock size={20} />
             </div>
             <div>
                 <h2 className="text-lg font-bold text-gunmetal-900">Edit Attendance</h2>
                 <p className="text-xs text-slate-grey-500">Modify time logs or location</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-grey-400 hover:text-gunmetal-900 hover:bg-platinum-50 rounded-full transition-colors">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
           
           {/* Original Summary */}
           <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200 text-sm">
               <h4 className="font-bold text-gunmetal-700 text-xs uppercase mb-2">Original Submission</h4>
               <div className="grid grid-cols-2 gap-2 text-slate-grey-600">
                   <p>In: <span className="font-mono font-semibold">{formatAttendenceTicketTime(ticket.timeIn)}</span></p>
                   <p>Out: <span className="font-mono font-semibold">{formatAttendenceTicketTime(ticket.timeOut)}</span></p>
               </div>
           </div>

           <div className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1.5 ml-1">Date</label>
                  <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 pointer-events-none" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => {
                           setDate(e.target.value);
                           calculateDuration(timeIn, timeOut);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-300 rounded-xl text-gunmetal-900 focus:border-gunmetal-500 focus:ring-2 focus:ring-gunmetal-200 outline-none transition-all font-medium text-sm shadow-sm"
                      />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1.5 ml-1">Time In</label>
                      <input
                        type="time"
                        value={timeIn}
                        onChange={(e) => {
                            setTimeIn(e.target.value);
                            calculateDuration(e.target.value, timeOut);
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-platinum-300 rounded-xl text-gunmetal-900 focus:border-gunmetal-500 focus:ring-2 focus:ring-gunmetal-200 outline-none transition-all font-medium text-sm shadow-sm font-mono"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1.5 ml-1">Time Out</label>
                     <input
                        type="time"
                        value={timeOut}
                        onChange={(e) => {
                            setTimeOut(e.target.value);
                            calculateDuration(timeIn, e.target.value);
                        }}
                        className="w-full px-4 py-2.5 bg-white border border-platinum-300 rounded-xl text-gunmetal-900 focus:border-gunmetal-500 focus:ring-2 focus:ring-gunmetal-200 outline-none transition-all font-medium text-sm shadow-sm font-mono"
                      />
                  </div>
               </div>
               
               {/* Duration Indicator */}
               <div className="flex justify-between items-center text-xs px-2">
                   <span className="text-slate-grey-500 font-medium">Calculated Duration:</span>
                   <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{duration || "--"}</span>
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1.5 ml-1">Location</label>
                  <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 pointer-events-none" />
                      <select
                        value={workLocation}
                        onChange={(e) => setWorkLocation(e.target.value as "Remote" | "On-site")}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-platinum-300 rounded-xl text-gunmetal-900 focus:border-gunmetal-500 focus:ring-2 focus:ring-gunmetal-200 outline-none transition-all font-medium text-sm shadow-sm appearance-none cursor-pointer"
                      >
                          <option value="Remote">Remote</option>
                          <option value="On-site">On-site</option>
                      </select>
                  </div>
               </div>
           </div>

           {error && (
             <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100 text-sm font-medium">
                 <FaExclamationCircle />
                 {error}
             </div>
           )}

           <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gunmetal-900 hover:bg-gunmetal-800 text-white font-bold rounded-xl shadow-lg hover:shadow-gunmetal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {loading ? "Updating Ticket..." : "Save Changes"}
              </button>
           </div>

        </form>
      </div>
    </div>
  );
};

export default EditAttendanceModal;
