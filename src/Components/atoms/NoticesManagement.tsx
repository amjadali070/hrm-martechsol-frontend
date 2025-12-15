import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosCloseCircle } from "react-icons/io";
import { formatDate } from "../../utils/formatDate";
import {
  FaEdit,
  FaInbox,
  FaSpinner,
  FaTrash,
  FaBullhorn,
  FaPlus,
  FaFilter,
  FaCheckDouble,
  FaEnvelopeOpenText,
  FaEnvelope,
} from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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

  const renderStatusBadge = (status: "Read" | "Unread") => {
    const isRead = status === "Read";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${
          isRead
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-blue-50 text-blue-700 border-blue-100"
        }`}
      >
        {isRead ? <FaEnvelopeOpenText size={10} /> : <FaEnvelope size={10} />}
        {status}
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FaSpinner className="text-gunmetal-600 animate-spin mb-4" size={32} />
        <p className="text-slate-grey-500 font-medium">Loading notices...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
        <p className="font-medium">{error}</p>
      </div>
    );

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 mb-8 overflow-hidden">
      {/* Header */}
      <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
            <FaBullhorn className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Notices
            </h2>
            <p className="text-sm text-slate-grey-500">
              Company-wide announcements and updates.
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal("create")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gunmetal-900 text-white text-sm font-bold rounded-lg hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20"
        >
          <FaPlus size={12} /> Create Notice
        </button>
      </div>

      <div className="p-8">
        {/* Filter */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400" />
              <select
                id="statusFilter"
                value={filteredStatus}
                onChange={(e) => {
                  setFilteredStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-8 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 appearance-none cursor-pointer hover:border-gunmetal-300 transition-colors"
              >
                <option value="All">All Statuses</option>
                <option value="Read">Read</option>
                <option value="Unread">Unread</option>
              </select>
            </div>
          </div>
        </div>

        {filteredNotices.length === 0 ? (
          <div className="text-center py-20 bg-alabaster-grey-50/50 rounded-xl border border-dashed border-platinum-200">
            <FaInbox size={40} className="mx-auto text-platinum-300 mb-4" />
            <h3 className="text-lg font-bold text-gunmetal-900">
              No notices found
            </h3>
            <p className="text-slate-grey-500 text-sm mt-1">
              Try changing the filters or create a new notice.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
              <table className="w-full text-left bg-white border-collapse">
                <thead className="bg-alabaster-grey-50">
                  <tr>
                    <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 w-16 text-center">
                      No.
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                      Date
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 w-1/3">
                      Subject
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">
                      Status
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-platinum-100">
                  {paginatedNotices.map((notice, index) => (
                    <tr
                      key={notice._id}
                      className="hover:bg-alabaster-grey-50/50 transition-colors group"
                    >
                      <td className="py-4 px-6 text-sm text-slate-grey-500 text-center font-mono">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gunmetal-900">
                        {formatDate(notice.date)}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-grey-700 font-medium">
                        {truncateComment(notice.subject)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {renderStatusBadge(notice.status)}
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                notice._id!,
                                notice.status === "Read" ? "Unread" : "Read"
                              )
                            }
                            className="text-slate-grey-400 hover:text-gunmetal-600 transition-colors p-1"
                            title={
                              notice.status === "Read"
                                ? "Mark as Unread"
                                : "Mark as Read"
                            }
                          >
                            {notice.status === "Read" ? (
                              <IoIosCloseCircle size={18} />
                            ) : (
                              <FaCheckDouble size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-end">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openModal("edit", notice)}
                            className="p-2 text-gunmetal-600 hover:bg-gunmetal-50 rounded-lg transition-all"
                            title="Edit Notice"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteNotice(notice._id!)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Notice"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-slate-grey-600 bg-alabaster-grey-50 px-3 py-1.5 rounded-lg border border-platinum-200">
                <span className="font-medium">Rows:</span>
                <select
                  className="bg-transparent border-none focus:outline-none font-semibold text-gunmetal-800 cursor-pointer"
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

              <div className="flex items-center gap-2">
                <button
                  className={`p-2 rounded-lg border border-platinum-200 transition-all ${
                    currentPage === 1
                      ? "bg-alabaster-grey-50 text-slate-grey-300 cursor-not-allowed"
                      : "bg-white text-gunmetal-600 hover:bg-platinum-50 hover:text-gunmetal-900 shadow-sm"
                  }`}
                  disabled={currentPage === 1}
                  onClick={handlePrevious}
                >
                  <FiChevronLeft size={16} />
                </button>

                <span className="text-xs font-semibold text-gunmetal-600 uppercase tracking-wide px-3">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className={`p-2 rounded-lg border border-platinum-200 transition-all ${
                    currentPage === totalPages || totalPages === 0
                      ? "bg-alabaster-grey-50 text-slate-grey-300 cursor-not-allowed"
                      : "bg-white text-gunmetal-600 hover:bg-platinum-50 hover:text-gunmetal-900 shadow-sm"
                  }`}
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={handleNext}
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedNotice && (
        <div className="fixed inset-0 bg-gunmetal-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-alabaster-grey-50 px-6 py-4 border-b border-platinum-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gunmetal-900">
                {modalMode === "create" ? "Create New Notice" : "Edit Notice"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors"
              >
                <IoIosCloseCircle size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <form onSubmit={handleNoticeSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gunmetal-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={selectedNotice.subject}
                      onChange={(e) =>
                        setSelectedNotice((prev) =>
                          prev ? { ...prev, subject: e.target.value } : null
                        )
                      }
                      className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                      placeholder="Enter notice subject"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gunmetal-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedNotice.date}
                      onChange={(e) =>
                        setSelectedNotice((prev) =>
                          prev ? { ...prev, date: e.target.value } : null
                        )
                      }
                      className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gunmetal-700">
                    Message Content
                  </label>
                  <div className="bg-white border border-platinum-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gunmetal-500/20 focus-within:border-gunmetal-500 transition-all">
                    <ReactQuill
                      theme="snow"
                      value={selectedNotice.paragraph}
                      onChange={(content: string) =>
                        setSelectedNotice((prev) =>
                          prev ? { ...prev, paragraph: content } : null
                        )
                      }
                      className="h-64 mb-10 border-none"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link"],
                          ["clean"],
                        ],
                      }}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-platinum-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-white border border-platinum-200 text-gunmetal-700 font-bold text-sm rounded-lg hover:bg-alabaster-grey-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gunmetal-900 text-white font-bold text-sm rounded-lg hover:bg-gunmetal-800 transition-colors shadow-lg shadow-gunmetal-500/20"
                  >
                    {modalMode === "create" ? "Publish Notice" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesManagement;
