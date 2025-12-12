import React, { useState, useEffect } from "react";
import { FaSpinner, FaInbox, FaTimes, FaChevronRight } from "react-icons/fa";
import { LeaveRequest } from "../../types/LeaveRequest";
import { formatDate } from "../../utils/formatDate";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosConfig";

interface LeaveManagementCardProps {
  onViewAll?: () => void;
}



const fetchLeaveRequests = async (userRole: string): Promise<LeaveRequest[]> => {
  try {
    const endpoint =
      userRole === "manager" || userRole === "SuperAdmin"
        ? `/api/leave-applications/assigned`
        : `/api/leave-applications`;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.error("Error fetching leave requests", error);
    return [];
  }
};

const LeaveManagementCard: React.FC<LeaveManagementCardProps> = ({
  onViewAll,
}) => {
  const { user } = useUser();
  const [recentLeaveRequests, setRecentLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string>("");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadRecentLeaveRequests = async () => {
      if (!user || !user.role) return;
      try {
        setIsLoading(true);
        const requests = await fetchLeaveRequests(user.role);
        const sortedRequests = requests.sort(
          (a: LeaveRequest, b: LeaveRequest) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setRecentLeaveRequests(sortedRequests.slice(0, 5));
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentLeaveRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const closePdfModal = () => {
    setIsPdfModalOpen(false);
    setSelectedPdfUrl("");
  };

  return (
    <section className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gunmetal-900 tracking-tight">
          Recent Requests
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-gunmetal-600 hover:text-gunmetal-800 flex items-center gap-1 uppercase tracking-wider transition-colors"
          >
            View All <FaChevronRight size={8} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scroll">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <FaSpinner className="text-gunmetal-500 animate-spin" size={24} />
          </div>
        ) : recentLeaveRequests.length > 0 ? (
          <div className="w-full">
            <table className="w-full text-left text-sm">
              <thead className="bg-alabaster-grey-50 text-slate-grey-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-md font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Period</th>
                  <th className="px-4 py-3 text-right rounded-r-md font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-platinum-100">
                {recentLeaveRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-alabaster-grey-50/50 transition-colors group">
                    <td className="px-4 py-3.5">
                       <div className="flex flex-col">
                          <span className="font-semibold text-gunmetal-800 text-sm">
                            {request.user.name}
                          </span>
                          <span className="text-slate-grey-400 text-xs font-medium">
                            {request.leaveType}
                          </span>
                       </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-gunmetal-600 font-medium">
                        <div className="flex flex-col">
                           <span>{formatDate(request.startDate)}</span>
                           <span className="text-slate-grey-400 text-[10px]">to {formatDate(request.endDate)}</span>
                        </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`px-2.5 py-1 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-md border items-center gap-1.5 ${
                          request.status === "Approved"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : request.status === "Rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                           request.status === "Approved" ? "bg-green-500" : request.status === "Rejected" ? "bg-red-500" : "bg-yellow-500"
                        }`}></span>
                        {request.status}
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
            <p className="text-sm font-medium">No recent leave applications</p>
          </div>
        )}
      </div>

      {isPdfModalOpen && (
        <div className="fixed inset-0 bg-carbon-black-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[90%] md:w-[80%] h-[80%] relative shadow-2xl p-2 border border-platinum-200">
            <button
              onClick={closePdfModal}
              className="absolute top-4 right-4 text-slate-grey-500 hover:text-gunmetal-900 z-10 bg-white rounded-full p-2 shadow-md border border-platinum-200 transition-colors"
            >
              <FaTimes size={20} />
            </button>
            <iframe
              src={selectedPdfUrl}
              className="w-full h-full rounded-xl"
              title="Handover Document"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default React.memo(LeaveManagementCard);
