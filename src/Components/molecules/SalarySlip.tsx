import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBuilding,
  FaRegCalendarAlt,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaSpinner,
  FaDownload,
  FaUserTie,
  FaCalendarCheck,
  FaWallet,
  FaReceipt,
  FaInbox,
  FaArrowRight
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
    return (
      <div className="flex items-center justify-center p-20">
        <FaSpinner className="animate-spin text-gunmetal-600 mb-4" size={40} />
      </div>
    );
  }

  // --- VIEW: LIST OF PAYROLLS ---
  if (!selectedPayroll) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 flex flex-col mb-8 overflow-hidden">
        {/* Header */}
        <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200">
           <div className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
                  <FaMoneyBillWave className="text-gunmetal-600 text-xl" />
              </div>
              <div>
                  <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                    Payroll History
                  </h2>
                  <p className="text-sm text-slate-grey-500">
                    View your salary slips and payment history.
                  </p>
              </div>
           </div>
        </div>

        <div className="p-8">
            {payrolls.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
                    <table className="w-full text-left bg-white border-collapse">
                        <thead className="bg-alabaster-grey-50">
                            <tr>
                                <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-center w-20">
                                S.No
                                </th>
                                <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                                Month
                                </th>
                                <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200">
                                Year
                                </th>
                                 <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 text-right">
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
                                    <td className="py-4 px-6 text-sm text-slate-grey-500 text-center font-mono">
                                        {idx + 1}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-semibold text-gunmetal-900">
                                         {getMonthName(payroll.month)}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-slate-grey-600">
                                         {payroll.year}
                                    </td>
                                     <td className="py-4 px-6 text-right">
                                        <button className="text-gunmetal-600 hover:text-gunmetal-900 group-hover:translate-x-1 transition-all">
                                            <FaArrowRight size={14} />
                                        </button>
                                     </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-platinum-200 rounded-xl bg-alabaster-grey-50/50">
                    <FaInbox size={48} className="text-slate-grey-300 mb-3" />
                    <h3 className="text-lg font-bold text-gunmetal-800">No payroll records found</h3>
                </div>
            )}
        </div>
      </div>
    );
  }

  // --- VIEW: SELECTED PAYROLL DETAIL (SALARY SLIP) ---
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 flex flex-col mb-8 overflow-hidden">
        {/* Header with Navigation */}
         <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div className="flex items-center gap-3">
              <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
                  <FaFileInvoiceDollar className="text-gunmetal-600 text-xl" />
              </div>
              <div>
                  <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                    Salary Slip
                  </h2>
                  <p className="text-sm text-slate-grey-500">
                    {getMonthName(selectedPayroll.month)} {selectedPayroll.year}
                  </p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
               <button
                  onClick={() => setSelectedPayroll(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-platinum-200 text-gunmetal-700 text-sm font-bold rounded-lg hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm"
                >
                  <FaArrowLeft size={12} /> Back
               </button>
                <PDFDownloadLink
                document={<SalarySlipPDF data={preparePDFData()!} />}
                fileName={`salary-slip-${selectedPayroll.month}-${selectedPayroll.year}.pdf`}
                className="flex items-center gap-2 px-4 py-2 bg-gunmetal-900 text-white text-sm font-bold rounded-lg hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20"
                >
                    {({ loading }) => (
                         loading ? 'Generating...' : <><FaDownload size={12} /> Download PDF</>
                     )}
                </PDFDownloadLink>
           </div>
        </div>

      <div className="p-8 space-y-8">
        {/* Section: User & Period Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border border-platinum-200 rounded-xl bg-alabaster-grey-50/50 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <FaUserTie className="text-6xl text-gunmetal-900" />
                 </div>
                <h3 className="text-sm font-bold text-slate-grey-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <FaUserTie className="text-gunmetal-600" /> Employee Details
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between border-b border-platinum-200 pb-2">
                        <span className="text-sm text-slate-grey-600">Name</span>
                        <span className="text-sm font-bold text-gunmetal-900">{selectedPayroll?.user.name}</span>
                    </div>
                     <div className="flex justify-between border-b border-platinum-200 pb-2">
                        <span className="text-sm text-slate-grey-600">Email</span>
                        <span className="text-sm font-bold text-gunmetal-900">{selectedPayroll?.user.email}</span>
                    </div>
                     <div className="flex justify-between border-b border-platinum-200 pb-2">
                        <span className="text-sm text-slate-grey-600">Job Title</span>
                        <span className="text-sm font-bold text-gunmetal-900">{selectedPayroll?.user.personalDetails?.jobTitle || "N/A"}</span>
                    </div>
                     <div className="flex justify-between pb-1">
                        <span className="text-sm text-slate-grey-600">Department</span>
                        <span className="text-sm font-bold text-gunmetal-900">{selectedPayroll?.user.personalDetails?.department}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 border border-platinum-200 rounded-xl bg-alabaster-grey-50/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <FaCalendarCheck className="text-6xl text-gunmetal-900" />
                 </div>
                <h3 className="text-sm font-bold text-slate-grey-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <FaRegCalendarAlt className="text-gunmetal-600" /> Pay Period
                </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-platinum-200 pb-2">
                        <span className="text-sm text-slate-grey-600">Month</span>
                        <span className="text-sm font-bold text-gunmetal-900">{getMonthName(selectedPayroll!.month)}</span>
                    </div>
                     <div className="flex justify-between pb-1">
                        <span className="text-sm text-slate-grey-600">Year</span>
                        <span className="text-sm font-bold text-gunmetal-900">{selectedPayroll!.year}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Section: Financial Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Earnings */}
             <div className="border border-platinum-200 rounded-xl overflow-hidden">
                <div className="bg-alabaster-grey-50 px-6 py-4 border-b border-platinum-200 flex items-center gap-2">
                    <FaWallet className="text-emerald-600" />
                    <h3 className="text-sm font-bold text-gunmetal-900 uppercase tracking-wide">Earnings</h3>
                </div>
                <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-platinum-100">
                        <span className="text-sm text-slate-grey-600">Basic Salary</span>
                        <span className="text-sm font-bold text-gunmetal-900">{formatCurrency(selectedPayroll!.basicSalary.toFixed(0))}</span>
                    </div>
                     <div className="flex justify-between items-center py-2 border-b border-platinum-100">
                        <span className="text-sm text-slate-grey-600">Medical Allowance</span>
                        <span className="text-sm font-bold text-gunmetal-900">{ (selectedPayroll as any)?.user?.salaryDetails?.medicalAllowance || selectedPayroll!.allowances}</span>
                    </div>
                     <div className="flex justify-between items-center py-2 border-b border-platinum-100">
                        <span className="text-sm text-slate-grey-600">Mobile Allowance</span>
                        <span className="text-sm font-bold text-gunmetal-900">{ (selectedPayroll as any)?.user?.salaryDetails?.mobileAllowance || 0}</span>
                    </div>
                     <div className="flex justify-between items-center py-2 border-b border-platinum-100">
                        <span className="text-sm text-slate-grey-600">Fuel Allowance</span>
                        <span className="text-sm font-bold text-gunmetal-900">{ (selectedPayroll as any)?.user?.salaryDetails?.fuelAllowance || 0}</span>
                    </div>
                    {/* Extra Payments */}
                    {extraPayments.map((payment) => (
                         <div key={payment.id} className="flex justify-between items-center py-2 border-b border-platinum-100">
                            <span className="text-sm text-slate-grey-600">{payment.description}</span>
                            <span className="text-sm font-bold text-gunmetal-900">{formatCurrency(payment.amount.toFixed(0))}</span>
                        </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-4 mt-2">
                        <span className="text-base font-bold text-gunmetal-900">Total Earnings</span>
                        <span className="text-base font-bold text-emerald-600">{formatCurrency(selectedPayroll!.totalSalary.toFixed(0))}</span>
                    </div>
                </div>
             </div>

             {/* Deductions */}
            <div className="border border-platinum-200 rounded-xl overflow-hidden">
                <div className="bg-alabaster-grey-50 px-6 py-4 border-b border-platinum-200 flex items-center gap-2">
                    <FaReceipt className="text-rose-600" />
                    <h3 className="text-sm font-bold text-gunmetal-900 uppercase tracking-wide">Deductions</h3>
                </div>
                <div className="p-6 space-y-3">
                     <div className="flex justify-between items-center py-2 border-b border-platinum-100">
                        <span className="text-sm text-slate-grey-600">Tax</span>
                        <span className="text-sm font-bold text-gunmetal-900">{formatCurrency(tax.toFixed(0))}</span>
                    </div>
                     <div className="flex justify-between items-center py-2 border-b border-platinum-100">
                        <span className="text-sm text-slate-grey-600">EOBI</span>
                        <span className="text-sm font-bold text-gunmetal-900">{formatCurrency(eobi.toFixed(0))}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-platinum-100">
                        <span className="text-sm text-slate-grey-600">Provident Fund</span>
                        <span className="text-sm font-bold text-gunmetal-900">{formatCurrency(employeePF.toFixed(0))}</span>
                    </div>
                    {/* Attendance Based Deductions Calculation Display */}
                     <div className="flex justify-between items-center py-2 border-b border-platinum-100">
                        <span className="text-sm text-slate-grey-600">Absent Deductions <span className="text-xs text-rose-500">({selectedPayroll?.absentDates?.length || 0} days)</span></span>
                        <span className="text-sm font-bold text-gunmetal-900">
                            {formatCurrency(
                                ((selectedPayroll?.absentDates?.length || 0) * (selectedPayroll?.perDaySalary || 0)).toFixed(0)
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-platinum-100">
                        <span className="text-sm text-slate-grey-600">Late IN Deductions</span>
                        <span className="text-sm font-bold text-gunmetal-900">
                             {formatCurrency(
                                ((Math.floor((selectedPayroll?.lateIns ?? 0) / 4) * (selectedPayroll?.perDaySalary ?? 0)) / 2).toFixed(0)
                            )}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-platinum-100">
                        <span className="text-sm text-slate-grey-600">Half Day Deductions</span>
                        <span className="text-sm font-bold text-gunmetal-900">
                             {formatCurrency(
                                (((selectedPayroll?.halfDays || 0) * (selectedPayroll?.perDaySalary || 0)) / 2).toFixed(0)
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 mt-2">
                        <span className="text-base font-bold text-gunmetal-900">Total Deductions</span>
                        <span className="text-base font-bold text-rose-600">{formatCurrency((selectedPayroll!.deductions + tax + eobi + employeePF).toFixed(0))}</span>
                    </div>
                </div>
             </div>
        </div>

        {/* Section: Net Pay Banner */}
        <div className="bg-gunmetal-900 rounded-xl p-8 text-white flex flex-col md:flex-row justify-between items-center shadow-lg shadow-gunmetal-500/20">
            <div>
                 <h2 className="text-2xl font-bold mb-1">Net Salary Payable</h2>
                 <p className="text-platinum-400 text-sm">Transfered to bank account</p>
            </div>
            <div className="mt-4 md:mt-0 text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-platinum-300 bg-clip-text text-transparent">
                 {formatCurrency(calculateNetSalary().toFixed(0))}
            </div>
        </div>

        {/* Section: Detailed Breakdowns (Collapsible or just clear lists) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Absent Dates */}
             <div className="border border-platinum-200 rounded-xl p-6 bg-alabaster-grey-50/30">
                <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-3">Absent Dates</h4>
                 {selectedPayroll?.absentDates && selectedPayroll.absentDates.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                         {selectedPayroll.absentDates.map((date, idx) => (
                             <span key={idx} className="px-2 py-1 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded font-mono">
                                 {new Date(date).toLocaleDateString()}
                             </span>
                         ))}
                    </div>
                 ) : (
                     <span className="text-sm text-slate-grey-400 italic">No absences</span>
                 )}
             </div>

             {/* Late Ins */}
              <div className="border border-platinum-200 rounded-xl p-6 bg-alabaster-grey-50/30">
                <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-3">Late Ins</h4>
                 {selectedPayroll?.lateInDates && selectedPayroll.lateInDates.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                         {selectedPayroll.lateInDates.map((date, idx) => (
                             <span key={idx} className="px-2 py-1 bg-amber-50 border border-amber-100 text-amber-700 text-xs rounded font-mono">
                                 {new Date(date).toLocaleDateString()}
                             </span>
                         ))}
                    </div>
                 ) : (
                     <span className="text-sm text-slate-grey-400 italic">No late ins</span>
                 )}
             </div>

             {/* Half Days */}
              <div className="border border-platinum-200 rounded-xl p-6 bg-alabaster-grey-50/30">
                <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-3">Half Days</h4>
                 {selectedPayroll?.halfDayDates && selectedPayroll.halfDayDates.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                         {selectedPayroll.halfDayDates.map((date, idx) => (
                             <span key={idx} className="px-2 py-1 bg-orange-50 border border-orange-100 text-orange-700 text-xs rounded font-mono">
                                 {new Date(date).toLocaleDateString()}
                             </span>
                         ))}
                    </div>
                 ) : (
                     <span className="text-sm text-slate-grey-400 italic">No half days</span>
                 )}
             </div>
        </div>

      </div>
    </div>
  );
};

export default SalarySlip;
