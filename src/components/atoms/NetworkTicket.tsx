import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFilter, FaInbox, FaSpinner } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useUser from "../../hooks/useUser";
import { toast } from "react-toastify"; // Import toast
import { formatDate } from "../../utils/formatDate";

interface Ticket {
  id: number;
  date: string;
  from: string;
  subject: string;
  message: string;
  status: "Open" | "Closed";
}

const NetworkTicket: React.FC = () => {
  const [formData, setFormData] = useState({
    deptTo: "",
    subject: "",
    message: "",
  });

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>(
    {}
  );

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const user = useUser();
  const userId = user.user?._id;

  const departments = [
    "Account Management",
    "Project Management",
    "Content Production",
    "Book Marketing",
    "Design Production",
    "SEO",
    "Creative Media",
    "Web Development",
    "Paid Advertising",
    "Software Production",
    "IT & Networking",
    "Human Resource",
    "Training & Development",
    "Admin",
    "Finance",
    "Brand Development",
    "Corporate Communication",
  ];

  useEffect(() => {
    const fetchTickets = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/tickets/user/${userId}`,
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
        `${backendUrl}/api/tickets`,
        {
          from: formData.deptTo,
          subject,
          message,
        },
        { withCredentials: true }
      );
      setSubmitSuccess(true);
      setTickets([response.data.ticket, ...tickets]);
      setFormData({ deptTo: "", subject: "", message: "" });
      toast.success("Ticket submitted successfully!");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setSubmitSuccess(false);
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
    <div className="w-full mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-black">
        Submit Network Ticket
      </h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label
            htmlFor="deptTo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Department To
          </label>
          <select
            id="deptTo"
            name="deptTo"
            value={formData.deptTo}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter the subject"
            required
          />
          {errors.subject && <p className="text-red-600">{errors.subject}</p>}
        </div>

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message
          </label>
          <ReactQuill
            value={formData.message}
            onChange={handleMessageChange}
            theme="snow"
            placeholder="Write your message here..."
            className="bg-white rounded-md"
            style={{ height: "200px" }}
          />
          {errors.message && <p className="text-red-600">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all w-auto font-semibold mt-12"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-black">
          Ticket Status
        </h2>
        <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-300 ">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={filteredStatus}
            onChange={(e) => {
              setFilteredStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-10 mb-10">
            <FaSpinner
              size={30}
              className="animate-spin text-blue-600 mb-2"
              aria-hidden="true"
            />
            <h1 className="text-xl font-semibold text-black">
              Loading Data...
            </h1>
          </div>
        ) : paginatedTickets.length > 0 ? (
          <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">
                  S.No
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">
                  Date
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">
                  From
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">
                  Subject
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">
                  Status
                </th>
                <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map((ticket, index) => (
                <tr key={ticket.id}>
                  <td className="text-sm text-gray-800 px-4 py-2 border text-center">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="text-sm text-gray-800 px-4 py-2 border text-center">
                    {formatDate(ticket.date)}
                  </td>
                  <td className="text-sm text-gray-800 px-4 py-2 border text-center">
                    {ticket.from}
                  </td>
                  <td className="text-sm text-gray-800 px-4 py-2 border text-center">
                    {ticket.subject}
                  </td>
                  <td
                    className={`text-sm px-4 py-2 border text-center ${
                      ticket.status === "Open"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {ticket.status}
                  </td>
                  <td
                    className="text-sm px-4 py-2 border text-blue-600 cursor-pointer hover:underline text-center"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    View
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && (
            <div className="flex flex-col items-center">
              <FaInbox size={40} className="text-gray-400 mb-4" />
              <span className="text-lg font-medium">No tickets available</span>
            </div>
          )
        )}
      </div>

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

      {selectedTicket && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-blue-600 hover:text-blue-500 transition duration-200"
            >
              <IoCloseCircle size={28} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-purple-900">
              Ticket Details
            </h3>
            <p>
              <strong>Date:</strong> {formatDate(selectedTicket.date)}
            </p>
            <p>
              <strong>From:</strong> {selectedTicket.from}
            </p>
            <p>
              <strong>Subject:</strong> {selectedTicket.subject}
            </p>
            <div className="my-4 p-4 bg-gray-100 rounded-md">
              <strong>Message:</strong>
              <div
                dangerouslySetInnerHTML={{ __html: selectedTicket.message }}
              />
            </div>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  selectedTicket.status === "Open"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {selectedTicket.status}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkTicket;
