import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBuilding,
  FaRegCalendarCheck,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaSpinner,
} from "react-icons/fa";
import axiosInstance from "../../../utils/axiosConfig";
import { getMonthName } from "../../../utils/monthUtils";
import { PayrollData } from "./PayrollContext";

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
  const [error, setError] = useState<string | null>(null);

  // Fetch payroll details on mount
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full dark:bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold text-black px-4 py-2">
              View Payroll
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

        {/* Payroll details in read-only mode */}
        <div className="space-y-8">
          {/* Section 1: User Details */}
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold text-white bg-purple-900 px-4 py-2 rounded mb-4 flex items-center">
              <FaBuilding className="mr-2" /> User Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 dark:text-gray-100">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <div className="mt-1">{payroll?.user.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <div className="mt-1">{payroll?.user.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium">Department</label>
                <div className="mt-1">
                  {payroll?.user.personalDetails?.department}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Job Title</label>
                <div className="mt-1">
                  {(payroll?.user as any)?.jobTitle || "N/A"}
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
                <div className="mt-1">{getMonthName(payroll!.month)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium">Year</label>
                <div className="mt-1">{payroll!.year}</div>
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
                  {payroll!.basicSalary.toFixed(0)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Medical Allowance (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {(payroll as any)?.user?.salaryDetails?.medicalAllowance ||
                    payroll!.allowances}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Mobile Allowance (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {(payroll as any)?.user?.salaryDetails?.mobileAllowance || 0}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Fuel Allowance (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {(payroll as any)?.user?.salaryDetails?.fuelAllowance || 0}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Per Day Salary (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {payroll!.perDaySalary.toFixed(0)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Gross Salary (PKR)
                </label>
                <div className="mt-1 font-bold text-green-700">
                  {payroll!.totalSalary.toFixed(0)}
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
              {payroll?.absentDates && payroll.absentDates.length > 0 ? (
                <table className="min-w-full border divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold">S.No</th>
                      <th className="px-4 py-2 text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payroll.absentDates.map((date, idx) => (
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
                  {(
                    (payroll?.absentDates?.length || 0) *
                    (payroll?.perDaySalary || 0)
                  ).toFixed(0)}
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
              <div className="mt-4">
                <label className="block text-sm font-medium">
                  Total Late In Deductions (PKR)
                </label>
                <div className="mt-1 font-bold text-red-700 rounded bg-red-50 p-2">
                  {(
                    (Math.floor((payroll?.lateIns ?? 0) / 4) *
                      (payroll?.perDaySalary ?? 0)) /
                    2
                  ).toFixed(0)}
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
              {payroll?.leaveDates && payroll.leaveDates.length > 0 ? (
                <table className="min-w-full border divide-y divide-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-sm font-semibold">S.No</th>
                      <th className="px-4 py-2 text-sm font-semibold">Date</th>
                      <th className="px-4 py-2 text-sm font-semibold">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payroll.leaveDates.map((entry, idx) => (
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
                <div className="mt-1 font-bold">{tax.toFixed(0)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium">EOBI (PKR)</label>
                <div className="mt-1 font-bold">{eobi.toFixed(0)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Employee PF (PKR)
                </label>
                <div className="mt-1 font-bold">{employeePF.toFixed(0)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Absent Deductions (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {(
                    (payroll?.absentDates?.length || 0) *
                    (payroll?.perDaySalary || 0)
                  ).toFixed(0)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Late IN Deductions (PKR)
                </label>
                <div className="mt-1 font-bold">
                  {(
                    (Math.floor((payroll?.lateIns ?? 0) / 4) *
                      (payroll?.perDaySalary ?? 0)) /
                    2
                  ).toFixed(0)}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">
                Total Deductions (PKR)
              </label>
              <div className="mt-1 font-bold text-red-700 rounded bg-red-50 p-2">
                {(payroll!.deductions + tax + eobi + employeePF).toFixed(0)}
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
                      <td className="px-4 py-2">{payment.amount.toFixed(0)}</td>
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
                  {payroll!.totalSalary.toFixed(0)}
                </div>
              </div>
              <div className="p-4 bg-yellow-100 rounded-lg text-center">
                <span className="text-sm text-gray-700">
                  Total Deductions (PKR)
                </span>
                <div className="mt-2 text-2xl font-extrabold text-yellow-800">
                  {(payroll!.deductions + tax + eobi + employeePF).toFixed(0)}
                </div>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg text-center">
                <span className="text-sm text-gray-700">Net Salary (PKR)</span>
                <div className="mt-2 text-2xl font-extrabold text-blue-800">
                  {calculateNetSalary().toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPayroll;
