// UserShiftManagement.tsx

import React, { useEffect, useState } from "react";
import { FaFilter, FaSearch, FaSpinner, FaInbox } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

interface UserShiftData {
  _id: string;
  name: string;
  department: string;
  jobTitle: string;
  shiftTimings?: string;
}

const departmentOptions = [
  "Account Management",
  "Project Management",
  "Content Production",
  "Book Marketing",
  "Design Production",
  "SEO",
  "Creative Media",
  "Web Development",
  "Paid Advertising",
  "Software Production",
  "IT & Networking",
  "Human Resource",
  "Training & Development",
  "Admin",
  "Finance",
  "Brand Development",
  "Corporate Communication",
  "Lead Generation",
];

const jobTitleOptions = [
  "Executive",
  "Senior Executive",
  "Assistant Manager",
  "Associate Manager",
  "Manager",
  "Senior Manager",
  "Assistant Vice President",
  "Associate Vice President",
  "Vice President",
  "Senior Vice President",
  "President",
  "Head of Department",
  "Head Of Project Management",
];

const additionalShiftTimings = [
  "9:00 AM - 5:30 PM",
  "10:00 AM - 6:30 PM",
  "11:00 AM - 7:30 PM",
  "12:00 PM - 8:30 PM",
  "1:00 PM - 9:30 PM",
  "2:00 PM - 10:30 PM",
  "3:00 PM - 11:30 PM",
  "4:00 PM - 12:30 AM",
  "5:00 PM - 1:30 AM",
  "6:00 PM - 2:30 AM",
  "7:00 PM - 3:30 AM",
  "8:00 PM - 4:30 AM",
  "9:00 PM - 5:30 AM",
];

const UserShiftManagement: React.FC = () => {
  const [data, setData] = useState<UserShiftData[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    jobTitle: "",
    shiftTimings: "",
  });
  const [editedShifts, setEditedShifts] = useState<{ [key: string]: string }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [shiftOptions, setShiftOptions] = useState<
    { label: string; timing: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUserShifts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/users/getAllUserShifts`,
          {
            withCredentials: true,
          }
        );
        setData(response.data.users);

        const uniqueShifts = Array.from(
          new Set(
            response.data.users.map((user: UserShiftData) => user.shiftTimings)
          )
        ) as string[];

        const allShiftTimings = [...uniqueShifts, ...additionalShiftTimings];
        const mappedShifts = allShiftTimings.map((shift: string) => ({
          label: shift,
          timing: shift,
        }));
        setShiftOptions(mappedShifts);
      } catch (error: any) {
        console.error("Error fetching user shifts:", error);
        toast.error("Failed to fetch user shift timings.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserShifts();
  }, [backendUrl]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleShiftChange = (id: string, newShift: string) => {
    setEditedShifts((prev) => ({ ...prev, [id]: newShift }));
  };

  const handleUpdate = async (id: string) => {
    if (editedShifts[id]) {
      const payload = { userId: id, shiftTimings: editedShifts[id] };
      console.log("Updating shift with payload:", payload); // Debugging
      setUpdating((prev) => ({ ...prev, [id]: true })); // Set updating to true for this user
      try {
        await axios.put(`${backendUrl}/api/users/shift`, payload, {
          withCredentials: true,
        });
        setData((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, shiftTimings: editedShifts[id] } : item
          )
        );
        setEditedShifts((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        toast.success("Shift timings updated successfully!");
      } catch (error: any) {
        console.error("Error updating shift:", error);
        toast.error(
          error.response?.data?.message || "Failed to update shift timings."
        );
      } finally {
        setUpdating((prev) => ({ ...prev, [id]: false })); // Set updating to false for this user
      }
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
    const matchesShift =
      !filters.shiftTimings || user.shiftTimings === filters.shiftTimings;

    return (
      matchesSearch && matchesDepartment && matchesJobTitle && matchesShift
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        User Shift Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Filter Inputs */}
        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
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
        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
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
        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
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
        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            name="shiftTimings"
            value={filters.shiftTimings}
            onChange={handleFilterChange}
            className="w-full border-none focus:outline-none"
          >
            <option value="">Filter by Shift</option>
            {shiftOptions.map((shiftTimings) => (
              <option key={shiftTimings.timing} value={shiftTimings.timing}>
                {shiftTimings.label}
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
              {[
                "S.No",
                "Employee Name",
                "Department",
                "Job Title",
                "Shift Timings",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="text-left px-4 py-2 text-sm font-medium"
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
            ) : currentData.length > 0 ? (
              currentData.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {user.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {user.department}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {user.jobTitle}
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={editedShifts[user._id] || user.shiftTimings || ""}
                      onChange={(e) =>
                        handleShiftChange(user._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg p-1 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="" disabled>
                        {user.shiftTimings
                          ? "Select Shift"
                          : `Select shift for ${user.name}`}
                      </option>
                      {shiftOptions.map((shift) => (
                        <option key={shift.timing} value={shift.timing}>
                          {shift.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    {editedShifts[user._id] ? (
                      <button
                        onClick={() => handleUpdate(user._id)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-2 focus:ring-blue-500"
                        disabled={updating[user._id]}
                      >
                        {updating[user._id] ? (
                          <FaSpinner className="animate-spin" size={16} />
                        ) : (
                          "Update"
                        )}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500 ml-3">
                        {user.shiftTimings ? "Updated" : "No Shift Assigned"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <FaInbox size={30} className="text-gray-400 mb-2" />
                    <span className="text-md font-medium">No users found.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserShiftManagement;
