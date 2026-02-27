// src/components/atoms/FormsManagement.tsx

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  FaInbox, 
  FaEye, 
  FaSearch, 
  FaRegFileAlt, 
  FaUser, 
  FaBriefcase, 
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes
} from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
import useUser from "../../hooks/useUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import LoadingSpinner from "../atoms/LoadingSpinner";

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

  const [activeTab, setActiveTab] = useState<"Feedback" | "Suggestion">("Feedback");
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
            limit: 1000, 
          },
          withCredentials: true,
        });

        setForms(response.data);
        setTotalPages(1); 
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
        (name.includes(lowerCaseSearchTerm) || subject.includes(lowerCaseSearchTerm))
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
      <LoadingSpinner className="h-96" size="xl" text="Loading forms..." />
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      <ToastContainer position="top-center" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
             <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
               <FaRegFileAlt className="text-gunmetal-600 text-xl" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                    Forms Management
                </h2>
                <p className="text-sm text-slate-grey-500">
                    Review and manage feedback and suggestions.
                </p>
             </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-platinum-200 mb-6">
        <button
          className={`py-3 px-6 text-sm font-bold focus:outline-none transition-all relative ${
            activeTab === "Feedback"
              ? "text-gunmetal-900"
              : "text-slate-grey-500 hover:text-gunmetal-700"
          }`}
          onClick={() => {
            setActiveTab("Feedback");
            setCurrentPage(1);
            setSearchTerm("");
          }}
        >
          Feedback Forms
           {activeTab === "Feedback" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gunmetal-900 rounded-t-full"></span>
            )}
        </button>
        <button
          className={`py-3 px-6 text-sm font-bold focus:outline-none transition-all relative ${
            activeTab === "Suggestion"
              ? "text-gunmetal-900"
              : "text-slate-grey-500 hover:text-gunmetal-700"
          }`}
          onClick={() => {
            setActiveTab("Suggestion");
            setCurrentPage(1);
            setSearchTerm("");
          }}
        >
          Suggestion Forms
           {activeTab === "Suggestion" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gunmetal-900 rounded-t-full"></span>
            )}
        </button>
      </div>

       {/* Search Bar */}
      <div className="flex justify-between items-center mb-6">
         <div className="relative group w-full md:w-96">
           <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
           <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400 shadow-sm"
          />
        </div>
      </div>

      {/* No Forms Message */}
      {!error && filteredForms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-platinum-200 rounded-xl bg-alabaster-grey-50/50">
             <FaInbox size={48} className="text-slate-grey-300 mb-3" />
            <h3 className="text-lg font-bold text-gunmetal-800">No forms found</h3>
            <p className="text-slate-grey-500 text-sm mt-1">
                 There are no {activeTab.toLowerCase()} forms matching your criteria.
            </p>
        </div>
      )}

      {/* Forms Table */}
      {filteredForms.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
            <table className="w-full text-left bg-white border-collapse">
              <thead className="bg-alabaster-grey-50">
                <tr>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 w-16 text-center">No.</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Name</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Job Title</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Subject</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-platinum-100">
                {paginatedForms.map((form, index) => (
                  <tr
                    key={form._id}
                    className={`hover:bg-alabaster-grey-50/50 transition-colors ${
                      form.status === "unread" ? "bg-emerald-50/30" : ""
                    }`}
                  >
                    <td className="py-4 px-4 text-sm text-slate-grey-500 text-center font-mono">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gunmetal-900">
                      {form.user?.name || "Anonymous"}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-grey-600">
                      {form.user?.personalDetails?.abbreviatedJobTitle || "N/A"}
                    </td>
                    <td className="py-4 px-4 text-sm text-gunmetal-800">
                      {form.subject}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${
                          form.status === "read"
                            ? "bg-slate-100 text-slate-600 border-slate-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}
                      >
                         {form.status === "read" ? <FaCheckCircle size={10} /> : <FaExclamationCircle size={10} />}
                        {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                        <button
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-platinum-200 text-gunmetal-600 rounded-lg hover:bg-gunmetal-900 hover:text-white transition-all font-medium text-xs shadow-sm group"
                          onClick={() => openModal(form)}
                        >
                          <FaEye className="group-hover:text-white transition-colors" />
                          View
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
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
                    <option key={option} value={option}>{option}</option>
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
                Page {currentPage} of {totalPages || 1}
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

      {/* Form Details Modal */}
      {selectedForm && isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200"
          role="dialog"
        >
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl border border-platinum-200 flex flex-col max-h-[90vh]">
             {/* Modal Header */}
            <div className="flex justify-between items-start px-6 py-5 border-b border-platinum-200 bg-alabaster-grey-50 rounded-t-xl">
                 <div>
                     <h3 className="text-lg font-bold text-gunmetal-900 line-clamp-1">{selectedForm.subject}</h3>
                     <p className="text-xs text-slate-grey-500 mt-1 flex items-center gap-2">
                        <FaCalendarAlt /> Submitted on {formatDate(selectedForm.createdAt)}
                     </p>
                 </div>
                <button
                  onClick={closeModal}
                  className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors p-1"
                >
                  <FaTimes size={18} />
                </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                     <div className="flex items-center gap-3 p-3 bg-alabaster-grey-50 rounded-lg border border-platinum-200 flex-1">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gunmetal-600 shadow-sm border border-platinum-100">
                             <FaUser />
                        </div>
                        <div>
                             <p className="text-xs text-slate-grey-500 font-semibold uppercase">Submitted By</p>
                             <p className="text-sm font-bold text-gunmetal-900">{selectedForm.user?.name || "Anonymous"}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-3 p-3 bg-alabaster-grey-50 rounded-lg border border-platinum-200 flex-1">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gunmetal-600 shadow-sm border border-platinum-100">
                             <FaBriefcase />
                        </div>
                         <div>
                             <p className="text-xs text-slate-grey-500 font-semibold uppercase">Job Title</p>
                             <p className="text-sm font-bold text-gunmetal-900">{selectedForm.user?.personalDetails?.abbreviatedJobTitle || "N/A"}</p>
                        </div>
                     </div>
                </div>

                <div className="mb-2">
                    <h4 className="text-sm font-bold text-gunmetal-900 mb-2 uppercase tracking-wide">Message Content</h4>
                    <div
                        className="p-5 border border-platinum-200 rounded-xl bg-white text-slate-grey-700 text-sm leading-relaxed shadow-sm min-h-[150px] prose prose-sm max-w-none prose-p:text-slate-grey-700 prose-headings:text-gunmetal-900"
                        dangerouslySetInnerHTML={{ __html: selectedForm.message }}
                    ></div>
                </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-platinum-200 bg-white rounded-b-xl flex justify-end">
               <button
                onClick={closeModal}
                className="px-6 py-2 bg-gunmetal-900 text-white font-semibold rounded-lg hover:bg-gunmetal-800 transition-colors shadow-lg shadow-gunmetal-500/20 text-sm"
               >
                Close Details
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsManagement;
