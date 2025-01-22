// src/components/atoms/FormsManagement.tsx

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaInbox, FaSpinner, FaEye } from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import useUser from "../../hooks/useUser";
import { ToastContainer, toast } from "react-toastify"; // Importing Toastify
import "react-toastify/dist/ReactToastify.css"; // Importing Toastify CSS
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";

interface UserInfo {
  name: string;
  personalDetails: {
    abbreviatedJobTitle: string;
  };
}

interface Form {
  _id: string;
  user: UserInfo;
  subject: string;
  message: string;
  formType: "feedback" | "suggestion";
  status: "read" | "unread";
  createdAt: string;
}

const FormsManagement: React.FC = () => {
  const { user, loading: userLoading } = useUser();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"Feedback" | "Suggestion">(
    "Feedback"
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch forms without searchTerm
  useEffect(() => {
    const fetchForms = async () => {
      if (!user) {
        setError("User not authenticated.");
        setForms([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Form[]>(`${backendUrl}/api/forms`, {
          params: {
            formType: activeTab.toLowerCase(),
            page: 1, // Fetch all forms for frontend handling
            limit: 1000, // Adjust based on expected maximum number of forms
          },
          withCredentials: true,
        });

        setForms(response.data);
        setTotalPages(1); // Reset pagination as it's handled on the frontend
      } catch (err: any) {
        console.error("Error fetching forms:", err);
        setError(err.response?.data?.message || "Failed to fetch forms.");
        setForms([]);
        toast.error(err.response?.data?.message || "Failed to fetch forms.");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [backendUrl, activeTab, user]);

  // Filter forms based on search term and active tab
  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const name = form.user?.name.toLowerCase() || "anonymous";
      const subject = form.subject.toLowerCase();
      return (
        form.formType.toLowerCase() === activeTab.toLowerCase() &&
        (name.includes(lowerCaseSearchTerm) ||
          subject.includes(lowerCaseSearchTerm))
      );
    });
  }, [forms, activeTab, searchTerm]);

  // Paginate the filtered forms
  const paginatedForms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredForms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredForms, currentPage, itemsPerPage]);

  // Update totalPages based on filtered forms
  useEffect(() => {
    const newTotalPages = Math.ceil(filteredForms.length / itemsPerPage) || 1;
    setTotalPages(newTotalPages);
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [filteredForms, itemsPerPage, currentPage]);

  const openModal = (form: Form) => {
    setSelectedForm(form);
    setIsModalOpen(true);

    if (form.status === "unread") {
      updateFormStatusToRead(form._id);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
  };

  const updateFormStatusToRead = async (formId: string) => {
    try {
      await axios.put(
        `${backendUrl}/api/forms/${formId}/status`,
        {},
        { withCredentials: true }
      );

      setForms((prevForms) =>
        prevForms.map((form) =>
          form._id === formId ? { ...form, status: "read" } : form
        )
      );
    } catch (err) {
      console.error("Error updating form status:", err);
      toast.error("Failed to update form status.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <FaSpinner className="text-indigo-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-gray-50 rounded-lg mb-8">
      <ToastContainer position="top-center" />
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
        Forms Management
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by subject or name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on new search
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Search Forms"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-6 focus:outline-none ${
            activeTab === "Feedback"
              ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
              : "text-gray-600 hover:text-indigo-600"
          }`}
          onClick={() => {
            setActiveTab("Feedback");
            setCurrentPage(1);
            setSearchTerm("");
          }}
        >
          Feedback Forms
        </button>
        <button
          className={`py-2 px-6 focus:outline-none ${
            activeTab === "Suggestion"
              ? "border-b-2 border-indigo-600 text-indigo-600 font-semibold"
              : "text-gray-600 hover:text-indigo-600"
          }`}
          onClick={() => {
            setActiveTab("Suggestion");
            setCurrentPage(1);
            setSearchTerm("");
          }}
        >
          Suggestion Forms
        </button>
      </div>

      {/* No Forms Message */}
      {!error && filteredForms.length === 0 && (
        <div className="text-center py-10">
          <div className="flex flex-col items-center justify-center">
            <FaInbox size={30} className="text-gray-400 mb-2" />
            <span className="text-md font-medium">
              No {activeTab} Forms Available
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            There are no {activeTab.toLowerCase()} forms submitted yet.
          </p>
        </div>
      )}

      {/* Forms Table */}
      {filteredForms.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-purple-900 text-white">
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedForms.map((form, index) => (
                  <tr
                    key={form._id}
                    className={`border-b ${
                      form.status === "unread" ? "bg-indigo-50" : "bg-white"
                    } hover:bg-indigo-100 transition-colors`}
                  >
                    <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap text-center">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap text-center">
                      {form.user?.name || "Anonymous"}
                    </td>
                    <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap text-center">
                      {form.user?.personalDetails?.abbreviatedJobTitle || "N/A"}
                    </td>
                    <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap text-center">
                      {form.subject}
                    </td>
                    <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap text-center">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          form.status === "read"
                            ? "bg-green-200 text-green-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {form.status.charAt(0).toUpperCase() +
                          form.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                          onClick={() => openModal(form)}
                          aria-label={`View form from ${
                            form.user?.name || "Anonymous"
                          }`}
                        >
                          <FaEye className="mr-2" />
                          View
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

      {/* Form Details Modal */}
      {selectedForm && isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-screen overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200"
              aria-label="Close Form Details Modal"
            >
              <IoCloseCircle size={20} />
            </button>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {selectedForm.subject}
            </h3>
            <div className="mb-4">
              <strong>Name:</strong>{" "}
              <span className="text-gray-700 dark:text-gray-300">
                {selectedForm.user?.name || "Anonymous"}
              </span>
            </div>
            <div className="mb-4">
              <strong>Job Title:</strong>{" "}
              <span className="text-gray-700 dark:text-gray-300">
                {selectedForm.user?.personalDetails?.abbreviatedJobTitle ||
                  "N/A"}
              </span>
            </div>
            <div className="mb-4">
              <strong>Date Submitted:</strong>{" "}
              <span className="text-gray-700 dark:text-gray-300">
                {formatDate(selectedForm.createdAt)}
              </span>
            </div>
            <div className="mb-4">
              <strong>Status:</strong>{" "}
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  selectedForm.status === "read"
                    ? "bg-green-200 text-green-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {selectedForm.status.charAt(0).toUpperCase() +
                  selectedForm.status.slice(1)}
              </span>
            </div>
            <div className="mb-4">
              <strong>Message:</strong>
              <div
                className="mt-2 p-4 border rounded-md bg-gray-50 dark:bg-gray-700 overflow-auto"
                dangerouslySetInnerHTML={{ __html: selectedForm.message }}
              ></div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsManagement;
