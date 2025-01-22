// src/components/PayrollView.tsx
import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalarySlipPDF from "../../html/SalarySlipPDF";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosConfig";
import { FaInbox, FaSpinner } from "react-icons/fa";
import { getMonthName } from "../../utils/monthUtils";

interface PayrollDetails {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    personalDetails: {
      department: string;
      fullJobTitle?: string;
    };
  };
  leaveDetails?: {
    casualLeaveAvailable: number;
    sickLeaveAvailable: number;
    annualLeaveAvailable: number;
  };
  month: number; // e.g., 12 for December
  year: number;
  basicSalary: number;
  medicalAllowance: number;
  mobileAllowance: number;
  fuelAllowance: number;
  allowances: number;
  perDaySalary: number;
  totalSalary: number;
  deductions: number;
  netSalary: number;
  lateIns: number;
  absentDays: number;
  presentDays: number;
  totalWorkingDays: number;
  absentDates?: string[]; // Array of ISO date strings
  // NEW: leaveDates is an array of objects with a date and a leave type.
  leaveDates?: { date: string; type: string }[];
  status: string;
  processedOn: string | null;
  createdAt: string;
  updatedAt: string;
  employeePF: number;
  employerPF: number;
  eobi: number;
  extraPayments: { description: string; amount: number }[];
  tax: number;
}

const PayrollView: React.FC = () => {
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>("");
  const [payrollData, setPayrollData] = useState<PayrollDetails | null>(null);
  const [payrollRecords, setPayrollRecords] = useState<PayrollDetails[]>([]);
  const [monthYearOptions, setMonthYearOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Get the logged-in user details from the useUser hook.
  const { user, loading: userLoading } = useUser();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch payroll records for the logged-in user using the correct endpoint.
  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        setLoading(true);
        // Use the /api/payroll/user/:userId endpoint.
        const response = await axiosInstance.get(
          `${backendUrl}/api/payroll/user/${user?._id}`,
          { withCredentials: true }
        );

        // Sort payroll records by year (descending) and then by month (descending)
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

        const sortedRecords = response.data.sort(
          (a: PayrollDetails, b: PayrollDetails) => {
            if (b.year !== a.year) return b.year - a.year;
            return (
              monthOrder.indexOf(getMonthName(b.month)) -
              monthOrder.indexOf(getMonthName(a.month))
            );
          }
        );

        setPayrollRecords(sortedRecords);

        // Create month-year options from the records using month name.
        const options = sortedRecords.map(
          (record: PayrollDetails) =>
            `${getMonthName(record.month)} ${record.year}`
        );
        setMonthYearOptions(options);

        // Set the most recent payroll record as the default.
        if (sortedRecords.length > 0) {
          const mostRecentRecord = sortedRecords[0];
          setPayrollData(mostRecentRecord);
          setSelectedMonthYear(
            `${getMonthName(mostRecentRecord.month)} ${mostRecentRecord.year}`
          );
        }
      } catch (err: any) {
        console.error("Error fetching payroll data:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch payroll data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchPayrollData();
    }
  }, [backendUrl, user]);

  const handleMonthYearChange = (selectedValue: string) => {
    setSelectedMonthYear(selectedValue);
    const selectedRecord =
      payrollRecords.find(
        (record: PayrollDetails) =>
          `${getMonthName(record.month)} ${record.year}` === selectedValue
      ) || null;
    setPayrollData(selectedRecord);
  };

  // Calculate Total Extra Payments
  const totalExtraPayments = payrollData?.extraPayments
    ? payrollData.extraPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      )
    : 0;

  // Fallback calculation for Net Salary if not provided by the API.
  const calculateNetSalary = () => {
    if (!payrollData) return 0;
    const basicSalary = payrollData.basicSalary || 0;
    const allowances = payrollData.allowances || 0;
    const totalSalary = basicSalary + allowances + totalExtraPayments;
    const deductions = payrollData.deductions || 0;
    return totalSalary - deductions;
  };

  const pdfData = {
    date: new Date().toLocaleDateString(),
    name: user?.name || "",
    designation: user?.personalDetails?.fullJobTitle || "",
    jobType: user?.personalDetails?.jobType || "",
    month: payrollData ? getMonthName(payrollData.month) : "",
    year: payrollData?.year?.toString() || "",
    basicSalary:
      "PKR " +
      (payrollData?.basicSalary?.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) || "0"),
    medicalAllowance:
      "PKR " +
      (user?.salaryDetails?.medicalAllowance?.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) || "0"),
    mobileAllowance:
      "PKR " +
      (user?.salaryDetails?.mobileAllowance.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) || "0"),
    fuelAllowance:
      "PKR " +
      (user?.salaryDetails?.fuelAllowance?.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) || "0"),
    allowances:
      "PKR " +
      (payrollData?.allowances?.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) || "0"),
    perDaySalary:
      "PKR " +
      (payrollData?.perDaySalary?.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) || "0"),
    totalSalary:
      "PKR " +
      (payrollData?.totalSalary?.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) || "0"),
    grossSalary:
      "PKR " +
      (payrollData?.totalSalary?.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) || "0"),
    tax:
      "PKR " +
      (payrollData?.tax?.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) || "0"),
    eobi:
      "PKR " +
      (payrollData?.eobi?.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) || "0"),
    pfContribution:
      "PKR " +
      (payrollData?.employeePF?.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }) || "0"),
    netSalary:
      "PKR " +
      (payrollData?.netSalary || calculateNetSalary()).toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }),
    amountPayable:
      "PKR " +
      calculateNetSalary().toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }),
    extraPayments: payrollData?.extraPayments?.map((p) => ({
      description: p.description,
      amount:
        "PKR " + p.amount.toLocaleString("en-US", { maximumFractionDigits: 0 }),
    })),
    absentDates: payrollData?.absentDates,
    absentDeductions:
      "PKR " +
      (
        (payrollData?.absentDays || 0) * (payrollData?.perDaySalary || 0)
      ).toLocaleString("en-US", { maximumFractionDigits: 0 }),
    leaveDetails: payrollData?.leaveDetails && {
      casualLeaveAvailable:
        payrollData.leaveDetails.casualLeaveAvailable.toString(),
      sickLeaveAvailable:
        payrollData.leaveDetails.sickLeaveAvailable.toString(),
      annualLeaveAvailable:
        payrollData.leaveDetails.annualLeaveAvailable.toString(),
    },
    // NEW: Pass leaveDates to the PDF document if available.
    leaveDates: payrollData?.leaveDates,
  };

  if (loading || userLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-40">
        <FaSpinner
          size={30}
          className="animate-spin text-blue-600 mb-6"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center mt-20">
        <FaInbox size={30} className="text-gray-600 mb-4" />
        <span className="text-lg font-medium">No Payroll Data Available</span>
      </div>
    );
  }

  if (!payrollData) {
    return (
      <div className="flex flex-col items-center mt-20">
        <FaInbox size={30} className="text-gray-600 mb-4" />
        <span className="text-lg font-medium">No Payroll Data Available</span>
      </div>
    );
  }

  // CSS classes for tables.
  const tableClass =
    "w-full border-collapse bg-white border border-gray-300 rounded-md mb-4 md:mb-6";
  const thClass =
    "bg-purple-900 text-white text-xs sm:text-sm font-semibold text-left px-2 py-2 sm:px-4 sm:py-2 border border-gray-300";
  const tdClass =
    "text-xs sm:text-sm text-gray-800 px-2 py-2 sm:px-4 sm:py-2 border border-gray-300 whitespace-nowrap";
  const newStyle =
    "text-xs sm:text-sm font-semibold text-left px-2 py-2 sm:px-4 sm:py-2 border border-gray-300";

  return (
    <div className="w-full p-3 sm:p-6 bg-white rounded-lg" id="payroll-view">
      {/* Header: Month-Year selector and PDF Download */}
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

      {/* Personal Details Section */}
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
              <td className={`${tdClass} w-1/2`}>Name</td>
              <td className={`${tdClass} font-bold`}>{user?.name}</td>
            </tr>
            <tr>
              <td className={tdClass}>Designation</td>
              <td className={`${tdClass} font-bold`}>
                {user?.personalDetails?.fullJobTitle}
              </td>
            </tr>
            <tr>
              <td className={tdClass}>Job Type</td>
              <td className={`${tdClass} font-bold`}>
                {user?.personalDetails?.jobType}
              </td>
            </tr>
            <tr>
              <td className={tdClass}>Department</td>
              <td className={`${tdClass} font-bold`}>
                {user?.personalDetails?.department}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Salary Period Section */}
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
              <td className={`${tdClass} w-1/2`}>Year</td>
              <td className={`${tdClass} font-bold w-1/2`}>
                {payrollData?.year}
              </td>
            </tr>
            <tr>
              <td className={`${tdClass} w-1/2`}>Month</td>
              <td className={`${tdClass} font-bold w-1/2`}>
                {getMonthName(payrollData?.month)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Salary Details Section */}
      <div>
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
              <td className={`${tdClass} w-1/2`}>
                PKR {payrollData?.basicSalary.toFixed(0)}
              </td>
            </tr>
            <tr>
              <td className={`${tdClass} w-1/2`}>Allowances</td>
              <td className={`${tdClass} w-1/2`}>
                PKR {payrollData?.allowances.toFixed(0)}
              </td>
            </tr>
            <tr>
              <td className={`${tdClass} w-1/2`}>Gross Salary</td>
              <td className={`${tdClass} w-1/2`}>
                PKR {payrollData?.totalSalary.toFixed(0)}
              </td>
            </tr>
            <tr>
              <td className={`${tdClass} font-bold w-1/2`}>Net Salary</td>
              <td className={`${tdClass} font-bold w-1/2`}>
                PKR{" "}
                {(payrollData?.netSalary || calculateNetSalary()).toFixed(0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Absent Dates Section */}
      <div className="w-full my-4">
        {payrollData?.absentDates && payrollData.absentDates.length > 0 && (
          <div className="mt-4">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass} colSpan={2}>
                    Absent Dates
                  </th>
                </tr>
                <tr>
                  <th className={`${newStyle} w-1/2`}>S.No</th>
                  <th className={`${newStyle} w-1/2`}>Date</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.absentDates.map((dateStr, index) => {
                  const formattedDate = new Date(dateStr).toLocaleDateString();
                  return (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className={tdClass}>{index + 1}</td>
                      <td className={tdClass}>{formattedDate}</td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-200">
                  <td className={tdClass}>Absent Attendance Deductions</td>
                  <td className={`${tdClass} font-bold`}>
                    PKR{" "}
                    {(
                      (payrollData.absentDays || 0) *
                      (payrollData.perDaySalary || 0)
                    ).toFixed(0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* NEW: Leave Dates Section */}
      <div className="w-full my-4">
        {payrollData?.leaveDates && payrollData.leaveDates.length > 0 && (
          <div className="mt-4">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass} colSpan={3}>
                    Leave Dates
                  </th>
                </tr>
                <tr>
                  <th className={`${newStyle} w-1/3`}>S.No</th>
                  <th className={`${newStyle} w-1/3`}>Date</th>
                  <th className={`${newStyle} w-1/3`}>Type</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.leaveDates.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className={tdClass}>{index + 1}</td>
                    <td className={tdClass}>
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className={tdClass}>{entry.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Leave Details Section (if any leave details exist) */}
      {payrollData?.leaveDetails && (
        <div className="w-full my-4">
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
                <td className={tdClass}>Casual Leave Available</td>
                <td className={`${tdClass} font-bold`}>
                  {payrollData.leaveDetails.casualLeaveAvailable || 0}
                </td>
              </tr>
              <tr>
                <td className={tdClass}>Sick Leave Available</td>
                <td className={`${tdClass} font-bold`}>
                  {payrollData.leaveDetails.sickLeaveAvailable || 0}
                </td>
              </tr>
              <tr>
                <td className={tdClass}>Annual Leave Available</td>
                <td className={`${tdClass} font-bold`}>
                  {payrollData.leaveDetails.annualLeaveAvailable || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Deductions Section */}
      <div className="w-full my-4">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass} colSpan={2}>
                Deductions
              </th>
            </tr>
            <tr>
              <th className={`${newStyle} w-1/2`}>S.No</th>
              <th className={`${newStyle} w-1/2`}>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100">
              <td className={tdClass}>1.</td>
              <td className={tdClass}>
                Tax: PKR {payrollData?.tax.toFixed(0)}
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className={tdClass}>2.</td>
              <td className={tdClass}>
                EOBI: PKR {payrollData?.eobi.toFixed(0)}
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className={tdClass}>3.</td>
              <td className={tdClass}>
                PF Contribution (Employee): PKR{" "}
                {payrollData?.employeePF.toFixed(0)}
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className={tdClass}>4.</td>
              <td className={tdClass}>
                PF Contribution (Employer): PKR{" "}
                {payrollData?.employerPF.toFixed(0)}
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className={tdClass}>5.</td>
              <td className={tdClass}>
                Other Deductions: PKR {payrollData?.deductions.toFixed(0)}
              </td>
            </tr>
            <tr className="bg-gray-200">
              <td className={tdClass}>Total Deductions</td>
              <td className={`${tdClass} font-bold`}>
                PKR{" "}
                {(
                  (payrollData?.tax || 0) +
                  (payrollData?.eobi || 0) +
                  (payrollData?.employeePF || 0) +
                  (payrollData?.employerPF || 0) +
                  (payrollData?.deductions || 0)
                ).toFixed(0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Extra Payments Section */}
      <div className="w-full mt-4">
        {payrollData?.extraPayments && payrollData.extraPayments.length > 0 ? (
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass} colSpan={3}>
                  Extra Payments
                </th>
              </tr>
              <tr>
                <th className={newStyle}>S.No</th>
                <th className={newStyle}>Description</th>
                <th className={newStyle}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.extraPayments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className={tdClass}>{index + 1}</td>
                  <td className={tdClass}>{payment.description}</td>
                  <td className={tdClass}>
                    PKR{" "}
                    {payment.amount.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-200">
                <td className={tdClass} colSpan={2}>
                  Total Extra Payments
                </td>
                <td className={`${tdClass} font-bold`}>
                  PKR{" "}
                  {totalExtraPayments.toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <p className="text-gray-600">No extra payments.</p>
        )}
      </div>

      {/* Amount Payable Section */}
      <table className={tableClass}>
        <thead>
          <tr>
            <th className={`${thClass} w-1/2`}>Amount Payable</th>
            <th className={`${tdClass} w-1/2 text-black text-left`}>
              PKR {calculateNetSalary().toFixed(0)}
            </th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default PayrollView;
