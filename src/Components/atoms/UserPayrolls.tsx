import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PayrollDetails } from "../molecules/PayrollManagement";
import { FaInbox, FaSpinner, FaTimes } from "react-icons/fa";
import saveAs from "file-saver";
import ExcelJS from "exceljs";

interface UserPayrollsProps {
  user: string;
  payrolls: PayrollDetails[];
  onBack: () => void;
}

const UserPayrolls: React.FC<UserPayrollsProps> = ({
  user,
  payrolls,
  onBack,
}) => {
  const navigate = useNavigate();

  const [monthFilter, setMonthFilter] = useState<string>("All");
  const [yearFilter, setYearFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollDetails | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredPayrolls = payrolls.filter((payroll) => {
    const matchesMonth = monthFilter === "All" || payroll.month === monthFilter;
    const matchesYear =
      yearFilter === "All" || payroll.year.toString() === yearFilter;

    return matchesMonth && matchesYear;
  });

  const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
  const currentPayrolls = filteredPayrolls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Payrolls");

    worksheet.columns = [
      { header: "S.No", key: "sNo", width: 10 },
      { header: "User Name", key: "userName", width: 15 },
      { header: "Month", key: "month", width: 15 },
      { header: "Year", key: "year", width: 10 },
      { header: "Total Salary", key: "totalSalary", width: 15 },
      { header: "Total Deductions", key: "totalDeductions", width: 15 },
      { header: "Net Salary", key: "netSalary", width: 15 },
    ];

    currentPayrolls.forEach((payroll, index) => {
      const totalDeductions =
        (payroll.deductions?.providentFund?.employeeContribution || 0) +
        (payroll.deductions?.providentFund?.employerContribution || 0) +
        (payroll.deductions?.tax || 0) +
        (payroll.deductions?.eobi || 0) +
        (payroll.deductions?.lossOfPay || 0);

      const totalEarnings =
        (payroll.earnings?.basicSalary || 0) +
        (payroll.earnings?.allowances?.medicalAllowance || 0) +
        (payroll.earnings?.allowances?.fuelAllowance || 0) +
        (payroll.earnings?.allowances?.mobileAllowance || 0) +
        (payroll.earnings?.overtimePay || 0);

      const netSalary = totalEarnings - totalDeductions;

      worksheet.addRow({
        sNo: index + 1 + (currentPage - 1) * itemsPerPage,
        userName: payroll.user.name,
        month: payroll.month,
        year: payroll.year,
        totalSalary: totalEarnings,
        totalDeductions: totalDeductions,
        netSalary: netSalary,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `${user}_Payrolls.xlsx`);
  };

  const openModal = (payroll: PayrollDetails) => {
    setSelectedPayroll(payroll);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayroll(null);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  // Helper function to safely calculate total earnings
  const calculateTotalEarnings = (earnings: PayrollDetails["earnings"]) => {
    return (
      (earnings?.basicSalary || 0) +
      (earnings?.allowances?.medicalAllowance || 0) +
      (earnings?.allowances?.fuelAllowance || 0) +
      (earnings?.allowances?.mobileAllowance || 0) +
      (earnings?.overtimePay || 0)
    );
  };

  // Helper function to safely calculate total deductions
  const calculateTotalDeductions = (
    deductions: PayrollDetails["deductions"]
  ) => {
    return (
      (deductions?.providentFund?.employeeContribution || 0) +
      (deductions?.providentFund?.employerContribution || 0) +
      (deductions?.tax || 0) +
      (deductions?.eobi || 0) +
      (deductions?.lossOfPay || 0)
    );
  };

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20 mb-20">
          <FaSpinner size={30} className="text-blue-500 mb-2 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Payrolls for {user}</h3>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300"
            >
              Export to Excel
            </button>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
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
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
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
          </div>

          <table className="min-w-full border-collapse bg-white border border-gray-300 rounded-lg">
            <thead className="bg-purple-900">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  S.No
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Month
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Year
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Total Earnings
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Total Deductions
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Net Salary
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((payroll, index) => {
                const totalDeductions = calculateTotalDeductions(
                  payroll.deductions
                );
                const totalEarnings = calculateTotalEarnings(payroll.earnings);
                const netSalary = totalEarnings - totalDeductions;

                return (
                  <tr key={payroll.payrollId} className="hover:bg-gray-50">
                    {" "}
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {payroll.month}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {payroll.year}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {totalEarnings}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {totalDeductions}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {netSalary}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      <button
                        onClick={() => openModal(payroll)}
                        className="px-3 py-1 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition duration-300"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/organization/payroll-management/edit/${payroll.payrollId}`,
                            { state: { payroll } }
                          )
                        }
                        className="px-3 py-1 text-white bg-orange-500 rounded-full hover:bg-orange-600 transition duration-300 ml-2"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </button>
            </div>
          </div>

          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
          >
            Back
          </button>

          {isModalOpen && selectedPayroll && (
            <div
              className="fixed inset-0 flex items-center justify-center modal-overlay bg-black bg-opacity-50"
              onClick={handleOverlayClick}
            >
              <div className="bg-white p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold mb-4">
                    Payroll Details for {selectedPayroll.month}{" "}
                    {selectedPayroll.year}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="mb-4 px-2 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="flex justify-between mb-4">
                  <div className="w-1/2 mr-4">
                    <table className="w-full border border-purple-900 border-collapse h-full">
                      <thead>
                        <tr className="bg-purple-900 text-white">
                          <th className="px-4 py-2 text-left" colSpan={2}>
                            Earnings Breakdown
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2">Basic Salary</td>
                          <td className="px-4 py-2 text-right">
                            {selectedPayroll.earnings?.basicSalary || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Medical Allowance</td>
                          <td className="px-4 py-2 text-right">
                            {selectedPayroll.earnings?.allowances
                              ?.medicalAllowance || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Fuel Allowance</td>
                          <td className="px-4 py-2 text-right">
                            {selectedPayroll.earnings?.allowances
                              ?.fuelAllowance || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Mobile Allowance</td>
                          <td className="px-4 py-2 text-right">
                            {selectedPayroll.earnings?.allowances
                              ?.mobileAllowance || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Overtime Pay</td>
                          <td className="px-4 py-2 text-right">
                            {selectedPayroll.earnings?.overtimePay || 0}
                          </td>
                        </tr>
                        <tr className="font-bold">
                          <td className="px-4 py-2">Total Earnings</td>
                          <td className="px-4 py-2 text-right">
                            {calculateTotalEarnings(selectedPayroll.earnings)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="w-1/2">
                    <table className="w-full border border-purple-900 border-collapse h-full">
                      <thead>
                        <tr className="bg-purple-900 text-white">
                          <th className="px-4 py-2 text-left" colSpan={2}>
                            Deductions Breakdown
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2">
                            Employee PF Contribution
                          </td>
                          <td className="px-4 py-2 text-right">
                            {selectedPayroll.deductions?.providentFund
                              ?.employeeContribution || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">
                            Employer PF Contribution
                          </td>
                          <td className="px-4 py-2 text-right">
                            {selectedPayroll.deductions.providentFund
                              .employerContribution || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Tax</td>
                          <td className="px-4 py-2 text-right">
                            {selectedPayroll.deductions.tax || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">EOBI</td>
                          <td className="px-4 py-2 text-right">
                            {selectedPayroll.deductions.eobi || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Loss of Pay</td>
                          <td className="px-4 py-2 text-right">
                            {selectedPayroll.deductions.lossOfPay || 0}
                          </td>
                        </tr>
                        <tr className="font-bold">
                          <td className="px-4 py-2">Total Deductions</td>
                          <td className="px-4 py-2 text-right">
                            {selectedPayroll.deductions.providentFund
                              .employeeContribution +
                              selectedPayroll.deductions.providentFund
                                .employerContribution +
                              selectedPayroll.deductions.tax +
                              selectedPayroll.deductions.eobi +
                              selectedPayroll.deductions.lossOfPay || 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <table className="w-full border border-purple-900 border-collapse h-full">
                  <thead>
                    <tr className="bg-purple-900 text-white">
                      <th className="px-4 py-2 text-left" colSpan={2}>
                        Attendance Summary
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2">Total Working Days</td>
                      <td className="px-4 py-2 text-right">
                        {selectedPayroll.totalWorkingDays}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Present Days</td>
                      <td className="px-4 py-2 text-right">
                        {selectedPayroll.presentDays}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">Absent Days</td>
                      <td className="px-4 py-2 text-right">
                        {selectedPayroll.absentDays}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border border-purple-900 border-collapse h-full mt-2">
                  <thead>
                    <tr className="text-white">
                      <th className="px-4 py-2 text-left bg-purple-900 w-1/2">
                        Net Salary
                      </th>
                      <td className="px-4 py-2 text-right text-black font-extrabold">
                        {calculateTotalEarnings(selectedPayroll.earnings) -
                          calculateTotalDeductions(selectedPayroll.deductions)}
                      </td>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserPayrolls;
