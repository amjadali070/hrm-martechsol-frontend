import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaPlus,
  FaMinus,
  FaRegCalendarCheck,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaSpinner,
  FaArrowLeft,
  FaSave,
  FaBriefcase,
  FaUser,
} from "react-icons/fa";
import { PayrollData, ExtraPayment } from "./PayrollContext";
import axiosInstance from "../../../utils/axiosConfig";
import { getMonthName } from "../../../utils/monthUtils";
import { toast } from "react-toastify";

const EditPayroll: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [payroll, setPayroll] = useState<PayrollData | null>(null);
  const [extraPayments, setExtraPayments] = useState<ExtraPayment[]>([]);
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

  const handleExtraPaymentChange = (
    paymentId: string,
    field: keyof ExtraPayment,
    value: string | number
  ) => {
    setExtraPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId
          ? { ...payment, [field]: field === "amount" ? Number(value) : value }
          : payment
      )
    );
  };

  const addExtraPayment = () => {
    const newPayment: ExtraPayment = {
      id: Date.now().toString(),
      description: "",
      amount: 0,
    };
    setExtraPayments((prev) => [...prev, newPayment]);
  };

  const removeExtraPayment = (paymentId: string) => {
    setExtraPayments((prev) =>
      prev.filter((payment) => payment.id !== paymentId)
    );
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payroll) {
      setLoading(true);
      try {
        const updatedPayroll: any = {
          ...payroll,
          netSalary: calculateNetSalary(),
          extraPayments,
          tax,
          eobi,
          employeePF,
        };
        await axiosInstance.patch(`/api/payroll/${id}`, updatedPayroll);
        toast.success(`Payroll updated for ${updatedPayroll.user.name}`);

        navigate(
          `/organization/payroll-management?month=${payroll.month}&year=${payroll.year}`
        );
      } catch (err: any) {
        console.error("Error updating payroll:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper Components
  const SectionHeader = ({
    icon: Icon,
    title,
  }: {
    icon: any;
    title: string;
  }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-platinum-200">
      <div className="bg-gunmetal-50 p-1.5 rounded text-gunmetal-600">
        <Icon size={16} />
      </div>
      <h3 className="text-lg font-bold text-gunmetal-900">{title}</h3>
    </div>
  );

  const InfoCard = ({
    label,
    value,
    subValue,
  }: {
    label: string;
    value: string;
    subValue?: string;
  }) => (
    <div className="bg-white border border-platinum-200 p-4 rounded-xl shadow-sm">
      <p className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-1 opacity-80">
        {label}
      </p>
      <p className="text-gunmetal-900 font-bold text-base">{value}</p>
      {subValue && (
        <p className="text-xs text-slate-grey-400 mt-1">{subValue}</p>
      )}
    </div>
  );

  const StatCard = ({
    label,
    value,
    type = "neutral",
  }: {
    label: string;
    value: string;
    type?: "success" | "warning" | "neutral" | "danger";
  }) => {
    const colorClasses = {
      success: "border-l-4 border-l-emerald-500 bg-emerald-50/50",
      warning: "border-l-4 border-l-amber-500 bg-amber-50/50",
      danger: "border-l-4 border-l-rose-500 bg-rose-50/50",
      neutral: "border-l-4 border-l-gunmetal-500 bg-alabaster-grey-50",
    };

    return (
      <div
        className={`p-4 rounded-r-xl shadow-sm border border-platinum-200 ${colorClasses[type]}`}
      >
        <p className="text-xs font-bold uppercase tracking-wider text-slate-grey-500 mb-1">
          {label}
        </p>
        <p className="text-lg font-mono font-bold text-gunmetal-900">{value}</p>
      </div>
    );
  };

  if (loading && !payroll) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="w-12 h-12 border-4 border-platinum-200 border-t-gunmetal-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-grey-500 font-medium text-sm animate-pulse">
          Loading Payroll Data...
        </p>
      </div>
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
          The requested payroll record could not be located.
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
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gunmetal-900 tracking-tight">
              Edit Payroll Details
            </h1>
            <p className="text-slate-grey-500 mt-1">
              Adjust salary components, taxes, and extra payments.
            </p>
          </div>

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
            Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
          {/* Top Grid: User & Period Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum-200">
              <SectionHeader icon={FaUser} title="Employee Information" />
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-grey-400 uppercase">
                    Values
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="bg-gunmetal-50 p-2 rounded-full text-gunmetal-600">
                      <FaUser size={12} />
                    </div>
                    <div>
                      <p className="font-bold text-gunmetal-900 text-sm">
                        {payroll?.user.name}
                      </p>
                      <p className="text-xs text-slate-grey-500">
                        {payroll?.user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-grey-400 uppercase">
                    Role
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="bg-gunmetal-50 p-2 rounded-full text-gunmetal-600">
                      <FaBriefcase size={12} />
                    </div>
                    <div>
                      <p className="font-bold text-gunmetal-900 text-sm">
                        {payroll?.user.personalDetails?.jobTitle || "N/A"}
                      </p>
                      <p className="text-xs text-slate-grey-500">
                        {payroll?.user.personalDetails?.department}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Period Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum-200">
              <SectionHeader icon={FaRegCalendarCheck} title="Payroll Period" />
              <div className="grid grid-cols-2 gap-6">
                <InfoCard label="Month" value={getMonthName(payroll!.month)} />
                <InfoCard label="Year" value={payroll!.year.toString()} />
              </div>
            </div>
          </div>

          {/* Salary Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum-200">
            <SectionHeader
              icon={FaMoneyBillWave}
              title="Compensation Breakdown"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                label="Basic Salary"
                value={formatCurrency(payroll!.basicSalary)}
              />
              <InfoCard
                label="Medical Allow."
                value={formatCurrency(
                  (payroll as any)?.user?.salaryDetails?.medicalAllowance ||
                    payroll!.allowances
                )}
              />
              <InfoCard
                label="Mobile Allow."
                value={formatCurrency(
                  (payroll as any)?.user?.salaryDetails?.mobileAllowance || 0
                )}
              />
              <InfoCard
                label="Fuel Allow."
                value={formatCurrency(
                  (payroll as any)?.user?.salaryDetails?.fuelAllowance || 0
                )}
              />
              <InfoCard
                label="Per Day Rate"
                value={formatCurrency(payroll!.perDaySalary)}
              />
              <div className="bg-gunmetal-50 border border-gunmetal-100 p-4 rounded-xl shadow-sm">
                <p className="text-xs font-bold text-gunmetal-500 uppercase tracking-wide mb-1">
                  Gross Salary
                </p>
                <p className="text-gunmetal-900 font-bold text-lg">
                  {formatCurrency(payroll!.totalSalary)}
                </p>
              </div>
            </div>
          </div>

          {/* Deductions & Adjustments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Automated Deductions (Read Only mostly) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum-200">
              <SectionHeader
                icon={FaFileInvoiceDollar}
                title="Attendance Deductions"
              />
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-alabaster-grey-50 rounded-lg border border-platinum-100">
                  <div>
                    <p className="text-sm font-bold text-gunmetal-900">
                      Absent Days
                    </p>
                    <p className="text-xs text-slate-grey-500">
                      {payroll?.absentDates?.length || 0} days recorded
                    </p>
                  </div>
                  <span className="font-mono font-bold text-rose-600">
                    -{" "}
                    {formatCurrency(
                      (payroll?.absentDates?.length || 0) *
                        (payroll?.perDaySalary || 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-alabaster-grey-50 rounded-lg border border-platinum-100">
                  <div>
                    <p className="text-sm font-bold text-gunmetal-900">
                      Late Arrivals
                    </p>
                    <p className="text-xs text-slate-grey-500">
                      {payroll?.lateIns || 0} late ins
                    </p>
                  </div>
                  <span className="font-mono font-bold text-rose-600">
                    -{" "}
                    {formatCurrency(
                      (Math.floor((payroll?.lateIns ?? 0) / 4) *
                        (payroll?.perDaySalary ?? 0)) /
                        2
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-alabaster-grey-50 rounded-lg border border-platinum-100">
                  <div>
                    <p className="text-sm font-bold text-gunmetal-900">
                      Half Days
                    </p>
                    <p className="text-xs text-slate-grey-500">
                      {payroll?.halfDays || 0} half days
                    </p>
                  </div>
                  <span className="font-mono font-bold text-rose-600">
                    -{" "}
                    {formatCurrency(
                      ((payroll?.halfDays || 0) *
                        (payroll?.perDaySalary || 0)) /
                        2
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Deductions (Editable) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum-200">
              <SectionHeader
                icon={FaFileInvoiceDollar}
                title="Tax & PF Contributions"
              />
              <div className="space-y-4">
                {[
                  { label: "Income Tax", value: tax, setter: setTax },
                  { label: "EOBI Contribution", value: eobi, setter: setEobi },
                  {
                    label: "Provident Fund (Emp)",
                    value: employeePF,
                    setter: setEmployeePF,
                  },
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-bold text-slate-grey-500 uppercase mb-1.5 ml-1">
                      {item.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 font-medium text-sm">
                        PKR
                      </span>
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => item.setter(Number(e.target.value))}
                        className="w-full pl-12 pr-4 py-2.5 bg-alabaster-grey-50 border border-platinum-200 rounded-lg focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all font-mono font-medium text-gunmetal-900"
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-platinum-100 flex justify-between items-center text-rose-700 font-bold">
                  <span>Total Manual Deductions</span>
                  <span>{formatCurrency(tax + eobi + employeePF)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Extra Payments */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-platinum-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-platinum-200">
              <div className="flex items-center gap-2">
                <div className="bg-gunmetal-50 p-1.5 rounded text-gunmetal-600">
                  <FaMoneyBillWave size={16} />
                </div>
                <h3 className="text-lg font-bold text-gunmetal-900">
                  Bonuses & Extra Payments
                </h3>
              </div>
              <button
                type="button"
                onClick={addExtraPayment}
                className="text-xs font-bold text-white bg-gunmetal-900 hover:bg-gunmetal-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <FaPlus size={10} /> Add Item
              </button>
            </div>

            {extraPayments.length > 0 ? (
              <div className="space-y-3">
                {extraPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                  >
                    <input
                      type="text"
                      value={payment.description}
                      placeholder="Description (e.g. Performance Bonus)"
                      onChange={(e) =>
                        handleExtraPaymentChange(
                          payment.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="flex-grow px-4 py-2 bg-alabaster-grey-50 border border-platinum-200 rounded-lg focus:outline-none focus:border-gunmetal-500 text-sm"
                    />
                    <div className="relative w-full sm:w-40">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 text-xs font-bold">
                        PKR
                      </span>
                      <input
                        type="number"
                        value={payment.amount}
                        placeholder="Amount"
                        onChange={(e) =>
                          handleExtraPaymentChange(
                            payment.id,
                            "amount",
                            e.target.value
                          )
                        }
                        className="w-full pl-10 pr-3 py-2 bg-alabaster-grey-50 border border-platinum-200 rounded-lg focus:outline-none focus:border-gunmetal-500 text-sm font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExtraPayment(payment.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <FaMinus />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-alabaster-grey-50 rounded-xl border border-dashed border-platinum-300">
                <p className="text-slate-grey-400 text-sm">
                  No extra payments or bonuses added yet.
                </p>
              </div>
            )}
          </div>

          {/* Final Summary */}
          <div className="bg-gunmetal-900 p-8 rounded-2xl shadow-xl text-white">
            <h3 className="text-xl font-bold mb-6 border-b border-gunmetal-700 pb-4">
              Net Payable Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-gunmetal-300 text-sm uppercase font-bold tracking-wider mb-2">
                  Total Earnings
                </p>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {formatCurrency(payroll!.totalSalary)}
                </p>
              </div>
              <div>
                <p className="text-rose-300 text-sm uppercase font-bold tracking-wider mb-2">
                  Total Deductions
                </p>
                <p className="text-3xl font-bold text-rose-200 tracking-tight">
                  {formatCurrency(
                    payroll!.deductions + tax + eobi + employeePF
                  )}
                </p>
              </div>
              <div className="bg-gunmetal-800 p-4 rounded-xl border border-gunmetal-600">
                <p className="text-emerald-400 text-sm uppercase font-bold tracking-wider mb-2">
                  Net Salary Payable
                </p>
                <p className="text-4xl font-extrabold text-emerald-300 tracking-tight">
                  {formatCurrency(calculateNetSalary())}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white border border-platinum-200 text-slate-grey-600 font-bold rounded-xl hover:bg-platinum-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gunmetal-900 text-white font-bold rounded-xl hover:bg-gunmetal-800 transition-all shadow-lg hover:shadow-gunmetal-500/30 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {loading ? "Saving Changes..." : "Update Payroll Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPayroll;
