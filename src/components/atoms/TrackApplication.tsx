import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaSearch,
  FaCalendar,
  FaTimes,
  FaSpinner,
  FaInbox,
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
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string>("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const user = useUser();
  const userId = user.user?._id;
  console.log(userId);

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${backendUrl}/api/leave-applications/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (response.status === 200) {
          setLeaveApplications(data);
        } else {
          setError(data.message || "Failed to fetch leave applications.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveApplications();
  }, [userId, backendUrl]);

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

  const handleViewFile = (id: string) => {
    const application = leaveApplications.find((app) => app._id === id);
    if (application?.handoverDocument) {
      const fullPdfUrl = `${backendUrl}/${application.handoverDocument.replace(
        /\\/g,
        "/"
      )}`;
      setSelectedPdfUrl(fullPdfUrl);
      setIsModalOpen(true);
    } else {
      toast.info("No document available");
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg mb-1">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">
        Track Leave Applications
      </h2>

      <div className="flex flex-wrap gap-4 mb-2">
        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
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

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
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

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by Leave Type, Reason, or Officer"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
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

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaCalendar className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="FROM"
            onFocus={(e) => {
              e.target.type = "date";
              e.target.showPicker();
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                e.target.type = "text";
                e.target.value = "FROM";
              }
            }}
            onChange={(e) => {
              setDateFrom(e.target.value);
              e.target.type = "text";
              e.target.value = e.target.value
                ? new Date(e.target.value).toLocaleDateString()
                : "FROM";
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaCalendar className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="TO"
            onFocus={(e) => {
              e.target.type = "date";
              e.target.showPicker();
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                e.target.type = "text";
                e.target.value = "TO";
              }
            }}
            onChange={(e) => {
              setDateTo(e.target.value);
              e.target.type = "text";
              e.target.value = e.target.value
                ? new Date(e.target.value).toLocaleDateString()
                : "TO";
            }}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-10">
          <FaSpinner
            size={30}
            className="animate-spin text-blue-600 mb-6"
            aria-hidden="true"
          />
        </div>
      )}

      {error && (
        <div className="text-black text-center mb-4 mt-10">
          <div className="flex flex-col items-center justify-center">
            <FaInbox size={30} className="text-gray-400 mb-2" />
            <span className="text-md font-medium">
              {" "}
              No leave applications found.
            </span>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          {filteredApplications.length > 0 ? (
            <>
              <table className="min-w-full bg-white table-fixed border-collapse">
                <thead>
                  <tr>
                    <th className="py-2 px-2 bg-purple-900 text-left text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      Leave Type
                    </th>
                    <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      From
                    </th>
                    <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      To
                    </th>
                    <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase tracking-wider border border-gray-200 truncate">
                      Last Day at Work
                    </th>
                    <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase tracking-wider border border-gray-200 truncate">
                      Return to Work
                    </th>
                    <th className="py-2 px-2 bg-purple-900  text-center text-xs font-medium text-white uppercase tracking-wider border border-gray-200 truncate">
                      Total Days
                    </th>
                    <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      File
                    </th>
                    <th className="py-2 px-2 bg-purple-900  text-center text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      Reason
                    </th>

                    <th className="py-2 px-2 bg-purple-900  text-center text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      Comments
                    </th>
                    <th className="py-2 px-2 bg-purple-900  text-center text-xs font-medium text-white uppercase tracking-wider border border-gray-200">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentApplications.map((app, index) => (
                    <tr key={app._id} className={`hover:bg-gray-50 bg-white`}>
                      <td className="py-2 px-2 text-sm text-gray-700 truncate border border-gray-200">
                        {app.leaveType}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 truncate border border-gray-200 text-center">
                        {formatDate(app.startDate)}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 truncate border border-gray-200 text-center">
                        {formatDate(app.endDate)}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 truncate border border-gray-200 text-center">
                        {formatDate(app.lastDayToWork)}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 truncate border border-gray-200 text-center">
                        {formatDate(app.returnToWork)}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {app.totalDays}
                      </td>
                      <td
                        className={`py-2 px-2 text-sm border border-gray-200 text-center ${
                          app.handoverDocument
                            ? "text-blue-600 cursor-pointer"
                            : "text-gray-400"
                        }`}
                        onClick={() =>
                          app.handoverDocument && handleViewFile(app._id)
                        }
                      >
                        {app.handoverDocument ? "View" : "No file"}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {app.reason}
                      </td>
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {app.comments ? app.comments : "N/A"}
                      </td>
                      <td className="py-2 px-2 text-sm border border-gray-200 text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-center ${
                            app.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : app.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                          aria-label={`Status: ${app.status}`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">Show:</span>
                  <select
                    className="text-sm border border-gray-300 rounded-md p-0.5"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
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
                        : "bg-blue-600 text-white hover:bg-blue-600"
                    }`}
                    disabled={currentPage === totalPages}
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <FaInbox size={30} className="text-gray-400 mb-2" />
              <span className="text-md font-medium">
                {" "}
                No leave applications found.
              </span>
            </div>
          )}
        </div>
      )}

      {isModalOpen && selectedPdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[80%] h-[80%] relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-[120px] text-white z-10"
            >
              <FaTimes size={24} />
            </button>
            <iframe
              src={selectedPdfUrl}
              className="w-full h-full rounded-lg"
              title="Handover Document"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackApplication;
