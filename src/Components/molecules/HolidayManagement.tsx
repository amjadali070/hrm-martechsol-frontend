import React, { useState } from "react";
import { FaInbox } from "react-icons/fa";

interface Holiday {
  id: number;
  fromDate: string;
  toDate: string | null; // Null indicates a single-day holiday
  name: string;
  description: string;
}

const HolidayManagement: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: 1, fromDate: "2024-01-01", toDate: null, name: "New Year's Day", description: "Celebration of the New Year." },
    { id: 2, fromDate: "2024-07-04", toDate: "2024-07-06", name: "Independence Weekend", description: "National holiday in the USA." },
    { id: 3, fromDate: "2024-12-25", toDate: null, name: "Christmas Day", description: "Celebration of Christmas." },
  ]);

  const [form, setForm] = useState({ id: 0, fromDate: "", toDate: "", name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({ search: "", date: "", month: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleAddOrUpdate = () => {
    if (isEditing) {
      setHolidays((prev) =>
        prev.map((holiday) =>
          holiday.id === form.id
            ? { ...holiday, ...form, toDate: form.toDate || null }
            : holiday
        )
      );
      setIsEditing(false);
    } else {
      setHolidays((prev) => [
        ...prev,
        { ...form, id: Date.now(), toDate: form.toDate || null },
      ]);
    }
    setForm({ id: 0, fromDate: "", toDate: "", name: "", description: "" });
  };

  const handleEdit = (holiday: Holiday) => {
    setForm({
      ...holiday,
      toDate: holiday.toDate || "",
    });
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
  };

  const applyFilters = () => {
    return holidays.filter((holiday) => {
      const searchFilter =
        holiday.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        holiday.description.toLowerCase().includes(filters.search.toLowerCase()) ||
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
  const currentHolidays = filteredHolidays.slice(indexOfFirstItem, indexOfLastItem);

  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Holiday Management</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-bold mb-4">{isEditing ? "Edit Holiday" : "Add New Holiday"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={form.fromDate}
              onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date (Optional)</label>
            <input
              type="date"
              value={form.toDate}
              onChange={(e) => setForm({ ...form, toDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Holiday Name</label>
            <input
              type="text"
              placeholder="Holiday Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          onClick={handleAddOrUpdate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          {isEditing ? "Update Holiday" : "Add Holiday"}
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by holiday name, description"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(2024, month - 1).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {/* Holiday List */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300 rounded-lg">
          <thead className="bg-purple-900">
            <tr>
              {["S.No", "From Date", "To Date", "Holiday Name", "Description", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-sm font-medium text-white"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentHolidays.length > 0 ? (
              currentHolidays.map((holiday, index) => (
                <tr key={holiday.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 text-sm text-gray-800">{indexOfFirstItem + index + 1}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{holiday.fromDate}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">
                    {holiday.toDate || "Single Day"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800">{holiday.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{holiday.description}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 flex space-x-4">
                    <button
                      onClick={() => handleEdit(holiday)}
                      className="px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(holiday.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                   className="text-center py-8 text-gray-500"
                >
                <div className="flex flex-col items-center justify-center">
                  <FaInbox size={40} className="text-gray-400 mb-2" />
                  <span className="text-md font-medium"> No holidays found.</span>
                </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Show:</span>
            <select
              className="text-sm border border-gray-300 rounded-md"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1); // Reset to the first page when items per page changes
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