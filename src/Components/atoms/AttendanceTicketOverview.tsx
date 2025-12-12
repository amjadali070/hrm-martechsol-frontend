import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { formatDate } from "../../utils/formatDate";
import { FaSpinner, FaInbox, FaChevronRight } from "react-icons/fa";
import { truncateComment } from "../../utils/truncateComment";

interface AttendanceRecord {
  _id: string;
  date: string;
  comments: string;
  status: "Open" | "Closed" | "Rejected";
}

const AttendanceTicketOverview: React.FC = () => {
  const [attendanceTickets, setAttendanceTickets] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?._id;

  useEffect(() => {
    const fetchRecentAttendanceTickets = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get<AttendanceRecord[]>(
          `/api/attendance-tickets/user/${userId}?limit=5`
        );
        setAttendanceTickets(response.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching recent attendance tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAttendanceTickets();
  }, [userId]);

  const handleViewAll = () => {
    navigate("/tickets/attendance");
  };

  return (
    <section className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gunmetal-900 tracking-tight">
          Recent Tickets
        </h2>
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-gunmetal-600 hover:text-gunmetal-800 flex items-center gap-1 uppercase tracking-wider transition-colors"
        >
          View All <FaChevronRight size={8} />
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scroll">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <FaSpinner className="text-gunmetal-500 animate-spin" size={24} />
          </div>
        ) : attendanceTickets.length > 0 ? (
          <div className="w-full">
            <table className="w-full text-left text-sm">
              <thead className="bg-alabaster-grey-50 text-slate-grey-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-md font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Topic</th>
                  <th className="px-4 py-3 rounded-r-md text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-platinum-100">
                {attendanceTickets.map((ticket, index) => (
                  <tr key={ticket._id} className="hover:bg-alabaster-grey-50/50 transition-colors group">
                    <td className="px-4 py-3.5 text-gunmetal-800 font-medium text-xs">
                      {formatDate(ticket.date)}
                    </td>
                    <td className="px-4 py-3.5 text-gunmetal-600 text-xs">
                      {truncateComment(ticket.comments)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`px-2.5 py-1 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-md border items-center gap-1.5 ${
                          ticket.status === "Closed"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : ticket.status === "Open"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                         <span className={`w-1.5 h-1.5 rounded-full ${
                           ticket.status === "Closed" ? "bg-red-500" : ticket.status === "Open" ? "bg-yellow-500" : "bg-green-500"
                        }`}></span>
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-grey-400">
            <FaInbox size={32} className="mb-3 opacity-30 text-gunmetal-300" />
            <p className="text-sm font-medium">No recent tickets</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AttendanceTicketOverview;
