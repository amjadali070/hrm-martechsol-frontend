import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilter, FaInbox, FaSpinner, FaNetworkWired, FaEdit, FaPaperPlane, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaEye } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/formatDate";

interface NetworkTicketProps {
  id: number;
  date: string;
  subject: string;
  message: string;
  status: "Open" | "Closed";
}

const NetworkTicket: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const [tickets, setTickets] = useState<NetworkTicketProps[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedTicket, setSelectedTicket] =
    useState<NetworkTicketProps | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>(
    {}
  );

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const user = useUser();
  const userId = user.user?._id;

  useEffect(() => {
    const fetchTickets = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/network-tickets/user/${userId}`,
          {
            withCredentials: true,
          }
        );
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [backendUrl, userId]);

  const filteredTickets =
    filteredStatus === "All"
      ? tickets
      : tickets.filter((ticket) => ticket.status === filteredStatus);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMessageChange = (value: string) => {
    setFormData({ ...formData, message: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { subject, message } = formData;
    const newErrors: { subject?: string; message?: string } = {};

    if (!subject.trim()) newErrors.subject = "Subject is required.";
    if (!message.trim() || message === "<p><br></p>")
      newErrors.message = "Message is required.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/network-tickets`,
        {
          subject,
          message,
        },
        { withCredentials: true }
      );
      setTickets([response.data.ticket, ...tickets]);
      setFormData({ subject: "", message: "" });
      toast.success("Ticket submitted successfully!");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast.error("Failed to submit ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const closeModal = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 mb-8">
      {/* Header */}
       <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
            <FaNetworkWired className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Network Support
            </h2>
            <p className="text-sm text-slate-grey-500">
               Report connectivity issues or request IT assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-8 border-b border-platinum-200">
         <h3 className="text-lg font-bold text-gunmetal-900 mb-6">Create New Ticket</h3>
         <form onSubmit={handleSubmit}>
            <div className="mb-6">
                 <label className="text-sm font-semibold text-gunmetal-700 flex items-center gap-2 mb-2">
                    <FaEdit className="text-gunmetal-400" /> Subject
                 </label>
                 <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
                    placeholder="Briefly describe the issue..."
                    required
                 />
                 {errors.subject && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.subject}</p>}
            </div>

            <div className="mb-6">
                <label className="text-sm font-semibold text-gunmetal-700 flex items-center gap-2 mb-2">
                    <FaPaperPlane className="text-gunmetal-400" /> Message
                 </label>
                <div className="bg-white border border-platinum-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gunmetal-500/20 focus-within:border-gunmetal-500 transition-all">
                    <ReactQuill
                        value={formData.message}
                        onChange={handleMessageChange}
                        theme="snow"
                        placeholder="Detailed explanation of the problem..."
                        className="h-40 mb-10 border-none"
                    />
                </div>
                 {errors.message && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.message}</p>}
            </div>

            <div className="flex justify-end">
                <button
                type="submit"
                className={`px-8 py-2.5 bg-gunmetal-900 text-white text-sm font-bold rounded-lg hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20 flex items-center gap-2 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
                >
                {isSubmitting ? (
                    <>
                    <FaSpinner className="animate-spin" /> Submitting...
                    </>
                ) : (
                    "Submit Ticket"
                )}
                </button>
            </div>
         </form>
      </div>

       {/* List Section */}
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
           <h3 className="text-lg font-bold text-gunmetal-900">Ticket History</h3>
           
           <div className="relative group w-full md:w-64">
               <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <select
                 value={filteredStatus}
                 onChange={(e) => {
                   setFilteredStatus(e.target.value);
                   setCurrentPage(1);
                 }}
                 className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
               >
                 <option value="All">All Statuses</option>
                 <option value="Open">Open</option>
                 <option value="Closed">Closed</option>
               </select>
           </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-16">
               <FaSpinner className="animate-spin text-gunmetal-500 mb-3" size={28} />
               <p className="text-slate-grey-500 text-sm">Loading tickets...</p>
             </div>
          ) : paginatedTickets.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-16 bg-alabaster-grey-50/50">
               <FaInbox size={40} className="text-slate-grey-300 mb-3" />
               <span className="text-sm font-medium text-slate-grey-500">No tickets found.</span>
             </div>
          ) : (
             <table className="w-full text-left bg-white border-collapse">
              <thead className="bg-alabaster-grey-50">
                <tr>
                   <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 w-16 text-center">No.</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Date</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 w-1/3">Subject</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Status</th>
                   <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-platinum-100">
                {paginatedTickets.map((ticket, index) => (
                  <tr key={ticket.id} className="hover:bg-alabaster-grey-50/50 transition-colors">
                     <td className="py-4 px-4 text-sm text-slate-grey-500 text-center font-mono">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gunmetal-900">
                      {formatDate(ticket.date)}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-grey-700 font-medium">
                      {ticket.subject}
                    </td>
                    <td className="py-4 px-4 text-center">
                       <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${
                          ticket.status === 'Open'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' // Open is good/active usually green or blue? Let's use Green for Open here as "Active" or Blue. The original used Green for Open.
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                         {ticket.status === 'Open' ? <FaCheckCircle size={10} /> : <FaTimesCircle size={10} />}
                         {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                         <button
                           onClick={() => setSelectedTicket(ticket)}
                           className="text-gunmetal-600 hover:text-gunmetal-900 transition-colors p-1.5 rounded-md hover:bg-platinum-100 flex items-center justify-center mx-auto"
                           title="View Details"
                         >
                           <FaEye size={14} />
                         </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

           {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
           <div className="flex items-center gap-2 text-sm text-slate-grey-600 bg-alabaster-grey-50 px-3 py-1.5 rounded-lg border border-platinum-200">
              <span className="font-medium">Rows:</span>
              <select
                  className="bg-transparent border-none focus:outline-none font-semibold text-gunmetal-800 cursor-pointer"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
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
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-gunmetal-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-alabaster-grey-50 px-6 py-4 border-b border-platinum-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gunmetal-900">Ticket Details</h3>
                 <button
                    onClick={closeModal}
                    className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors"
                  >
                    <IoCloseCircle size={24} />
                  </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <span className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide">Date</span>
                        <p className="text-sm font-semibold text-gunmetal-900">{formatDate(selectedTicket.date)}</p>
                    </div>
                     <div>
                        <span className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide text-right block">Status</span>
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border mt-1 ${
                            selectedTicket.status === 'Open'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                        >
                            {selectedTicket.status}
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    <span className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-1 block">Subject</span>
                    <p className="text-base font-bold text-gunmetal-900">{selectedTicket.subject}</p>
                </div>

                <div>
                    <span className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-2 block">Message</span>
                    <div className="p-4 bg-alabaster-grey-50 rounded-xl border border-platinum-200 text-sm text-slate-grey-700 leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: selectedTicket.message }} />
                    </div>
                </div>
            </div>
            
            <div className="p-6 border-t border-platinum-200 bg-alabaster-grey-50">
                 <button
                    onClick={closeModal}
                    className="w-full py-2.5 bg-white border border-platinum-300 text-gunmetal-700 text-sm font-bold rounded-lg hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm"
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

export default NetworkTicket;
