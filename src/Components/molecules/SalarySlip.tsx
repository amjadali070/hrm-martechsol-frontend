import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBuilding,
  FaRegCalendarCheck,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaSpinner,
  FaDownload,
} from "react-icons/fa";
import { PayrollData } from "./payrollManagment/PayrollContext";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosConfig";
import { getMonthName } from "../../utils/monthUtils";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalarySlipPDF from "../../html/SalarySlipPDF";

const SalarySlip: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const [payrolls, setPayrolls] = useState<PayrollData[]>([]);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollData | null>(
    null
  );
  const [extraPayments, setExtraPayments] = useState<
    { id: string; description: string; amount: number }[]
  >([]);
  const [tax, setTax] = useState<number>(0);
  const [eobi, setEobi] = useState<number>(0);
  const [employeePF, setEmployeePF] = useState<number>(0);
  const [payrollLoading, setPayrollLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const parseCurrency = (value: string): number => {
    return Number(value.replace(/[^0-9.-]+/g, ""));
  };

  const formatCurrency = (value: string | number): string => {
    let numericValue: number;
    if (typeof value === "string") {
      numericValue = parseCurrency(value);
    } else {
      numericValue = value;
    }
    return (
      "PKR " +
      numericValue.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })
    );
  };

  const userId = user?._id;
  useEffect(() => {
    const fetchPayrolls = async () => {
      console.log("userId", userId);
      if (!userId) {
        setError("User ID not found.");
        return;
      }
      try {
        setPayrollLoading(true);
        const response = await axiosInstance.get(`/api/payroll/user/${userId}`);
        setPayrolls(response.data);
      } catch (err: any) {
        console.error("Error fetching payrolls:", err);
        setError(err.response?.data?.message || "Failed to fetch payrolls.");
      } finally {
        setPayrollLoading(false);
      }
    };
    fetchPayrolls();
  }, [userId]);

  const handlePayrollClick = async (payroll: PayrollData) => {
    setSelectedPayroll(payroll);
    setExtraPayments(payroll.extraPayments || []);
    setTax(payroll.tax || 0);
    setEobi(payroll.eobi || 0);
    setEmployeePF(payroll.employeePF || 0);
  };

  const calculateNetSalary = () => {
    if (!selectedPayroll) return 0;
    const extrasTotal = extraPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return (
      selectedPayroll.totalSalary -
      selectedPayroll.deductions -
      tax -
      eobi -
      employeePF +
      extrasTotal
    );
  };

  const preparePDFData = () => {
    if (!selectedPayroll || !user) return null;

    const totalAbsents = selectedPayroll.absentDates?.length || 0;
    const totalAbsentDeductions = (
      totalAbsents * selectedPayroll.perDaySalary
    ).toFixed(0);

    const totalLateIns = selectedPayroll.lateIns || 0;
    const totalLateInDeductions = (
      (Math.floor(totalLateIns / 4) * selectedPayroll.perDaySalary) /
      2
    ).toFixed(0);

    const totalHalfDays = selectedPayroll.halfDays || 0;
    const totalHalfDayDeductions = (
      (totalHalfDays * selectedPayroll.perDaySalary) /
      2
    ).toFixed(0);

    const leaveTypeCounts: { [key: string]: number } = {};
    if (selectedPayroll.leaveDates) {
      selectedPayroll.leaveDates.forEach((leave) => {
        if (leaveTypeCounts[leave.type]) {
          leaveTypeCounts[leave.type]++;
        } else {
          leaveTypeCounts[leave.type] = 1;
        }
      });
    }

    const pdfData = {
      date: new Date().toLocaleDateString(),
      name: selectedPayroll.user.name,
      department: selectedPayroll.user.personalDetails.department,
      jobTitle: selectedPayroll.user.personalDetails.jobTitle,
      month: getMonthName(selectedPayroll.month),
      year: selectedPayroll.year.toString(),
      basicSalary: `PKR ${selectedPayroll.basicSalary.toFixed(0)}`,
      medicalAllowance: `PKR ${
        (selectedPayroll.user as any)?.salaryDetails?.medicalAllowance ||
        selectedPayroll.allowances ||
        0
      }`,
      mobileAllowance: `PKR ${
        (selectedPayroll.user as any)?.salaryDetails?.mobileAllowance || 0
      }`,
      fuelAllowance: `PKR ${
        (selectedPayroll.user as any)?.salaryDetails?.fuelAllowance || 0
      }`,
      grossSalary: `PKR ${selectedPayroll.totalSalary.toFixed(0)}`,
      tax: `PKR ${tax.toFixed(0)}`,
      eobi: `PKR ${eobi.toFixed(0)}`,
      pfContribution: `PKR ${employeePF.toFixed(0)}`,
      absentDeductions: `PKR ${totalAbsentDeductions}`,
      amountPayable: `PKR ${calculateNetSalary().toFixed(0)}`,
      extraPayments: extraPayments.map((payment) => ({
        description: payment.description,
        amount: `PKR ${payment.amount.toFixed(0)}`,
      })),
      absentDates: selectedPayroll.absentDates || [],
      leaveDates: selectedPayroll.leaveDates || [],
      leaveDetails: {
        casualLeaveAvailable:
          (selectedPayroll.user as any)?.leaveDetails?.casualLeaveAvailable ||
          "0",
        sickLeaveAvailable:
          (selectedPayroll.user as any)?.leaveDetails?.sickLeaveAvailable ||
          "0",
        annualLeaveAvailable:
          (selectedPayroll.user as any)?.leaveDetails?.annualLeaveAvailable ||
          "0",
      },
      totalHalfDays: selectedPayroll.halfDays || 0,
      totalHalfDayDeductions: `PKR ${totalHalfDayDeductions}`,
      halfDayDates: selectedPayroll.halfDayDates || [],
      totalAbsents,
      totalAbsentDeductions: `PKR ${totalAbsentDeductions}`,
      totalLateIns,
      lateInDates: selectedPayroll.lateInDates || [],
      totalLateInDeductions: `PKR ${totalLateInDeductions}`,
      leaveTypeCounts,
    };

    return pdfData;
  };

  if (loading || payrollLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-blue-500" size={50} />
      </div>
    );
  }

  //   if (error) {
  //     return (
  //       <div className="flex items-center justify-center h-screen">
  //         <p className="text-gray-700">{error}</p>
  //       </div>
  //     );
  //   }

  if (!selectedPayroll) {
    return (
      <div className=" bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full dark:bg-gray-800 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl font-bold text-black px-4 py-2">
                Payroll Months
              </h2>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          </div>

          <div className="space-y-8">
            <div className="p-6 border rounded-lg">
              {payrolls.length > 0 ? (
                <table className="w-full table-auto bg-white rounded-lg overflow-hidden">
                  <thead className="bg-purple-900 text-white">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold rounded-l-lg">
                        S.No
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold ">
                        Month
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold rounded-r-lg">
                        Year
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrolls.map((payroll, idx) => (
                      <tr
                        key={payroll.id}
                        className="cursor-pointer"
                        onClick={() => handlePayrollClick(payroll)}
                      >
                        <td className="px-4 py-2 text-center">{idx + 1}</td>
                        <td className="px-4 py-2 text-center text-blue-600">
                          {getMonthName(payroll.month)}
                        </td>
                        <td className="px-4 py-2 text-center ">
                          {payroll.year}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No payroll records found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full dark:bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-black px-4 py-2">
              Salary Slip
            </h2>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setSelectedPayroll(null)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full transition-colors hover:bg-blue-700"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
            <PDFDownloadLink
              document={<SalarySlipPDF data={preparePDFData()!} />}
              fileName={`salary-slip-${selectedPayroll.month}-${selectedPayroll.year}.pdf`}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-full transition-colors "
            >
              <FaDownload className="mr-2" />
              Download PDF
            </PDFDownloadLink>
          </div>
        </div>

        <div className="space-y-8">
          {/* Section 1: User Details */}
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaBuilding className="mr-2" /> User Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 dark:text-gray-100">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <div className="mt-1">{selectedPayroll?.user.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <div className="mt-1">{selectedPayroll?.user.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium">Department</label>
                <div className="mt-1">
                  {selectedPayroll?.user.personalDetails?.department}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Job Title</label>
                <div className="mt-1">
                  {selectedPayroll?.user.personalDetails?.jobTitle || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payroll Period */}
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaRegCalendarCheck className="mr-2" /> Payroll Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 dark:text-gray-100">
              <div>
                <label className="block text-sm font-medium">Month</label>
                <div className="mt-1">
                  {getMonthName(selectedPayroll!.month)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Year</label>
                <div className="mt-1">{selectedPayroll!.year}</div>
              </div>
            </div>
          </div>

          {/* Section 3: Salary Details */}
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2" /> Salary Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-800 dark:text-gray-100">
              <div>
                <label className="block text-sm font-medium">
                  Basic Salary (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {formatCurrency(selectedPayroll!.basicSalary.toFixed(0))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Medical Allowance (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {(selectedPayroll as any)?.user?.salaryDetails
                    ?.medicalAllowance || selectedPayroll!.allowances}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Mobile Allowance (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {(selectedPayroll as any)?.user?.salaryDetails
                    ?.mobileAllowance || 0}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Fuel Allowance (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {(selectedPayroll as any)?.user?.salaryDetails
                    ?.fuelAllowance || 0}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Per Day Salary (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {formatCurrency(selectedPayroll!.perDaySalary.toFixed(0))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Gross Salary (PKR)
                </label>
                <div className="mt-1 font-bold text-green-700">
                  {formatCurrency(selectedPayroll!.totalSalary.toFixed(0))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Absent Dates */}
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Absent Dates
            </h3>
            <div className="text-gray-800 dark:text-gray-100">
              {selectedPayroll?.absentDates &&
              selectedPayroll.absentDates.length > 0 ? (
                <table className="min-w-full border divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold">S.No</th>
                      <th className="px-4 py-2 text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayroll.absentDates.map((date, idx) => (
                      <tr key={idx} className="hover:bg-gray-100">
                        <td className="px-4 py-2 text-center">{idx + 1}</td>
                        <td className="px-4 py-2 text-center">
                          {new Date(date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No absent dates recorded.</p>
              )}
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Total Absent Deductions (PKR)
                </label>
                <div className="mt-1 font-bold text-red-700 rounded bg-red-50 p-2">
                  {formatCurrency(
                    (
                      (selectedPayroll?.absentDates?.length || 0) *
                      (selectedPayroll?.perDaySalary || 0)
                    ).toFixed(0)
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 8: Late In Dates and Deductions */}
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Late In Details
            </h3>
            <div className="text-gray-800 dark:text-gray-100">
              {selectedPayroll?.lateInDates &&
              selectedPayroll.lateInDates.length > 0 ? (
                <table className="min-w-full border divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold">S.No</th>
                      <th className="px-4 py-2 text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayroll.lateInDates.map((date, idx) => (
                      <tr key={idx} className="hover:bg-gray-100">
                        <td className="px-4 py-2 text-center">{idx + 1}</td>
                        <td className="px-4 py-2 text-center">
                          {new Date(date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No late in dates recorded.</p>
              )}
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Total Late In Deductions (PKR)
                </label>
                <div className="mt-1 font-bold text-red-700 rounded bg-red-50 p-2">
                  {formatCurrency(
                    (
                      (Math.floor((selectedPayroll?.lateIns ?? 0) / 4) *
                        (selectedPayroll?.perDaySalary ?? 0)) /
                      2
                    ).toFixed(0)
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Half Days Details
            </h3>
            <div className="text-gray-800 dark:text-gray-100">
              {selectedPayroll?.halfDayDates &&
              selectedPayroll.halfDayDates.length > 0 ? (
                <table className="min-w-full border divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold">S.No</th>
                      <th className="px-4 py-2 text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayroll.halfDayDates.map((date, idx) => (
                      <tr key={idx} className="hover:bg-gray-100">
                        <td className="px-4 py-2 text-center">{idx + 1}</td>
                        <td className="px-4 py-2 text-center">
                          {new Date(date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No half day dates recorded.</p>
              )}
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Total Half Days Deductions (PKR)
                </label>
                <div className="mt-1 font-bold text-red-700 rounded bg-red-50 p-2">
                  {formatCurrency(
                    (
                      ((selectedPayroll?.halfDays || 0) *
                        (selectedPayroll?.perDaySalary || 0)) /
                      2
                    ).toFixed(0)
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* NEW Section 5: Leave Dates */}
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Leave Dates
            </h3>
            <div className="text-gray-800 dark:text-gray-100">
              {selectedPayroll?.leaveDates &&
              selectedPayroll.leaveDates.length > 0 ? (
                <table className="min-w-full border divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold">S.No</th>
                      <th className="px-4 py-2 text-sm font-semibold">Date</th>
                      <th className="px-4 py-2 text-sm font-semibold">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayroll.leaveDates.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-gray-100">
                        <td className="px-4 py-2 text-center">{idx + 1}</td>
                        <td className="px-4 py-2 text-center">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-center">{entry.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No leave dates recorded.</p>
              )}
            </div>
          </div>

          {/* Section 6: Deductions */}
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Deductions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-800 dark:text-gray-100">
              <div>
                <label className="block text-sm font-medium">Tax (PKR)</label>
                <div className="mt-1 font-bold">
                  {formatCurrency(tax.toFixed(0))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">EOBI (PKR)</label>
                <div className="mt-1 font-bold">
                  {formatCurrency(eobi.toFixed(0))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Employee PF (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {formatCurrency(employeePF.toFixed(0))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Absent Deductions (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {formatCurrency(
                    (selectedPayroll?.absentDates?.length || 0) *
                      (selectedPayroll?.perDaySalary || 0)
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Late IN Deductions (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {formatCurrency(
                    (
                      (Math.floor((selectedPayroll?.lateIns ?? 0) / 4) *
                        (selectedPayroll?.perDaySalary ?? 0)) /
                      2
                    ).toFixed(0)
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Half Days Deductions (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {formatCurrency(
                    (
                      ((selectedPayroll?.halfDays || 0) *
                        (selectedPayroll?.perDaySalary || 0)) /
                      2
                    ).toFixed(0)
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">
                Total Deductions (PKR)
              </label>
              <div className="mt-1 font-bold text-red-700 rounded bg-red-50 p-2">
                {formatCurrency(
                  (
                    selectedPayroll!.deductions +
                    tax +
                    eobi +
                    employeePF
                  ).toFixed(0)
                )}
              </div>
            </div>
          </div>

          {/* Section 7: Extra Payments */}
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2" /> Extra Payments
            </h3>
            {extraPayments.length > 0 ? (
              <table className="min-w-full border divide-y divide-gray-300 rounded-lg overflow-hidden text-center">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-sm font-semibold">
                      Description
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold">
                      Amount (PKR)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {extraPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{payment.description}</td>
                      <td className="px-4 py-2">
                        {formatCurrency(payment.amount.toFixed(0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No extra payments added.</p>
            )}
          </div>

          {/* Section 8: Payroll Summary */}
          <div className="p-6 border rounded-lg bg-white dark:bg-gray-600">
            <h3 className="text-2xl font-bold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Payroll Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-100 rounded-lg text-center">
                <span className="text-sm text-gray-700">
                  Gross Salary (PKR)
                </span>
                <div className="mt-2 text-2xl font-extrabold text-green-800">
                  {formatCurrency(selectedPayroll!.totalSalary.toFixed(0))}
                </div>
              </div>
              <div className="p-4 bg-yellow-100 rounded-lg text-center">
                <span className="text-sm text-gray-700">
                  Total Deductions (PKR)
                </span>
                <div className="mt-2 text-2xl font-extrabold text-yellow-800">
                  {formatCurrency(
                    selectedPayroll!.deductions + tax + eobi + employeePF
                  )}
                </div>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg text-center">
                <span className="text-sm text-gray-700">Net Salary (PKR)</span>
                <div className="mt-2 text-2xl font-extrabold text-blue-800">
                  {formatCurrency(calculateNetSalary().toFixed(0))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlip;
