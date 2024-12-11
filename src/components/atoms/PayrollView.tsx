import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalarySlipPDF from "../../html/SalarySlipPDF";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosConfig";
import { FaInbox, FaSpinner } from "react-icons/fa";

interface PayrollDetails {
  _id: string;
  user: string;
  month: string;
  year: number;
  basicSalary: number;
  earnings: {
    basicSalary: number;
    allowances: {
      medicalAllowance: number;
      fuelAllowance: number;
      mobileAllowance: number;
    };
    overtimePay: number;
  };
  deductions: {
    tax: number;
    eobi: number;
    providentFund: {
      employeeContribution: number;
      employerContribution: number;
    };
    lossOfPay: number;
  };
  netSalary?: number;
  presentDays: number;
  totalWorkingDays: number;
  leaveDetails?: {
    casualLeaveAvailable?: number;
    sickLeaveAvailable?: number;
    annualLeaveAvailable?: number;
  };
}

const PayrollView: React.FC = () => {
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>("");
  const [payrollData, setPayrollData] = useState<PayrollDetails | null>(null);
  const [monthYearOptions, setMonthYearOptions] = useState<string[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollDetails[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useUser();

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${backendUrl}/api/payrolls`, {
          withCredentials: true,
        });

        // Sort payroll records by year and month (most recent first)
        const sortedRecords = response.data.sort(
          (a: PayrollDetails, b: PayrollDetails) => {
            const monthOrder = [
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

            if (b.year !== a.year) {
              return b.year - a.year;
            }
            return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
          }
        );

        setPayrollRecords(sortedRecords);

        // Create month-year options
        const options = sortedRecords.map(
          (record: PayrollDetails) => `${record.month} ${record.year}`
        );
        setMonthYearOptions(options);

        // Set the most recent payroll record as default
        if (sortedRecords.length > 0) {
          const mostRecentRecord = sortedRecords[0];
          setPayrollData(mostRecentRecord);
          setSelectedMonthYear(
            `${mostRecentRecord.month} ${mostRecentRecord.year}`
          );
        }
      } catch (err: any) {
        console.error("Full Axios Error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch payroll data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, []);

  const handleMonthYearChange = (selectedValue: string) => {
    setSelectedMonthYear(selectedValue);

    const selectedRecord =
      payrollRecords.find(
        (record: PayrollDetails) =>
          `${record.month} ${record.year}` === selectedValue
      ) || null;
    setPayrollData(selectedRecord);
  };

  // Calculate Net Salary if not provided
  const calculateNetSalary = () => {
    if (!payrollData) return 0;

    const basicSalary = payrollData.basicSalary || 0;
    const allowances = payrollData.earnings?.allowances || {};
    const deductions = payrollData.deductions || {};

    const totalEarnings =
      basicSalary +
      (allowances.medicalAllowance || 0) +
      (allowances.fuelAllowance || 0) +
      (allowances.mobileAllowance || 0);

    const totalDeductions =
      (deductions.tax || 0) +
      (deductions.eobi || 0) +
      (deductions.providentFund?.employeeContribution || 0);

    return totalEarnings - totalDeductions;
  };

  // Prepare data for PDF
  const pdfData = {
    date: new Date().toLocaleDateString(),
    name: user.user?.name || "",
    designation: user.user?.personalDetails?.fullJobTitle || "",
    jobType: user.user?.personalDetails?.jobType || "",
    month: payrollData?.month || "",
    year: payrollData?.year?.toString() || "",
    basicSalary: payrollData?.basicSalary?.toLocaleString() || "0",
    medicalAllowance:
      payrollData?.earnings?.allowances?.medicalAllowance?.toLocaleString() ||
      "0",
    fuelAllowance:
      payrollData?.earnings?.allowances?.fuelAllowance?.toLocaleString() || "0",
    mobileAllowance:
      payrollData?.earnings?.allowances?.mobileAllowance?.toLocaleString() ||
      "0",
    grossSalary: (
      (payrollData?.basicSalary || 0) +
      (payrollData?.earnings?.allowances?.medicalAllowance || 0) +
      (payrollData?.earnings?.allowances?.fuelAllowance || 0) +
      (payrollData?.earnings?.allowances?.mobileAllowance || 0)
    ).toLocaleString(),
    tax: payrollData?.deductions?.tax?.toLocaleString() || "0",
    eobi: payrollData?.deductions?.eobi?.toLocaleString() || "0",
    pfContribution:
      payrollData?.deductions?.providentFund.employeeContribution?.toLocaleString() ||
      "0",
    amountPayable: (
      payrollData?.netSalary || calculateNetSalary()
    ).toLocaleString(),
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <FaSpinner
          size={30}
          className="animate-spin text-blue-600 mb-6"
          aria-hidden="true"
        />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center mt-40">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto mb-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Retrieving Payroll Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );

  if (!payrollData)
    return (
      <div className="flex flex-col items-center mt-20">
        <FaInbox size={30} className="text-gray-600 mb-4" />
        <span className="text-lg font-medium">No Payroll Data Available</span>
      </div>
    );

  const tableClass =
    "w-full border-collapse bg-white border border-gray-300 rounded-md mb-4 md:mb-6";
  const thClass =
    "bg-purple-900 text-white text-xs sm:text-sm font-semibold text-left px-2 py-2 sm:px-4 sm:py-2 border border-gray-300";
  const tdClass =
    "text-xs sm:text-sm text-gray-800 px-2 py-2 sm:px-4 sm:py-2 border border-gray-300 whitespace-nowrap";

  return (
    <div className="w-full p-3 sm:p-6 bg-white rounded-lg" id="payroll-view">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4 sm:mb-0">
          Salary Slip
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <select
            id="monthYear"
            value={selectedMonthYear}
            onChange={(e) => handleMonthYearChange(e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm mb-2 sm:mb-0"
          >
            {monthYearOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <PDFDownloadLink
            document={<SalarySlipPDF data={pdfData} />}
            fileName={`Salary_Slip_${selectedMonthYear.replace(
              /\s+/g,
              "_"
            )}.pdf`}
            style={{
              textDecoration: "none",
              padding: "10px 20px",
              color: "#fff",
              backgroundColor: "#1b45d5",
              borderRadius: "5px",
              display: "inline-block",
            }}
          >
            Download PDF
          </PDFDownloadLink>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass} colSpan={2}>
                  Personal Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Name</td>
                <td className={`${tdClass} font-bold`}>{user.user?.name}</td>
              </tr>
              <tr>
                <td className={tdClass}>Designation</td>
                <td className={`${tdClass} font-bold`}>
                  {user.user?.personalDetails?.fullJobTitle}
                </td>
              </tr>
              <tr>
                <td className={tdClass}>Job Type</td>
                <td className={`${tdClass} font-bold`}>
                  {user.user?.personalDetails?.jobType}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass} colSpan={2}>
                  Salary Period
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${tdClass} w-1/2`}>Salary for the month of</td>
                <td className={`${tdClass} font-bold w-1/2`}>
                  {selectedMonthYear}
                </td>
              </tr>
              <tr>
                <td className={`${tdClass} w-1/2`}>Year</td>
                <td className={`${tdClass} font-bold w-1/2`}>
                  {payrollData?.year}
                </td>
              </tr>
              <tr>
                <td className={`${tdClass} w-1/2`}>Month</td>
                <td className={`${tdClass} font-bold w-1/2`}>
                  {payrollData?.month}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <table className={tableClass}>
        <thead>
          <tr>
            <th className={thClass} colSpan={2}>
              Salary Details
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${tdClass} w-1/2`}>Basic Salary</td>
            <td className={`${tdClass} w-1/2`}>{payrollData?.basicSalary}</td>
          </tr>
          <tr>
            <td className={`${tdClass} w-1/2`}>Medical Allowance</td>
            <td className={`${tdClass} w-1/2`}>
              {payrollData?.earnings?.allowances?.medicalAllowance}
            </td>
          </tr>
          <tr>
            <td className={`${tdClass} w-1/2`}>Mobile Allowance</td>
            <td className={`${tdClass} w-1/2`}>
              {payrollData?.earnings?.allowances?.mobileAllowance}
            </td>
          </tr>
          <tr>
            <td className={`${tdClass} w-1/2`}>Fuel Allowance</td>
            <td className={`${tdClass} w-1/2`}>
              {payrollData?.earnings?.allowances?.fuelAllowance}
            </td>
          </tr>
          <tr>
            <td className={`${tdClass} w-1/2`}>Gross Salary</td>
            <td className={`${tdClass} w-1/2`}>
              {payrollData?.earnings?.basicSalary}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass} colSpan={2}>
                Additions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdClass}>N/A</td>
              <td className={tdClass}>N/A</td>
            </tr>
          </tbody>
        </table>

        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass} colSpan={2}>
                Deductions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdClass}>Tax</td>
              <td className={tdClass}>{payrollData?.deductions?.tax}</td>
            </tr>
            <tr>
              <td className={tdClass}>EOBI</td>
              <td className={tdClass}>{payrollData?.deductions?.eobi}</td>
            </tr>
            <tr>
              <td className={tdClass}>PF Contribution</td>
              <td className={tdClass}>
                {payrollData?.deductions?.providentFund?.employeeContribution}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className={tableClass}>
        <thead>
          <tr>
            <th className={`${thClass} w-1/2`}>Amount Payable</th>
            <th className={`${tdClass} w-1/2 text-black text-left`}>
              PKR {(payrollData.netSalary || calculateNetSalary()).toFixed(2)}
            </th>
          </tr>
        </thead>
      </table>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
        {/* <div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass} colSpan={2}>
                  Leave Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Casual Leave</td>
                <td className={tdClass}>
                  {payrollData?.leaveDetails?.casualLeaveAvailable}
                </td>
              </tr>
              <tr>
                <td className={tdClass}>Sick Leave</td>
                <td className={tdClass}>
                  {payrollData?.leaveDetails?.sickLeaveAvailable}
                </td>
              </tr>
              <tr>
                <td className={tdClass}>Annual Leave</td>
                <td className={tdClass}>
                  {payrollData?.leaveDetails?.annualLeaveAvailable}
                </td>
              </tr>
            </tbody>
          </table>
        </div> */}

        <div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass} colSpan={2}>
                  Provident Fund Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${tdClass} w-1/2 text-black text-left`}>
                  Your Contribution
                </td>
                <td className={tdClass}>
                  {payrollData?.deductions?.providentFund?.employeeContribution}
                </td>
              </tr>
              <tr>
                <td className={`${tdClass} w-1/2 text-black text-left`}>
                  Employer Contribution
                </td>
                <td className={tdClass}>
                  {payrollData?.deductions?.providentFund?.employerContribution}
                </td>
              </tr>
              <tr>
                <td className={`${tdClass} w-1/2 text-black text-left`}>
                  Total Provident Fund
                </td>
                <td className={tdClass}>
                  {(payrollData?.deductions?.providentFund
                    ?.employeeContribution || 0) +
                    (payrollData?.deductions?.providentFund
                      ?.employerContribution || 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollView;
