import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { formatDate } from "../../utils/formatDate";
import { FaSpinner, FaInbox } from "react-icons/fa";
import { truncateComment } from "../../utils/truncateComment";

interface AttendanceRecord {
  _id: string;
  date: string;
  comments: string;
  status: "Open" | "Closed" | "Rejected";
}

const AttendanceTicketOverview: React.FC = () => {
  const [attendanceTickets, setAttendanceTickets] = useState<
    AttendanceRecord[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { user } = useUser();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const userId = user?._id;

  useEffect(() => {
    const fetchRecentAttendanceTickets = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        // Fetch only the top 3 most recent attendance tickets
        const response = await axios.get<AttendanceRecord[]>(
          `${backendUrl}/api/attendance-tickets/user/${userId}?limit=3`,
          {
            withCredentials: true,
          }
        );

        // Set state with only top 3 records
        const tickets = response.data.slice(0, 3);
        setAttendanceTickets(tickets);
      } catch (error) {
        console.error("Error fetching recent attendance tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAttendanceTickets();
  }, [backendUrl, userId]);

  const handleViewAll = () => {
    navigate("/tickets/attendance");
  };

  return (
    <section className="flex flex-col w-full md:w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col p-6 mx-auto w-full bg-white rounded-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl sm:text-2xl font-bold text-black">
            Attendance Ticket Status
          </h2>
          <button
            onClick={handleViewAll}
            className="mt-4 sm:mt-0 px-6 py-2 text-sm sm:text-base text-center text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors duration-300"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto" style={{ height: "180px" }}>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <FaSpinner className="text-blue-500 animate-spin" size={30} />
            </div>
          ) : attendanceTickets.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-purple-900">
                <tr>
                  <th
                    scope="col"
                    className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-l-md"
                  >
                    S.No
                  </th>
                  <th
                    scope="col"
                    className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-2 md:px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Comments
                  </th>
                  <th
                    scope="col"
                    className="px-2 md:px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-r-md"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceTickets.map((ticket, index) => (
                  <tr key={ticket._id} className="hover:bg-gray-100">
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                      {index + 1}
                    </td>
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-center">
                      {formatDate(ticket.date)}
                    </td>
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-left">
                      {truncateComment(ticket.comments)}
                    </td>
                    <td className="px-2 md:px-4 py-2 whitespace-nowrap text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.status === "Closed"
                            ? "bg-red-100 text-red-800"
                            : ticket.status === "Open"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              className="flex flex-col items-center justify-center"
              style={{ height: "180px" }}
            >
              <FaInbox size={30} className="text-gray-400 mb-2" />
              <span className="text-md font-medium">
                No recent attendance tickets found.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AttendanceTicketOverview;
