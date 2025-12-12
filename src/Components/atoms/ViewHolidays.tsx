import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaFilter, FaInbox, FaSpinner, FaUmbrellaBeach, FaRegCalendarCheck } from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";
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
  const [userFilter] = useState<string>("All"); // Kept for logic consistency, though not fully used in UI
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: userLoading } = useUser();
  const user_Id = user?._id;
  const userRole = user?.role;
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

        // Use the 'all' endpoint for broader access or specific filtering if needed
        endpoint = `${backendUrl}/api/holidays/all`;
        params.user = userFilter;

        if (fromDate) params.startDate = fromDate;
        if (toDate) params.endDate = toDate;

        const { data } = await axiosInstance.get(endpoint, { params });

        setHolidays(data);
        setFilteredHolidays(data);
      } catch (error: any) {
        console.error("Error fetching holidays:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading && user_Id) {
      fetchHolidays();
    }
  }, [fromDate, toDate, user_Id, userLoading, backendUrl, userFilter, userRole]);

  // Apply filters
  useEffect(() => {
    let data = [...holidays];

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

    if (nameFilter !== "All") {
      data = data.filter((holiday) => holiday.holidayName === nameFilter);
    }

    setFilteredHolidays(data);
    setCurrentPage(1);
  }, [fromDate, toDate, nameFilter, userFilter, holidays, userRole]);

  // Pagination
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

  const calculateTotalDays = (start: string, end: string | null): number => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : startDate;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getHolidayStatus = (start: string, end: string | null): string => {
    const today = new Date();
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0); 
    
    // Parse start date
    const holidayStart = new Date(start);
    holidayStart.setHours(0, 0, 0, 0);

    // Parse end date (or default to start date)
    const holidayEnd = end ? new Date(end) : new Date(start);
    holidayEnd.setHours(23, 59, 59, 999); // End date includes the full day

    if (today >= holidayStart && today <= holidayEnd) {
        return "Ongoing";
    } else if (today > holidayEnd) {
        return "Passed";
    } else {
        return "Upcoming";
    }
};

  const uniqueHolidayNames = Array.from(
    new Set(holidays.map((holiday) => holiday.holidayName))
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 flex flex-col mb-8 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
            <FaUmbrellaBeach className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              View Holidays
            </h2>
            <p className="text-sm text-slate-grey-500">
              Check upcoming public holidays and events.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FaSpinner className="text-gunmetal-500 mb-4 animate-spin" size={40} />
          <p className="text-slate-grey-500 font-medium">Loading holiday calendar...</p>
        </div>
      ) : (
        <>
           {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="relative group">
               <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
                placeholder="From"
              />
            </div>

            <div className="relative group">
               <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
                placeholder="To"
              />
            </div>

            <div className="relative group">
               <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
               <select
                 value={nameFilter}
                 onChange={(e) => setNameFilter(e.target.value)}
                 className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
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

          {currentData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-platinum-200 rounded-xl bg-alabaster-grey-50/50">
                <FaInbox size={48} className="text-slate-grey-300 mb-3" />
                <h3 className="text-lg font-bold text-gunmetal-800">No holidays found</h3>
                <p className="text-slate-grey-500 text-sm mt-1">
                    There are no holidays matching your criteria.
                </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
                <table className="w-full text-left bg-white border-collapse">
                  <thead className="bg-alabaster-grey-50">
                    <tr>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center w-16">No.</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Holiday Name</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Start Date</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">End Date</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Days</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">Status</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-platinum-100">
                    {currentData.map((holiday, index) => {
                        const status = getHolidayStatus(holiday.fromDate, holiday.toDate);
                        return (
                            <tr key={holiday._id} className="hover:bg-alabaster-grey-50/50 transition-colors">
                                <td className="py-4 px-4 text-sm text-slate-grey-500 text-center font-mono">
                                    {indexOfFirstItem + index + 1}
                                </td>
                                <td className="py-4 px-4 text-sm font-bold text-gunmetal-900">
                                    {holiday.holidayName}
                                </td>
                                <td className="py-4 px-4 text-sm text-slate-grey-600 font-mono whitespace-nowrap">
                                    {new Date(holiday.fromDate).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4 text-sm text-slate-grey-600 font-mono whitespace-nowrap">
                                    {holiday.toDate ? new Date(holiday.toDate).toLocaleDateString() : "-"}
                                </td>
                                <td className="py-4 px-4 text-sm font-bold text-gunmetal-900 text-center">
                                    {calculateTotalDays(holiday.fromDate, holiday.toDate)}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <span
                                    className={`inline-block px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm ${
                                        status === "Upcoming"
                                        ? "bg-emerald-500"
                                        : status === "Ongoing"
                                        ? "bg-amber-500"
                                        : "bg-slate-400"
                                    }`}
                                    >
                                    {status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-sm text-slate-grey-600 max-w-xs truncate" title={holiday.description}>
                                    {holiday.description}
                                </td>
                            </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>

               {/* Pagination */}
               <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                 <div className="flex items-center gap-2 text-sm text-slate-grey-600 bg-alabaster-grey-50 px-3 py-1.5 rounded-lg border border-platinum-200">
                    <span className="font-medium">Rows:</span>
                    <select
                        className="bg-transparent border-none focus:outline-none font-semibold text-gunmetal-800 cursor-pointer"
                        value={itemsPerPage}
                        onChange={(e) => {
                        setItemsPerPage(parseInt(e.target.value));
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
        </>
      )}
    </div>
  );
};

export default ViewHolidays;
