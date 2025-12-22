import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaRegCalendarCheck,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaDownload,
  FaUser,
  FaUniversity,
} from "react-icons/fa";
import axiosInstance from "../../../utils/axiosConfig";
import { getMonthName } from "../../../utils/monthUtils";
import { PayrollData } from "./PayrollContext";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalarySlipPDF from "../../../html/SalarySlipPDF";
import LoadingSpinner from "../../atoms/LoadingSpinner";

const ViewPayroll: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [payroll, setPayroll] = useState<PayrollData | null>(null);
  const [extraPayments, setExtraPayments] = useState<
    { id: string; description: string; amount: number }[]
  >([]);
  const [tax, setTax] = useState<number>(0);
  const [eobi, setEobi] = useState<number>(0);
  const [employeePF, setEmployeePF] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchPayroll = async () => {
      if (!id) {
        return;
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/payroll/${id}`);
        const fetchedPayroll: PayrollData = response.data;
        setPayroll(fetchedPayroll);
        setExtraPayments(fetchedPayroll.extraPayments || []);
        setTax(fetchedPayroll.tax || 0);
        setEobi(fetchedPayroll.eobi || 0);
        setEmployeePF(fetchedPayroll.employeePF || 0);
      } catch (err: any) {
        console.error("Error fetching payroll:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, [id]);

  const calculateNetSalary = () => {
    if (!payroll) return 0;
    const extrasTotal = extraPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return (
      payroll.totalSalary -
      payroll.deductions -
      tax -
      eobi -
      employeePF +
      extrasTotal
    );
  };

  const preparePDFData = () => {
    if (!payroll) return null;

    const totalAbsents = payroll.absentDates?.length || 0;
    const totalAbsentDeductions = (totalAbsents * payroll.perDaySalary).toFixed(
      0
    );

    const totalLateIns = payroll.lateIns || 0;
    const totalLateInDeductions = (
      (Math.floor(totalLateIns / 4) * payroll.perDaySalary) /
      2
    ).toFixed(0);

    const totalHalfDays = payroll.halfDays || 0;
    const totalHalfDayDeductions = (
      (totalHalfDays * payroll.perDaySalary) /
      2
    ).toFixed(0);

    const leaveTypeCounts: { [key: string]: number } = {};
    if (payroll.leaveDates) {
      payroll.leaveDates.forEach((leave) => {
        if (leaveTypeCounts[leave.type]) {
          leaveTypeCounts[leave.type]++;
        } else {
          leaveTypeCounts[leave.type] = 1;
        }
      });
    }

    const pdfData = {
      date: new Date().toLocaleDateString(),
      name: payroll.user.name,
      department: payroll.user.personalDetails.department,
      jobTitle: payroll.user.personalDetails.jobTitle,
      month: getMonthName(payroll.month),
      year: payroll.year.toString(),
      basicSalary: `PKR ${payroll.basicSalary.toFixed(0)}`,
      medicalAllowance: `PKR ${
        (payroll.user as any)?.salaryDetails?.medicalAllowance ||
        payroll.allowances ||
        0
      }`,
      mobileAllowance: `PKR ${
        (payroll.user as any)?.salaryDetails?.mobileAllowance || 0
      }`,
      fuelAllowance: `PKR ${
        (payroll.user as any)?.salaryDetails?.fuelAllowance || 0
      }`,
      grossSalary: `PKR ${payroll.totalSalary.toFixed(0)}`,
      tax: `PKR ${tax.toFixed(0)}`,
      eobi: `PKR ${eobi.toFixed(0)}`,
      pfContribution: `PKR ${employeePF.toFixed(0)}`,
      absentDeductions: `PKR ${totalAbsentDeductions}`,
      amountPayable: `PKR ${calculateNetSalary().toFixed(0)}`,
      extraPayments: extraPayments.map((payment) => ({
        description: payment.description,
        amount: `PKR ${payment.amount.toFixed(0)}`,
      })),
      absentDates: payroll.absentDates || [],
      leaveDates: payroll.leaveDates || [],
      leaveDetails: {
        casualLeaveAvailable:
          (payroll.user as any)?.leaveDetails?.casualLeaveAvailable || "0",
        sickLeaveAvailable:
          (payroll.user as any)?.leaveDetails?.sickLeaveAvailable || "0",
        annualLeaveAvailable:
          (payroll.user as any)?.leaveDetails?.annualLeaveAvailable || "0",
      },
      totalHalfDays: payroll.halfDays || 0,
      totalHalfDayDeductions: `PKR ${totalHalfDayDeductions}`,
      halfDayDates: payroll.halfDayDates || [],
      totalAbsents,
      totalAbsentDeductions: `PKR ${totalAbsentDeductions}`,
      totalLateIns,
      lateInDates: payroll.lateInDates || [],
      totalLateInDeductions: `PKR ${totalLateInDeductions}`,
      leaveTypeCounts,
    };

    return pdfData;
  };

  // Helper Components
  const SectionTitle = ({
    icon: Icon,
    title,
  }: {
    icon: any;
    title: string;
  }) => (
    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-platinum-200">
      <div className="bg-gunmetal-50 p-2 rounded text-gunmetal-600">
        <Icon size={18} />
      </div>
      <h3 className="text-xl font-bold text-gunmetal-900">{title}</h3>
    </div>
  );

  const DetailRow = ({
    label,
    value,
    isBold = false,
    isCurrency = false,
  }: {
    label: string;
    value: string | number;
    isBold?: boolean;
    isCurrency?: boolean;
  }) => (
    <div className="flex justify-between items-center py-2 border-b border-platinum-100 last:border-0 hover:bg-alabaster-grey-50 px-2 rounded transition-colors bg-white">
      <span className="text-sm font-medium text-slate-grey-600">{label}</span>
      <span
        className={`text-sm ${
          isBold ? "font-bold text-gunmetal-900" : "text-gunmetal-700"
        } ${isCurrency ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );

  if (loading && !payroll) {
    return (
      <LoadingSpinner
        className="h-[80vh]"
        size="xl"
        text="Loading Payroll..."
      />
    );
  }

  if (!loading && !payroll) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6">
        <FaFileInvoiceDollar size={48} className="text-slate-grey-300 mb-4" />
        <h3 className="text-xl font-bold text-gunmetal-900">
          Payroll Not Found
        </h3>
        <p className="text-slate-grey-500 mt-2 mb-6">
          The requested payroll record is not available.
        </p>
        <button
          onClick={() => navigate("/organization/payroll-management")}
          className="px-6 py-2 bg-gunmetal-900 text-white rounded-lg hover:bg-gunmetal-800 transition-colors font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-alabaster-grey-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gunmetal-900 tracking-tight">
              Payroll Details
            </h1>
            <p className="text-slate-grey-500 mt-1">
              Viewing record for{" "}
              <span className="font-semibold text-gunmetal-700">
                {getMonthName(payroll!.month)} {payroll!.year}
              </span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                navigate(
                  `/organization/payroll-management?month=${
                    payroll!.month
                  }&year=${payroll!.year}`
                )
              }
              className="px-5 py-2.5 bg-white border border-platinum-200 text-slate-grey-600 rounded-xl hover:bg-platinum-50 hover:text-gunmetal-900 transition-all font-semibold shadow-sm flex items-center gap-2 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <PDFDownloadLink
              document={<SalarySlipPDF data={preparePDFData()!} />}
              fileName={`salary-slip-${payroll?.month}-${payroll?.year}.pdf`}
              className="px-5 py-2.5 bg-gunmetal-900 text-white rounded-xl hover:bg-gunmetal-800 transition-all font-bold shadow-lg hover:shadow-gunmetal-500/20 flex items-center gap-2"
            >
              {({ loading }) => (
                <>
                  {loading ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <FaDownload />
                  )}
                  {loading ? " Preparing..." : "Download Play Slip"}
                </>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          {/* Left Col: Employee & Earnings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Employee Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <FaUser size={120} />
              </div>
              <SectionTitle icon={FaUser} title="Employee Info" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <DetailRow
                  label="Employee Name"
                  value={payroll!.user.name}
                  isBold={true}
                />
                <DetailRow
                  label="Department"
                  value={payroll!.user.personalDetails?.department}
                />
                <DetailRow
                  label="Job Title"
                  value={payroll!.user.personalDetails?.jobTitle || "N/A"}
                />
                <DetailRow label="Email" value={payroll!.user.email} />
              </div>
            </div>

            {/* Earnings Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum-200">
              <SectionTitle icon={FaMoneyBillWave} title="Earnings" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <DetailRow
                  label="Basic Salary"
                  value={formatCurrency(payroll!.basicSalary)}
                  isCurrency={true}
                />
                <DetailRow
                  label="Medical Allowance"
                  value={formatCurrency(
                    (payroll as any)?.user?.salaryDetails?.medicalAllowance ||
                      payroll!.allowances
                  )}
                  isCurrency={true}
                />
                <DetailRow
                  label="Mobile Allowance"
                  value={formatCurrency(
                    (payroll as any)?.user?.salaryDetails?.mobileAllowance || 0
                  )}
                  isCurrency={true}
                />
                <DetailRow
                  label="Fuel Allowance"
                  value={formatCurrency(
                    (payroll as any)?.user?.salaryDetails?.fuelAllowance || 0
                  )}
                  isCurrency={true}
                />
                <DetailRow
                  label="Per Day Rate"
                  value={formatCurrency(payroll!.perDaySalary)}
                  isCurrency={true}
                />
                <div className="md:col-span-2 bg-emerald-50 rounded-lg p-3 flex justify-between items-center mt-2 border border-emerald-100">
                  <span className="font-bold text-emerald-800">
                    Total Earnings (Gross)
                  </span>
                  <span className="font-mono font-bold text-emerald-700 text-lg">
                    {formatCurrency(payroll!.totalSalary)}
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance/Leave Report Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum-200">
              <SectionTitle
                icon={FaRegCalendarCheck}
                title="Attendance & Leaves"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-alabaster-grey-50 p-3 rounded-xl border border-platinum-100 text-center">
                  <span className="block text-2xl font-bold text-gunmetal-900">
                    {payroll?.absentDates?.length || 0}
                  </span>
                  <span className="text-xs text-slate-grey-500 uppercase font-bold">
                    Absent Days
                  </span>
                </div>
                <div className="bg-alabaster-grey-50 p-3 rounded-xl border border-platinum-100 text-center">
                  <span className="block text-2xl font-bold text-gunmetal-900">
                    {payroll?.lateIns || 0}
                  </span>
                  <span className="text-xs text-slate-grey-500 uppercase font-bold">
                    Late Arrivals
                  </span>
                </div>
                <div className="bg-alabaster-grey-50 p-3 rounded-xl border border-platinum-100 text-center">
                  <span className="block text-2xl font-bold text-gunmetal-900">
                    {payroll?.halfDays || 0}
                  </span>
                  <span className="text-xs text-slate-grey-500 uppercase font-bold">
                    Half Days
                  </span>
                </div>
              </div>

              {payroll?.absentDates && payroll.absentDates.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-grey-400 uppercase mb-2">
                    Absent Dates Log
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {payroll.absentDates.map((date, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs border border-red-100 font-mono"
                      >
                        {new Date(date).toLocaleDateString()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Calculations & Net */}
          <div className="flex flex-col gap-8">
            {/* Deductions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum-200">
              <SectionTitle icon={FaFileInvoiceDollar} title="Deductions" />
              <div className="space-y-1">
                <DetailRow
                  label="Absent Deductions"
                  value={formatCurrency(
                    (payroll?.absentDates?.length || 0) *
                      (payroll?.perDaySalary || 0)
                  )}
                  isCurrency={true}
                />
                <DetailRow
                  label="Late Deductions"
                  value={formatCurrency(
                    (Math.floor((payroll?.lateIns ?? 0) / 4) *
                      (payroll?.perDaySalary ?? 0)) /
                      2
                  )}
                  isCurrency={true}
                />
                <DetailRow
                  label="Half Day Deductions"
                  value={formatCurrency(
                    ((payroll?.halfDays || 0) * (payroll?.perDaySalary || 0)) /
                      2
                  )}
                  isCurrency={true}
                />
                <div className="my-2 border-t border-platinum-100"></div>
                <DetailRow
                  label="Income Tax"
                  value={formatCurrency(tax)}
                  isCurrency={true}
                />
                <DetailRow
                  label="EOBI"
                  value={formatCurrency(eobi)}
                  isCurrency={true}
                />
                <DetailRow
                  label="Provident Fund"
                  value={formatCurrency(employeePF)}
                  isCurrency={true}
                />

                <div className="bg-rose-50 rounded-lg p-3 flex justify-between items-center mt-3 border border-rose-100">
                  <span className="font-bold text-rose-800">
                    Total Deductions
                  </span>
                  <span className="font-mono font-bold text-rose-700 text-lg">
                    -
                    {formatCurrency(
                      payroll!.deductions + tax + eobi + employeePF
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Extra Payments */}
            {extraPayments.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum-200">
                <SectionTitle icon={FaMoneyBillWave} title="Bonuses" />
                <div className="space-y-2">
                  {extraPayments.map((pay) => (
                    <div
                      key={pay.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gunmetal-700">
                        {pay.description}
                      </span>
                      <span className="font-mono font-bold text-emerald-600">
                        +{formatCurrency(pay.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Net Payout Summary */}
            <div className="bg-gunmetal-900 p-6 rounded-2xl shadow-xl text-white">
              <div className="flex items-center gap-3 mb-4 opacity-80">
                <FaUniversity />
                <span className="text-sm font-bold uppercase tracking-widest">
                  Net Payable
                </span>
              </div>
              <p className="text-4xl font-extrabold tracking-tight mb-2">
                {formatCurrency(calculateNetSalary())}
              </p>
              <p className="text-sm text-gunmetal-300">
                This is the final amount to be transferred to the employees
                account after all adjustments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPayroll;
