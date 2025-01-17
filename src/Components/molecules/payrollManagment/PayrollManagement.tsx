// src/components/PayrollManagement.tsx
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
  const [monthYears, setMonthYears] = useState<MonthYear[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollData | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] =
    useState<boolean>(false);

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

  const uniqueYears = Array.from(
    new Set(monthYears.map((my) => my.year))
  ).sort();
  const filteredMonthYears = monthYears.filter((my) => {
    const monthName = getMonthName(my.month).toLowerCase();
    const matchesSearch = monthName.includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === "" || my.year.toString() === filterYear;
    return matchesSearch && matchesYear;
  });

  const handleMonthYearClick = async (m: number, y: number) => {
    setSelectedMonth(m);
    setSelectedYear(y);
    setCurrentPage(1);
    setNotFound(false);
    setLoading(true);
    try {
      const fetchedPayrolls = await fetchPayrolls(getMonthName(m), y);
      const foundPayrolls = fetchedPayrolls.filter(
        (pay) => pay.month === m && pay.year === y
      );
      if (foundPayrolls.length === 0) setNotFound(true);
    } catch (error) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMonths = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  const filteredPayrolls = payrolls.filter(
    (pay) => pay.month === selectedMonth && pay.year === selectedYear
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

  const openGenerateModal = () => setIsGenerateModalOpen(true);
  const closeGenerateModal = () => setIsGenerateModalOpen(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const handleYearFilterChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setFilterYear(e.target.value);

  return (
    <div className="w-full p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
        Payroll Management
      </h2>
      <div className="flex justify-end mb-6">
        <button
          onClick={openGenerateModal}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md"
        >
          <FaPlus className="mr-2" /> Generate Payroll
        </button>
      </div>
      {!selectedMonth && !selectedYear && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by month name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-3 py-2 border rounded-md"
            />
            <select
              value={filterYear}
              onChange={handleYearFilterChange}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Years</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="flex flex-col items-center py-8">
              <FaSpinner size={40} className="animate-spin mb-2" />
              <span>Loading months...</span>
            </div>
          ) : filteredMonthYears.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead className="bg-purple-900">
                  <tr>
                    <th className="px-6 py-3 text-sm text-white text-center">
                      S.No
                    </th>
                    <th className="px-6 py-3 text-sm text-white text-center">
                      Month
                    </th>
                    <th className="px-6 py-3 text-sm text-white text-center">
                      Year
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMonthYears.map((my, index) => (
                    <tr
                      key={`${my.year}-${my.month}`}
                      onClick={() => handleMonthYearClick(my.month, my.year)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">
                        {getMonthName(my.month)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">
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
      {selectedMonth && selectedYear && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handleBackToMonths}
              className="px-4 py-2 bg-blue-600 text-white rounded-full flex items-center"
            >
              <IoArrowBackCircle className="mr-2" /> Back
            </button>
            <h3 className="text-xl font-bold text-gray-800">
              Payroll for {getMonthName(selectedMonth)} {selectedYear}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
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
                      className="px-6 py-3 text-sm text-white text-center"
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
                      <div className="flex flex-col items-center">
                        <FaSpinner size={40} className="animate-spin mb-2" />
                        <span>Loading payroll data...</span>
                      </div>
                    </td>
                  </tr>
                ) : notFound || currentPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaInbox size={40} className="text-gray-400 mb-4" />
                        <span className="text-lg font-medium">
                          No payroll data found for this period.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentPayrolls.map((payroll, index) => (
                    <tr key={payroll.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 text-sm text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        {payroll.user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        {payroll.user.personalDetails?.department}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        {getMonthName(payroll.month)}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        {payroll.year}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        PKR {payroll.totalSalary.toFixed(0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        PKR {payroll.netSalary.toFixed(0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        {payroll.status}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => openDetailModal(payroll)}
                            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-full"
                            title="View Details"
                          >
                            <FaEye className="mr-1" /> View
                          </button>
                          <Link
                            to={`/edit/${payroll.id}`}
                            className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-full"
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
          {filteredPayrolls.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-3">Show:</span>
                <select
                  className="text-sm border rounded-md p-2"
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
                  className={`flex items-center px-4 py-2 bg-gray-200 rounded-lg ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={currentPage === 1}
                  onClick={handlePrevious}
                >
                  <FiChevronLeft className="mr-2" /> Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  className={`flex items-center px-4 py-2 bg-gray-200 rounded-lg ${
                    currentPage === totalPages || totalPages === 0
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={handleNext}
                >
                  Next <FiChevronRight className="ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {isDetailModalOpen && selectedPayroll && (
        <PayrollDetailModal
          isOpen={isDetailModalOpen}
          payroll={selectedPayroll}
          onClose={closeDetailModal}
        />
      )}
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
