import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaSearch,
  FaCalendar,
  FaTimes,
  FaSpinner,
  FaInbox,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import useUser from "../../hooks/useUser";
import axios from "axios";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/formatDate";

interface LeaveApplication {
  _id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  lastDayToWork: string;
  returnToWork: string;
  totalDays: number;
  handoverDocument: string;
  reason: string;
  comments: string | null;
  status: "Pending" | "Approved" | "Rejected";
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

interface LeaveApplicationDetailModalProps {
  isOpen: boolean;
  application: LeaveApplication | null;
  onClose: () => void;
  onOpenFile: (filePath: string) => void;
}

const LeaveApplicationDetailModal: React.FC<
  LeaveApplicationDetailModalProps
> = ({ isOpen, application, onClose, onOpenFile }) => {
  if (!isOpen || !application) return null;

  const getStatusConfig = (status: "Pending" | "Approved" | "Rejected") => {
    switch (status) {
      case "Approved":
        return {
          color: "bg-green-50 text-green-800 border-green-200",
          icon: <FaCheckCircle className="text-green-600 mr-2" />,
          label: "Approved",
        };
      case "Rejected":
        return {
          color: "bg-red-50 text-red-800 border-red-200",
          icon: <FaTimesCircle className="text-red-600 mr-2" />,
          label: "Rejected",
        };
      default:
        return {
          color: "bg-blue-50 text-blue-800 border-blue-200",
          icon: null,
          label: "Pending",
        };
    }
  };

  const statusConfig = getStatusConfig(application.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-3xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-hidden transform transition-transform duration-300 scale-100 origin-center">
        <div className="bg-purple-900 p-4 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <FaFileAlt className="mr-3" /> Leave Application Details
          </h2>
          <button
            onClick={onClose}
            aria-label="Close application details"
            className="text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-4">
              <FaCalendar className="text-blue-500 text-2xl" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Applied Dates
                </p>
                <p className="font-semibold text-gray-800 text-lg">
                  {formatDate(application.startDate)}{" "}
                  <span className="mx-1">-</span>{" "}
                  {formatDate(application.endDate)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-4">
              <FaFileAlt className="text-green-500 text-2xl" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Leave Type
                </p>
                <p className="font-bold text-gray-900 text-lg">
                  {application.leaveType}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-4">
              <FaClock className="text-purple-500 text-2xl" />
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-gray-500 uppercase text-xs tracking-wider">
                    Last Day:
                    <span className="font-semibold text-gray-800 ml-1">
                      {formatDate(application.lastDayToWork)}
                    </span>
                  </p>
                  <p className="text-gray-500 uppercase text-xs tracking-wider ml-3">
                    Return:
                    <span className="font-semibold text-gray-800 ml-1">
                      {formatDate(application.returnToWork)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center space-x-4">
              <div className="flex-grow">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Total Days
                </p>
                <p className="font-semibold text-gray-800 text-lg">
                  {application.totalDays}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Status
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center ${statusConfig.color}`}
                >
                  {statusConfig.icon}
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <FaFileAlt className="mr-2 text-gray-500" /> Reason
            </h3>
            <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
              {application.reason || "No reason provided."}
            </p>
          </div>

          {/* Card for Comments */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <FaFileAlt className="mr-2 text-gray-500" /> Comments
            </h3>
            <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
              {application.comments || "No additional comments provided."}
            </p>
          </div>

          {/* Attachment Section */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-gray-600 flex items-center">
              <FaFileAlt className="mr-2 text-gray-500" />
              {application.handoverDocument
                ? "Attachment available"
                : "No attachment"}
            </p>
            {application.handoverDocument && (
              <button
                onClick={() =>
                  onOpenFile(
                    `${application.handoverDocument.replace(/\\/g, "/")}`
                  )
                }
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-full text-sm transition-colors flex items-center"
              >
                View Attachment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackApplication: React.FC = () => {
  const [leaveApplications, setLeaveApplications] = useState<
    LeaveApplication[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterLeaveType, setFilterLeaveType] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] =
    useState<LeaveApplication | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      if (!user?._id) return;
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `${backendUrl}/api/leave-applications/user/${user._id}`,
          { withCredentials: true }
        );
        const data = response.data;
        if (response.status === 200) {
          setLeaveApplications(data);
        } else {
          setError(data.message || "Failed to fetch leave applications.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error("Error fetching leave applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveApplications();
  }, [user?._id]);

  const leaveTypes = [
    "All",
    ...new Set(leaveApplications.map((app) => app.leaveType)),
  ];

  const filteredApplications = leaveApplications.filter((app) => {
    const matchesStatus =
      filterStatus === "All"
        ? true
        : app.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesLeaveType =
      filterLeaveType === "All" ? true : app.leaveType === filterLeaveType;
    const matchesSearch =
      app.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth =
      selectedMonth === "All"
        ? true
        : new Date(app.startDate).getMonth() + 1 === parseInt(selectedMonth);
    const matchesDateFrom = dateFrom
      ? new Date(app.endDate) >= new Date(dateFrom)
      : true;
    const matchesDateTo = dateTo
      ? new Date(app.endDate) <= new Date(dateTo)
      : true;
    return (
      matchesStatus &&
      matchesLeaveType &&
      matchesSearch &&
      matchesMonth &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentApplications = filteredApplications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [totalPages, currentPage]);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleViewFile = (app: LeaveApplication) => {
    if (app.handoverDocument) {
      const fullPdfUrl = `${app.handoverDocument.replace(/\\/g, "/")}`;
      window.open(fullPdfUrl, "_blank");
    } else {
      toast.info("No document available");
    }
  };

  const handleViewApplicationDetails = (app: LeaveApplication) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const onOpenFile = (filePath: string) => {
    window.open(filePath, "_blank");
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg mb-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Track Leave Applications
      </h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={filterLeaveType}
            onChange={(e) => {
              setFilterLeaveType(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            {leaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by Leave Type or Reason"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaCalendar className="text-gray-400 mr-2" />
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="All">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaCalendar className="text-gray-400 mr-2" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          />
        </div>

        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaCalendar className="text-gray-400 mr-2" />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-10">
          <FaSpinner
            size={30}
            className="animate-spin text-blue-600 mb-6"
            aria-hidden="true"
          />
        </div>
      ) : error ? (
        <div className="text-gray-800 text-center mb-4 mt-10">
          <div className="flex flex-col items-center justify-center">
            <FaInbox size={30} className="text-gray-400 mb-2" />
            <span className="text-md font-medium">
              No leave applications found.
            </span>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {filteredApplications.length > 0 ? (
            <>
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-purple-900 text-white text-center">
                    <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                      From
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                      To
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                      Total Days
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                      File
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentApplications.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-700 text-center border-b">
                        {app.leaveType}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 text-center border-b">
                        {formatDate(app.startDate)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 text-center border-b">
                        {formatDate(app.endDate)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 text-center border-b">
                        {app.totalDays}
                      </td>
                      <td
                        className={`py-3 px-4 text-sm text-center border-b cursor-pointer ${
                          app.handoverDocument
                            ? "text-blue-600 hover:underline"
                            : "text-gray-400"
                        }`}
                        onClick={() => handleViewFile(app)}
                      >
                        {app.handoverDocument ? "View" : "No file"}
                      </td>
                      <td className="py-3 px-4 text-sm text-center border-b">
                        <span
                          className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                            app.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : app.status === "Pending"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center border-b">
                        <button
                          onClick={() => handleViewApplicationDetails(app)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-700"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-3">Show:</span>
                  <select
                    className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value));
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
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <FaInbox size={30} className="text-gray-400 mb-2" />
              <span className="text-md font-medium">
                No leave applications found.
              </span>
            </div>
          )}
        </div>
      )}

      <LeaveApplicationDetailModal
        isOpen={isModalOpen}
        application={selectedApplication}
        onClose={closeModal}
        onOpenFile={onOpenFile}
      />
    </div>
  );
};

export default TrackApplication;
