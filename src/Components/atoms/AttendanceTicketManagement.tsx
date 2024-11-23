import React, { useState } from "react";
import { FaInbox } from "react-icons/fa";

interface AttendanceTicket {
  id: number;
  date: string;
  timeIn: string;
  timeOut: string;
  totalTime: string;
  workFromHome: "Half Day" | "Full Day";
  comments: string;
  file: string;
  status: "Pending" | "Approved" | "Rejected";
}

const AttendanceTicketManagement: React.FC = () => {
  const [attendanceTickets, setAttendanceTickets] = useState<AttendanceTicket[]>([
    {
      id: 1,
      date: "2024-11-21",
      timeIn: "09:00 AM",
      timeOut: "05:00 PM",
      totalTime: "8 hours",
      workFromHome: "Full Day",
      comments: "Worked from home due to personal reasons.",
      file: "wfh_document.pdf",
      status: "Pending",
    },
    {
      id: 2,
      date: "2024-11-22",
      timeIn: "10:00 AM",
      timeOut: "06:00 PM",
      totalTime: "8 hours",
      workFromHome: "Half Day",
      comments: "Personal appointment in the morning.",
      file: "appointment_document.pdf",
      status: "Approved",
    },
    {
        id: 3,
        date: "2024-11-21",
        timeIn: "09:00 AM",
        timeOut: "05:00 PM",
        totalTime: "8 hours",
        workFromHome: "Full Day",
        comments: "Worked from home due to personal reasons.",
        file: "wfh_document.pdf",
        status: "Pending",
      },
      {
        id: 4,
        date: "2024-11-22",
        timeIn: "10:00 AM",
        timeOut: "06:00 PM",
        totalTime: "8 hours",
        workFromHome: "Half Day",
        comments: "Personal appointment in the morning.",
        file: "appointment_document.pdf",
        status: "Approved",
      },
      {
        id: 5,
        date: "2024-11-21",
        timeIn: "09:00 AM",
        timeOut: "05:00 PM",
        totalTime: "8 hours",
        workFromHome: "Full Day",
        comments: "Worked from home due to personal reasons.",
        file: "wfh_document.pdf",
        status: "Pending",
      },
      {
        id: 6,
        date: "2024-11-22",
        timeIn: "10:00 AM",
        timeOut: "06:00 PM",
        totalTime: "8 hours",
        workFromHome: "Half Day",
        comments: "Personal appointment in the morning.",
        file: "appointment_document.pdf",
        status: "Approved",
      },
      {
        id: 7,
        date: "2024-11-21",
        timeIn: "09:00 AM",
        timeOut: "05:00 PM",
        totalTime: "8 hours",
        workFromHome: "Full Day",
        comments: "Worked from home due to personal reasons.",
        file: "wfh_document.pdf",
        status: "Pending",
      },
      {
        id: 8,
        date: "2024-11-22",
        timeIn: "10:00 AM",
        timeOut: "06:00 PM",
        totalTime: "8 hours",
        workFromHome: "Half Day",
        comments: "Personal appointment in the morning.",
        file: "appointment_document.pdf",
        status: "Approved",
      },
  ]);

  const [filters, setFilters] = useState({ date: "", status: "All" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const filteredTickets = attendanceTickets.filter(
    (ticket) =>
      (filters.date === "" || ticket.date.includes(filters.date)) &&
      (filters.status === "All" || ticket.status === filters.status)
  );

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAction = (id: number, action: "approve" | "reject") => {
    setAttendanceTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, status: action === "approve" ? "Approved" : "Rejected" }
          : ticket
      )
    );
  };

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 mt-4 text-center">
        Attendance Tickets Management
      </h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
        <thead className="bg-purple-900">
          <tr>
            {[
              "S.No",
              "Date",
              "Time In",
              "Time Out",
              "Total Time",
              "Work From Home",
              "Comments",
              "File",
              "Action",
            ].map((header) => (
              <th key={header} className="px-3 py-2 text-left text-sm font-medium text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentTickets.length > 0 ? (
            currentTickets.map((ticket, index) => (
              <tr key={ticket.id} className="hover:bg-gray-100">
                <td className="px-3 py-2 text-sm text-gray-800">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-3 py-2 text-sm text-gray-800">{ticket.date}</td>
                <td className="px-3 py-2 text-sm text-gray-800">{ticket.timeIn}</td>
                <td className="px-3 py-2 text-sm text-gray-800">{ticket.timeOut}</td>
                <td className="px-3 py-2 text-sm text-gray-800">{ticket.totalTime}</td>
                <td className="px-3 py-2 text-sm text-gray-800">{ticket.workFromHome}</td>
                <td className="px-3 py-2 text-sm text-gray-800">{ticket.comments}</td>
                <td className="px-3 py-2 text-sm text-blue-600 underline cursor-pointer">
                  <a href={`/${ticket.file}`} download>
                    {ticket.file}
                  </a>
                </td>
                <td className="px-3 py-2 text-sm text-center">
                  {ticket.status === "Pending" ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(ticket.id, "approve")}
                        className="px-2 py-1 text-white bg-green-600 rounded-full hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(ticket.id, "reject")}
                        className="px-2 py-1 text-white bg-red-600 rounded-full hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-sm ${
                        ticket.status === "Rejected"
                          ? "text-red-600"
                          : ticket.status === "Approved"
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
                <td
                  colSpan={9}
                   className="text-center py-8 text-gray-500"
                >
                <div className="flex flex-col items-center justify-center">
                  <FaInbox size={40} className="text-gray-400 mb-2" />
                  <span className="text-md font-medium"> No Attendance Tickets Found.</span>
                </div>
               </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Show:</span>
            <select
              className="text-sm border border-gray-300 rounded-md"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1); // Reset to the first page when items per page changes
              }}
            >
              {[5, 10, 20].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
              disabled={currentPage === 1}
              onClick={handlePrevious}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={currentPage === totalPages}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
    </div>
  );
};

export default AttendanceTicketManagement;