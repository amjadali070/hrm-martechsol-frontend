// src/components/PayrollDetailModal.tsx
import React from "react";
import { FaTimes, FaMoneyCheckAlt } from "react-icons/fa";
import { getMonthName } from "../../../utils/monthUtils";

export interface PayrollData {
  id: string;
  user: {
    name: string;
    email: string;
    employeeId?: string;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl border border-platinum-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-platinum-200">
             <div className="flex items-center gap-3">
                <div className="bg-gunmetal-50 p-2.5 rounded-lg text-gunmetal-600">
                    <FaMoneyCheckAlt size={22} />
                </div>
                <div>
                     <h2 className="text-xl font-bold text-gunmetal-900">
                        Payroll Details
                    </h2>
                    <p className="text-xs text-slate-grey-500 font-medium">
                        {getMonthName(payroll.month)} {payroll.year}
                    </p>
                </div>
             </div>
             
             <button
                onClick={onClose}
                className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors bg-platinum-50 hover:bg-platinum-100 p-2 rounded-full"
                aria-label="Close Modal"
            >
                <FaTimes size={16} />
            </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
            {/* User Info Section */}
            <div className="bg-alabaster-grey-50 rounded-xl p-4 border border-platinum-200 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div>
                     <h3 className="text-lg font-bold text-gunmetal-900">{payroll.user.name}</h3>
                     <div className="flex items-center gap-3 text-sm text-slate-grey-600 mt-1">
                         <span className="bg-white px-2 py-0.5 rounded border border-platinum-200 text-xs font-mono">
                             {payroll.user.employeeId || "No ID"}
                         </span>
                         <span>{payroll.user.personalDetails?.department}</span>
                     </div>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                     payroll.status === "Paid" 
                     ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                     : "bg-amber-50 text-amber-700 border-amber-100"
                 }`}>
                     {payroll.status}
                 </div>
            </div>

            {/* Financial Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                 <div className="space-y-4">
                     <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 pb-2">Earnings</h4>
                     
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-grey-600">Basic Salary</span>
                         <span className="font-mono font-medium text-gunmetal-900">PKR {Number(payroll.basicSalary).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-grey-600">Allowances</span>
                         <span className="font-mono font-medium text-gunmetal-900">PKR {Number(payroll.allowances).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-grey-600">Per Day Salary</span>
                         <span className="font-mono font-medium text-slate-grey-500">PKR {Number(payroll.perDaySalary).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed border-platinum-200">
                         <span className="font-bold text-gunmetal-700">Total Salary</span>
                         <span className="font-mono font-bold text-gunmetal-900">PKR {Number(payroll.totalSalary).toLocaleString()}</span>
                     </div>
                 </div>

                 <div className="space-y-4">
                     <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider border-b border-platinum-200 pb-2">Deductions & Summary</h4>
                     
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-grey-600">Absent Days ({payroll.absentDays})</span>
                         <span className="font-mono text-rose-600">-</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-grey-600">Late/Early ({payroll.lateIns})</span>
                         <span className="font-mono text-rose-600">-</span>
                     </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-slate-grey-600">Total Deductions</span>
                         <span className="font-mono font-medium text-rose-600">- PKR {Number(payroll.deductions).toLocaleString()}</span>
                     </div>
                     
                     <div className="bg-gunmetal-50 p-2 rounded-lg flex justify-between items-center mt-2">
                         <span className="text-sm font-bold text-gunmetal-900">Net Salary</span>
                         <span className="font-mono text-lg font-bold text-gunmetal-900">PKR {Number(payroll.netSalary).toLocaleString()}</span>
                     </div>
                 </div>
            </div>

            {/* Additional Details */}
            {(formattedAbsentDates.length > 0 || payroll.processedOn) && (
                <div className="mt-8 pt-4 border-t border-platinum-200 space-y-3">
                    {formattedAbsentDates.length > 0 && (
                        <div>
                            <span className="text-xs font-bold text-slate-grey-500 uppercase block mb-1">Absent Dates</span>
                            <p className="text-sm text-slate-grey-600 leading-relaxed">{formattedAbsentDates.join(", ")}</p>
                        </div>
                    )}
                    
                    {payroll.processedOn && (
                         <div className="flex justify-end">
                            <p className="text-xs text-slate-grey-400 italic">
                                Processed on: {new Date(payroll.processedOn).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-platinum-200 bg-alabaster-grey-50 rounded-b-xl flex justify-end">
             <button
                onClick={onClose}
                className="px-6 py-2 bg-white border border-platinum-200 text-gunmetal-700 font-medium rounded-lg hover:bg-platinum-50 hover:text-gunmetal-900 transition-colors shadow-sm text-sm"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetailModal;
