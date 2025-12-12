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
} from "react-icons/fa";
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
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8 gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex items-center gap-3">
             <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
               <FaUmbrellaBeach className="text-gunmetal-600 text-xl" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                    Holiday Management
                </h2>
                <p className="text-sm text-slate-grey-500">
                    Configure and manage the company holiday calendar.
                </p>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
            <div className="bg-alabaster-grey-50 rounded-xl p-5 border border-platinum-200 shadow-sm sticky top-6">
               <h3 className="font-bold text-gunmetal-900 mb-4 flex items-center gap-2">
                 {isEditing ? <FaEdit className="text-amber-500" /> : <FaPlus className="text-emerald-500" />}
                 {isEditing ? "Edit Holiday" : "Add New Holiday"}
               </h3>
               
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1">
                      Event Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Annual Company Retreat"
                      value={form.holidayName}
                      onChange={(e) =>
                        setForm({ ...form, holidayName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-platinum-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={form.fromDate}
                          onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-platinum-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all font-mono"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1">
                          End Date <span className="text-slate-grey-400 font-normal lowercase">(opt)</span>
                        </label>
                        <input
                          type="date"
                          value={form.toDate}
                          onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-platinum-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all font-mono"
                        />
                     </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Additional details about the event..."
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-platinum-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all min-h-[80px] resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleAddOrUpdate}
                        disabled={!form.holidayName || !form.fromDate}
                        className={`flex-1 py-2 text-white font-semibold rounded-lg shadow-sm transition-all text-sm ${
                            isEditing
                            ? "bg-amber-500 hover:bg-amber-600"
                            : "bg-gunmetal-900 hover:bg-gunmetal-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                        >
                        {isEditing ? "Update Event" : "Create Event"}
                      </button>
                      
                      {isEditing && (
                          <button 
                             onClick={handleCancelEdit}
                             className="px-4 py-2 bg-white border border-platinum-200 text-slate-grey-600 font-semibold rounded-lg hover:bg-platinum-50 transition-all text-sm"
                          >
                              Cancel
                          </button>
                      )}
                  </div>
               </div>
            </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 flex flex-col gap-4">
             {/* Filters */}
             <div className="flex flex-col sm:flex-row gap-3 bg-white p-1">
                <div className="relative group flex-1">
                   <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                   <input
                    type="text"
                    name="search"
                    placeholder="Search holidays..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                  />
                </div>
                
                <div className="relative group sm:w-40">
                   <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
                   <select
                    value={filters.month}
                    onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                    className="w-full pl-9 pr-8 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All Months</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        {new Date(2024, month - 1).toLocaleString("default", {
                          month: "short",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
             </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
                <table className="w-full text-left bg-white border-collapse">
                  <thead className="bg-alabaster-grey-50">
                    <tr>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Date</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">Event Details</th>
                      <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 w-24 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-platinum-100">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="text-center py-12 text-slate-grey-400">
                           <FaSpinner className="animate-spin h-6 w-6 mx-auto mb-2 text-gunmetal-500" />
                           <span className="text-sm">Loading calendar...</span>
                        </td>
                      </tr>
                    ) : currentHolidays.length > 0 ? (
                      currentHolidays.map((holiday) => (
                        <tr key={holiday._id} className="hover:bg-alabaster-grey-50/50 transition-colors group">
                          <td className="py-4 px-4 align-top w-48">
                             <div className="flex flex-col gap-1">
                                 <span className="text-sm font-bold text-gunmetal-900 font-mono">
                                     {formatDate(holiday.fromDate)}
                                 </span>
                                 {holiday.toDate && (
                                     <span className="text-xs text-slate-grey-500 font-mono">
                                         to {formatDate(holiday.toDate)}
                                     </span>
                                 )}
                                 {!holiday.toDate && (
                                     <span className="text-[10px] uppercase font-bold tracking-wider text-slate-grey-400 bg-platinum-100 px-1.5 py-0.5 rounded w-fit">
                                         Single Day
                                     </span>
                                 )}
                             </div>
                          </td>
                          <td className="py-4 px-4 align-top">
                            <h4 className="text-sm font-bold text-gunmetal-800 mb-1">{holiday.holidayName}</h4>
                            <p className="text-sm text-slate-grey-600 leading-relaxed">{holiday.description}</p>
                          </td>
                          <td className="py-4 px-4 align-top text-center">
                            <div className="flex justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(holiday)}
                                className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(holiday._id)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
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
                        <td colSpan={3} className="text-center py-12 text-slate-grey-400">
                           <div className="flex flex-col items-center">
                               <FaInbox size={32} className="opacity-50 mb-2" />
                               <span className="text-sm font-medium">No holidays scheduled.</span>
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            {filteredHolidays.length > 0 && (
                <div className="flex justify-between items-center border-t border-platinum-200 pt-4">
                     <span className="text-xs text-slate-grey-500">
                         Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredHolidays.length)} of {filteredHolidays.length}
                     </span>
                     <div className="flex items-center gap-2">
                         <button
                           className={`px-3 py-1 text-xs font-semibold rounded border border-platinum-200 transition-all ${
                             currentPage === 1 ? "bg-platinum-50 text-slate-grey-400 cursor-not-allowed" : "bg-white text-gunmetal-600 hover:bg-platinum-50"
                           }`}
                           disabled={currentPage === 1}
                           onClick={handlePrevious}
                         >
                           Previous
                         </button>
                         <button
                           className={`px-3 py-1 text-xs font-semibold rounded border border-platinum-200 transition-all ${
                             currentPage === totalPages ? "bg-platinum-50 text-slate-grey-400 cursor-not-allowed" : "bg-white text-gunmetal-600 hover:bg-platinum-50"
                           }`}
                           disabled={currentPage === totalPages}
                           onClick={handleNext}
                         >
                           Next
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
