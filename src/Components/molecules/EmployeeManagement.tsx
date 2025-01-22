// src/components/EmployeeManagement.tsx
import React, { useState, useEffect, useCallback } from "react";
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
  FaSpinner,
  FaPlus,
  FaFileExport,
  FaEdit,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for notifications
import UserStatusToggleConfirmation from "../atoms/UserStatusToggleConfirmation";

interface Employee {
  _id: string; // Ensure _id is included
  name: string;
  department: string;
  jobTitle: string;
  joiningDate: string;
  jobType: "Full-Time" | "Part-Time" | "Remote" | "Contract" | "Internship";
  gender: "Male" | "Female" | "Other";
  isActive: boolean; // Include isActive status
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
            // Remove pagination parameters to fetch all employees
            params: {
              // Include other filters if the backend supports them
              department:
                departmentFilter !== "All" ? departmentFilter : undefined,
              jobTitle: jobTitleFilter !== "All" ? jobTitleFilter : undefined,
              jobType: jobTypeFilter !== "All" ? jobTypeFilter : undefined,
              gender: genderFilter !== "All" ? genderFilter : undefined,
              // Add searchTerm and monthFilter if backend supports them
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
    // Remove dependencies related to client-side pagination
    departmentFilter,
    jobTitleFilter,
    jobTypeFilter,
    genderFilter,
    searchTerm,
    monthFilter,
    backendUrl,
  ]);

  useEffect(() => {
    let updatedEmployees = [...employees]; // Create a copy to avoid mutating state

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
    setCurrentPage(1); // Reset to first page when filters change
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
      { header: "Status", key: "status", width: 15 }, // New Column for Status
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
        status: employee.isActive ? "Active" : "Deactivated", // Populate Status
      });
    });

    // Styling Headers
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
    <div className="w-full p-6 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">
          Employee Management
        </h2>
        <div className="flex space-x-4">
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleAddNewEmployee}
          >
            <FaPlus className="mr-2" />
            Add New Employee
          </button>
          <button
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            onClick={handleExportData}
          >
            <FaFileExport className="mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 mb-4">
        {/* Search Input */}
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full focus:outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300">
          <FaUsers className="text-gray-400 mr-2" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full focus:outline-none text-sm text-gray-700"
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
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300">
          <FaBriefcase className="text-gray-400 mr-2" />
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="w-full focus:outline-none text-sm text-gray-700"
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
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300">
          <FaUserTag className="text-gray-400 mr-2" />
          <select
            value={jobTitleFilter}
            onChange={(e) => setJobTitleFilter(e.target.value)}
            className="w-full focus:outline-none text-sm text-gray-700"
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
        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300">
          <FaUsers className="text-gray-400 mr-2" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full focus:outline-none text-sm text-gray-700"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center bg-white rounded-lg px-4 py-2 border border-gray-300">
          <FaCalendarAlt className="text-gray-400 mr-2" />
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full focus:outline-none text-sm text-gray-700"
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-purple-900 text-white">
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide rounded-tl-lg">
                S.No
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                Name
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                Department
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                Job Title
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                Joining Date
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                Job Type
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                Gender
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide">
                Status
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wide rounded-tr-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee, index) => (
                <tr
                  key={employee._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {employee.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {employee.department}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {employee.jobTitle}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(employee.joiningDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {employee.jobType}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {employee.gender}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {employee.isActive ? (
                      <span className="inline-flex items-center px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-medium">
                        Deactivated
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm flex space-x-2">
                    <button
                      className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                      onClick={() => handleEditClick(employee)}
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </button>

                    <UserStatusToggleConfirmation
                      userId={employee._id}
                      currentStatus={employee.isActive}
                      onConfirm={() =>
                        handleToggleStatus(employee._id, employee.isActive)
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-8 px-4 text-center text-gray-500" colSpan={9}>
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <FaSpinner
                        size={40}
                        className="text-blue-500 mb-4 animate-spin"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FaInbox size={40} className="text-gray-400 mb-4" />
                      <span className="text-lg font-medium">
                        No Employees Found.
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        {/* Items Per Page */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show:</span>
          <select
            className="text-sm border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1); // Reset to first page when items per page changes
            }}
          >
            {[20, 10, 5].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <button
            className={`flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
              currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={currentPage === 1}
            onClick={handlePrevious}
          >
            <FaChevronLeft className="mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
              currentPage === totalPages || totalPages === 0
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={handleNext}
          >
            Next
            <FaChevronRight className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
