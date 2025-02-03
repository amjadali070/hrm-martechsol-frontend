import React, { useState } from "react";
import { FaTimes, FaCalendarCheck } from "react-icons/fa";
import { getMonthNumber } from "../../../utils/monthUtils";

interface ProcessPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (month: string, year: number) => Promise<void>;
}

const ProcessPayrollModal: React.FC<ProcessPayrollModalProps> = ({
  isOpen,
  onClose,
  onProcess,
}) => {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!month || !year) {
      setError("Both Month and Year are required.");
      return;
    }

    const monthNumber = getMonthNumber(month);
    if (!monthNumber) {
      setError("Invalid month selected.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onProcess(month, year);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to process payroll.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-labelledby="process-payroll-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
          aria-label="Close Modal"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
          <FaCalendarCheck className="mr-2" />
          Process Payroll
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="month"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2"
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Year
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              required
              min={2000}
              max={2100}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2"
              placeholder="e.g., 2025"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end">
            <button
              type="submit"
              className={`flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              <FaCalendarCheck className="mr-2" />
              {loading ? "Processing..." : "Process Payroll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcessPayrollModal;
