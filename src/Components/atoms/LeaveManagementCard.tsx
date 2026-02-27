import React, { useState, useEffect } from "react";
import { FaInbox, FaTimes, FaChevronRight } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { LeaveRequest } from "../../types/LeaveRequest";
import { formatDate } from "../../utils/formatDate";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosConfig";

interface LeaveManagementCardProps {
  onViewAll?: () => void;
}

const fetchLeaveRequests = async (
  userRole: string
): Promise<LeaveRequest[]> => {
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
  const [recentLeaveRequests, setRecentLeaveRequests] = useState<
    LeaveRequest[]
  >([]);
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
            className="text-xs font-semibold text-slate-grey-500 hover:text-gunmetal-800 flex items-center gap-1 uppercase tracking-wider transition-colors"
          >
            View All <FaChevronRight size={8} className="translate-y-[0.5px]" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scroll -mr-2 pr-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full min-h-[150px]">
            <LoadingSpinner size="md" />
          </div>
        ) : recentLeaveRequests.length > 0 ? (
          <div className="w-full">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-platinum-200">
                  <th className="px-2 py-3 font-bold text-xs text-slate-grey-500 uppercase tracking-wider w-[40%]">
                    Employee
                  </th>
                  <th className="px-2 py-3 font-bold text-xs text-slate-grey-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-2 py-3 font-bold text-xs text-slate-grey-500 uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-platinum-100">
                {recentLeaveRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-alabaster-grey-50/50 transition-colors group"
                  >
                    <td className="px-2 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gunmetal-900 text-sm line-clamp-1">
                          {request.user.name}
                        </span>
                        <span className="text-slate-grey-500 text-[10px] font-medium uppercase tracking-wide mt-0.5 line-clamp-1">
                          {request.leaveType}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-gunmetal-700 font-medium">
                          {formatDate(request.startDate)}
                        </span>
                        <span className="text-slate-grey-400 text-[10px]">
                          to {formatDate(request.endDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 align-top text-right">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border min-w-[72px] ${
                          request.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : request.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-slate-grey-400">
            <div className="w-10 h-10 bg-alabaster-grey-50 rounded-full flex items-center justify-center mb-2">
              <FaInbox size={20} className="text-slate-grey-300" />
            </div>
            <p className="text-sm font-medium">No recent leave applications</p>
          </div>
        )}
      </div>

      {isPdfModalOpen && (
        <div className="fixed inset-0 bg-gunmetal-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] relative shadow-2xl p-2 border border-platinum-200 flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 border-b border-platinum-100 mb-2">
              <h3 className="font-bold text-gunmetal-900">Document Viewer</h3>
              <button
                onClick={closePdfModal}
                className="text-slate-grey-400 hover:text-gunmetal-900 bg-white rounded-full p-2 hover:bg-platinum-100 transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div className="flex-1 bg-alabaster-grey-50 rounded-xl overflow-hidden relative">
              <iframe
                src={selectedPdfUrl}
                className="w-full h-full"
                title="Handover Document"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default React.memo(LeaveManagementCard);
