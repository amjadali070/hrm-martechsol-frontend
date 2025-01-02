// src/components/ViewHolidays.tsx

import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaInbox, FaSpinner } from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig"; // Centralized Axios instance
import useUser from "../../hooks/useUser";

interface Holiday {
  _id: string;
  fromDate: string;
  toDate: string | null;
  holidayName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const ViewHolidays: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [filteredHolidays, setFilteredHolidays] = useState<Holiday[]>([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("All");
  const [userFilter, setUserFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: userLoading } = useUser();
  const user_Id = user?._id;
  const userRole = user?.role; // Assuming user object contains role
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch holidays
  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      try {
        if (!user_Id) {
          throw new Error("User not found");
        }

        let endpoint = `${backendUrl}/api/holidays`;
        const params: any = {};

        // If admin and userFilter is set

        endpoint = `${backendUrl}/api/holidays/all`;
        params.user = userFilter;

        // Add date range filters
        if (fromDate) params.startDate = fromDate;
        if (toDate) params.endDate = toDate;

        const { data } = await axiosInstance.get(endpoint, { params });

        setHolidays(data);
        setFilteredHolidays(data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch holidays.";
        // toast.error(errorMessage);
        console.error("Error fetching holidays:", error, errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Fetch holidays only when user is loaded and user_Id is available
    if (!userLoading && user_Id) {
      fetchHolidays();
    }
  }, [
    fromDate,
    toDate,
    user_Id,
    userLoading,
    backendUrl,
    userFilter,
    userRole,
  ]);

  // Apply filters whenever holidays or filters change
  useEffect(() => {
    let data = [...holidays];

    // Filter by date range if both dates are selected
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      data = data.filter((holiday) => {
        const holidayStart = new Date(holiday.fromDate);
        const holidayEnd = holiday.toDate
          ? new Date(holiday.toDate)
          : holidayStart;
        return (
          (holidayStart >= start && holidayStart <= end) ||
          (holidayEnd >= start && holidayEnd <= end) ||
          (holidayStart <= start && holidayEnd >= end)
        );
      });
    }

    // Filter by holiday name
    if (nameFilter !== "All") {
      data = data.filter((holiday) => holiday.holidayName === nameFilter);
    }

    setFilteredHolidays(data);
    setCurrentPage(1); // Reset to first page when filters change
  }, [fromDate, toDate, nameFilter, userFilter, holidays, userRole]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredHolidays.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHolidays.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Calculate total days between two dates
  const calculateTotalDays = (start: string, end: string | null): number => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : startDate;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of both start and end
    return diffDays;
  };

  // Determine if the holiday is upcoming or passed
  const getHolidayStatus = (start: string, end: string | null): string => {
    const today = new Date();
    const holidayEnd = end ? new Date(end) : new Date(start);
    return holidayEnd >= today ? "Upcoming" : "Passed";
  };

  // Get unique holiday names for filter
  const uniqueHolidayNames = Array.from(
    new Set(holidays.map((holiday) => holiday.holidayName))
  );

  return (
    <div className="w-full p-4 sm:p-6 bg-white rounded-lg mb-8">
      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center">
          <FaSpinner className="text-blue-500 mb-4 animate-spin" size={30} />
        </div>
      ) : (
        <>
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-black">
            View Holidays
          </h2>

          {/* Filters */}
          <div className="flex gap-4 mb-4 flex-wrap sm:flex-nowrap overflow-x-auto">
            {/* From Date Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
                placeholder="FROM"
              />
            </div>

            {/* To Date Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
              <FaCalendarAlt className="text-gray-400 mr-3" />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
                placeholder="TO"
              />
            </div>

            {/* Name Filter */}
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
              <FaFilter className="text-gray-400 mr-3" />
              <select
                id="nameFilter"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
              >
                <option value="All">All Holidays</option>
                {uniqueHolidayNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Holidays Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md">
              <colgroup>
                <col style={{ width: "5%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    S.No
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Holiday Name
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    From Date
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    To Date
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Total Days
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Status
                  </th>
                  <th className="py-2 px-2 bg-purple-900 text-center text-xs font-medium text-white uppercase border border-gray-200">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((holiday, index) => (
                    <tr
                      key={holiday._id}
                      className={`hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-gray-100" : ""
                      }`}
                    >
                      {/* Serial Number */}
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Holiday Name */}
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {holiday.holidayName}
                      </td>

                      {/* From Date */}
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {new Date(holiday.fromDate).toLocaleDateString()}
                      </td>

                      {/* To Date */}
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {holiday.toDate
                          ? new Date(holiday.toDate).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* Total Days */}
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        {calculateTotalDays(holiday.fromDate, holiday.toDate)}
                      </td>

                      {/* Status */}
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full text-white ${
                            getHolidayStatus(
                              holiday.fromDate,
                              holiday.toDate
                            ) === "Upcoming"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {getHolidayStatus(holiday.fromDate, holiday.toDate)}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-2 px-2 text-sm text-gray-700 border border-gray-200 text-left">
                        {holiday.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  // No Records Found
                  <tr>
                    <td colSpan={7} className="py-4 px-2 text-sm text-gray-700 border border-gray-200 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FaInbox size={30} className="text-gray-400 mb-2" />
                        <span className="text-md font-medium">
                          No holidays found.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            {/* Items Per Page Selector */}
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Show:</span>
              <select
                className="text-sm border border-gray-300 rounded-md p-0.5"
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
                aria-label="Go to previous page"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  currentPage === totalPages || totalPages === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={handleNext}
                aria-label="Go to next page"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewHolidays;
