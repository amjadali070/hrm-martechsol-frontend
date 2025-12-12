import React, { useState, useEffect } from "react";
import axios from "axios";
import useUser from "../../hooks/useUser";
import { FaInbox, FaSpinner, FaPiggyBank, FaUser, FaRegCalendarAlt, FaFilter } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { formatDate } from "../../utils/formatDate";

const ProvidentFund: React.FC = () => {
  interface PFDetail {
    month: string;
    year: number;
    employeeContribution: number;
    employerContribution: number;
  }

  const [pfSummary, setPfSummary] = useState<PFDetail[]>([]);
  const [filteredYear, setFilteredYear] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const user = useUser();

  const userId = user.user?._id;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchPFContributionSummary = async () => {
      setLoading(true);
      setDataFetched(false);
      try {
        const response = await axios.get(
          `${backendUrl}/api/payrolls/contribution-summary/${userId}`,
          {
            withCredentials: true,
          }
        );
        setPfSummary(response.data);
      } catch (error) {
        console.error("Error fetching PF contribution summary:", error);
      } finally {
        setLoading(false);
        setDataFetched(true);
      }
    };

    if (userId) {
      fetchPFContributionSummary();
    }
  }, [userId, backendUrl]);

  const filteredFundDetails =
    filteredYear === "All"
      ? pfSummary
      : pfSummary.filter((detail) => detail.month.includes(filteredYear) || detail.year.toString() === filteredYear);

  const paginatedData = filteredFundDetails.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredFundDetails.length / rowsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Calculate Total Balance for display
  const totalBalance = pfSummary.reduce((sum, item) => sum + item.employeeContribution + item.employerContribution, 0);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
            <FaPiggyBank className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Provident Fund
            </h2>
            <p className="text-sm text-slate-grey-500">
              Track your monthly provident fund contributions.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-48">
          <FaSpinner className="text-gunmetal-500 mb-3 animate-spin" size={32} />
          <p className="text-slate-grey-500 text-sm">Loading fund details...</p>
        </div>
      ) : (
        <>
           {/* Top Info Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               {/* User Details */}
               <div className="p-5 border border-platinum-200 rounded-xl bg-alabaster-grey-50/50 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                        <FaUser className="text-gunmetal-400" />
                        <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide">Account Holder</h4>
                    </div>
                    <p className="text-lg font-bold text-gunmetal-900">{user.user?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <FaRegCalendarAlt className="text-slate-grey-400 text-xs" />
                        <p className="text-sm text-slate-grey-600">Member since {formatDate(user.user?.personalDetails?.joiningDate ?? "")}</p>
                    </div>
               </div>

                {/* Total Balance Summary (Optional Addition) */}
                <div className="p-5 border border-platinum-200 rounded-xl bg-gradient-to-br from-gunmetal-900 to-gunmetal-800 text-white flex flex-col justify-center shadow-lg shadow-gunmetal-500/10">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <FaPiggyBank />
                        <h4 className="text-xs font-bold uppercase tracking-wide">Total Fund Balance</h4>
                    </div>
                    <p className="text-3xl font-extrabold tracking-tight">PKR {totalBalance.toLocaleString()}</p>
                    <p className="text-xs text-platinum-300 mt-1">Combined Employee & Employer Contribution</p>
               </div>
           </div>

          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gunmetal-900">Contribution History</h3>
            
            <div className="relative group w-40">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                <select
                    value={filteredYear}
                    onChange={(e) => {
                        setFilteredYear(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-8 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer font-medium"
                >
                    <option value="All">All Years</option>
                    {[2024, 2023, 2022].map((year) => (
                    <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm mb-6">
             {dataFetched && filteredFundDetails.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 bg-alabaster-grey-50">
                    <FaInbox size={40} className="text-slate-grey-300 mb-3" />
                    <span className="text-sm font-medium text-slate-grey-500">No contribution records found.</span>
               </div>
            ) : (
                <table className="w-full text-left bg-white border-collapse">
                    <thead className="bg-alabaster-grey-50">
                        <tr>
                            <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Month</th>
                            <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-right">Employee Share</th>
                            <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-right">Employer Share</th>
                             <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-platinum-100">
                        {paginatedData.map((detail, index) => (
                        <tr key={index} className="hover:bg-alabaster-grey-50/50 transition-colors">
                            <td className="py-4 px-6 text-sm font-semibold text-gunmetal-900">
                                {detail.month} <span className="text-slate-grey-500 font-normal ml-1">{detail.year}</span>
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-grey-600 text-right font-mono">
                                PKR {detail.employeeContribution.toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-grey-600 text-right font-mono">
                                PKR {detail.employerContribution.toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-sm font-bold text-emerald-700 text-right font-mono bg-emerald-50/30">
                                PKR {(detail.employeeContribution + detail.employerContribution).toLocaleString()}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-2 text-sm text-slate-grey-600 bg-alabaster-grey-50 px-3 py-1.5 rounded-lg border border-platinum-200">
                <span className="font-medium">Rows:</span>
                <select
                    className="bg-transparent border-none focus:outline-none font-semibold text-gunmetal-800 cursor-pointer"
                    value={rowsPerPage}
                    onChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                    }}
                >
                    {[5, 10, 20].map((option) => (
                    <option key={option} value={option}>{option}</option>
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
                <FiChevronLeft size={16} />
            </button>
            
            <span className="text-xs font-semibold text-gunmetal-600 uppercase tracking-wide px-3">
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
                <FiChevronRight size={16} />
            </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProvidentFund;
