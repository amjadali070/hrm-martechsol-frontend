// src/components/atoms/FormsManagement.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaInbox, FaSpinner } from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import useUser from "../../hooks/useUser";

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
  const [totalForms, setTotalForms] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // State for items per page

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

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
            page: currentPage,
            limit: itemsPerPage, // Use itemsPerPage for pagination
            search: searchTerm,
          },
          withCredentials: true,
        });

        console.log("Active Tab:", activeTab);
        console.log("Forms data:", response.data);

        setForms(response.data);
        setTotalForms(response.data.length); // Update this based on actual total from API if available
        setTotalPages(Math.ceil(totalForms / itemsPerPage)); // Calculate total pages
      } catch (err) {
        console.error("Error fetching forms:", err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || "Failed to fetch forms.");
        } else {
          setError("Failed to fetch forms. Please try again later.");
        }
        setForms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [
    backendUrl,
    activeTab,
    user,
    currentPage,
    searchTerm,
    itemsPerPage,
    totalForms,
  ]);

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

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <FaSpinner className="text-blue-500 animate-spin" size={30} />
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Forms Managment</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by subject or name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 focus:outline-none ${
            activeTab === "Feedback"
              ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
              : "text-gray-600 hover:text-purple-600"
          }`}
          onClick={() => {
            setActiveTab("Feedback");
            setCurrentPage(1);
          }}
        >
          Feedback Forms
        </button>
        <button
          className={`py-2 px-4 focus:outline-none ${
            activeTab === "Suggestion"
              ? "border-b-2 border-purple-600 text-purple-600 font-semibold"
              : "text-gray-600 hover:text-purple-600"
          }`}
          onClick={() => {
            setActiveTab("Suggestion");
            setCurrentPage(1);
          }}
        >
          Suggestion Forms
        </button>
      </div>

      {error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : forms.filter(
          (form) => form.formType.toLowerCase() === activeTab.toLowerCase()
        ).length === 0 ? (
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
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  S.No
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  Name
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  Job Title
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  Subject
                </th>
                {/* <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  Message
                </th> */}
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  Status
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {forms
                .filter(
                  (form) =>
                    form.formType.toLowerCase() === activeTab.toLowerCase()
                )
                .map((form, index) => (
                  <tr
                    key={form._id}
                    className={`border-b ${
                      form.status === "unread" ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                      {index + 1}
                    </td>
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                      {form.user?.name || "Anonymous"}
                    </td>
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                      {form.user?.personalDetails?.abbreviatedJobTitle || "N/A"}
                    </td>
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                      {form.subject}
                    </td>
                    {/* <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-normal">
                      <div
                        dangerouslySetInnerHTML={{ __html: form.message }}
                      ></div>
                    </td> */}
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                      {form.status.charAt(0).toUpperCase() +
                        form.status.slice(1)}
                    </td>
                    <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => openModal(form)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Items per page and pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Show:</span>
          <select
            className="text-sm border border-gray-300 rounded-md"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
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

      {selectedForm && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-lg relative">
            {/* ... */}
            <div className="mb-4">
              <strong>Name:</strong> {selectedForm.user?.name || "Anonymous"}
            </div>
            <div className="mb-4">
              <strong>Job Title:</strong>{" "}
              {selectedForm.user?.personalDetails?.abbreviatedJobTitle || "N/A"}
            </div>
            <div className="mb-4">
              <strong>Subject:</strong> {selectedForm.subject}
            </div>
            <div className="mb-4">
              <strong>Message:</strong>
              <div
                className="mt-2 p-2 border rounded bg-gray-50 overflow-auto max-h-60"
                dangerouslySetInnerHTML={{ __html: selectedForm.message }}
              ></div>
            </div>
            <div className="mb-4">
              <strong>Date Submitted:</strong>{" "}
              {formatDate(selectedForm.createdAt)}
            </div>
            <div className="mb-4">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  selectedForm.status === "read"
                    ? "bg-green-200 text-green-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {selectedForm.status.charAt(0).toUpperCase() +
                  selectedForm.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                onClick={closeModal}
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
