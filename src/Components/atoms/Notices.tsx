// frontend/src/components/Notices.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosCloseCircle } from "react-icons/io";
import { formatDate } from "../../utils/formatDate";
import { FaInbox } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

interface Notice {
  _id: string;
  date: string;
  subject: string;
  status: "Read" | "Unread";
  paragraph: string;
}

const Notices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filteredStatus, setFilteredStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/notices`, {
          withCredentials: true,
        });
        setNotices(response.data.notices);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch notices");
        setLoading(false);
      }
    };

    fetchNotices();
  }, [backendUrl]);

  const openNotice = async (notice: Notice) => {
    try {
      const config = {
        withCredentials: true,
      };
      if (notice.status === "Unread") {
        await axios.patch(
          `${backendUrl}/api/notices/${notice._id}/status`,
          { status: "Read" },
          config
        );
        setNotices((prev) =>
          prev.map((n) => (n._id === notice._id ? { ...n, status: "Read" } : n))
        );
      }

      setSelectedNotice(notice);
    } catch (err) {
      console.error("Failed to update notice status", err);
    }
  };

  const toggleStatus = async (
    noticeId: string,
    currentStatus: "Read" | "Unread"
  ) => {
    const newStatus = currentStatus === "Read" ? "Unread" : "Read";

    try {
      await axios.patch(
        `${backendUrl}/api/notices/${noticeId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setNotices((prev) =>
        prev.map((notice) =>
          notice._id === noticeId ? { ...notice, status: newStatus } : notice
        )
      );
    } catch (err) {
      setError("Failed to update notice status");
      console.error(err);
    }
  };

  const filteredNotices =
    filteredStatus === "All"
      ? notices
      : notices.filter(
          (notice) =>
            notice.status.toLowerCase() === filteredStatus.toLowerCase()
        );

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const closeModal = () => {
    setSelectedNotice(null);
  };

  if (loading) {
    return (
      <div className="w-full p-6 text-center">
        <div className="p-20 flex flex-col items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg mb-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mt-2 mb-3 text-black">
        Notices
      </h2>

      {notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20">
          <FaInbox size={30} className="text-gray-400 mb-2" />
          <span className="text-md font-medium">No Notice Found.</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 mt-1">
            <div className="flex items-center space-x-2">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Filter by Status:
              </label>
              <select
                id="status"
                value={filteredStatus}
                onChange={(e) => {
                  setFilteredStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="p-1 border border-gray-300 rounded-md"
              >
                <option value="All">All</option>
                <option value="Read">Read</option>
                <option value="Unread">Unread</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md mb-6">
              <colgroup>
                <col style={{ width: "5%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "15%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    S.No
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    Date
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    Subject
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    Status
                  </th>
                  <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedNotices.map((notice, index) => (
                  <tr key={notice._id}>
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                      {formatDate(notice.date)}
                    </td>
                    <td
                      className="text-sm px-4 py-2 border border-gray-300 whitespace-nowrap text-center text-blue-600 cursor-pointer hover:underline"
                      onClick={() => openNotice(notice)}
                    >
                      {notice.subject}
                    </td>
                    <td
                      className={`text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center ${
                        notice.status === "Read"
                          ? "text-green-600"
                          : "text-blue-600 font-semibold"
                      }`}
                    >
                      {notice.status}
                    </td>
                    <td className="text-center px-4 py-2 border border-gray-300 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(notice._id, notice.status)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          notice.status === "Unread"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-yellow-500 text-white hover:bg-yellow-600"
                        }`}
                      >
                        {notice.status === "Unread"
                          ? "Mark as Read"
                          : "Mark as Unread"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Show:</span>
              <select
                className="text-sm border border-gray-300 rounded-md p-0.5"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
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
        </>
      )}

      {/* Modal for Viewing Notice Details */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-blue-600 hover:text-blue-500"
            >
              <IoIosCloseCircle size={28} />
            </button>
            <p className="text-xl font-bold text-purple-900 mb-4">
              {selectedNotice.subject}
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Date:</strong> {formatDate(selectedNotice.date)}
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Message:</strong> {selectedNotice.paragraph}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;
