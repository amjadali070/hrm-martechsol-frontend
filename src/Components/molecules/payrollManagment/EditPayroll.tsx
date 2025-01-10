// src/components/EditPayroll.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaTimes,
  FaPlus,
  FaMinus,
  FaUserEdit,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import { ExtraPayment, PayrollData, usePayroll } from "./PayrollContext"; // Adjust the path as needed
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosConfig";
import { getMonthNumber } from "../../../utils/monthUtils";

const EditPayroll: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { updatePayroll } = usePayroll();
  const navigate = useNavigate();

  const [payroll, setPayroll] = useState<PayrollData | null>(null);
  const [extraPayments, setExtraPayments] = useState<ExtraPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayroll = async () => {
      if (!id) {
        setError("Invalid payroll ID.");
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/payroll/user/${id}`);
        const fetchedPayroll: PayrollData = response.data.payroll; // Ensure the backend sends 'payroll'
        setPayroll(fetchedPayroll);
        setExtraPayments(fetchedPayroll.extraPayments || []);
      } catch (err: any) {
        console.error("Error fetching payroll:", err);
        setError(err.response?.data?.message || "Failed to fetch payroll.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayroll();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPayroll((prev: PayrollData | null) =>
      prev
        ? {
            ...prev,
            [name]: [
              "year",
              "daysPresent",
              "daysAbsent",
              "leaves",
              "baseSalary",
              "deductions",
              "bonuses",
              "totalSalary",
              "netSalary",
            ].includes(name)
              ? Number(value)
              : value,
          }
        : null
    );
  };

  const handleExtraPaymentChange = (
    id: string,
    field: keyof ExtraPayment,
    value: string | number
  ) => {
    setExtraPayments((prev) =>
      prev.map((payment) =>
        payment.id === id
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

  const removeExtraPayment = (id: string) => {
    setExtraPayments((prev) => prev.filter((payment) => payment.id !== id));
  };

  const calculateNetSalary = () => {
    if (!payroll) return 0;
    const base = payroll.baseSalary;
    const deductions = payroll.deductions;
    const bonuses = payroll.bonuses;
    const extras = extraPayments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );
    return base - deductions + bonuses + extras;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payroll) {
      setLoading(true);
      setError(null);
      try {
        const updatedPayroll: PayrollData = {
          ...payroll,
          netSalary: calculateNetSalary(),
          extraPayments,
        };

        // Send update request to backend
        const response = await axiosInstance.patch(
          `/api/payroll/${id}`,
          updatedPayroll
        );
        updatePayroll(response.data.payroll);
        toast.success(`Payroll updated for ${payroll.user.name}`);
        navigate("/");
      } catch (err: any) {
        console.error("Error updating payroll:", err);
        setError(err.response?.data?.message || "Failed to update payroll.");
      } finally {
        setLoading(false);
      }
    }
  };

  const months = [
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

  if (loading && !payroll) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-blue-600" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center rounded-lg">
      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <FaUserEdit
              className="text-purple-900 dark:text-blue-600 mr-3"
              size={30}
            />
            <h2 className="text-3xl font-bold text-purple-900 dark:text-blue-600">
              Edit Payroll
            </h2>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-purple-900 dark:text-blue-600 hover:text-purple-700 dark:hover:text-blue-400 transition-colors"
            aria-label="Close"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="flex items-center text-sm font-medium text-purple-900 dark:text-blue-600 mb-1"
              >
                <FaUserEdit className="mr-2" /> Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={payroll?.user.name}
                onChange={handleChange}
                required
                className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Department */}
            <div className="flex flex-col">
              <label
                htmlFor="department"
                className="flex items-center text-sm font-medium text-purple-900 dark:text-blue-600 mb-1"
              >
                <FaBuilding className="mr-2" /> Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={payroll?.user.department}
                onChange={(e) =>
                  setPayroll((prev) =>
                    prev
                      ? {
                          ...prev,
                          user: { ...prev.user, department: e.target.value },
                        }
                      : null
                  )
                }
                required
                className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Month */}
            <div className="flex flex-col">
              <label
                htmlFor="month"
                className="flex items-center text-sm font-medium text-purple-900 dark:text-blue-600 mb-1"
              >
                <FaCalendarAlt className="mr-2" /> Month
              </label>
              <select
                id="month"
                name="month"
                value={payroll?.month}
                onChange={handleChange}
                required
                className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month} value={getMonthNumber(month)}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="flex flex-col">
              <label
                htmlFor="year"
                className="flex items-center text-sm font-medium text-purple-900 dark:text-blue-600 mb-1"
              >
                <FaCalendarAlt className="mr-2" /> Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={payroll?.year}
                onChange={handleChange}
                required
                min={2000}
                max={2100}
                className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Days Present */}
            <div className="flex flex-col">
              <label
                htmlFor="daysPresent"
                className="flex items-center text-sm font-medium text-purple-900 dark:text-blue-600 mb-1"
              >
                <FaCalendarAlt className="mr-2" /> Days Present
              </label>
              <input
                type="number"
                id="daysPresent"
                name="daysPresent"
                value={payroll?.daysPresent}
                onChange={handleChange}
                required
                min={0}
                max={31}
                className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Days Absent */}
            <div className="flex flex-col">
              <label
                htmlFor="daysAbsent"
                className="flex items-center text-sm font-medium text-purple-900 dark:text-blue-600 mb-1"
              >
                <FaCalendarAlt className="mr-2" /> Days Absent
              </label>
              <input
                type="number"
                id="daysAbsent"
                name="daysAbsent"
                value={payroll?.daysAbsent}
                onChange={handleChange}
                required
                min={0}
                max={31}
                className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Leaves */}
            <div className="flex flex-col">
              <label
                htmlFor="leaves"
                className="flex items-center text-sm font-medium text-purple-900 dark:text-blue-600 mb-1"
              >
                <FaCalendarAlt className="mr-2" /> Leaves
              </label>
              <input
                type="number"
                id="leaves"
                name="leaves"
                value={payroll?.leaves ?? 0}
                onChange={handleChange}
                required
                min={0}
                className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Base Salary */}
            <div className="flex flex-col">
              <label
                htmlFor="baseSalary"
                className="flex items-center text-sm font-medium text-purple-900 dark:text-blue-600 mb-1"
              >
                <FaMoneyBillWave className="mr-2" /> Base Salary (PKR)
              </label>
              <input
                type="number"
                id="baseSalary"
                name="baseSalary"
                value={payroll?.baseSalary}
                onChange={handleChange}
                required
                min={0}
                step={0.01}
                className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Deductions */}
            <div className="flex flex-col">
              <label
                htmlFor="deductions"
                className="flex items-center text-sm font-medium text-purple-900 dark:text-blue-600 mb-1"
              >
                <FaMoneyBillWave className="mr-2" /> Deductions (PKR)
              </label>
              <input
                type="number"
                id="deductions"
                name="deductions"
                value={payroll?.deductions}
                onChange={handleChange}
                required
                min={0}
                step={0.01}
                className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Bonuses */}
            <div className="flex flex-col">
              <label
                htmlFor="bonuses"
                className="flex items-center text-sm font-medium text-purple-900 dark:text-blue-600 mb-1"
              >
                <FaMoneyBillWave className="mr-2" /> Bonuses (PKR)
              </label>
              <input
                type="number"
                id="bonuses"
                name="bonuses"
                value={payroll?.bonuses}
                onChange={handleChange}
                required
                min={0}
                step={0.01}
                className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            {/* Net Salary */}
            <div className="flex flex-col">
              <label
                htmlFor="netSalary"
                className="flex items-center text-sm font-medium text-purple-900 dark:text-blue-600 mb-1"
              >
                <FaMoneyBillWave className="mr-2" /> Net Salary (PKR)
              </label>
              <input
                type="number"
                id="netSalary"
                name="netSalary"
                value={calculateNetSalary()}
                readOnly
                className="mt-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Extra Payments */}
          <div className="mt-6">
            <h3 className="flex items-center text-lg font-semibold text-purple-900 dark:text-blue-600 mb-4">
              <FaMoneyBillWave className="mr-2" /> Extra Payments
            </h3>
            {extraPayments.length > 0 ? (
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left text-purple-900 dark:text-blue-600">
                      Description
                    </th>
                    <th className="px-4 py-2 border-b text-left text-purple-900 dark:text-blue-600">
                      Amount (PKR)
                    </th>
                    <th className="px-4 py-2 border-b text-center text-purple-900 dark:text-blue-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {extraPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
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
                          placeholder="Description"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
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
                          step={0.01}
                          placeholder="Amount"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeExtraPayment(payment.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Remove Extra Payment"
                        >
                          <FaMinus />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 dark:text-gray-300 mb-4">
                No extra payments added.
              </p>
            )}
            <button
              type="button"
              onClick={addExtraPayment}
              className="flex items-center text-green-500 hover:text-green-700 transition-colors mt-4"
            >
              <FaPlus className="mr-2" /> Add Extra Payment
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className={`flex items-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              <FaArrowLeft className="mr-2" />{" "}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPayroll;
