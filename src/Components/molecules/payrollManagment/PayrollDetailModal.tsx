// src/components/PayrollDetailModal.tsx
import React from "react";
import {
  FaTimes,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaChartLine,
} from "react-icons/fa";
import { getMonthName } from "../../../utils/monthUtils";

export interface ExtraPayment {
  id: string;
  description: string;
  amount: number;
}

export interface PayrollData {
  id: string;
  user: {
    name: string;
    email: string;
    personalDetails: {
      department: string;
    };
  };
  month: number;
  year: number;
  daysPresent: number;
  daysAbsent: number;
  leaves: number;
  baseSalary: number;
  deductions: number;
  bonuses: number;
  totalSalary: number;
  netSalary: number;
  status: string;
  processedOn: string | null;
  remarks: string;
  extraPayments?: ExtraPayment[];
  absentDates: string[];
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

  // Define formattedAbsentDates with a fallback to an empty array.
  const formattedAbsentDates = payroll.absentDates
    ? payroll.absentDates.map((date) => new Date(date).toLocaleDateString())
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity"
      aria-labelledby="payroll-detail-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl w-11/12 md:w-3/4 lg:w-1/2 p-4 relative transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-purple-900 dark:text-blue-600 hover:text-purple-700 dark:hover:text-blue-400 transition-colors"
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
          <table className="min-w-full table-auto">
            <tbody>
              <tr className="border-b">
                <td className="px-6 py-3 text-purple-800 dark:text-blue-400 font-medium flex items-center">
                  <FaUser className="mr-2" /> Name
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  {payroll.user.name}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium flex items-center">
                  <FaBuilding className="mr-2" /> Department
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  {payroll.user.personalDetails?.department}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium flex items-center">
                  <FaCalendarAlt className="mr-2" /> Month & Year
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  {getMonthName(payroll.month)} {payroll.year}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium">
                  Days Present
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  {payroll.daysPresent}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium">
                  Days Absent
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  {payroll.daysAbsent}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium">
                  Leaves
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  {payroll.leaves}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium flex items-center">
                  <FaMoneyCheckAlt className="mr-2" /> Base Salary
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  PKR {Number(payroll.baseSalary || 0).toFixed(2)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium">
                  Deductions
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  PKR {Number(payroll.deductions || 0).toFixed(2)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium">
                  Bonuses
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  PKR {Number(payroll.bonuses || 0).toFixed(2)}
                </td>
              </tr>
              {/* <tr className="border-b">
                <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium">
                  Total Salary
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  PKR {Number(payroll.totalSalary || 0).toFixed(2)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium">
                  Net Salary
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  PKR {Number(payroll.netSalary || 0).toFixed(2)}
                </td>
              </tr> */}
              {/* <tr className="border-b">
                <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium">
                  Status
                </td>
                <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  {payroll.status}
                </td>
              </tr> */}
              {payroll.processedOn && (
                <tr className="border-b">
                  <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium">
                    Processed On
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {new Date(payroll.processedOn).toLocaleString()}
                  </td>
                </tr>
              )}
              <tr className="border-b">
                {/* <td className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium">
                  Remarks
                </td> */}
                {/* <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                  {payroll.remarks || "N/A"}
                </td> */}
              </tr>
              {payroll.extraPayments && payroll.extraPayments.length > 0 && (
                <>
                  <tr className="border-b">
                    <td
                      className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium"
                      colSpan={2}
                    >
                      <FaChartLine className="mr-2 inline" /> Extra Payments
                    </td>
                  </tr>
                  {payroll.extraPayments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                        {payment.description}
                      </td>
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                        PKR {Number(payment.amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </>
              )}
              {payroll.absentDates && payroll.absentDates.length > 0 && (
                <>
                  <tr className="border-b">
                    <td
                      className="px-5 py-3 text-purple-800 dark:text-blue-400 font-medium"
                      colSpan={2}
                    >
                      Absent Dates
                    </td>
                  </tr>
                  {formattedAbsentDates.map((date, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                        Absent Date {index + 1}
                      </td>
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                        {date}
                      </td>
                    </tr>
                  ))}
                </>
              )}
              <tr className="border-t-2">
                <td className="px-5 py-3 text-purple-900 dark:text-blue-600 font-semibold text-lg">
                  Total Salary
                </td>
                <td className="px-5 py-3 text-purple-900 dark:text-blue-600 font-semibold text-lg">
                  PKR {Number(payroll.totalSalary || 0).toFixed(2)}
                </td>
              </tr>
              <tr className="border-t-2">
                <td className="px-5 py-3 text-purple-900 dark:text-blue-600 font-semibold text-lg">
                  Net Salary
                </td>
                <td className="px-5 py-3 text-purple-900 dark:text-blue-600 font-semibold text-lg">
                  PKR {Number(payroll.netSalary || 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center px-5 py-2 bg-purple-900 dark:bg-blue-600 text-white rounded-md hover:bg-purple-700 dark:hover:bg-blue-400 transition-colors"
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
