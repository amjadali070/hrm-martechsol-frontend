import React, { useState } from "react";
import { FaTimes, FaCalendarPlus } from "react-icons/fa";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import { getMonthNumber } from "../../../utils/monthUtils";

interface GeneratePayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (month: string, year: number) => Promise<void>;
}

const GeneratePayrollModal: React.FC<GeneratePayrollModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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
      await onGenerate(month, year);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to generate payroll.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1050] flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm p-4 animate-fadeIn"
      aria-labelledby="generate-payroll-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-platinum-200 relative overflow-hidden transform transition-all scale-100">
         {/* Decoration */}
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gunmetal-600 to-gunmetal-900"></div>

         <div className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                     <div className="bg-gunmetal-50 p-3 rounded-xl text-gunmetal-600">
                        <FaCalendarPlus size={24} />
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-gunmetal-900">Generate Payroll</h2>
                        <p className="text-xs text-slate-grey-500">Initiate salary calculation for a period</p>
                     </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors p-1"
                >
                    <FaTimes size={18} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-2">Month</label>
                    <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 outline-none transition-all cursor-pointer text-gunmetal-900 font-medium appearance-none"
                    >
                        <option value="">Select Month</option>
                        {months.map((m) => (
                             <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-wide mb-2">Year</label>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        min={2000}
                        max={2100}
                        className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 outline-none transition-all text-gunmetal-900 font-medium"
                    />
                 </div>

                 {error && (
                     <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center justify-center font-medium">
                         {error}
                     </div>
                 )}

                 <div className="flex gap-3 mt-4">
                     <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white border border-platinum-200 text-slate-grey-600 font-bold rounded-xl hover:bg-platinum-50 transition-colors"
                     >
                         Cancel
                     </button>
                     <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-gunmetal-900 text-white font-bold rounded-xl hover:bg-gunmetal-800 transition-all shadow-lg hover:shadow-gunmetal-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                     >
                         {loading ? <LoadingSpinner size="sm" color="white" /> : null}
                         {loading ? " Generating..." : "Generate"}
                     </button>
                 </div>
            </form>
         </div>
      </div>
    </div>
  );
};

export default GeneratePayrollModal;
