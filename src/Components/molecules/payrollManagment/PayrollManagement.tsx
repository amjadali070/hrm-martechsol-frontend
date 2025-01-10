import React, { useEffect, useState } from "react";
import { FaSpinner, FaEye, FaPlus, FaInbox, FaEdit } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
  const { payrolls, fetchPayrolls, generatePayroll } = usePayroll();

  // 1) Local state for distinct month-year combos
  const [monthYears, setMonthYears] = useState<MonthYear[]>([]);
  // 2) Selected month and year
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Table pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Loading and notFound states
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Payroll details modal states
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollData | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Generate payroll modal state
  const [isGenerateModalOpen, setIsGenerateModalOpen] =
    useState<boolean>(false);

  // ---  Fetch distinct months/years on component mount  ---
  useEffect(() => {
    const fetchMonthYears = async () => {
      setLoading(true);
      try {
        // E.g., GET /api/payroll/all-months
        const response = await fetch("/api/payroll/all-months", {
          credentials: "include", // or with axiosInstance.get(...)
        });
        if (!response.ok) {
          throw new Error("Failed to fetch distinct months");
        }
        const data = await response.json();
        setMonthYears(data.months); // => [ { month: 12, year: 2025 }, ...]
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthYears();
  }, []);

  // --- Fetch all payrolls for the *selected* month-year ---
  const handleMonthYearClick = async (m: number, y: number) => {
    setSelectedMonth(m);
    setSelectedYear(y);
    setNotFound(false);
    setCurrentPage(1);

    // Re-use your existing fetchPayrolls in the PayrollContext
    // This calls GET /api/payroll?month={m}&year={y}
    setLoading(true);
    try {
      await fetchPayrolls(getMonthName(m), y);

      // Check if we got no payroll for that month
      const foundPayrolls = payrolls.filter(
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

  // Filter the global payrolls by the selected month-year
  const filteredPayrolls = payrolls.filter(
    (pay) => pay.month === selectedMonth && pay.year === selectedYear
  );

  // Pagination
  const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
  const currentPayrolls = filteredPayrolls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Detail modal
  const openDetailModal = (payroll: PayrollData) => {
    setSelectedPayroll(payroll);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPayroll(null);
  };

  // Generate payroll modal
  const openGenerateModal = () => {
    setIsGenerateModalOpen(true);
  };
  const closeGenerateModal = () => {
    setIsGenerateModalOpen(false);
  };

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

      {/* 1) List all distinct month-year combos */}
      {loading && monthYears.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <FaSpinner size={40} className="animate-spin text-blue-600 mb-2" />
          <span>Loading months...</span>
        </div>
      ) : (
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 mb-8">
          {monthYears.map((my) => (
            <button
              key={`${my.year}-${my.month}`}
              onClick={() => handleMonthYearClick(my.month, my.year)}
              className={`border px-3 py-2 rounded shadow hover:shadow-md
                ${
                  selectedMonth === my.month && selectedYear === my.year
                    ? "bg-purple-200 dark:bg-purple-600"
                    : "bg-white dark:bg-gray-800"
                }
              `}
            >
              {getMonthName(my.month)} {my.year}
            </button>
          ))}
        </div>
      )}

      {/* 2) Show payroll table for the selected month-year */}
      {selectedMonth && selectedYear ? (
        <div>
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Showing Payroll for {getMonthName(selectedMonth)} {selectedYear}
          </h3>

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
                          No Payroll Data Found for this month-year.
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
                            <FaEdit className="mr-1" /> Edit
                          </Link>
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

          {/* Pagination */}
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
                  className={`flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 
                  text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 
                  dark:hover:bg-gray-600 transition-colors 
                  ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
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
                  className={`flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 
                  text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 
                  dark:hover:bg-gray-600 transition-colors 
                  ${
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
      ) : (
        <div className="text-center text-gray-600 dark:text-gray-300 mt-8">
          Select a month and year to view payrolls.
        </div>
      )}

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
