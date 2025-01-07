// src/components/ViewHolidays.tsx

import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaInbox, FaSpinner } from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig"; // Centralized Axios instance
import useUser from "../../hooks/useUser";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
    <div className="w-full p-6 sm:p-8 bg-gradient-to-r from-gray-100 to-white rounded-lg mb-8">
      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center">
          <FaSpinner className="text-indigo-500 mb-4 animate-spin" size={40} />
        </div>
      ) : (
        <>
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-gray-800">
            View Holidays
          </h2>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6 items-start sm:items-center">
            {/* Date Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* From Date Filter */}
              <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
                <FaCalendarAlt className="text-black mr-3" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border-none focus:ring-0 text-sm text-gray-700"
                  placeholder="FROM"
                  aria-label="Filter from date"
                />
              </div>

              {/* To Date Filter */}
              <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-200">
                <FaCalendarAlt className="text-black mr-3" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border-none focus:ring-0 text-sm text-gray-700"
                  placeholder="TO"
                  aria-label="Filter to date"
                />
              </div>
            </div>

            {/* Name Filter */}
            <div className="flex items-center bg-white rounded-lg px-4 py-3 border border-gray-200 w-full sm:w-auto">
              <FaFilter className="text-black mr-3" />
              <select
                id="nameFilter"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="w-full border-none focus:ring-0 text-sm text-gray-700"
                aria-label="Filter by holiday name"
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
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-purple-900 text-white">
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider text-center">
                    S.No
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider text-left">
                    Holiday Name
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider text-left">
                    From Date
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider text-left">
                    To Date
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider text-center">
                    Total Days
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((holiday, index) => (
                    <tr
                      key={holiday._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition-colors`}
                    >
                      {/* Serial Number */}
                      <td className="py-4 px-4 text-sm text-gray-700 text-center">
                        {indexOfFirstItem + index + 1}
                      </td>

                      {/* Holiday Name */}
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {holiday.holidayName}
                      </td>

                      {/* From Date */}
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {new Date(holiday.fromDate).toLocaleDateString()}
                      </td>

                      {/* To Date */}
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {holiday.toDate
                          ? new Date(holiday.toDate).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* Total Days */}
                      <td className="py-4 px-4 text-sm text-gray-700 text-center">
                        {calculateTotalDays(holiday.fromDate, holiday.toDate)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-sm text-center">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            getHolidayStatus(
                              holiday.fromDate,
                              holiday.toDate
                            ) === "Upcoming"
                              ? "bg-green-400 text-white"
                              : "bg-red-400 text-white"
                          }`}
                        >
                          {getHolidayStatus(holiday.fromDate, holiday.toDate)}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {holiday.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  // No Records Found
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 px-4 text-sm text-gray-500 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <FaInbox size={40} className="text-gray-400 mb-4" />
                        <span className="text-lg font-medium">
                          No holidays found.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
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
    </div>
  );
};

export default ViewHolidays;
