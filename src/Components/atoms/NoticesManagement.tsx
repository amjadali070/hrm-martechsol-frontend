import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IoIosCloseCircle,
  IoIosAdd,
  IoIosCheckmarkCircle,
} from "react-icons/io";
import { formatDate } from "../../utils/formatDate";
import { FaEdit, FaInbox, FaSpinner, FaTrash } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MAX_WORDS = 5;
export const truncateComment = (comment: string) => {
  if (!comment) return "No Comments";
  const words = comment.trim().split(" ");
  if (words.length > MAX_WORDS) {
    return words.slice(0, MAX_WORDS).join(" ") + "......";
  }
  return comment;
};

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

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
        <div className="flex justify-between items-center mb-4">
          <Link
            to="/notices/create"
            className="flex items-center bg-green-600 text-white px-3 py-2 rounded-full hover:bg-green-700"
          >
            <IoIosAdd size={20} className="mr-1" /> Create Notice
          </Link>
        </div>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-20">
          <div className="flex flex-col items-center justify-center">
            <FaInbox size={40} className="text-gray-400 mb-4" />
            <span className="text-lg font-medium">No notices available</span>
          </div>

          <p className="text-gray-500 text-sm mt-2">
            Click "Create Notice" to add your first notice
          </p>
        </div>
      ) : (
        <>
          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className="flex items-center">
              <label htmlFor="statusFilter" className="mr-2 text-gray-700">
                Filter by Status:
              </label>
              <select
                id="statusFilter"
                value={filteredStatus}
                onChange={(e) => {
                  setFilteredStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Filter by Status"
              >
                <option value="All">All</option>
                <option value="Read">Read</option>
                <option value="Unread">Unread</option>
              </select>
            </div>
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
              {/* Notices Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <colgroup>
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-purple-900 text-white">
                      <th className="py-3 px-6 text-center text-sm font-semibold uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="py-3 px-6 text-center text-sm font-semibold uppercase tracking-wider">
                        Date
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="py-3 px-6 text-center text-sm font-semibold uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-3 px-6 text-center text-sm font-semibold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedNotices.map((notice, index) => (
                      <tr
                        key={notice._id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100 transition-colors`}
                      >
                        <td className="text-sm text-gray-700 px-6 py-4 border-b border-gray-200 whitespace-nowrap text-center">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </td>
                        <td className="text-sm text-gray-700 px-6 py-4 border-b border-gray-200 whitespace-nowrap text-center">
                          {formatDate(notice.date)}
                        </td>
                        <td className="text-sm text-gray-700 px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                          {truncateComment(notice.subject)}
                        </td>
                        <td className="text-sm text-gray-700 px-6 py-4 border-b border-gray-200 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <span
                              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                notice.status === "Read"
                                  ? "bg-green-500 text-white"
                                  : "bg-blue-500 text-white"
                              }`}
                            >
                              {notice.status}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  notice._id!,
                                  notice.status === "Read" ? "Unread" : "Read"
                                )
                              }
                              className="text-indigo-600 hover:text-indigo-800"
                              title="Toggle Status"
                            >
                              {notice.status === "Read" ? (
                                <IoIosCloseCircle size={20} />
                              ) : (
                                <IoIosCheckmarkCircle size={20} />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="text-sm text-gray-700 px-6 py-4 border-b border-gray-200 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={() => openModal("edit", notice)}
                              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                              aria-label={`Edit notice titled ${notice.subject}`}
                            >
                              <FaEdit className="mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNotice(notice._id!)}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                              aria-label={`Delete notice titled ${notice.subject}`}
                            >
                              <FaTrash className="mr-2" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination and Items Per Page */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-3">Show:</span>
                  <select
                    className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <div className="flex items-center space-x-3">
                  <button
                    className={`flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={currentPage === 1}
                    onClick={handlePrevious}
                  >
                    <FiChevronLeft className="mr-2" />
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className={`flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
                      currentPage === totalPages || totalPages === 0
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={handleNext}
                  >
                    Next
                    <FiChevronRight className="ml-2" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Modal with ReactQuill */}
          {isModalOpen && selectedNotice && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              aria-modal="true"
              role="dialog"
            >
              <div className="bg-white p-8 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-screen overflow-y-auto relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                  aria-label="Close Modal"
                >
                  <IoIosCloseCircle size={30} />
                </button>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">
                  {modalMode === "create" ? "Create New Notice" : "Edit Notice"}
                </h3>
                <form onSubmit={handleNoticeSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="subject"
                      className="block mb-2 text-gray-700"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={selectedNotice.subject}
                      onChange={(e) =>
                        setSelectedNotice((prev) =>
                          prev ? { ...prev, subject: e.target.value } : null
                        )
                      }
                      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="date" className="block mb-2 text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={selectedNotice.date}
                      onChange={(e) =>
                        setSelectedNotice((prev) =>
                          prev ? { ...prev, date: e.target.value } : null
                        )
                      }
                      className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="paragraph"
                      className="block mb-2 text-gray-700"
                    >
                      Message
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={selectedNotice.paragraph}
                      onChange={(content: string) =>
                        setSelectedNotice((prev) =>
                          prev ? { ...prev, paragraph: content } : null
                        )
                      }
                      className="h-40 rounded-md"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link", "image"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "list",
                        "bullet",
                        "link",
                        "image",
                      ]}
                    />
                  </div>
                  <div className="flex justify-end space-x-4 mt-14">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                      {modalMode === "create" ? "Create" : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoticesManagement;
