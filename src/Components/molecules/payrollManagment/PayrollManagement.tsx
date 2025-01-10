// src/components/PayrollManagement.tsx

import React, { useEffect, useState } from "react";
import { FaFilter, FaSpinner, FaEye, FaPlus, FaInbox } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import PayrollDetailModal, { PayrollData } from "./PayrollDetailModal";
import GeneratePayrollModal from "./GeneratePayrollModal";
import { usePayroll } from "./PayrollContext";
import { getMonthNumber, getMonthName } from "../../../utils/monthUtils";

const PayrollManagement: React.FC = () => {
  const { payrolls, fetchPayrolls, generatePayroll } = usePayroll();
  const [filters, setFilters] = useState({
    month: "",
    year: new Date().getFullYear(),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Increased for better UX
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollData | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchPayrolls(filters.month, filters.year);
        const monthNumber = getMonthNumber(filters.month);
        const filtered = payrolls.filter(
          (payroll) =>
            (filters.month ? payroll.month === monthNumber : true) &&
            payroll.year === parseInt(filters.year.toString())
        );
        setNotFound(filtered.length === 0);
        setCurrentPage(1); // Reset to first page on filter change
      } catch (error) {
        console.error("Error fetching payroll data:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Removed 'payrolls' from dependencies to prevent infinite loop
  }, [filters.month, filters.year, fetchPayrolls]);

  const filteredPayrolls = payrolls.filter(
    (payroll) =>
      (filters.month
        ? payroll.month === getMonthNumber(filters.month)
        : true) && payroll.year === parseInt(filters.year.toString())
  );

  const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
  const currentPayrolls = filteredPayrolls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const openDetailModal = (payroll: PayrollData) => {
    setSelectedPayroll(payroll);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPayroll(null);
  };

  const openGenerateModal = () => {
    setIsGenerateModalOpen(true);
  };

  const closeGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };

  // Generate month options
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="w-full p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
        Payroll Management
      </h2>

      {/* Generate Payroll Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openGenerateModal}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <FaPlus className="mr-2" />
          Generate Payroll
        </button>
      </div>

      {/* Filters Section */}
      <div className="grid gap-6 mb-6 sm:grid-cols-1 md:grid-cols-2">
        {/* Month Filter */}
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-700">
          <FaFilter className="text-purple-600 mr-3" />
          <select
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            className="w-full border-none focus:outline-none text-sm text-gray-700 dark:text-gray-300 bg-transparent"
          >
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border border-gray-300 dark:border-gray-700">
          <FaFilter className="text-purple-600 mr-3" />
          <input
            type="number"
            value={filters.year}
            onChange={(e) =>
              setFilters({ ...filters, year: parseInt(e.target.value) })
            }
            className="w-full border-none focus:outline-none text-sm text-gray-700 dark:text-gray-300 bg-transparent"
            placeholder="Year"
            min={2000}
            max={2100}
          />
        </div>
      </div>

      {/* Payrolls Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
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
            ) : notFound ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={40} className="text-gray-400 mb-4" />
                    <span className="text-lg font-medium">
                      No Payroll Data Found.
                    </span>
                  </div>
                </td>
              </tr>
            ) : currentPayrolls.length > 0 ? (
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
                    {payroll.user.department}
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
                  <td className="px-6 py-4 text-center space-x-2">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openDetailModal(payroll)}
                        className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors"
                        title="View Details"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                      <Link
                        to={`/edit/${payroll.id}`}
                        className="flex items-center justify-center px-3 py-2 bg-yellow-500 text-white text-sm rounded-full hover:bg-yellow-600 transition-colors"
                        title="Edit Payroll"
                      >
                        <FaPlus className="mr-1" /> Edit
                      </Link>
                      {/* Optional: Delete Button */}
                      {/* <button
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to delete this payroll?")) {
                            await deletePayroll(payroll.id);
                          }
                        }}
                        className="flex items-center justify-center px-3 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors"
                        title="Delete Payroll"
                      >
                        <FaTimes className="mr-1" /> Delete
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={40} className="text-gray-400 mb-4" />
                    <span className="text-lg font-medium">
                      No Payroll Data Found.
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

      {/* Payroll Detail Modal */}
      {isDetailModalOpen && selectedPayroll && (
        <PayrollDetailModal
          isOpen={isDetailModalOpen}
          payroll={selectedPayroll}
          onClose={closeDetailModal}
        />
      )}

      {/* Generate Payroll Modal */}
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
