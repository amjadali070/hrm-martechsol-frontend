import React, { useEffect, useState } from "react";
import { FaFilter, FaSearch, FaSpinner, FaInbox, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface UserShiftData {
  _id: string;
  name: string;
  department: string;
  jobTitle: string;
  shiftStartTime?: string; // e.g., "9:00 AM"
  shiftEndTime?: string; // e.g., "5:30 PM"
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
  "Administration",
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
  "Chief Executive Officer",
];

const additionalShiftTimings = [
  { label: "9:00 AM - 5:30 PM", start: "9:00 AM", end: "5:30 PM" },
  { label: "10:00 AM - 6:30 PM", start: "10:00 AM", end: "6:30 PM" },
  { label: "11:00 AM - 7:30 PM", start: "11:00 AM", end: "7:30 PM" },
  { label: "12:00 PM - 8:30 PM", start: "12:00 PM", end: "8:30 PM" },
  { label: "1:00 PM - 9:30 PM", start: "1:00 PM", end: "9:30 PM" },
  { label: "2:00 PM - 10:30 PM", start: "2:00 PM", end: "10:30 PM" },
  { label: "3:00 PM - 11:30 PM", start: "3:00 PM", end: "11:30 PM" },
  { label: "4:00 PM - 12:30 AM", start: "4:00 PM", end: "12:30 AM" },
  { label: "5:00 PM - 1:30 AM", start: "5:00 PM", end: "1:30 AM" },
  { label: "6:00 PM - 2:30 AM", start: "6:00 PM", end: "2:30 AM" },
  { label: "6:30 PM - 3:00 AM", start: "6:30 PM", end: "3:00 AM" },
  { label: "7:00 PM - 3:30 AM", start: "7:00 PM", end: "3:30 AM" },
  { label: "8:00 PM - 4:30 AM", start: "8:00 PM", end: "4:30 AM" },
  { label: "9:00 PM - 5:30 AM", start: "9:00 PM", end: "5:30 AM" },
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
    { label: string; start: string; end: string }[]
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

        const users: UserShiftData[] = response.data.users;

        setData(users);

        // Shift options are already correctly formatted
        setShiftOptions(additionalShiftTimings);
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

  const handleShiftChange = (
    id: string,
    shift: { start: string; end: string }
  ) => {
    setEditedShifts((prev) => ({
      ...prev,
      [id]: `${shift.start} - ${shift.end}`,
    }));
  };

  const handleUpdate = async (id: string) => {
    if (editedShifts[id]) {
      const [shiftStartTime, shiftEndTime] = editedShifts[id].split(" - ");
      const payload = { userId: id, shiftStartTime, shiftEndTime };

      setUpdating((prev) => ({ ...prev, [id]: true }));
      try {
        await axios.put(`${backendUrl}/api/users/shift`, payload, {
          withCredentials: true,
        });
        setData((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, shiftStartTime, shiftEndTime } : item
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
      } finally {
        setUpdating((prev) => ({ ...prev, [id]: false }));
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
      !filters.shiftTimings ||
      `${user.shiftStartTime} - ${user.shiftEndTime}` === filters.shiftTimings;

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
    <div className="w-full p-8 bg-gradient-to-r from-gray-100 to-white rounded-lg mb-8">
      <ToastContainer position="top-center" />
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        User Shift Management
      </h1>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search Input */}
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            name="search"
            placeholder="Search by name"
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full border-none focus:outline-none"
            aria-label="Search by name"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="w-full border-none focus:outline-none"
            aria-label="Filter by Department"
          >
            <option value="">Filter by Department</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Job Title Filter */}
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            name="jobTitle"
            value={filters.jobTitle}
            onChange={handleFilterChange}
            className="w-full border-none focus:outline-none"
            aria-label="Filter by Job Title"
          >
            <option value="">Filter by Job Title</option>
            {jobTitleOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        {/* Shift Timings Filter */}
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            name="shiftTimings"
            value={filters.shiftTimings}
            onChange={handleFilterChange}
            className="w-full border-none focus:outline-none"
            aria-label="Filter by Shift Timings"
          >
            <option value="">Filter by Shift</option>
            {shiftOptions.map((shift) => (
              <option key={shift.label} value={shift.label}>
                {shift.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-purple-900 text-white">
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
                  className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider "
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  className="py-4 px-4 text-sm text-gray-700 border border-gray-300 text-center"
                  colSpan={6}
                >
                  <div className="flex flex-col items-center justify-center mt-10 mb-10">
                    <FaSpinner
                      size={30}
                      className="animate-spin text-blue-600 mb-2"
                      aria-hidden="true"
                    />
                  </div>
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-t border-gray-200 hover:bg-indigo-50 transition-colors`}
                >
                  <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap">
                    {user.department}
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap">
                    {user.jobTitle}
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap">
                    <select
                      value={
                        editedShifts[user._id] ||
                        (user.shiftStartTime && user.shiftEndTime
                          ? `${user.shiftStartTime} - ${user.shiftEndTime}`
                          : "")
                      }
                      onChange={(e) => {
                        const selectedLabel = e.target.value;
                        const selectedShift = shiftOptions.find(
                          (shift) => shift.label === selectedLabel
                        );
                        if (selectedShift) {
                          handleShiftChange(user._id, {
                            start: selectedShift.start,
                            end: selectedShift.end,
                          });
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Select shift timing for ${user.name}`}
                    >
                      <option value="" disabled>
                        {user.shiftStartTime && user.shiftEndTime
                          ? "Select Shift"
                          : `Select shift for ${user.name}`}
                      </option>
                      {shiftOptions.map((shift) => (
                        <option key={shift.label} value={shift.label}>
                          {shift.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-sm text-gray-700 px-4 py-2 whitespace-nowrap text-center">
                    {editedShifts[user._id] ? (
                      <button
                        onClick={() => handleUpdate(user._id)}
                        className={`flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition ${
                          updating[user._id]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={updating[user._id]}
                        aria-label={`Update shift for ${user.name}`}
                      >
                        {updating[user._id] ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <>
                            <FaEdit />
                            Update
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500 ml-3">
                        {user.shiftStartTime && user.shiftEndTime
                          ? "Updated"
                          : "No Shift Assigned"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  <FaInbox size={30} className="mx-auto mb-2" />
                  <p>No users found matching the criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
        {/* Items Per Page Selector */}
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-sm text-gray-700 mr-2">Show:</span>
          <select
            className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            aria-label="Select number of items per page"
          >
            {[5, 10, 20].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center space-x-4">
          <button
            className={`flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
              currentPage === 1
            }`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            aria-label="Go to previous page"
          >
            <FiChevronLeft className="mr-2" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
              currentPage === totalPages || totalPages === 0
            }`}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            aria-label="Go to next page"
          >
            Next
            <FiChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserShiftManagement;
