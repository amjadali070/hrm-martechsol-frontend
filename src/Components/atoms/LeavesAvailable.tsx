import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaSpinner, FaUmbrellaBeach, FaBriefcaseMedical, FaPlaneDeparture } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";

interface LeaveDetail {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  totalDays: number;
}

interface LeaveBalance {
  type: string;
  used: number;
  total: number;
}

const LeavesAvailable: React.FC = () => {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([
    { type: "Sick Leave", used: 0, total: 8 },
    { type: "Casual Leave", used: 0, total: 10 },
    { type: "Annual Leave", used: 0, total: 14 },
  ]);
  const [leaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("All");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchLeaveData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/leave-applications`,
          {
            withCredentials: true,
          }
        );
        // Filter approved leaves only
        const approvedLeaves = response.data.filter(
          (leave: LeaveDetail) => leave.status === "Approved"
        );

        // Update leave balances with used days
        const updatedBalances = leaveBalances.map((balance) => {
          const usedDays = approvedLeaves
            .filter((leave: LeaveDetail) => leave.leaveType === balance.type)
            .reduce(
              (sum: number, leave: LeaveDetail) => sum + leave.totalDays,
              0
            );
          return { ...balance, used: usedDays };
        });

        setLeaveBalances(updatedBalances);
        setLeaveDetails(approvedLeaves);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter leave details
  const filteredDetails = leaveDetails.filter((detail) => {
    const matchesLeaveType =
      selectedLeaveType === "All" || detail.leaveType === selectedLeaveType;
    const matchesFromDate =
      !fromDate || new Date(detail.startDate) >= new Date(fromDate);
    const matchesToDate =
      !toDate || new Date(detail.endDate) <= new Date(toDate);
    return matchesLeaveType && matchesFromDate && matchesToDate;
  });

  const totalPages = Math.ceil(filteredDetails.length / rowsPerPage);
  const paginatedDetails = filteredDetails.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getLeaveIcon = (type: string) => {
      switch (type) {
          case 'Sick Leave': return <FaBriefcaseMedical />;
          case 'Casual Leave': return <FaUmbrellaBeach />;
          case 'Annual Leave': return <FaPlaneDeparture />;
          default: return <FaCalendarAlt />;
      }
  };

  const getLeaveColor = (type: string) => {
    switch (type) {
        case 'Sick Leave': return 'text-rose-600 bg-rose-50 border-rose-100';
        case 'Casual Leave': return 'text-amber-600 bg-amber-50 border-amber-100';
        case 'Annual Leave': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        default: return 'text-gunmetal-600 bg-alabaster-grey-50 border-platinum-200';
    }
  };


  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
            <FaUmbrellaBeach className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Leave Balance
            </h2>
            <p className="text-sm text-slate-grey-500">
              Overview of your available and used leaves.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-48">
          <FaSpinner className="text-gunmetal-500 mb-3 animate-spin" size={32} />
          <p className="text-slate-grey-500 text-sm">Loading leave balances...</p>
        </div>
      ) : (
        <>
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {leaveBalances.map((leave) => {
                const remaining = leave.total - leave.used;
                const percentageUsed = (leave.used / leave.total) * 100;
                
                return (
                    <div key={leave.type} className={`p-6 rounded-xl border ${getLeaveColor(leave.type).split(' ')[2]} ${getLeaveColor(leave.type).split(' ')[1]} relative overflow-hidden`}>
                         <div className="flex justify-between items-start mb-4">
                             <div>
                                 <h3 className="text-base font-bold text-gunmetal-900">{leave.type}</h3>
                                 <p className="text-xs text-slate-grey-600 font-medium opacity-80">Total Allocated: {leave.total}</p>
                             </div>
                             <div className={`p-2 rounded-lg bg-white/60 ${getLeaveColor(leave.type).split(' ')[0]}`}>
                                 {getLeaveIcon(leave.type)}
                             </div>
                         </div>
                         
                         <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-extrabold text-gunmetal-900">{remaining}</span>
                            <span className="text-sm font-medium text-slate-grey-600 mb-1.5">days remaining</span>
                         </div>

                         {/* Mini Progress Bar */}
                         <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full ${getLeaveColor(leave.type).split(' ')[0].replace('text', 'bg')}`} 
                                style={{ width: `${percentageUsed}%` }}
                             ></div>
                         </div>
                         <div className="flex justify-between mt-1.5">
                            <span className="text-xs font-medium text-slate-grey-500">Used: {leave.used}</span>
                            <span className="text-xs font-medium text-slate-grey-500">{percentageUsed.toFixed(0)}% Utilized</span>
                         </div>
                    </div>
                );
            })}
          </div>

          <h3 className="text-lg font-bold text-gunmetal-900 mb-4 px-1">Used Leaves History</h3>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="relative group">
               <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <select
                 value={selectedLeaveType}
                 onChange={(e) => {
                   setSelectedLeaveType(e.target.value);
                   setCurrentPage(1);
                 }}
                 className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
               >
                 <option value="All">All Leave Types</option>
                 {leaveBalances.map((leave) => (
                   <option key={leave.type} value={leave.type}>{leave.type}</option>
                 ))}
               </select>
            </div>

            <div className="relative group">
               <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <input
                 type="date"
                 value={fromDate}
                 onChange={(e) => {
                   setFromDate(e.target.value);
                   setCurrentPage(1);
                 }}
                 className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
               />
            </div>

            <div className="relative group">
               <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <input
                 type="date"
                 value={toDate}
                 onChange={(e) => {
                   setToDate(e.target.value);
                   setCurrentPage(1);
                 }}
                 className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
               />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm mb-6">
            <table className="w-full text-left bg-white border-collapse">
              <thead className="bg-alabaster-grey-50">
                <tr>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center w-16">No.</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Type</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Duration</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Days</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-platinum-100">
                {paginatedDetails.length > 0 ? (
                  paginatedDetails.map((detail, index) => (
                    <tr key={detail.id} className="hover:bg-alabaster-grey-50/50 transition-colors">
                      <td className="py-4 px-4 text-sm text-slate-grey-500 text-center font-mono">
                         {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-gunmetal-900">
                          {detail.leaveType}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-grey-600 text-center font-mono">
                          {new Date(detail.startDate).toLocaleDateString()} - {new Date(detail.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-gunmetal-900 text-center ">
                          {detail.totalDays}
                      </td>
                      <td className="py-4 px-4 text-center">
                         <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                             {detail.status}
                         </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-grey-500">
                        No leave history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                    {[2, 5, 10, 20].map((option) => (
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

export default LeavesAvailable;
