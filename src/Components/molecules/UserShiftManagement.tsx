import React, { useEffect, useState } from "react";
import {
  FaFilter,
  FaSearch,
  FaInbox,
  FaUserClock,
  FaCheckCircle,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import useUser from "../../hooks/useUser";
import LoadingSpinner from "../atoms/LoadingSpinner";

interface UserShiftData {
  _id: string;
  name: string;
  department: string;
  jobTitle: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
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
  { label: "7:30 PM - 4:00 AM", start: "7:30 PM", end: "4:00 AM" },
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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [shiftOptions, setShiftOptions] = useState<
    { label: string; start: string; end: string }[]
  >(additionalShiftTimings);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const user = useUser();
  const currentUserId = user.user?._id;

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
    setCurrentPage(1);
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
        toast.error("Failed to update shift timings.");
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

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      <ToastContainer position="top-center" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
            <FaUserClock className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Shift Management
            </h2>
            <p className="text-sm text-slate-grey-500">
              Assign and update employee working hours.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative group">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <input
            type="text"
            name="search"
            placeholder="Search by name..."
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
          />
        </div>

        <div className="relative group">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Departments</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            name="jobTitle"
            value={filters.jobTitle}
            onChange={handleFilterChange}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Job Titles</option>
            {jobTitleOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div className="relative group">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            name="shiftTimings"
            value={filters.shiftTimings}
            onChange={handleFilterChange}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Shifts</option>
            {shiftOptions.map((shift) => (
              <option key={shift.label} value={shift.label}>
                {shift.label}
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
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                User
              </th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                Department
              </th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                Job Title
              </th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 w-64">
                Shift Timings
              </th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center w-32">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-platinum-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <LoadingSpinner size="lg" text="Loading shifts..." />
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-alabaster-grey-50/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="text-sm font-semibold text-gunmetal-900">
                      {user.name}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-grey-600">
                    {user.department}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-grey-600">
                    {user.jobTitle}
                  </td>
                  <td className="py-4 px-4">
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
                          (s) => s.label === selectedLabel
                        );
                        if (selectedShift) {
                          handleShiftChange(user._id, {
                            start: selectedShift.start,
                            end: selectedShift.end,
                          });
                        }
                      }}
                      disabled={user._id === currentUserId}
                      className="w-full text-sm border border-platinum-300 rounded-lg px-3 py-2 text-gunmetal-900 focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all font-mono"
                    >
                      <option value="" disabled>
                        {user.shiftStartTime ? "Select Shift" : "Select Shift"}
                      </option>
                      {shiftOptions.map((shift) => (
                        <option key={shift.label} value={shift.label}>
                          {shift.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {user._id === currentUserId ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-alabaster-grey-100 text-slate-grey-500 border border-platinum-200">
                        Current User
                      </span>
                    ) : editedShifts[user._id] ? (
                      <button
                        onClick={() => handleUpdate(user._id)}
                        disabled={updating[user._id]}
                        className="flex items-center justify-center gap-2 w-full px-3 py-1.5 bg-gunmetal-900 text-white rounded-lg hover:bg-gunmetal-800 transition-all shadow-sm text-xs font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {updating[user._id] ? (
                          <LoadingSpinner size="sm" color="white" />
                        ) : (
                          <>
                            <FaCheckCircle /> Save
                          </>
                        )}
                      </button>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold border ${
                          user.shiftStartTime
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}
                      >
                        {user.shiftStartTime ? "Assigned" : "Unassigned"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-slate-grey-400"
                >
                  <div className="flex flex-col items-center">
                    <FaInbox size={32} className="opacity-50 mb-2" />
                    <span className="text-sm font-medium">No users found.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredData.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-grey-600 bg-alabaster-grey-50 px-3 py-1.5 rounded-lg border border-platinum-200">
            <span className="font-medium">Rows per page:</span>
            <select
              className="bg-transparent border-none focus:outline-none font-semibold text-gunmetal-800 cursor-pointer"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
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
              <FiChevronLeft size={12} />
            </button>

            <span className="text-xs font-semibold text-gunmetal-600 uppercase tracking-wide px-2">
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
              <FiChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserShiftManagement;
