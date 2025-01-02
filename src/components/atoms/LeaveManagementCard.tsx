import React, { useState, useEffect } from "react";
import { FaSpinner, FaInbox, FaFilePdf, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { LeaveRequest } from "../../types/LeaveRequest";
import { formatDate } from "../../utils/formatDate";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosConfig";

interface LeaveManagementCardProps {
  onViewAll?: () => void;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const fetchLeaveRequests = async (
  userRole: string
): Promise<LeaveRequest[]> => {
  try {
    const endpoint =
      userRole === "manager" || userRole === "SuperAdmin"
        ? `${backendUrl}/api/leave-applications/assigned`
        : `${backendUrl}/api/leave-applications`;

    const { data } = await axiosInstance.get(endpoint, {
      withCredentials: true,
    });

    return data;
  } catch (error) {
    console.error("Error fetching leave requests", error);
    // toast.error("Failed to fetch leave requests.");
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
      if (!user || !user.role) {
        return;
      }
      try {
        setIsLoading(true);
        const requests = await fetchLeaveRequests(user.role);

        const sortedRequests = requests.sort(
          (a: LeaveRequest, b: LeaveRequest) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        // Get top 5
        const top5 = sortedRequests.slice(0, 5);

        setRecentLeaveRequests(top5);
      } catch (error) {
        // toast.error("Error loading recent leave requests.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentLeaveRequests();
  }, [user?.role]);

  const closePdfModal = () => {
    setIsPdfModalOpen(false);
    setSelectedPdfUrl("");
  };

  return (
    <section className="flex flex-col w-full md:w-6/12 max-md:ml-0 max-md:w-full">
      <div
        className="flex flex-col p-6 mx-auto w-full bg-white rounded-xl"
        style={{ height: "251px" }}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-black">
            Recent Leave Applications
          </h2>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="mt-4 sm:mt-0 px-6 py-2 text-sm sm:text-base text-center text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors duration-300"
            >
              View All
            </button>
          )}
        </div>

        {isLoading ? (
          <div
            className="flex justify-center items-center"
            style={{ height: "200px" }}
          >
            <FaSpinner className="text-blue-500 animate-spin" size={30} />
          </div>
        ) : recentLeaveRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-purple-900">
                <tr>
                  <th className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-l-md">
                    Name
                  </th>
                  <th className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-r-md">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentLeaveRequests.map((request, index) => (
                  <tr key={request._id} className="hover:bg-gray-100">
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                      {request.user.name}
                    </td>
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                      {request.leaveType}
                    </td>
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                      {formatDate(request.startDate)}
                    </td>
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                      {formatDate(request.endDate)}
                    </td>
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : request.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
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
          <div
            className="flex flex-col items-center justify-center"
            style={{ height: "251px" }}
          >
            <FaInbox size={30} className="text-gray-400 mb-2" />
            <span className="text-md font-medium">
              No Recent Leave Applications.
            </span>
          </div>
        )}

        {isPdfModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[80%] h-[80%] relative">
              <button
                onClick={closePdfModal}
                className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
              >
                <FaTimes size={24} />
              </button>
              <iframe
                src={selectedPdfUrl}
                className="w-full h-full rounded-lg"
                title="Handover Document"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(LeaveManagementCard);
