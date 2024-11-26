import React, { useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";

interface UserShiftData {
  id: number;
  name: string;
  department: string;
  jobTitle: string;
  shift: string;
}

const shiftOptions = [
  { label: "Morning", timing: "6:00 AM - 2:00 PM" },
  { label: "Evening", timing: "2:00 PM - 10:00 PM" },
  { label: "Night", timing: "10:00 PM - 6:00 AM" },
  { label: "Flexible", timing: "6:00 PM - 2:30 AM" },
];

const departmentOptions = ["HR", "Engineering", "Sales", "Marketing"];
const jobTitleOptions = ["Manager", "Developer", "Analyst", "Designer"];

const initialData: UserShiftData[] = [
  { id: 1, name: "John Doe", department: "Engineering", jobTitle: "Developer", shift: "6:00 AM - 2:00 PM" },
  { id: 2, name: "Jane Smith", department: "HR", jobTitle: "Manager", shift: "2:00 PM - 10:00 PM" },
  { id: 3, name: "Alice Brown", department: "Sales", jobTitle: "Analyst", shift: "10:00 PM - 6:00 AM" },
  { id: 4, name: "Bob Johnson", department: "Marketing", jobTitle: "Designer", shift: "6:00 PM - 2:30 AM" },
];

const UserShiftManagement: React.FC = () => {
  const [data, setData] = useState<UserShiftData[]>(initialData);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    jobTitle: "",
    shift: "",
  });
  const [editedShifts, setEditedShifts] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleShiftChange = (id: number, newShift: string) => {
    setEditedShifts((prev) => ({ ...prev, [id]: newShift }));
  };

  const handleUpdate = (id: number) => {
    if (editedShifts[id]) {
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, shift: editedShifts[id] } : item
        )
      );
      setEditedShifts((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  const filteredData = data.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesDepartment =
      !filters.department || user.department === filters.department;
    const matchesJobTitle =
      !filters.jobTitle || user.jobTitle === filters.jobTitle;
    const matchesShift = !filters.shift || user.shift === filters.shift;

    return matchesSearch && matchesDepartment && matchesJobTitle && matchesShift;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        User Shift Management
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center bg-white rounded-lg px-3 py-2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            name="search"
            placeholder="Search by name"
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full border-none focus:outline-none"
          />
        </div>
        <div className="flex items-center bg-white rounded-lg px-3 py-2">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="w-full border-none focus:outline-none"
          >
            <option value="">Filter by Department</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center bg-white rounded-lg px-3 py-2">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            name="jobTitle"
            value={filters.jobTitle}
            onChange={handleFilterChange}
            className="w-full border-none focus:outline-none"
          >
            <option value="">Filter by Job Title</option>
            {jobTitleOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center bg-white rounded-lg px-3 py-2">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            name="shift"
            value={filters.shift}
            onChange={handleFilterChange}
            className="w-full border-none focus:outline-none"
          >
            <option value="">Filter by Shift</option>
            {shiftOptions.map((shift) => (
              <option key={shift.timing} value={shift.timing}>
                {shift.timing}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg">
          <thead className="bg-purple-900 text-white">
            <tr>
              {["S.No", "Employee Name", "Department", "Job Title", "Shift", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="text-left px-4 py-2 text-sm font-medium"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((user, index) => (
              <tr
                key={user.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-sm text-gray-600">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{user.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{user.department}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{user.jobTitle}</td>
                <td className="px-4 py-2">
                  <select
                    value={editedShifts[user.id] || user.shift}
                    onChange={(e) => handleShiftChange(user.id, e.target.value)}
                    className="border border-gray-300 rounded-lg p-1 focus:ring-2 focus:ring-purple-500"
                  >
                    {shiftOptions.map((shift) => (
                      <option key={shift.timing} value={shift.timing}>
                        {shift.timing}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-2">
                  {editedShifts[user.id] ? (
                    <button
                      onClick={() => handleUpdate(user.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-2 focus:ring-blue-500"
                    >
                      Update
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500 ml-3">Updated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserShiftManagement;