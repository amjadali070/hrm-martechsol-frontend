import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaFilter,
  FaInbox,
  FaSearch,
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaUmbrellaBeach,
  FaSave,
  FaTimes
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { formatDate } from "../../utils/formatDate";
import { toast } from "react-toastify";

interface Holiday {
  _id: number;
  fromDate: string;
  toDate: string | null;
  holidayName: string;
  description: string;
}

const HolidayManagement: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [form, setForm] = useState({
    _id: 0,
    fromDate: "",
    toDate: "",
    holidayName: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({ search: "", date: "", month: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/holidays`, {
        withCredentials: true,
      });
      setHolidays(response.data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddOrUpdate = async () => {
    if (isEditing) {
      try {
        await axios.put(
          `${backendUrl}/api/holidays/${form._id}`,
          {
            ...form,
            toDate: form.toDate || null,
          },
          { withCredentials: true }
        );

        setHolidays((prev) =>
          prev.map((holiday) =>
            holiday._id === form._id
              ? { ...holiday, ...form, toDate: form.toDate || null }
              : holiday
          )
        );
        toast.success("Holiday updated successfully.");
        setIsEditing(false);
      } catch (error) {
        toast.error("Error updating holiday.");
        console.error("Error updating holiday:", error);
      }
    } else {
      try {
        const response = await axios.post(
          `${backendUrl}/api/holidays`,
          {
            ...form,
            toDate: form.toDate || null,
          },
          { withCredentials: true }
        );
        toast.success("Holiday added successfully.");
        setHolidays((prev) => [...prev, response.data]);
      } catch (error) {
        toast.error("Error adding holiday.");
        console.error("Error adding holiday:", error);
      }
    }
    setForm({
      _id: 0,
      fromDate: "",
      toDate: "",
      holidayName: "",
      description: "",
    });
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleEdit = (holiday: Holiday) => {
    setForm({
      _id: holiday._id,
      fromDate: formatDateForInput(holiday.fromDate),
      toDate: holiday.toDate ? formatDateForInput(holiday.toDate) : "",
      holidayName: holiday.holidayName,
      description: holiday.description,
    });
    setIsEditing(true);
  };

  const handleDelete = async (_id: number) => {
    if(!window.confirm("Are you sure you want to delete this holiday?")) return;

    try {
      await axios.delete(`${backendUrl}/api/holidays/${_id}`, {
        withCredentials: true,
      });
      toast.success("Holiday deleted successfully.");
      setHolidays((prev) => prev.filter((holiday) => holiday._id !== _id));
    } catch (error) {
      toast.error("Error deleting holiday.");
      console.error("Error deleting holiday:", error);
    }
  };

  const applyFilters = () => {
    return holidays.filter((holiday) => {
      const searchFilter =
        holiday.holidayName
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        holiday.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        holiday.fromDate.includes(filters.search) ||
        (holiday.toDate && holiday.toDate.includes(filters.search));

      const dateFilter = filters.date
        ? holiday.fromDate === filters.date || holiday.toDate === filters.date
        : true;

      const monthFilter = filters.month
        ? new Date(holiday.fromDate).getMonth() + 1 === parseInt(filters.month)
        : true;

      return searchFilter && dateFilter && monthFilter;
    });
  };

  const filteredHolidays = applyFilters();
  const totalPages = Math.ceil(filteredHolidays.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHolidays = filteredHolidays.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleCancelEdit = () => {
    setIsEditing(false);
    setForm({
        _id: 0,
        fromDate: "",
        toDate: "",
        holidayName: "",
        description: "",
    });
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-platinum-200 p-6 flex flex-col mb-8 gap-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-platinum-200 pb-6">
         <div className="flex items-center gap-4">
             <div className="bg-gunmetal-50 p-3.5 rounded-2xl border border-platinum-200 shadow-inner">
               <FaUmbrellaBeach className="text-gunmetal-600 text-2xl" />
             </div>
             <div>
                <h2 className="text-2xl font-extrabold text-gunmetal-900 tracking-tight">
                    Holiday Management
                </h2>
                <p className="text-sm text-slate-grey-500 font-medium">
                    Configure and manage the annual company holiday calendar.
                </p>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
            <div className="bg-alabaster-grey-50 rounded-2xl p-6 border border-platinum-200 shadow-sm sticky top-6">
               <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-gunmetal-900 flex items-center gap-2 text-lg">
                     {isEditing ? <FaEdit className="text-amber-500" /> : <FaPlus className="text-emerald-500" />}
                     {isEditing ? "Edit Holiday" : "New Holiday"}
                   </h3>
                   {isEditing && (
                       <button onClick={handleCancelEdit} className="text-xs font-bold text-slate-grey-500 hover:text-rose-500 flex items-center gap-1 transition-colors">
                           <FaTimes /> Cancel
                       </button>
                   )}
               </div>
               
               <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1.5 ml-1">
                      Event Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Annual Company Retreat"
                      value={form.holidayName}
                      onChange={(e) =>
                        setForm({ ...form, holidayName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white border border-platinum-200 rounded-xl text-sm font-medium text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all shadow-sm placeholder:text-slate-grey-300"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1.5 ml-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={form.fromDate}
                          onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                          className="w-full px-3 py-2.5 bg-white border border-platinum-200 rounded-xl text-sm font-medium text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all font-mono shadow-sm"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1.5 ml-1">
                          End Date <span className="text-slate-grey-400 font-normal lowercase">(opt)</span>
                        </label>
                        <input
                          type="date"
                          value={form.toDate}
                          onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                          className="w-full px-3 py-2.5 bg-white border border-platinum-200 rounded-xl text-sm font-medium text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all font-mono shadow-sm"
                        />
                     </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1.5 ml-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Additional details about the event..."
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-platinum-200 rounded-xl text-sm font-medium text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all min-h-[100px] resize-none shadow-sm placeholder:text-slate-grey-300"
                    />
                  </div>
                  
                  <div className="pt-2">
                      <button
                        onClick={handleAddOrUpdate}
                        disabled={!form.holidayName || !form.fromDate}
                        className={`w-full py-3 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 ${
                            isEditing
                            ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                            : "bg-gunmetal-900 hover:bg-gunmetal-800 shadow-gunmetal-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        }`}
                        >
                        {isEditing ? <FaSave /> : <FaPlus />}
                        {isEditing ? "Update Event" : "Create Event"}
                      </button>
                  </div>
               </div>
            </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
             {/* Filters */}
             <div className="flex flex-col sm:flex-row gap-4 bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200">
                <div className="relative group flex-1">
                   <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                   <input
                    type="text"
                    name="search"
                    placeholder="Search holidays..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                  />
                </div>
                
                <div className="relative group sm:w-48">
                   <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                   <select
                    value={filters.month}
                    onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                    className="w-full pl-10 pr-8 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All Months</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        {new Date(2024, month - 1).toLocaleString("default", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
             </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-platinum-200 shadow-sm bg-white">
                <table className="w-full text-left bg-white border-collapse">
                  <thead className="bg-alabaster-grey-50 border-b border-platinum-200">
                    <tr>
                      <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Date</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Event Details</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-center w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-platinum-100">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="text-center py-16 text-slate-grey-400">
                           <div className="flex flex-col items-center justify-center animate-pulse gap-3">
                               <FaSpinner className="animate-spin text-gunmetal-500 text-2xl" />
                               <span className="text-sm font-medium">Loading calendar...</span>
                           </div>
                        </td>
                      </tr>
                    ) : currentHolidays.length > 0 ? (
                      currentHolidays.map((holiday) => (
                        <tr key={holiday._id} className="hover:bg-alabaster-grey-50/50 transition-colors group">
                          <td className="py-5 px-6 align-top w-56">
                             <div className="flex flex-col gap-1.5">
                                 <div className="flex items-center gap-2 text-gunmetal-900 font-bold font-mono">
                                    <FaCalendarAlt className="text-slate-grey-400 text-xs" />
                                    {formatDate(holiday.fromDate)}
                                 </div>
                                 {holiday.toDate && (
                                     <span className="text-xs text-slate-grey-500 font-mono ml-5 border-l-2 border-platinum-200 pl-2">
                                         to {formatDate(holiday.toDate)}
                                     </span>
                                 )}
                                 {!holiday.toDate && (
                                     <span className="ml-5 text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit border border-emerald-100">
                                         Single Day
                                     </span>
                                 )}
                             </div>
                          </td>
                          <td className="py-5 px-6 align-top">
                            <h4 className="text-base font-bold text-gunmetal-900 mb-1.5">{holiday.holidayName}</h4>
                            <p className="text-sm text-slate-grey-600 leading-relaxed max-w-prose">{holiday.description}</p>
                          </td>
                          <td className="py-5 px-6 align-top text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(holiday)}
                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(holiday._id)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                                title="Delete"
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-16 text-slate-grey-400">
                           <div className="flex flex-col items-center justify-center">
                               <div className="w-16 h-16 bg-alabaster-grey-50 rounded-full flex items-center justify-center mb-4 border border-platinum-200">
                                   <FaInbox className="text-slate-grey-300 text-3xl" />
                               </div>
                               <span className="text-gunmetal-900 font-bold text-lg">No holidays found</span>
                               <p className="text-slate-grey-500 text-sm mt-1 max-w-xs mx-auto">
                                   No holidays match your search or none have been added yet.
                               </p>
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            {filteredHolidays.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-platinum-200 pt-2 px-1">
                     <span className="text-sm font-medium text-slate-grey-500">
                         Showing <span className="font-bold text-gunmetal-900">{indexOfFirstItem + 1}</span> to <span className="font-bold text-gunmetal-900">{Math.min(indexOfLastItem, filteredHolidays.length)}</span> of <span className="font-bold text-gunmetal-900">{filteredHolidays.length}</span> entries
                     </span>
                     <div className="flex items-center gap-2">
                         <button
                           className={`p-2 rounded-lg border border-platinum-200 transition-all ${
                             currentPage === 1 
                                ? "bg-platinum-50 text-slate-grey-300 cursor-not-allowed" 
                                : "bg-white text-slate-grey-600 hover:bg-gunmetal-50 hover:text-gunmetal-900 hover:border-gunmetal-200 shadow-sm"
                           }`}
                           disabled={currentPage === 1}
                           onClick={handlePrevious}
                           aria-label="Previous Page"
                         >
                           <FiChevronLeft size={18} />
                         </button>
                         
                         <span className="text-sm font-bold text-gunmetal-900 px-2">
                            Page {currentPage} of {totalPages}
                         </span>

                         <button
                           className={`p-2 rounded-lg border border-platinum-200 transition-all ${
                             currentPage === totalPages 
                                ? "bg-platinum-50 text-slate-grey-300 cursor-not-allowed" 
                                : "bg-white text-slate-grey-600 hover:bg-gunmetal-50 hover:text-gunmetal-900 hover:border-gunmetal-200 shadow-sm"
                           }`}
                           disabled={currentPage === totalPages}
                           onClick={handleNext}
                           aria-label="Next Page"
                         >
                           <FiChevronRight size={18} />
                         </button>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HolidayManagement;
