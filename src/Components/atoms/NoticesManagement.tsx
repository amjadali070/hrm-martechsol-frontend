import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IoIosCloseCircle,
  IoIosAdd,
  IoIosCheckmarkCircle,
} from "react-icons/io";
import { formatDate } from "../../utils/formatDate";
import { FaInbox, FaSpinner } from "react-icons/fa";

interface Notice {
  _id?: string;
  date: string;
  subject: string;
  status: "Read" | "Unread";
  paragraph: string;
}

const NoticesManagement: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filteredStatus, setFilteredStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/notices`, {
          withCredentials: true,
        });
        // Check if notices is null or undefined, default to empty array
        setNotices(response.data.notices || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch notices");
        setLoading(false);
      }
    };

    fetchNotices();
  }, [backendUrl]);

  const openModal = (mode: "create" | "edit", notice?: Notice) => {
    setModalMode(mode);
    setSelectedNotice(
      mode === "create"
        ? {
            date: new Date().toISOString().split("T")[0],
            subject: "",
            status: "Unread",
            paragraph: "",
          }
        : notice || null
    );
    setIsModalOpen(true);
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNotice) return;

    try {
      const config = { withCredentials: true };

      if (modalMode === "create") {
        const response = await axios.post(
          `${backendUrl}/api/notices`,
          {
            subject: selectedNotice.subject,
            paragraph: selectedNotice.paragraph,
            date: selectedNotice.date,
          },
          config
        );
        setNotices((prev) => [...prev, { ...response.data, status: "Unread" }]);
      } else if (modalMode === "edit" && selectedNotice._id) {
        const response = await axios.put(
          `${backendUrl}/api/notices/${selectedNotice._id}`,
          {
            subject: selectedNotice.subject,
            paragraph: selectedNotice.paragraph,
            date: selectedNotice.date,
          },
          config
        );
        setNotices((prev) =>
          prev.map((notice) =>
            notice._id === selectedNotice._id
              ? { ...response.data, status: notice.status }
              : notice
          )
        );
      }

      setIsModalOpen(false);
      setSelectedNotice(null);
    } catch (err) {
      setError("Failed to save notice");
      console.error(err);
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    try {
      await axios.delete(`${backendUrl}/api/notices/${noticeId}`, {
        withCredentials: true,
      });
      setNotices((prev) => prev.filter((notice) => notice._id !== noticeId));
    } catch (err) {
      setError("Failed to delete notice");
      console.error(err);
    }
  };

  const handleUpdateStatus = async (
    noticeId: string,
    status: "Read" | "Unread"
  ) => {
    try {
      await axios.patch(
        `${backendUrl}/api/notices/${noticeId}/status`,
        { status },
        { withCredentials: true }
      );
      setNotices((prev) =>
        prev.map((notice) =>
          notice._id === noticeId ? { ...notice, status } : notice
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

  if (loading)
    return (
      <div className="w-full p-6 text-center">
        <div className="p-20 flex flex-col items-center justify-center">
          <FaSpinner className="text-blue-500 mb-4 animate-spin" size={30} />
        </div>
      </div>
    );

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notices Management</h2>
        <button
          onClick={() => openModal("create")}
          className="flex items-center bg-green-600 text-white px-3 py-2 rounded-full hover:bg-green-700"
        >
          <IoIosAdd size={20} className="mr-1" /> Create Notice
        </button>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-10">
          <div className="flex flex-col items-center justify-center">
            <FaInbox size={30} className="text-gray-400 mb-2" />
            <span className="text-md font-medium">No notices available</span>
          </div>

          <p className="text-gray-500 text-sm mt-2">
            Click "Create Notice" to add your first notice
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="mr-2">Filter by Status:</label>
            <select
              value={filteredStatus}
              onChange={(e) => {
                setFilteredStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded p-1"
            >
              <option value="All">All</option>
              <option value="Read">Read</option>
              <option value="Unread">Unread</option>
            </select>
          </div>

          {filteredNotices.length === 0 ? (
            <div className="text-center py-10 bg-gray-100 rounded-md">
              <p className="text-gray-600 text-lg">No notices found</p>
              <p className="text-gray-500 text-sm mt-2">
                Try changing the filter or create a new notice
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md mb-6">
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
                      <tr key={notice._id} className="border-b">
                        <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </td>
                        <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                          {formatDate(notice.date)}
                        </td>
                        <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                          {notice.subject}
                        </td>
                        <td
                          className={`text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center ${
                            notice.status === "Read"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            {notice.status}
                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  notice._id!,
                                  notice.status === "Read" ? "Unread" : "Read"
                                )
                              }
                              className="ml-2 hover:opacity-75"
                              title="Toggle Status"
                            >
                              {notice.status === "Read" ? (
                                <IoIosCheckmarkCircle className="text-green-600" />
                              ) : (
                                <IoIosCloseCircle className="text-blue-600" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => openModal("edit", notice)}
                              className="px-1.5 py-0.5 text-xs text-white bg-blue-600 rounded-full hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(notice._id!)}
                              className="px-1.5 py-0.5 text-xs text-white bg-red-600 rounded-full hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
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
                    className="text-sm border border-gray-300 rounded-md"
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
        </>
      )}

      {/* Modal remains the same */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalMode === "create" ? "Create New Notice" : "Edit Notice"}
            </h2>
            <form onSubmit={handleNoticeSubmit}>
              <div className="mb-4">
                <label className="block mb-2">Subject</label>
                <input
                  type="text"
                  value={selectedNotice?.subject || ""}
                  onChange={(e) =>
                    setSelectedNotice((prev) =>
                      prev ? { ...prev, subject: e.target.value } : null
                    )
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Date</label>
                <input
                  type="date"
                  value={selectedNotice?.date || ""}
                  onChange={(e) =>
                    setSelectedNotice((prev) =>
                      prev ? { ...prev, date: e.target.value } : null
                    )
                  }
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Message</label>
                <textarea
                  value={selectedNotice?.paragraph || ""}
                  onChange={(e) =>
                    setSelectedNotice((prev) =>
                      prev ? { ...prev, paragraph: e.target.value } : null
                    )
                  }
                  className="w-full border p-2 rounded"
                  rows={4}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full"
                >
                  {modalMode === "create" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesManagement;
