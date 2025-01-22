import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaFilter,
  FaInbox,
  FaSearch,
  FaSpinner,
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
  const [itemsPerPage, setItemsPerPage] = useState(5);
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

  return (
    <div className="w-full p-6 bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Holiday Management</h1>

      <div className="p-4 rounded-lg mb-6">
        <h2 className="text-lg font-bold mb-4">
          {isEditing ? "Edit Holiday" : "Add New Holiday"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              value={form.fromDate}
              onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              To Date (Optional)
            </label>
            <input
              type="date"
              value={form.toDate}
              onChange={(e) => setForm({ ...form, toDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Holiday Name
            </label>
            <input
              type="text"
              placeholder="Holiday Name"
              value={form.holidayName}
              onChange={(e) =>
                setForm({ ...form, holidayName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          onClick={handleAddOrUpdate}
          className={`mt-4 px-4 py-2 text-white rounded-full hover:bg-opacity-90 ${
            isEditing
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isEditing ? "Update Holiday" : "Add Holiday"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            name="search"
            placeholder="Search by holiday name, description"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
          <FaCalendarAlt className="text-gray-400 mr-2" />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="">Select Month</option>
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

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead className="bg-purple-900">
            <tr>
              {[
                "S.No",
                "From Date",
                "To Date",
                "Holiday Name",
                "Description",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-center text-sm font-medium text-white"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-blue-600">
                  <div className="flex flex-col items-center justify-center">
                    <FaSpinner
                      className="text-blue-500 mb-4 animate-spin"
                      size={30}
                    />
                  </div>
                </td>
              </tr>
            ) : currentHolidays.length > 0 ? (
              currentHolidays.map((holiday, index) => (
                <tr key={holiday._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm text-gray-800 text-center">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 text-center">
                    {formatDate(holiday.fromDate)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 text-center">
                    {holiday.toDate ? formatDate(holiday.toDate) : "Single Day"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 text-center">
                    {holiday.holidayName}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 text-center">
                    {holiday.description}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 flex space-x-4 text-center">
                    <button
                      onClick={() => handleEdit(holiday)}
                      className="px-3 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(holiday._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={30} className="text-gray-400 mb-2" />
                    <span className="text-md font-medium">
                      No holidays found.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Show:</span>
            <select
              className="text-sm border border-gray-300 rounded-md"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
              disabled={currentPage === 1}
              onClick={handlePrevious}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`px-3 py-1 text-sm rounded-full ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={currentPage === totalPages}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayManagement;
