// src/components/EmployeeManagement.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import saveAs from "file-saver";
import ExcelJS from "exceljs";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaInbox,
  FaSearch,
  FaUsers,
  FaUserTag,
  FaPlus,
  FaFileExport,
  FaEdit,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import UserStatusToggleConfirmation from "../atoms/UserStatusToggleConfirmation";
import LoadingSpinner from "../atoms/LoadingSpinner";

interface Employee {
  _id: string;
  name: string;
  department: string;
  jobTitle: string;
  joiningDate: string;
  jobType: "Full-Time" | "Part-Time" | "Remote" | "Contract" | "Internship";
  gender: "Male" | "Female" | "Other";
  isActive: boolean;
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("All");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("All");
  const [genderFilter, setGenderFilter] = useState<string>("All");
  const [monthFilter, setMonthFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/users/getAllUsers`,
          {
            withCredentials: true,
            params: {
              department:
                departmentFilter !== "All" ? departmentFilter : undefined,
              jobTitle: jobTitleFilter !== "All" ? jobTitleFilter : undefined,
              jobType: jobTypeFilter !== "All" ? jobTypeFilter : undefined,
              gender: genderFilter !== "All" ? genderFilter : undefined,
              search: searchTerm || undefined,
              month: monthFilter !== "All" ? monthFilter : undefined,
            },
          }
        );

        const { users } = response.data;
        setEmployees(users);
        setFilteredEmployees(users);
      } catch (error: any) {
        console.error("Error fetching employee data:", error);
        toast.error("Failed to fetch employee data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [
    departmentFilter,
    jobTitleFilter,
    jobTypeFilter,
    genderFilter,
    searchTerm,
    monthFilter,
    backendUrl,
  ]);

  useEffect(() => {
    let updatedEmployees = [...employees];

    if (departmentFilter !== "All") {
      updatedEmployees = updatedEmployees.filter(
        (employee) => employee.department === departmentFilter
      );
    }

    if (jobTypeFilter !== "All") {
      updatedEmployees = updatedEmployees.filter(
        (employee) => employee.jobType === jobTypeFilter
      );
    }

    if (jobTitleFilter !== "All") {
      updatedEmployees = updatedEmployees.filter(
        (employee) => employee.jobTitle === jobTitleFilter
      );
    }

    if (genderFilter !== "All") {
      updatedEmployees = updatedEmployees.filter(
        (employee) => employee.gender === genderFilter
      );
    }

    if (searchTerm) {
      updatedEmployees = updatedEmployees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (monthFilter !== "All") {
      updatedEmployees = updatedEmployees.filter((employee) => {
        const [year, month] = monthFilter.split("-");
        const employeeDate = new Date(employee.joiningDate);
        return (
          employeeDate.getFullYear().toString() === year &&
          (employeeDate.getMonth() + 1).toString() === month
        );
      });
    }

    setFilteredEmployees(updatedEmployees);
    setCurrentPage(1);
  }, [
    employees,
    departmentFilter,
    jobTypeFilter,
    jobTitleFilter,
    genderFilter,
    searchTerm,
    monthFilter,
  ]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleAddNewEmployee = () => {
    navigate("/organization/employee-management/add-new-employee");
  };

  const handleExportData = async () => {
    if (filteredEmployees.length === 0) {
      toast.warning("No employees to export.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: "Name", key: "name", width: 25 },
      { header: "Department", key: "department", width: 20 },
      { header: "Job Title", key: "jobTitle", width: 25 },
      { header: "Joining Date", key: "joiningDate", width: 20 },
      { header: "Job Type", key: "jobType", width: 15 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Status", key: "status", width: 15 },
    ];

    filteredEmployees.forEach((employee, index) => {
      worksheet.addRow({
        sno: index + 1,
        name: employee.name,
        department: employee.department,
        jobTitle: employee.jobTitle,
        joiningDate: new Date(employee.joiningDate).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ),
        jobType: employee.jobType,
        gender: employee.gender,
        status: employee.isActive ? "Active" : "Deactivated",
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.columns.forEach((column) => {
      column.alignment = { vertical: "middle", horizontal: "center" };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "AllEmployeesData.xlsx");
    toast.success("Employee data exported successfully!");
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    new Set(
      employees.map((employee) => new Date(employee.joiningDate).getFullYear())
    )
  );

  const monthOptions = [
    "All",
    ...years.flatMap((year) =>
      months.map(
        (month, index) => `${year}-${String(index + 1).padStart(2, "0")}`
      )
    ),
  ];

  const handleEditClick = (employee: Employee) => {
    navigate(`/edit-profile/${employee._id}`);
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await axios.put(
        `${backendUrl}/api/users/${userId}/status`,
        { isActive: !currentStatus },
        { withCredentials: true }
      );

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee._id === userId
            ? { ...employee, isActive: !currentStatus }
            : employee
        )
      );

      toast.success(
        `User ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status.");
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
            <FaUsers className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Employee Management
            </h2>
            <p className="text-sm text-slate-grey-500">
              Oversee workforce details, roles, and employment status.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gunmetal-900 text-white rounded-lg hover:bg-gunmetal-800 transition-all duration-200 shadow-sm text-sm font-semibold"
            onClick={handleAddNewEmployee}
          >
            <FaPlus className="w-3.5 h-3.5" />
            Add Employee
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white text-gunmetal-600 border border-platinum-200 rounded-lg hover:bg-platinum-50 transition-all duration-200 shadow-sm text-sm font-semibold"
            onClick={handleExportData}
          >
            <FaFileExport className="w-3.5 h-3.5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {/* Search Input */}
        <div className="relative group">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
          />
        </div>

        {/* Department Filter */}
        <div className="relative group">
          <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Account Management">Account Management</option>
            <option value="Project Management">Project Management</option>
            <option value="Content Production">Content Production</option>
            <option value="Book Marketing">Book Marketing</option>
            <option value="Design Production">Design Production</option>
            <option value="SEO">SEO</option>
            <option value="Creative Media">Creative Media</option>
            <option value="Web Development">Web Development</option>
            <option value="Paid Advertising">Paid Advertising</option>
            <option value="Software Production">Software Production</option>
            <option value="IT & Networking">IT & Networking</option>
            <option value="Human Resource">Human Resource</option>
            <option value="Training & Development">
              Training & Development
            </option>
            <option value="Admin">Admin</option>
            <option value="Finance">Finance</option>
            <option value="Brand Development">Brand Development</option>
            <option value="Corporate Communication">
              Corporate Communication
            </option>
          </select>
        </div>

        {/* Job Type Filter */}
        <div className="relative group">
          <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Remote">Remote</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Job Title Filter */}
        <div className="relative group">
          <FaUserTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            value={jobTitleFilter}
            onChange={(e) => setJobTitleFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Job Titles</option>
            {[
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
              "Head Of Project Management",
              "Head of Department",
              "Chief Executive Officer",
            ].map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div className="relative group">
          <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Month Filter */}
        <div className="relative group">
          <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            {monthOptions.map((option) => (
              <option key={option} value={option}>
                {option === "All"
                  ? "All Months"
                  : `${months[parseInt(option.split("-")[1], 10) - 1]} ${
                      option.split("-")[0]
                    }`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="overflow-x-auto rounded-xl border border-platinum-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-alabaster-grey-50">
            <tr>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                S.No
              </th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                Name
              </th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                Department
              </th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                Job Title
              </th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                Joined
              </th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                Type
              </th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                Status
              </th>
              <th className="py-3 px-4 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-platinum-100">
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee, index) => (
                <tr
                  key={employee._id}
                  className="hover:bg-alabaster-grey-50/50 transition-colors group"
                >
                  <td className="py-3 px-4 text-sm text-slate-grey-500 font-mono">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gunmetal-900 group-hover:text-gunmetal-700">
                        {employee.name}
                      </span>
                      <span className="text-[10px] text-slate-grey-400 capitalize">
                        {employee.gender}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gunmetal-700 font-medium">
                    {employee.department}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-grey-600">
                    {employee.jobTitle}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-grey-600 font-mono text-xs">
                    {new Date(employee.joiningDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-alabaster-grey-100 text-slate-grey-600 border border-platinum-200">
                      {employee.jobType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {employee.isActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wide">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100 uppercase tracking-wide">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditClick(employee)}
                        className="p-1.5 text-slate-grey-400 hover:text-gunmetal-900 transition-colors rounded hover:bg-platinum-100"
                        title="Edit Profile"
                      >
                        <FaEdit />
                      </button>

                      <UserStatusToggleConfirmation
                        userId={employee._id}
                        currentStatus={employee.isActive}
                        onConfirm={() =>
                          handleToggleStatus(employee._id, employee.isActive)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-12 text-center" colSpan={8}>
                  {isLoading ? (
                    <LoadingSpinner size="md" text="Loading records..." />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-grey-400">
                      <FaInbox size={40} className="mb-3 opacity-50" />
                      <p className="text-sm font-medium">
                        No employees found matching criteria.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="flex items-center space-x-2 text-sm text-slate-grey-600 bg-alabaster-grey-50 px-3 py-1.5 rounded-lg border border-platinum-200">
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

        <div className="flex items-center space-x-2">
          <button
            className={`p-2 rounded-lg border border-platinum-200 transition-all ${
              currentPage === 1
                ? "bg-alabaster-grey-50 text-slate-grey-300 cursor-not-allowed"
                : "bg-white text-gunmetal-600 hover:bg-platinum-50 hover:text-gunmetal-900 shadow-sm"
            }`}
            disabled={currentPage === 1}
            onClick={handlePrevious}
          >
            <FaChevronLeft size={12} />
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
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
