// src/components/PayrollDetailModal.tsx
import React from "react";
import { FaTimes, FaMoneyCheckAlt } from "react-icons/fa";
import { getMonthName } from "../../../utils/monthUtils";

export interface PayrollData {
  id: string;
  user: {
    name: string;
    email: string;
    personalDetails: { department: string };
  };
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  perDaySalary: number;
  totalSalary: number;
  deductions: number;
  netSalary: number;
  lateIns: number;
  absentDays: number;
  absentDates: string[];
  status: string;
  processedOn: string | null;
  remarks?: string;
  extraPayments?: any[];
}

interface PayrollDetailModalProps {
  isOpen: boolean;
  payroll: PayrollData;
  onClose: () => void;
}

const PayrollDetailModal: React.FC<PayrollDetailModalProps> = ({
  isOpen,
  payroll,
  onClose,
}) => {
  if (!isOpen) return null;

  const formattedAbsentDates = payroll.absentDates
    ? payroll.absentDates.map((date) => new Date(date).toLocaleDateString())
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-11/12 md:w-3/4 lg:w-1/2 p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-purple-900 dark:text-blue-600"
          aria-label="Close Modal"
        >
          <FaTimes size={24} />
        </button>
        <div className="flex items-center mb-6">
          <FaMoneyCheckAlt
            className="text-purple-900 dark:text-blue-600 mr-3"
            size={30}
          />
          <h2 className="text-3xl font-bold text-purple-900 dark:text-blue-600">
            Payroll Details
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <tbody>
              <tr>
                <td className="px-5 py-3 font-medium">Name</td>
                <td className="px-5 py-3">{payroll.user.name}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Department</td>
                <td className="px-5 py-3">
                  {payroll.user.personalDetails?.department}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Month & Year</td>
                <td className="px-5 py-3">
                  {getMonthName(payroll.month)} {payroll.year}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Basic Salary</td>
                <td className="px-5 py-3">
                  PKR {Number(payroll.basicSalary).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Allowances</td>
                <td className="px-5 py-3">
                  PKR {Number(payroll.allowances).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Per Day Salary</td>
                <td className="px-5 py-3">
                  PKR {Number(payroll.perDaySalary).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Absent Days</td>
                <td className="px-5 py-3">{payroll.absentDays}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">
                  Late IN/Early Out Count
                </td>
                <td className="px-5 py-3">{payroll.lateIns}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Total Deductions</td>
                <td className="px-5 py-3">
                  PKR {Number(payroll.deductions).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Total Salary</td>
                <td className="px-5 py-3">
                  PKR {Number(payroll.totalSalary).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3 font-medium">Net Salary</td>
                <td className="px-5 py-3">
                  PKR {Number(payroll.netSalary).toFixed(2)}
                </td>
              </tr>
              {formattedAbsentDates.length > 0 && (
                <tr>
                  <td className="px-5 py-3 font-medium">Absent Dates</td>
                  <td className="px-5 py-3">
                    {formattedAbsentDates.join(", ")}
                  </td>
                </tr>
              )}
              {payroll.processedOn && (
                <tr>
                  <td className="px-5 py-3 font-medium">Processed On</td>
                  <td className="px-5 py-3">
                    {new Date(payroll.processedOn).toLocaleString()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center px-5 py-2 bg-purple-900 dark:bg-blue-600 text-white rounded-md"
          >
            <FaTimes className="mr-2" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetailModal;
