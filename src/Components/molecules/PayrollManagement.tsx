import React, { useState, useEffect } from "react";
import saveAs from "file-saver";
import ExcelJS from "exceljs";
import { useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaSearch,
  FaUsers,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";
import UserPayrolls from "../atoms/UserPayrolls";
import { IoDocumentText } from "react-icons/io5";
import axios from "axios";

export interface PayrollDetails {
  payrollId: string;
  month: string;
  year: number;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    jobType: string;
  };
  earnings: {
    allowances: {
      medicalAllowance: number;
      fuelAllowance: number;
      mobileAllowance: number;
    };
    basicSalary: number;
    overtimePay: number;
  };
  deductions: {
    providentFund: {
      employeeContribution: number;
      employerContribution: number;
    };
    tax: number;
    eobi: number;
    lossOfPay: number;
  };
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
}

interface User {
  id: string;
  name: string;
  email?: string;
  department: string;
  jobTitle: string;
  jobType: string;
}

const PayrollManagement: React.FC = () => {
  const [tab, setTab] = useState<"summary" | "user">("summary");
  const [payrollData, setPayrollData] = useState<PayrollDetails[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("All");
  const [yearFilter, setYearFilter] = useState<string>("All");
  const [monthFilter, setMonthFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [userPayrolls, setUserPayrolls] = useState<PayrollDetails[]>([]);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchPayrollData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/payrolls/summary`, {
          withCredentials: true,
        });
        setPayrollData(response.data);
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      setUserLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/users/getAllUsers`,
          {
            withCredentials: true,
          }
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchPayrollData();
    fetchUsers();
  }, [backendUrl]);

  const handleExportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Payroll Data");

    worksheet.columns = [
      { header: "S.No", key: "sNo", width: 10 },
      { header: "Name", key: "name", width: 20 },
      { header: "Month", key: "month", width: 15 },
      { header: "Year", key: "year", width: 15 },
      { header: "Basic Salary", key: "basicSalary", width: 15 },
      { header: "Net Salary", key: "netSalary", width: 15 },
      { header: "Deductions", key: "deductions", width: 15 },
      { header: "Earnings", key: "earnings", width: 15 },
    ];

    payrollData.forEach((payroll, index) => {
      const totalDeductions =
        payroll.deductions.tax +
        payroll.deductions.providentFund.employeeContribution +
        payroll.deductions.providentFund.employerContribution +
        payroll.deductions.eobi;

      const netSalary = payroll.earnings.basicSalary - totalDeductions;

      worksheet.addRow({
        sNo: index + 1,
        name: payroll.user.name || "N/A",
        month: payroll.month,
        year: payroll.year,
        basicSalary: payroll.earnings.basicSalary,
        netSalary: netSalary,
        deductions: totalDeductions,
        earnings: payroll.earnings,
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `PayrollData.xlsx`
      );
    });
  };

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    setTab("user");
    setUserLoading(true);

    try {
      const response = await axios.get(
        `${backendUrl}/api/payrolls/user/${user.id}`,
        {
          withCredentials: true,
        }
      );
      setUserPayrolls(response.data);
    } catch (error) {
      console.error("Error fetching user payrolls:", error);
    } finally {
      setUserLoading(false);
    }
  };

  const filteredPayrolls = payrollData.filter((payroll) => {
    const userName = payroll.user?.name?.toLowerCase() || "";
    const matchesName = userName.includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "All" ||
      payroll.user?.department === departmentFilter;
    const matchesJobTitle =
      jobTitleFilter === "All" || payroll.user?.jobTitle === jobTitleFilter;
    const matchesYear =
      yearFilter === "All" || payroll.year.toString() === yearFilter;
    const matchesMonth = monthFilter === "All" || payroll.month === monthFilter;

    return (
      matchesName &&
      matchesDepartment &&
      matchesJobTitle &&
      matchesYear &&
      matchesMonth
    );
  });

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => {
        const matchesName = user.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesDepartment =
          departmentFilter === "All" || user.department === departmentFilter;
        const matchesJobTitle =
          jobTitleFilter === "All" || user.jobTitle === jobTitleFilter;

        return matchesName && matchesDepartment && matchesJobTitle;
      })
    : [];

  const totalPayrollPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const currentPayrolls = filteredPayrolls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Payroll Management
      </h1>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setTab("summary")}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition duration-300 space-x-2 ${
            tab === "summary"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          <IoDocumentText className="w-5 h-5" />
          <span>Payroll Summary</span>
        </button>
        <button
          onClick={() => setTab("user")}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition duration-300 space-x-2 ${
            tab === "user"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          <FaUsers className="w-5 h-5" />
          <span>Users Payroll</span>
        </button>
      </div>

      {tab === "summary" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleExportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            >
              Export to Excel
            </button>
          </div>
          <div className="flex gap-4 mb-4 flex-nowrap overflow-x-auto">
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
              <FaUsers className="text-gray-400 mr-2" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
              >
                <option value="All">All Departments</option>
                {Array.from(new Set(users.map((user) => user.department))).map(
                  (department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
              <FaBriefcase className="text-gray-400 mr-2" />
              <select
                value={jobTitleFilter}
                onChange={(e) => setJobTitleFilter(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
              >
                <option value="All">All Job Titles</option>
                {Array.from(new Set(users.map((user) => user.jobTitle))).map(
                  (jobTitle) => (
                    <option key={jobTitle} value={jobTitle}>
                      {jobTitle}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
              >
                <option value="All">All Years</option>
                {Array.from(
                  { length: 5 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
              >
                <option value="All">All Months</option>
                {[
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
                ].map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="w-full p-10 mt-10 bg-white rounded-lg flex justify-center items-center">
              <FaSpinner
                size={30}
                className="text-blue-500 mb-10 animate-spin"
              />
            </div>
          ) : currentPayrolls.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <span>No payroll data found.</span>
            </div>
          ) : (
            <table className="min-w-full border-collapse bg-white border border-gray-300 rounded-lg">
              <thead className="bg-purple-900">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    S.No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Department
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Job Title
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Job Type
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Month
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Year
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPayrolls.map((payroll, index) => (
                  <tr key={payroll.payrollId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {payroll.user.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {payroll.user.department}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {payroll.user.jobTitle}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {payroll.user.jobType}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {payroll.month}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {payroll.year}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      <button
                        onClick={() =>
                          navigate(
                            `/organization/payroll-management/edit/${payroll.payrollId}`,
                            { state: { payroll } }
                          )
                        }
                        className="px-3 py-1 text-white bg-orange-500 rounded-full hover:bg-orange-600 transition duration-300"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPayrollPages}
              </span>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  currentPage === totalPayrollPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={currentPage === totalPayrollPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPayrollPages)
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "user" && selectedUser === null && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Users List</h2>
          <div className="flex gap-4 mb-4 flex-nowrap overflow-x-auto">
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
              <FaUsers className="text-gray-400 mr-2" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
              >
                <option value="All">All Departments</option>
                {Array.from(new Set(users.map((user) => user.department))).map(
                  (department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
              <FaBriefcase className="text-gray-400 mr-2" />
              <select
                value={jobTitleFilter}
                onChange={(e) => setJobTitleFilter(e.target.value)}
                className="w-full border-none focus:outline-none text-sm text-gray-600"
              >
                <option value="All">All Job Titles</option>
                {Array.from(new Set(users.map((user) => user.jobTitle))).map(
                  (jobTitle) => (
                    <option key={jobTitle} value={jobTitle}>
                      {jobTitle}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {userLoading ? (
            <div className="w-full p-10 mt-10 bg-white rounded-lg flex justify-center items-center">
              <FaSpinner
                size={30}
                className="text-blue-500 mb-10 animate-spin"
              />
            </div>
          ) : currentUsers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <span>No users found.</span>
            </div>
          ) : (
            <table className="min-w-full border-collapse bg-white border border-gray-300 rounded-lg">
              <thead className="bg-purple-900">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    S.No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Department
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Job Title
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Job Type
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {user.department}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {user.jobTitle}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {user.jobType}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      <button
                        onClick={() => handleUserSelect(user)}
                        className="px-3 py-1 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition duration-300"
                      >
                        View Payrolls
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalUserPages}
              </span>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  currentPage === totalUserPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={currentPage === totalUserPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalUserPages))
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "user" && selectedUser && (
        <UserPayrolls
          user={selectedUser.name}
          payrolls={userPayrolls}
          onBack={() => {
            setSelectedUser(null);
            setTab("user");
          }}
        />
      )}
    </div>
  );
};

export default PayrollManagement;
