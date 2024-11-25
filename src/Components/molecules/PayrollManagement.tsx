import React, { useState, useEffect } from "react";
import saveAs from "file-saver";
import ExcelJS from "exceljs";
import { useNavigate } from "react-router-dom";
import { FaInbox } from "react-icons/fa";

interface PayrollDetails {
  name: string;
  department: string;
  jobTitle: string;
  jobType: string;
  from: string;
  to: string;
  basicSalary: number;
  medicalAllowance: number;
  mobileAllowance: number;
  fuelAllowance: number;
  additions: number;
  deductions: {
    tax: number;
    eobi: number;
    pfContribution: number;
  };
}

const PayrollManagement: React.FC = () => {
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>("October 2024");
  const [payrollData, setPayrollData] = useState<{ [key: string]: PayrollDetails[] } | null>(null);
  const [filters, setFilters] = useState({ name: "", jobType: "All", department: "All" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const navigate = useNavigate();

  const dummyData: { [key: string]: PayrollDetails[] } = {
    "October 2024": [
      {
        name: "Urwah Iftikhar",
        department: "Engineering",
        jobTitle: "Assistant Vice President - Graphic Design",
        jobType: "Full Time",
        from: "October 01, 2024",
        to: "October 31, 2024",
        basicSalary: 135000,
        medicalAllowance: 13564,
        mobileAllowance: 0,
        fuelAllowance: 6000,
        additions: 0,
        deductions: {
          tax: 9245,
          eobi: 370,
          pfContribution: 6239,
        },
      },
      {
        name: "John Doe",
        department: "IT",
        jobTitle: "Software Engineer",
        jobType: "Full Time",
        from: "October 01, 2024",
        to: "October 31, 2024",
        basicSalary: 120000,
        medicalAllowance: 12000,
        mobileAllowance: 3000,
        fuelAllowance: 5000,
        additions: 5000,
        deductions: {
          tax: 8500,
          eobi: 400,
          pfContribution: 6000,
        },
      },
    ],
  };

  useEffect(() => {
    setPayrollData(dummyData);
  }, []);

  const handleExportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Payroll Data");

    worksheet.columns = [
      { header: "S.No", key: "sNo", width: 10 },
      { header: "Name", key: "name", width: 20 },
      { header: "Department", key: "department", width: 15 },
      { header: "Job Title", key: "jobTitle", width: 30 },
      { header: "Job Type", key: "jobType", width: 15 },
    ];

    if (payrollData && selectedMonthYear in payrollData) {
      payrollData[selectedMonthYear].forEach((employee, index) => {
        worksheet.addRow({
          sNo: index + 1,
          name: employee.name,
          department: employee.department,
          jobTitle: employee.jobTitle,
          jobType: employee.jobType,
        });
      });
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `${selectedMonthYear}_PayrollData.xlsx`
      );
    });
  };

  const filteredEmployees =
    payrollData && selectedMonthYear in payrollData
      ? payrollData[selectedMonthYear].filter(
          (employee) =>
            (filters.name === "" || employee.name.toLowerCase().includes(filters.name.toLowerCase())) &&
            (filters.jobType === "All" || employee.jobType === filters.jobType) &&
            (filters.department === "All" || employee.department === filters.department)
        )
      : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Payroll Management</h1>
        <div className="flex gap-4">
          <select
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            {Object.keys(dummyData).map((monthYear) => (
              <option key={monthYear} value={monthYear}>
                {monthYear}
              </option>
            ))}
          </select>
          <button
            onClick={handleExportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="flex mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="All">All Job Types</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Contract">Contract</option>
        </select>
        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="All">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="IT">IT</option>
        </select>
      </div>

      <table className="min-w-full border-collapse bg-white border border-gray-300 rounded-lg">
        <thead className="bg-purple-900">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-white">S.No</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-white">Name(s)</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-white">Department</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-white">Job Title</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-white">Job Type</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.length > 0 ? (
            currentEmployees.map((employee, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">{employee.name}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{employee.department}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{employee.jobTitle}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{employee.jobType}</td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  <button
                    onClick={() =>
                      navigate(`/organization/payroll-management/edit/${encodeURIComponent(employee.name)}`, {
                        state: { employee },
                      })
                    }
                    className="px-3 py-1 text-white bg-orange-500 rounded-full hover:bg-orange-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <FaInbox size={40} className="text-gray-400 mb-2" />
                  <span className="text-md font-medium">No Payroll Found.</span>
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
            onClick={handlePreviousPage}
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
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;