import React, { useEffect, useState, ChangeEvent } from "react";
import { FaSpinner, FaEye, FaPlus, FaInbox, FaEdit } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoArrowBackCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import PayrollDetailModal, { PayrollData } from "./PayrollDetailModal";
import GeneratePayrollModal from "./GeneratePayrollModal";
import { usePayroll } from "./PayrollContext";
import { getMonthName } from "../../../utils/monthUtils";

interface MonthYear {
  month: number;
  year: number;
}

const PayrollManagement: React.FC = () => {
  const { payrolls, fetchPayrolls, fetchAllMonths, generatePayroll } =
    usePayroll();

  // State for the month–year list loaded from the API.
  const [monthYears, setMonthYears] = useState<MonthYear[]>([]);
  // State for the currently selected month and year.
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Filter states for months list
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");

  // Pagination states for payroll data.
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Loading and notFound states.
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Modal states.
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollData | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] =
    useState<boolean>(false);

  // --- Load the list of month–year combinations when the component mounts ---
  useEffect(() => {
    const loadMonths = async () => {
      setLoading(true);
      try {
        const months = await fetchAllMonths();
        setMonthYears(months);
      } catch (error) {
        console.error("Error fetching months:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMonths();
  }, [fetchAllMonths]);

  // --- Compute unique years for the year filter dropdown ---
  const uniqueYears = Array.from(
    new Set(monthYears.map((my) => my.year))
  ).sort();

  // --- Filter the monthYears using search term and selected year ---
  const filteredMonthYears = monthYears.filter((my) => {
    const monthName = getMonthName(my.month).toLowerCase();
    const matchesSearch = monthName.includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === "" || my.year.toString() === filterYear;
    return matchesSearch && matchesYear;
  });

  // --- When a month row is clicked, update the selection and fetch payroll data ---
  const handleMonthYearClick = async (m: number, y: number) => {
    setSelectedMonth(m);
    setSelectedYear(y);
    setCurrentPage(1);
    setNotFound(false);

    setLoading(true);
    try {
      // fetchPayrolls expects the month name (e.g., "January") and the year.
      const fetchedPayrolls = await fetchPayrolls(getMonthName(m), y);
      const foundPayrolls = fetchedPayrolls.filter(
        (pay) => pay.month === m && pay.year === y
      );
      setNotFound(foundPayrolls.length === 0);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // --- Option to clear selection and show months list again ---
  const handleBackToMonths = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
    // Optionally, you can also reset payroll-related pagination or state if needed.
  };

  // --- Filter payrolls according to the selected month and year ---
  const filteredPayrolls = payrolls.filter(
    (pay) => pay.month === selectedMonth && pay.year === selectedYear
  );

  // --- Pagination calculations ---
  const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
  const currentPayrolls = filteredPayrolls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // --- Modal control functions ---
  const openDetailModal = (payroll: PayrollData) => {
    setSelectedPayroll(payroll);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPayroll(null);
  };

  const openGenerateModal = () => setIsGenerateModalOpen(true);
  const closeGenerateModal = () => setIsGenerateModalOpen(false);

  // --- Event handlers for filter controls ---
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleYearFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilterYear(e.target.value);
  };

  return (
    <div className="w-full p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
        Payroll Management
      </h2>

      {/* Generate Payroll Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={openGenerateModal}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <FaPlus className="mr-2" />
          Generate Payroll
        </button>
      </div>

      {/* --- Months List (with Filters) --- */}
      {!selectedMonth && !selectedYear && (
        <div className="mb-6">
          {/* Filter Controls for Months List */}
          <div className="flex flex-col sm:flex-row gap-4 justify-start items-start mb-4">
            <input
              type="text"
              placeholder="Search by month name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={filterYear}
              onChange={handleYearFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Years</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {loading && monthYears.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FaSpinner
                size={40}
                className="animate-spin text-blue-600 mb-2"
              />
              <span>Loading months...</span>
            </div>
          ) : filteredMonthYears.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <thead className="bg-purple-900">
                  <tr>
                    <th className="px-6 py-3 text-sm font-medium text-white uppercase tracking-wider text-center">
                      S.No
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-white uppercase tracking-wider text-center">
                      Month
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-white uppercase tracking-wider text-center">
                      Year
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMonthYears.map((my, index) => (
                    <tr
                      key={`${my.year}-${my.month}`}
                      onClick={() => handleMonthYearClick(my.month, my.year)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        {getMonthName(my.month)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        {my.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- Payroll Data Table (when a month is selected) --- */}
      {selectedMonth && selectedYear && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handleBackToMonths}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center"
            >
              <IoArrowBackCircle className="mr-2" />
              Back
            </button>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Payroll for {getMonthName(selectedMonth)} {selectedYear}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <thead className="bg-purple-900 sticky top-0">
                <tr>
                  {[
                    "S.No",
                    "Name",
                    "Department",
                    "Month",
                    "Year",
                    "Total Salary",
                    "Net Salary",
                    "Status",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-sm font-medium text-white uppercase tracking-wider text-center"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FaSpinner
                          size={40}
                          className="animate-spin text-blue-600 mb-2"
                          aria-hidden="true"
                        />
                        <span>Loading payroll data...</span>
                      </div>
                    </td>
                  </tr>
                ) : notFound || currentPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FaInbox size={40} className="text-gray-400 mb-4" />
                        <span className="text-lg font-medium">
                          No payroll data found for this period.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentPayrolls.map((payroll, index) => (
                    <tr
                      key={payroll.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        {payroll.user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        {payroll.user.personalDetails?.department}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        {getMonthName(payroll.month)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        {payroll.year}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        PKR {payroll.totalSalary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        PKR {payroll.netSalary.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        {payroll.status}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => openDetailModal(payroll)}
                            className="flex items-center px-3 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors"
                            title="View Details"
                          >
                            <FaEye className="mr-1" /> View
                          </button>
                          <Link
                            to={`/edit/${payroll.id}`}
                            className="flex items-center px-3 py-2 bg-yellow-500 text-white text-sm rounded-full hover:bg-yellow-600 transition-colors"
                            title="Edit Payroll"
                          >
                            <FaEdit className="mr-1" /> Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* --- Pagination Controls --- */}
          {filteredPayrolls.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300 mr-3">
                  Show:
                </span>
                <select
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {[5, 10, 20, 50].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  className={`flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={currentPage === 1}
                  onClick={handlePrevious}
                >
                  <FiChevronLeft className="mr-2" />
                  Previous
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  className={`flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${
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
          )}
        </div>
      )}

      {/* --- Payroll Detail Modal --- */}
      {isDetailModalOpen && selectedPayroll && (
        <PayrollDetailModal
          isOpen={isDetailModalOpen}
          payroll={selectedPayroll}
          onClose={closeDetailModal}
        />
      )}

      {/* --- Generate Payroll Modal --- */}
      {isGenerateModalOpen && (
        <GeneratePayrollModal
          isOpen={isGenerateModalOpen}
          onClose={closeGenerateModal}
          onGenerate={generatePayroll}
        />
      )}
    </div>
  );
};

export default PayrollManagement;
