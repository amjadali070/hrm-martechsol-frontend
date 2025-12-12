import React, { useEffect, useState, ChangeEvent } from "react";
import {
  FaSpinner,
  FaInbox,
  FaEdit,
  FaEye,
  FaPlus,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoArrowBackCircle } from "react-icons/io5";
import { Link, useSearchParams } from "react-router-dom";
import PayrollDetailModal, { PayrollData } from "./PayrollDetailModal";
import GeneratePayrollModal from "./GeneratePayrollModal";
import { usePayroll } from "./PayrollContext";
import { getMonthName } from "../../../utils/monthUtils";
import ProcessPayrollModal from "./ProcessPayrollModal";

interface MonthYear {
  month: number;
  year: number;
}

const PayrollManagement: React.FC = () => {
  const {
    payrolls,
    fetchPayrolls,
    fetchAllMonths,
    generatePayroll,
    processPayroll,
  } = usePayroll();
  const [monthYears, setMonthYears] = useState<MonthYear[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [loading, setLoading] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollData | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] =
    useState<boolean>(false);

  const [isProcessModalOpen, setIsProcessModalOpen] = useState<boolean>(false);

  const [searchParams] = useSearchParams();

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

  useEffect(() => {
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");
    if (monthParam && yearParam) {
      const monthNum = parseInt(monthParam, 10);
      const yearNum = parseInt(yearParam, 10);
      if (!isNaN(monthNum) && !isNaN(yearNum)) {
        setSelectedMonth(monthNum);
        setSelectedYear(yearNum);
        setCurrentPage(1);
        setNotFound(false);
        setLoading(true);
        fetchPayrolls(getMonthName(monthNum), yearNum)
          .then((fetchedPayrolls) => {
            const foundPayrolls = fetchedPayrolls.filter(
              (pay) => pay.month === monthNum && pay.year === yearNum
            );
            if (foundPayrolls.length === 0) setNotFound(true);
          })
          .catch((error) => {
            console.error("Error fetching payrolls:", error);
            setNotFound(true);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [searchParams, fetchPayrolls]);

  const uniqueYears = Array.from(new Set(monthYears.map((my) => my.year))).sort(
    (a, b) => b - a
  );

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
    window.history.replaceState(
      {},
      "",
      `/organization/payroll-management?month=${m}&year=${y}`
    );
  };

  const handleBackToMonths = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
    window.history.replaceState({}, "", `/organization/payroll-management`);
  };

  const filteredPayrolls = payrolls.filter(
    (pay) => pay.month === selectedMonth && pay.year === selectedYear
  );

  const finalFilteredPayrolls = filteredPayrolls.filter((pay) => {
    const matchesName = pay.user.name
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchesDepartment =
      departmentFilter === "" ||
      (pay.user.personalDetails?.department &&
        pay.user.personalDetails.department.toLowerCase() ===
          departmentFilter.toLowerCase());
    return matchesName && matchesDepartment;
  });

  const totalPages = Math.ceil(finalFilteredPayrolls.length / itemsPerPage);
  const currentPayrolls = finalFilteredPayrolls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const uniqueDepartments = Array.from(
    new Set(
      filteredPayrolls
        .map((pay) => pay.user.personalDetails?.department)
        .filter((dep) => !!dep)
    )
  ) as string[];

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPayroll(null);
  };

  const openGenerateModal = () => setIsGenerateModalOpen(true);
  const closeGenerateModal = () => setIsGenerateModalOpen(false);

  const openProcessModal = () => setIsProcessModalOpen(true);
  const closeProcessModal = () => setIsProcessModalOpen(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const handleYearFilterChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setFilterYear(e.target.value);
  const handleNameFilterChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNameFilter(e.target.value);
  const handleDepartmentFilterChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setDepartmentFilter(e.target.value);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
                  <FaMoneyBillWave className="text-gunmetal-600 text-xl" />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                  Payroll Management
                 </h2>
                 <p className="text-sm text-slate-grey-500">
                  Manage employee salaries, generate slips, and process payments.
                 </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
               {!selectedMonth && !selectedYear && (
                 <>
                   <button
                    onClick={openProcessModal}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gunmetal-600 border border-platinum-200 rounded-lg hover:bg-platinum-50 hover:text-gunmetal-900 transition-all font-semibold text-sm shadow-sm"
                   >
                    <FaCalendarCheck className="text-emerald-500" />
                    Process Payroll
                   </button>
                   <button
                    onClick={openGenerateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-gunmetal-900 text-white rounded-lg hover:bg-gunmetal-800 transition-all font-semibold text-sm shadow-sm"
                   >
                     <FaPlus />
                     Generate Payroll
                   </button>
                 </>
               )}
               
               {(selectedMonth || selectedYear) && (
                  <button
                    onClick={handleBackToMonths}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-grey-600 border border-platinum-200 rounded-lg hover:bg-gunmetal-50 hover:text-gunmetal-900 transition-all font-semibold text-sm shadow-sm"
                  >
                    <IoArrowBackCircle size={18} />
                    Back to Overview
                  </button>
               )}
            </div>
         </div>

      {/* Overview / Month Selection Mode */}
      {!selectedMonth && !selectedYear && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
             <div className="relative flex-1">
                 <FaFileInvoiceDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400" />
                 <input
                  type="text"
                  placeholder="Search by month..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                 />
             </div>
             <div className="relative w-full sm:w-48">
                 <select
                  value={filterYear}
                  onChange={handleYearFilterChange}
                  className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
                 >
                  <option value="">All Years</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {/* Custom arrow could be added here css-wise or via icon */}
             </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner
                size={32}
                className="animate-spin mb-3 text-gunmetal-500"
              />
               <p className="text-slate-grey-500 font-medium">Loading payroll periods...</p>
            </div>
          ) : filteredMonthYears.length === 0 ? (
            <div className="text-center py-12 text-slate-grey-400 bg-alabaster-grey-50 rounded-xl border border-dashed border-platinum-300">
               <FaInbox size={40} className="mx-auto mb-3 opacity-50" />
               <p className="font-medium">No payroll records found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {filteredMonthYears.map((my, index) => (
                   <div 
                      key={`${my.year}-${my.month}`}
                      onClick={() => handleMonthYearClick(my.month, my.year)}
                      className="group p-5 bg-white border border-platinum-200 rounded-xl hover:shadow-md hover:border-gunmetal-200 transition-all cursor-pointer flex flex-col items-start gap-2"
                   >
                      <div className="w-10 h-10 rounded-lg bg-gunmetal-50 text-gunmetal-600 flex items-center justify-center mb-1 group-hover:bg-gunmetal-900 group-hover:text-white transition-colors">
                          <FaCalendarCheck size={18} />
                      </div>
                      <h3 className="text-lg font-bold text-gunmetal-900">
                          {getMonthName(my.month)}
                      </h3>
                      <p className="text-sm font-mono text-slate-grey-500 bg-alabaster-grey-50 px-2 py-0.5 rounded border border-platinum-100">
                          {my.year}
                      </p>
                      
                      <div className="w-full mt-2 pt-3 border-t border-platinum-100 flex items-center justify-between text-xs font-semibold text-gunmetal-600">
                          <span>View Details</span>
                          <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </div>
                   </div>
               ))}
            </div>
          )}
        </div>
      )}

      {/* Specific Payroll View Mode */}
      {selectedMonth && selectedYear && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200">
             <div>
                <h3 className="text-lg font-bold text-gunmetal-900">
                  {getMonthName(selectedMonth)} {selectedYear}
                </h3>
                <p className="text-xs text-slate-grey-500 uppercase tracking-wide font-semibold mt-0.5">
                    Payroll Records
                </p>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                 <input
                  type="text"
                  placeholder="Search employee..."
                  value={nameFilter}
                  onChange={handleNameFilterChange}
                  className="px-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                />
                <select
                  value={departmentFilter}
                  onChange={handleDepartmentFilterChange}
                   className="px-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                >
                  <option value="">All Departments</option>
                  {uniqueDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
             </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
            <table className="w-full text-left bg-white">
              <thead className="bg-alabaster-grey-50 border-b border-platinum-200">
                <tr>
                   <th className="px-6 py-3 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Name</th>
                   <th className="px-6 py-3 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Department</th>
                   <th className="px-6 py-3 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-right">Total Salary</th>
                   <th className="px-6 py-3 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-right">Net Pay</th>
                   <th className="px-6 py-3 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-center">Status</th>
                   <th className="px-6 py-3 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-platinum-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                        <FaSpinner className="animate-spin h-6 w-6 text-gunmetal-500 mx-auto" />
                    </td>
                  </tr>
                ) : notFound || finalFilteredPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-grey-400">
                        <p>No records found for this period.</p>
                    </td>
                  </tr>
                ) : (
                  currentPayrolls.map((payroll, index) => {
                      const totalExtra = (payroll.extraPayments ?? []).reduce((acc, p) => acc + p.amount, 0);
                      const netPay = payroll.netSalary + totalExtra;
                      
                      return (
                    <tr key={payroll.id} className="hover:bg-alabaster-grey-50/50 transition-colors">
                      <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-gunmetal-900 block">{payroll.user.name}</span>
                          {/* <span className="text-xs text-slate-grey-400">ID: {payroll.user.employeeId || "N/A"}</span> */}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-grey-600">
                        {payroll.user.personalDetails?.department || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-grey-600 font-mono text-right">
                        {payroll.totalSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-700 font-mono text-right">
                        {netPay.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${
                             payroll.status === "Paid" 
                             ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                             : "bg-amber-50 text-amber-700 border-amber-100"
                         }`}>
                             {payroll.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link
                            to={`/edit/${payroll.id}`}
                            className="p-1.5 text-slate-grey-400 hover:text-gunmetal-600 hover:bg-platinum-100 rounded transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={16} />
                          </Link>
                          <Link
                            to={`/view/${payroll.id}`}
                             className="p-1.5 text-slate-grey-400 hover:text-gunmetal-600 hover:bg-platinum-100 rounded transition-colors"
                            title="View"
                          >
                             <FaEye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {finalFilteredPayrolls.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-grey-600">
                <span>Rows per page:</span>
                <select
                  className="bg-alabaster-grey-50 border border-platinum-200 rounded px-2 py-1 focus:outline-none"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {[20, 30, 50].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
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
                  <FiChevronLeft />
                </button>
                <span className="text-xs font-semibold text-gunmetal-600 uppercase tracking-wide px-2">
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
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
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

      {isProcessModalOpen && (
        <ProcessPayrollModal
          isOpen={isProcessModalOpen}
          onClose={closeProcessModal}
          onProcess={processPayroll}
        />
      )}
    </div>
  );
};

export default PayrollManagement;
