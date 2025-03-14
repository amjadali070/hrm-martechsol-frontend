import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaPlus,
  FaMinus,
  FaBuilding,
  FaRegCalendarCheck,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import { PayrollData, ExtraPayment } from "./PayrollContext";
import axiosInstance from "../../../utils/axiosConfig";
import { getMonthName } from "../../../utils/monthUtils";
import { toast } from "react-toastify";

const EditPayroll: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const { updatePayroll } = usePayroll();
  const navigate = useNavigate();

  const [payroll, setPayroll] = useState<PayrollData | null>(null);
  const [extraPayments, setExtraPayments] = useState<ExtraPayment[]>([]);
  const [tax, setTax] = useState<number>(0);
  const [eobi, setEobi] = useState<number>(0);
  const [employeePF, setEmployeePF] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
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

  useEffect(() => {
    const fetchPayroll = async () => {
      if (!id) {
        setError("Invalid payroll ID.");
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
        setError(err.response?.data?.message || "Failed to fetch payroll.");
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
        setError(err.response?.data?.message || "Failed to update payroll.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !payroll) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-blue-500" size={50} />
      </div>
    );
  }

  if (!loading && !payroll) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700">No payroll data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 rounded-lg">
      <div className="w-full dark:bg-gray-800 p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-black px-4 py-2 rounded">
              Edit Payroll
            </h2>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() =>
                navigate(
                  `/organization/payroll-management?month=${
                    payroll!.month
                  }&year=${payroll!.year}`
                )
              }
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaBuilding className="mr-2" /> User Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1 text-gray-900">{payroll?.user.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 text-gray-900">{payroll?.user.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="mt-1 text-gray-900">
                  {payroll?.user.personalDetails?.department}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <div className="mt-1 text-gray-900">
                  {payroll?.user.personalDetails?.jobTitle || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaRegCalendarCheck className="mr-2" /> Payroll Period
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Month
                </label>
                <div className="mt-1 text-gray-900">
                  {getMonthName(payroll!.month)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <div className="mt-1 text-gray-900">{payroll!.year}</div>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2" /> Salary Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Basic Salary (PKR)
                </label>
                <div className="mt-1 text-gray-900">
                  {formatCurrency(payroll!.basicSalary)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Medical Allowance (PKR)
                </label>
                <div className="mt-1 text-gray-900">
                  {formatCurrency(
                    (payroll as any)?.user?.salaryDetails?.medicalAllowance ||
                      payroll!.allowances
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Allowance (PKR)
                </label>
                <div className="mt-1 text-gray-900">
                  {(payroll as any)?.user?.salaryDetails?.mobileAllowance || 0}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fuel Allowance (PKR)
                </label>
                <div className="mt-1 text-gray-900">
                  {(payroll as any)?.user?.salaryDetails?.fuelAllowance || 0}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Per Day Salary (PKR)
                </label>
                <div className="mt-1 text-gray-900">
                  {formatCurrency(payroll!.perDaySalary)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gross Salary (PKR)
                </label>
                <div className="mt-1 text-gray-900">
                  {formatCurrency(payroll!.totalSalary)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Absent Dates
            </h3>
            <div>
              {payroll?.absentDates && payroll.absentDates.length > 0 ? (
                <table className="min-w-full border divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-center">
                        S.No
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-center">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payroll.absentDates.map((date, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
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
                    (payroll?.absentDates?.length || 0) *
                      (payroll?.perDaySalary || 0)
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Late In Details
            </h3>
            <div className="text-gray-800 dark:text-gray-100">
              {payroll?.lateInDates && payroll.lateInDates.length > 0 ? (
                <table className="min-w-full border divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold">S.No</th>
                      <th className="px-4 py-2 text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payroll.lateInDates.map((date, idx) => (
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
              <div className="mt-4 space-y-4">
                {payroll?.lateIns && payroll.lateIns > 0 && (
                  <div>
                    <label className="block text-sm font-medium">
                      Late In Salary Deductions (PKR)
                    </label>
                    <div className="mt-1 font-bold text-red-700 rounded bg-red-50 p-2">
                      {formatCurrency(
                        (Math.floor((payroll?.lateIns ?? 0) / 4) *
                          (payroll?.perDaySalary ?? 0)) /
                          2
                      )}
                    </div>
                  </div>
                )}

                {payroll?.lateInCasualLeavesDeduction &&
                  payroll.lateInCasualLeavesDeduction.deductedCasualLeaves >
                    0 && (
                    <div>
                      <label className="block text-sm font-medium">
                        Casual Leaves Deducted Due to Late Ins
                      </label>
                      <div className="mt-1 font-bold text-red-700 rounded bg-red-50 p-2">
                        {
                          payroll.lateInCasualLeavesDeduction
                            .deductedCasualLeaves
                        }{" "}
                        Casual Leave(s)
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Half Days Details
            </h3>
            <div className="text-gray-800 dark:text-gray-100">
              {payroll?.halfDayDates && payroll.halfDayDates.length > 0 ? (
                <table className="min-w-full border divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold">S.No</th>
                      <th className="px-4 py-2 text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payroll.halfDayDates.map((date, idx) => (
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
                    ((payroll?.halfDays || 0) * (payroll?.perDaySalary || 0)) /
                      2
                  )}
                </div>
              </div>
            </div>

            <div className="text-gray-800 dark:text-gray-100 mt-3">
              {payroll?.halfDayCasualLeavesDeduction &&
                payroll.halfDayCasualLeavesDeduction.deductedCasualLeaves >
                  0 && (
                  <div>
                    <label className="block text-sm font-medium">
                      Casual Leaves Deducted Due to Half Days
                    </label>
                    <div className="mt-1 font-bold text-red-700 rounded bg-red-50 p-2">
                      {
                        payroll.halfDayCasualLeavesDeduction
                          .deductedCasualLeaves
                      }{" "}
                      Casual Leave(s)
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Leave Dates
            </h3>
            <div>
              {payroll?.leaveDates && payroll.leaveDates.length > 0 ? (
                <table className="min-w-full border divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-center">
                        S.No
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-center">
                        Date
                      </th>
                      <th className="px-4 py-2 text-sm font-semibold text-gray-700 text-center">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payroll.leaveDates.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
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
          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Deductions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tax (PKR)
                </label>
                <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1"
                  placeholder="Enter Tax"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  EOBI (PKR)
                </label>
                <input
                  type="number"
                  value={eobi}
                  onChange={(e) => setEobi(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1"
                  placeholder="Enter EOBI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee PF (PKR)
                </label>
                <input
                  type="number"
                  value={employeePF}
                  onChange={(e) => setEmployeePF(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1"
                  placeholder="Enter Employee PF"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Absent Deductions (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {formatCurrency(
                    (payroll?.absentDates?.length || 0) *
                      (payroll?.perDaySalary || 0)
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Late IN Deductions (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {formatCurrency(
                    (Math.floor((payroll?.lateIns ?? 0) / 4) *
                      (payroll?.perDaySalary ?? 0)) /
                      2
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Half Days Deductions (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {formatCurrency(
                    ((payroll?.halfDays || 0) * (payroll?.perDaySalary || 0)) /
                      2
                  )}
                </div>
              </div>
            </div>
            {/* Highlight Total Deductions */}
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
              <label className="block text-sm font-medium text-red-700">
                Total Deductions (PKR)
              </label>
              <div className="mt-1 font-bold text-red-800">
                {formatCurrency(payroll!.deductions + tax + eobi + employeePF)}
              </div>
            </div>
          </div>

          {/* Section 7: Extra Payments */}
          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2" /> Extra Payments
            </h3>
            {extraPayments.length > 0 ? (
              <table className="min-w-full border divide-y divide-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                      Amount (PKR)
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {extraPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={payment.description}
                          onChange={(e) =>
                            handleExtraPaymentChange(
                              payment.id,
                              "description",
                              e.target.value
                            )
                          }
                          required
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter description"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={payment.amount}
                          onChange={(e) =>
                            handleExtraPaymentChange(
                              payment.id,
                              "amount",
                              e.target.value
                            )
                          }
                          required
                          min={0}
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter amount"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeExtraPayment(payment.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove Payment"
                        >
                          <FaMinus />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No extra payments added.</p>
            )}
            <button
              type="button"
              onClick={addExtraPayment}
              className="flex items-center text-green-500 mt-4"
            >
              <FaPlus className="mr-2" /> Add Extra Payment
            </button>
          </div>

          {/* Section 8: Payroll Summary */}
          <div className="p-6 border rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaFileInvoiceDollar className="mr-2" /> Payroll Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-center">
                <label className="block text-sm font-medium text-blue-700">
                  Gross Salary (PKR)
                </label>
                <div className="mt-2 font-bold text-blue-900">
                  {formatCurrency(payroll!.totalSalary)}
                </div>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center">
                <label className="block text-sm font-medium text-yellow-700">
                  Total Deductions (PKR)
                </label>
                <div className="mt-2 font-bold text-yellow-900">
                  {formatCurrency(
                    payroll!.deductions + tax + eobi + employeePF
                  )}
                </div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center">
                <label className="block text-sm font-medium text-green-700">
                  Net Salary (PKR)
                </label>
                <div className="mt-2 font-extrabold text-green-900 text-xl">
                  {formatCurrency(calculateNetSalary())}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`flex items-center px-6 py-3 bg-blue-600 text-white rounded-full transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPayroll;
