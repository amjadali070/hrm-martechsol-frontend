import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import saveAs from "file-saver";
import ExcelJS from "exceljs";
import { FaInbox } from "react-icons/fa";
import { useUser } from "../organisms/UserContext";

interface Employee {
  id: number;
  name: string;
  department: string;
  jobTitle: string;
  joinDate: string;
  jobType: "Full-Time" | "Part-Time" | "Remote" | "Contract" | "Internship";
  gender: "Male" | "Female" | "Other";
}

const EmployeeManagement: React.FC = () => {
    const employeeData: Employee[] = [
    {
        id: 1,
        name: "John Doe",
        department: "Engineering",
        jobTitle: "Software Engineer",
        joinDate: "2024-05-15",
        jobType: "Full-Time",
        gender: "Male",
    },
    {
        id: 2,
        name: "Jane Smith",
        department: "HR",
        jobTitle: "HR Manager",
        joinDate: "2024-09-20",
        jobType: "Part-Time",
        gender: "Female",
    },
    {
        id: 3,
        name: "Michael Johnson",
        department: "Sales",
        jobTitle: "Sales Executive",
        joinDate: "2024-03-12",
        jobType: "Remote",
        gender: "Male",
    },
    {
        id: 4,
        name: "Emily Davis",
        department: "Marketing",
        jobTitle: "Content Strategist",
        joinDate: "2024-11-01",
        jobType: "Contract",
        gender: "Female",
    },
    {
        id: 5,
        name: "Chris Brown",
        department: "Engineering",
        jobTitle: "Frontend Developer",
        joinDate: "2024-07-10",
        jobType: "Internship",
        gender: "Male",
    },
    {
        id: 6,
        name: "Sophia Wilson",
        department: "Marketing",
        jobTitle: "SEO Specialist",
        joinDate: "2024-01-05",
        jobType: "Full-Time",
        gender: "Female",
    },
    ];

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employeeData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("All");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("All");
  const [genderFilter, setGenderFilter] = useState<string>("All");
  const [monthFilter, setMonthFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const navigate = useNavigate();
  const { user, loading } = useUser();
  useEffect(() => {
    let updatedEmployees = employeeData;

    if (departmentFilter !== "All") {
      updatedEmployees = updatedEmployees.filter((employee) => employee.department === departmentFilter);
    }

    if (jobTypeFilter !== "All") {
      updatedEmployees = updatedEmployees.filter((employee) => employee.jobType === jobTypeFilter);
    }

    if (jobTitleFilter !== "All") {
      updatedEmployees = updatedEmployees.filter((employee) => employee.jobTitle === jobTitleFilter);
    }

    if (genderFilter !== "All") {
      updatedEmployees = updatedEmployees.filter((employee) => employee.gender === genderFilter);
    }

    if (searchTerm) {
      updatedEmployees = updatedEmployees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (monthFilter !== "All") {
      updatedEmployees = updatedEmployees.filter((employee) => {
        const [year, month] = monthFilter.split("-");
        const employeeDate = new Date(employee.joinDate);
        return (
          employeeDate.getFullYear().toString() === year &&
          (employeeDate.getMonth() + 1).toString() === month
        );
      });
    }

    setFilteredEmployees(updatedEmployees);
  }, [departmentFilter, jobTypeFilter, jobTitleFilter, genderFilter, searchTerm, monthFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleAddNewEmployee = () => {
    navigate("/organization/employee-management/add-new-employee");
  };

  const handleExportData = async () => {
    if (filteredEmployees.length === 0) {
      alert("No employees to export.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: "Name", key: "name", width: 20 },
      { header: "Department", key: "department", width: 20 },
      { header: "Job Title", key: "jobTitle", width: 25 },
      { header: "Join Date", key: "startDate", width: 15 },
      { header: "Job Type", key: "jobType", width: 15 },
      { header: "Gender", key: "gender", width: 15 },
    ];

    filteredEmployees.forEach((employee, index) => {
      worksheet.addRow({
        sno: index + 1,
        name: employee.name,
        department: employee.department,
        jobTitle: employee.jobTitle,
        startDate: employee.joinDate,
        jobType: employee.jobType,
        gender: employee.gender,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "EmployeeData.xlsx");
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
    new Set(employeeData.map((employee) => new Date(employee.joinDate).getFullYear()))
  );

  const monthOptions = ["All", ...years.flatMap((year) => months.map((month, index) => `${year}-${index + 1}`))];

  const handleEditClick = () => {
    navigate(`/edit-profile/${user.id}`);
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Employee Management</h2>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500" onClick={handleAddNewEmployee}>
            Add New Employee
          </button>
          <button className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700" onClick={handleExportData}>
            Export Employee Data
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center items-center mb-6 gap-5">
        <div className="flex gap-5">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Departments</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
          </select>
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Remote">Remote</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <select
            value={jobTitleFilter}
            onChange={(e) => setJobTitleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Job Titles</option>
            {Array.from(new Set(employeeData.map((employee) => employee.jobTitle))).map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {monthOptions.map((option) => (
              <option key={option} value={option}>
                {option === "All"
                  ? "By Month"
                  : `${months[parseInt(option.split("-")[1], 10) - 1]} ${option.split("-")[0]}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-purple-900">
              <th className="py-3 px-4 text-left text-sm font-medium text-white">S.No</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-white">Name(s)</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-white">Department</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-white">Job Title</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-white">Joining Date</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-white">Job Type</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-white">Gender</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee, index) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{employee.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{employee.department}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{employee.jobTitle}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{employee.joinDate}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{employee.jobType}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{employee.gender}</td>
                  <td className="py-3 px-4 text-sm text-gray-800 flex gap-2">
                    <button className="px-3 py-1 text-white bg-orange-500 rounded-full hover:bg-orange-600"  onClick={handleEditClick}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center">
                    <FaInbox size={40} className="text-gray-400 mb-4" />
                    <span className="text-lg font-medium">No Employees Found.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Show:</span>
          <select
            className="text-sm border border-gray-300 rounded-md"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
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
  );
};

export default EmployeeManagement;