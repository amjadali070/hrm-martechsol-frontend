import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaRegCalendarAlt,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaDownload,
  FaUserTie,
  FaCalendarCheck,
  FaWallet,
  FaReceipt,
  FaInbox,
  FaArrowRight,
} from "react-icons/fa";
import { PayrollData } from "./payrollManagment/PayrollContext";
import useUser from "../../hooks/useUser";
import axiosInstance from "../../utils/axiosConfig";
import { getMonthName } from "../../utils/monthUtils";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalarySlipPDF from "../../html/SalarySlipPDF";
import LoadingSpinner from "../atoms/LoadingSpinner";

const SalarySlip: React.FC = () => {
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
      if (!userId) {
        return;
      }
      try {
        setPayrollLoading(true);
        const response = await axiosInstance.get(
          `/api/payroll/processed/user/${userId}`
        );
        setPayrolls(response.data);
      } catch (err: any) {
        console.error("Error fetching payrolls:", err);
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
    return <LoadingSpinner className="p-20" size="xl" />;
  }

  // --- VIEW: LIST OF PAYROLLS ---
  if (!selectedPayroll) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl border border-platinum-200 flex flex-col mb-8 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-platinum-200">
          <div className="flex items-center gap-4">
            <div className="bg-gunmetal-50 p-3 rounded-2xl border border-platinum-200 shadow-inner text-gunmetal-600">
              <FaMoneyBillWave className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gunmetal-900 tracking-tight">
                Payroll History
              </h2>
              <p className="text-sm font-medium text-slate-grey-500">
                View your salary slips and payment history.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {payrolls.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-platinum-200 shadow-sm bg-white">
              <table className="w-full text-left bg-white border-collapse">
                <thead className="bg-alabaster-grey-50 border-b border-platinum-200">
                  <tr>
                    <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-center w-20">
                      S.No
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-platinum-100">
                  {payrolls.map((payroll, idx) => (
                    <tr
                      key={payroll.id}
                      className="group hover:bg-alabaster-grey-50/50 transition-colors cursor-pointer"
                      onClick={() => handlePayrollClick(payroll)}
                    >
                      <td className="py-4 px-6 text-sm font-medium text-slate-grey-500 text-center font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-gunmetal-900">
                        {getMonthName(payroll.month)}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-grey-600 font-mono">
                        {payroll.year}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-gunmetal-500 hover:text-gunmetal-900 group-hover:translate-x-1 transition-all p-2 rounded-full hover:bg-gunmetal-50">
                          <FaArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-alabaster-grey-50/30 rounded-2xl border-2 border-dashed border-platinum-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-platinum-100">
                <FaInbox size={24} className="text-slate-grey-300" />
              </div>
              <h3 className="text-lg font-bold text-gunmetal-800">
                No payroll records found
              </h3>
              <p className="text-slate-grey-500 text-sm mt-1">
                Salary slips will appear here once generated.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- VIEW: SELECTED PAYROLL DETAIL (SALARY SLIP) ---
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-platinum-200 flex flex-col mb-8 overflow-hidden animate-fadeIn">
      {/* Header with Navigation */}
      <div className="bg-white px-8 py-6 border-b border-platinum-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-gunmetal-50 p-3 rounded-2xl border border-platinum-200 shadow-inner text-gunmetal-600">
            <FaFileInvoiceDollar className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-gunmetal-900 tracking-tight">
              Salary Slip
            </h2>
            <p className="text-sm font-medium text-slate-grey-500 flex items-center gap-2">
              <span className="font-bold text-gunmetal-700">
                {getMonthName(selectedPayroll.month)} {selectedPayroll.year}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-grey-300"></span>
              <span>Official Record</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setSelectedPayroll(null)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-platinum-200 text-slate-grey-600 text-sm font-bold rounded-xl hover:bg-gunmetal-50 hover:text-gunmetal-900 transition-all shadow-sm flex-1 md:flex-none"
          >
            <FaArrowLeft size={12} /> Back
          </button>
          <PDFDownloadLink
            document={<SalarySlipPDF data={preparePDFData()!} />}
            fileName={`salary-slip-${selectedPayroll.month}-${selectedPayroll.year}.pdf`}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gunmetal-900 text-white text-sm font-bold rounded-xl hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20 flex-1 md:flex-none"
          >
            {({ loading }) =>
              loading ? (
                "Generating..."
              ) : (
                <>
                  <FaDownload size={14} /> Download PDF
                </>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>

      <div className="p-8 space-y-8 bg-alabaster-grey-50/30">
        {/* Section: User & Period Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 border border-platinum-200 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <FaUserTie className="text-7xl text-gunmetal-900" />
            </div>
            <h3 className="text-xs font-bold text-slate-grey-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FaUserTie className="text-gunmetal-500" /> Employee Details
            </h3>
            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-xs text-slate-grey-500 font-bold uppercase mb-1">
                  Full Name
                </p>
                <p className="text-lg font-bold text-gunmetal-900">
                  {selectedPayroll?.user.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-grey-500 font-bold uppercase mb-1">
                    Job Title
                  </p>
                  <p className="text-sm font-bold text-gunmetal-700">
                    {selectedPayroll?.user.personalDetails?.jobTitle || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-grey-500 font-bold uppercase mb-1">
                    Department
                  </p>
                  <p className="text-sm font-bold text-gunmetal-700">
                    {selectedPayroll?.user.personalDetails?.department}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-grey-500 font-bold uppercase mb-1">
                  Email Address
                </p>
                <p className="text-sm font-medium text-slate-grey-600">
                  {selectedPayroll?.user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-platinum-200 rounded-2xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <FaCalendarCheck className="text-7xl text-gunmetal-900" />
            </div>
            <h3 className="text-xs font-bold text-slate-grey-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FaRegCalendarAlt className="text-gunmetal-500" /> Pay Period
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gunmetal-50 rounded-xl text-center min-w-[80px] border border-platinum-100">
                  <span className="block text-2xl font-bold text-gunmetal-900">
                    {selectedPayroll!.year}
                  </span>
                  <span className="text-xs font-bold text-slate-grey-500 uppercase">
                    Year
                  </span>
                </div>
                <div className="p-3 bg-gunmetal-50 rounded-xl text-center min-w-[100px] border border-platinum-100 flex-1">
                  <span className="block text-2xl font-bold text-gunmetal-900">
                    {getMonthName(selectedPayroll!.month)}
                  </span>
                  <span className="text-xs font-bold text-slate-grey-500 uppercase">
                    Month
                  </span>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-800 font-bold text-sm">
                    Payment Status
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Processed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Financial Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Earnings */}
          <div className="bg-white border border-platinum-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
            <div className="bg-alabaster-grey-50 px-6 py-5 border-b border-platinum-200 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <FaWallet size={16} />
              </div>
              <h3 className="text-sm font-bold text-gunmetal-900 uppercase tracking-wide">
                Earnings Breakdown
              </h3>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <div className="flex justify-between items-center pb-3 border-b border-platinum-100 border-dashed">
                <span className="text-sm font-medium text-slate-grey-600">
                  Basic Salary
                </span>
                <span className="text-sm font-bold text-gunmetal-900 font-mono">
                  {formatCurrency(selectedPayroll!.basicSalary.toFixed(0))}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-platinum-100 border-dashed">
                <span className="text-sm font-medium text-slate-grey-600">
                  Medical Allowance
                </span>
                <span className="text-sm font-bold text-gunmetal-900 font-mono">
                  {(selectedPayroll as any)?.user?.salaryDetails
                    ?.medicalAllowance || selectedPayroll!.allowances}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-platinum-100 border-dashed">
                <span className="text-sm font-medium text-slate-grey-600">
                  Mobile Allowance
                </span>
                <span className="text-sm font-bold text-gunmetal-900 font-mono">
                  {(selectedPayroll as any)?.user?.salaryDetails
                    ?.mobileAllowance || 0}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-platinum-100 border-dashed">
                <span className="text-sm font-medium text-slate-grey-600">
                  Fuel Allowance
                </span>
                <span className="text-sm font-bold text-gunmetal-900 font-mono">
                  {(selectedPayroll as any)?.user?.salaryDetails
                    ?.fuelAllowance || 0}
                </span>
              </div>
              {/* Extra Payments */}
              {extraPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center pb-3 border-b border-platinum-100 border-dashed"
                >
                  <span className="text-sm font-medium text-slate-grey-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {payment.description}
                  </span>
                  <span className="text-sm font-bold text-gunmetal-900 font-mono">
                    {formatCurrency(payment.amount.toFixed(0))}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-emerald-50/50 p-6 border-t border-platinum-200 mt-auto">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gunmetal-900">
                  Total Earnings
                </span>
                <span className="text-lg font-bold text-emerald-600 font-mono">
                  {formatCurrency(selectedPayroll!.totalSalary.toFixed(0))}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-white border border-platinum-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
            <div className="bg-alabaster-grey-50 px-6 py-5 border-b border-platinum-200 flex items-center gap-3">
              <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                <FaReceipt size={16} />
              </div>
              <h3 className="text-sm font-bold text-gunmetal-900 uppercase tracking-wide">
                Deductions Breakdown
              </h3>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <div className="flex justify-between items-center pb-3 border-b border-platinum-100 border-dashed">
                <span className="text-sm font-medium text-slate-grey-600">
                  Tax
                </span>
                <span className="text-sm font-bold text-gunmetal-900 font-mono">
                  {formatCurrency(tax.toFixed(0))}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-platinum-100 border-dashed">
                <span className="text-sm font-medium text-slate-grey-600">
                  EOBI
                </span>
                <span className="text-sm font-bold text-gunmetal-900 font-mono">
                  {formatCurrency(eobi.toFixed(0))}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-platinum-100 border-dashed">
                <span className="text-sm font-medium text-slate-grey-600">
                  Provident Fund
                </span>
                <span className="text-sm font-bold text-gunmetal-900 font-mono">
                  {formatCurrency(employeePF.toFixed(0))}
                </span>
              </div>
              {/* Attendance Based Deductions Calculation Display */}
              <div className="flex justify-between items-center pb-3 border-b border-platinum-100 border-dashed">
                <span className="text-sm font-medium text-slate-grey-600">
                  Absent Deductions{" "}
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded ml-1">
                    {selectedPayroll?.absentDates?.length || 0} days
                  </span>
                </span>
                <span className="text-sm font-bold text-gunmetal-900 font-mono">
                  {formatCurrency(
                    (
                      (selectedPayroll?.absentDates?.length || 0) *
                      (selectedPayroll?.perDaySalary || 0)
                    ).toFixed(0)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-platinum-100 border-dashed">
                <span className="text-sm font-medium text-slate-grey-600">
                  Late IN Deductions
                </span>
                <span className="text-sm font-bold text-gunmetal-900 font-mono">
                  {formatCurrency(
                    (
                      (Math.floor((selectedPayroll?.lateIns ?? 0) / 4) *
                        (selectedPayroll?.perDaySalary ?? 0)) /
                      2
                    ).toFixed(0)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-platinum-100 border-dashed">
                <span className="text-sm font-medium text-slate-grey-600">
                  Half Day Deductions
                </span>
                <span className="text-sm font-bold text-gunmetal-900 font-mono">
                  {formatCurrency(
                    (
                      ((selectedPayroll?.halfDays || 0) *
                        (selectedPayroll?.perDaySalary || 0)) /
                      2
                    ).toFixed(0)
                  )}
                </span>
              </div>
            </div>
            <div className="bg-rose-50/50 p-6 border-t border-platinum-200 mt-auto">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gunmetal-900">
                  Total Deductions
                </span>
                <span className="text-lg font-bold text-rose-600 font-mono">
                  {formatCurrency(
                    (
                      selectedPayroll!.deductions +
                      tax +
                      eobi +
                      employeePF
                    ).toFixed(0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Net Pay Banner */}
        <div className="bg-gunmetal-900 rounded-2xl p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>

          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">
              Net Salary Payable
            </h2>
            <p className="text-platinum-400 text-sm font-medium">
              Final amount to be transferred to employee bank account
            </p>
          </div>
          <div className="relative z-10 text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-platinum-300 bg-clip-text text-transparent font-mono tracking-tight">
            {formatCurrency(calculateNetSalary().toFixed(0))}
          </div>
        </div>

        {/* Section: Detailed Breakdowns Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Absent Dates */}
          <div className="bg-white border border-platinum-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-grey-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Absent Dates
            </h4>
            {selectedPayroll?.absentDates &&
            selectedPayroll.absentDates.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedPayroll.absentDates.map((date, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-lg font-mono"
                  >
                    {new Date(date).toLocaleDateString()}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-slate-grey-400 italic flex items-center gap-2">
                <FaCalendarCheck /> No absences recorded
              </span>
            )}
          </div>

          {/* Late Ins */}
          <div className="bg-white border border-platinum-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-grey-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Late Ins
            </h4>
            {selectedPayroll?.lateInDates &&
            selectedPayroll.lateInDates.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedPayroll.lateInDates.map((date, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold rounded-lg font-mono"
                  >
                    {new Date(date).toLocaleDateString()}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-slate-grey-400 italic flex items-center gap-2">
                <FaCalendarCheck /> No late arrivals
              </span>
            )}
          </div>

          {/* Half Days */}
          <div className="bg-white border border-platinum-200 rounded-xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-grey-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Half Days
            </h4>
            {selectedPayroll?.halfDayDates &&
            selectedPayroll.halfDayDates.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedPayroll.halfDayDates.map((date, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1.5 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold rounded-lg font-mono"
                  >
                    {new Date(date).toLocaleDateString()}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-slate-grey-400 italic flex items-center gap-2">
                <FaCalendarCheck /> No half days
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlip;
