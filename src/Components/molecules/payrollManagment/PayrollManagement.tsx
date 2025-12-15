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
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { IoArrowBackCircle } from "react-icons/io5";
import { Link, useSearchParams } from "react-router-dom";
import PayrollDetailModal from "./PayrollDetailModal";
import GeneratePayrollModal from "./GeneratePayrollModal";
import { usePayroll, PayrollData } from "./PayrollContext";
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

  // Stats for the current view
  const totalPayout = finalFilteredPayrolls.reduce((acc, curr) => acc + curr.netSalary, 0);

  return (
    <div className="w-full bg-alabaster-grey-50 min-h-screen p-6 md:p-8 font-sans text-slate-grey-800">
      
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
           <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-platinum-200">
               <FaMoneyBillWave className="text-gunmetal-600 text-2xl" />
           </div>
           <div>
              <h2 className="text-2xl font-extrabold text-gunmetal-900 tracking-tight">
               Payroll Management
              </h2>
              <p className="text-sm text-slate-grey-500 font-medium mt-1">
                 Manage employee salaries, generate slips, and process payments securely.
              </p>
           </div>
        </div>

        <div className="flex flex-wrap gap-3">
           {!selectedMonth && !selectedYear && (
             <>
               <button
                onClick={openProcessModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-gunmetal-700 border border-platinum-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all font-bold text-sm shadow-sm group"
               >
                <FaCalendarCheck className="text-emerald-500 group-hover:scale-110 transition-transform" />
                Process Payroll
               </button>
               <button
                onClick={openGenerateModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-gunmetal-900 text-white rounded-xl hover:bg-gunmetal-800 transition-all font-bold text-sm shadow-lg hover:shadow-gunmetal-500/20 group transform hover:-translate-y-0.5"
               >
                 <FaPlus className="group-hover:rotate-90 transition-transform" />
                 Generate Payroll
               </button>
             </>
           )}
           
           {(selectedMonth || selectedYear) && (
              <div className="flex items-center bg-white border border-platinum-200 rounded-xl p-1 shadow-sm">
                 <button
                   onClick={handleBackToMonths}
                   className="flex items-center gap-2 px-4 py-2 bg-alabaster-grey-50 text-slate-grey-600 rounded-lg hover:bg-platinum-100 hover:text-gunmetal-900 transition-all font-semibold text-sm"
                 >
                   <IoArrowBackCircle size={18} />
                   Back to Overview
                 </button>
                 <div className="h-6 w-px bg-platinum-200 mx-2"></div>
                 <div className="px-4 py-1 text-sm font-bold text-gunmetal-900">
                     Month Total: <span className="font-mono text-emerald-600">PKR {totalPayout.toLocaleString()}</span>
                 </div>
              </div>
           )}
        </div>
      </div>

      {/* Mode 1: Months Overview Grid */}
      {!selectedMonth && !selectedYear && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-platinum-200 shadow-sm">
             <div className="relative flex-1">
                 <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-grey-400" />
                 <input
                  type="text"
                  placeholder="Search by month name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-11 pr-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all font-medium"
                 />
             </div>
             <div className="relative w-full sm:w-56">
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-grey-400 pointer-events-none" />
                 <select
                  value={filterYear}
                  onChange={handleYearFilterChange}
                  className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer font-medium"
                 >
                  <option value="">All Years</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
             </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner
                size={40}
                className="animate-spin mb-4 text-gunmetal-500"
              />
               <p className="text-slate-grey-500 font-medium">Loading payroll periods...</p>
            </div>
          ) : filteredMonthYears.length === 0 ? (
            <div className="text-center py-20 text-slate-grey-400 bg-white rounded-2xl border border-dashed border-platinum-300">
               <FaInbox size={48} className="mx-auto mb-4 opacity-50 text-slate-grey-300" />
               <p className="font-bold text-lg text-slate-grey-500">No payroll records found</p>
               <p className="text-sm text-slate-grey-400 mt-1">Try generating a new payroll or adjusting filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
               {filteredMonthYears.map((my, index) => (
                   <div 
                      key={`${my.year}-${my.month}`}
                      onClick={() => handleMonthYearClick(my.month, my.year)}
                      className="group bg-white border border-platinum-200 rounded-2xl p-6 hover:shadow-lg hover:border-gunmetal-200 transition-all cursor-pointer flex flex-col justify-between h-40 relative overflow-hidden"
                   >
                       {/* Background decoration */}
                       <div className="absolute top-0 right-0 w-24 h-24 bg-gunmetal-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                       
                       <div className="relative z-10 flex justify-between items-start">
                           <div className="bg-gunmetal-50 p-3 rounded-xl text-gunmetal-600 group-hover:bg-gunmetal-900 group-hover:text-white transition-colors shadow-sm">
                               <FaFileInvoiceDollar size={20} />
                           </div>
                           <span className="bg-alabaster-grey-50 text-slate-grey-500 text-xs font-bold px-2 py-1 rounded border border-platinum-100 font-mono">
                               {my.year}
                           </span>
                       </div>
                       
                       <div className="relative z-10 mt-4">
                           <h3 className="text-xl font-bold text-gunmetal-900 group-hover:translate-x-1 transition-transform">
                               {getMonthName(my.month)}
                           </h3>
                           <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transform">
                               <span>View Details</span>
                               <FiChevronRight />
                           </div>
                       </div>
                   </div>
               ))}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Specific Month Detail View */}
      {selectedMonth && selectedYear && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 rounded-2xl border border-platinum-200 shadow-sm">
             <div className="flex items-center gap-4">
                 <div className="hidden sm:flex bg-gunmetal-50 w-12 h-12 rounded-xl items-center justify-center text-gunmetal-600 font-bold text-lg shadow-inner">
                     {selectedMonth}
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gunmetal-900">
                      {getMonthName(selectedMonth)} {selectedYear}
                    </h3>
                    <p className="text-xs text-slate-grey-500 uppercase tracking-wide font-bold mt-1">
                        Employee Records
                    </p>
                 </div>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                 <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400" />
                      <input
                        type="text"
                        placeholder="Search employee..."
                        value={nameFilter}
                        onChange={handleNameFilterChange}
                        className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-alabaster-grey-50 border border-platinum-200 rounded-xl text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                      />
                 </div>
                 <div className="relative">
                      <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400" />
                      <select
                        value={departmentFilter}
                        onChange={handleDepartmentFilterChange}
                         className="w-full sm:w-48 pl-9 pr-8 py-2.5 bg-alabaster-grey-50 border border-platinum-200 rounded-xl text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">All Departments</option>
                        {uniqueDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-grey-400 pointer-events-none" />
                 </div>
             </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl border border-platinum-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-alabaster-grey-50 border-b border-platinum-200">
                    <tr>
                       <th className="px-6 py-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Employee Name</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Department</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-right">Gross Salary</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-right">Net Payable</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-center">Status</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-platinum-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16">
                            <FaSpinner className="animate-spin h-8 w-8 text-gunmetal-500 mx-auto" />
                            <p className="text-slate-grey-400 mt-2 text-sm font-medium">Fetching records...</p>
                        </td>
                      </tr>
                    ) : notFound || finalFilteredPayrolls.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-slate-grey-400">
                            <FaInbox className="h-10 w-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No records matching your search.</p>
                        </td>
                      </tr>
                    ) : (
                      currentPayrolls.map((payroll, index) => {
                          const totalExtra = (payroll.extraPayments ?? []).reduce((acc, p) => acc + p.amount, 0);
                          const netPay = payroll.netSalary + totalExtra;
                          
                          return (
                        <tr key={payroll.id} className="hover:bg-alabaster-grey-50 transition-colors group">
                          <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gunmetal-100 flex items-center justify-center text-gunmetal-700 font-bold text-xs ring-2 ring-white shadow-sm">
                                      {payroll.user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-sm font-bold text-gunmetal-900">{payroll.user.name}</span>
                              </div>
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
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                                 payroll.status === "Paid" 
                                 ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                 : "bg-amber-50 text-amber-700 border-amber-100"
                             }`}>
                                 {payroll.status}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openDetailModal(payroll)}
                                 className="p-2 text-slate-grey-400 hover:text-gunmetal-600 hover:bg-white border border-transparent hover:border-platinum-200 rounded-lg transition-all shadow-sm"
                                title="Quick View"
                              >
                                 <FaEye size={16} />
                              </button>
                               <Link
                                to={`/edit/${payroll.id}`}
                                className="p-2 text-slate-grey-400 hover:text-blue-600 hover:bg-white border border-transparent hover:border-blue-100 rounded-lg transition-all shadow-sm"
                                title="Edit"
                              >
                                <FaEdit size={16} />
                              </Link>
                               <Link
                                to={`/view/${payroll.id}`}
                                className="p-2 text-slate-grey-400 hover:text-emerald-600 hover:bg-white border border-transparent hover:border-emerald-100 rounded-lg transition-all shadow-sm"
                                title="Full Details"
                              >
                                <FaFileInvoiceDollar size={16} />
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
                 <div className="px-6 py-4 bg-white border-t border-platinum-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-grey-600 font-medium">
                        <span>Show</span>
                        <select
                          className="bg-alabaster-grey-50 border border-platinum-200 rounded-lg px-2 py-1 focus:outline-none focus:border-gunmetal-500 text-gunmetal-900 cursor-pointer"
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
                        <span>entries</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-grey-400 uppercase tracking-wide mr-2">
                             Page {currentPage} of {totalPages || 1}
                        </span>
                        <button
                          className={`p-2 rounded-lg border border-platinum-200 transition-all ${
                            currentPage === 1 
                              ? "bg-alabaster-grey-50 text-slate-grey-300 cursor-not-allowed" 
                              : "bg-white text-gunmetal-600 hover:bg-gunmetal-50 hover:text-gunmetal-900 shadow-sm"
                          }`}
                          disabled={currentPage === 1}
                          onClick={handlePrevious}
                        >
                          <FiChevronLeft />
                        </button>
                        <button
                          className={`p-2 rounded-lg border border-platinum-200 transition-all ${
                            currentPage === totalPages || totalPages === 0
                              ? "bg-alabaster-grey-50 text-slate-grey-300 cursor-not-allowed" 
                              : "bg-white text-gunmetal-600 hover:bg-gunmetal-50 hover:text-gunmetal-900 shadow-sm"
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
