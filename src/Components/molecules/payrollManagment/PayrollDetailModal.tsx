import React from "react";
import { FaTimes, FaMoneyCheckAlt, FaUser, FaBuilding } from "react-icons/fa";
import { getMonthName } from "../../../utils/monthUtils";
import { PayrollData } from "./PayrollContext";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-platinum-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-platinum-200 bg-white">
             <div className="flex items-center gap-3">
                <div className="bg-gunmetal-50 p-2.5 rounded-xl text-gunmetal-600">
                    <FaMoneyCheckAlt size={22} />
                </div>
                <div>
                     <h2 className="text-xl font-bold text-gunmetal-900">
                        Payroll Slip
                    </h2>
                    <p className="text-xs text-slate-grey-500 font-bold uppercase tracking-wide">
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
        <div className="overflow-y-auto p-6 bg-alabaster-grey-50/50">
            {/* User Info Section */}
            <div className="bg-white rounded-xl p-5 border border-platinum-200 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gunmetal-50 to-transparent rounded-bl-full -mr-2 -mt-2"></div>
                 
                 <div className="flex items-center gap-4 relative z-10">
                     <div className="w-12 h-12 rounded-full bg-gunmetal-100 flex items-center justify-center text-gunmetal-600 font-bold text-lg ring-4 ring-alabaster-grey-50">
                         {payroll.user.name.charAt(0)}
                     </div>
                     <div>
                         <h3 className="text-lg font-bold text-gunmetal-900">{payroll.user.name}</h3>
                         <div className="flex items-center gap-3 text-sm text-slate-grey-600 mt-0.5">
                             <div className="flex items-center gap-1.5">
                                 <FaBuilding size={12} className="text-slate-grey-400"/>
                                 <span>{payroll.user.personalDetails?.department}</span>
                             </div>
                         </div>
                     </div>
                 </div>
                 
                 <div className="relative z-10">
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border shadow-sm ${
                        payroll.status === "Paid" 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                        {payroll.status}
                    </div>
                 </div>
            </div>

            {/* Financial Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {/* Earnings */}
                 <div className="bg-white p-5 rounded-xl border border-platinum-200 shadow-sm">
                     <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider mb-4 pb-2 border-b border-platinum-100 flex justify-between items-center">
                         <span>Earnings</span>
                         <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px]">Credit</span>
                     </h4>
                     
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-grey-600 font-medium">Basic Salary</span>
                            <span className="font-mono font-bold text-gunmetal-900">{payroll.basicSalary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-grey-600 font-medium">Allowances</span>
                            <span className="font-mono font-bold text-gunmetal-900">{payroll.allowances.toLocaleString()}</span>
                        </div>
                        
                        {(payroll.extraPayments || []).map((extra: any, idx: number) => (
                             <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-slate-grey-600 font-medium">{extra.description}</span>
                                <span className="font-mono font-bold text-emerald-600">+{extra.amount.toLocaleString()}</span>
                            </div>
                        ))}

                        <div className="flex justify-between items-center text-sm pt-3 border-t border-dashed border-platinum-200 mt-2">
                            <span className="font-bold text-gunmetal-700">Gross Total</span>
                            <span className="font-mono font-extrabold text-gunmetal-900">{payroll.totalSalary.toLocaleString()}</span>
                        </div>
                     </div>
                 </div>

                 {/* Deductions */}
                 <div className="bg-white p-5 rounded-xl border border-platinum-200 shadow-sm">
                     <h4 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider mb-4 pb-2 border-b border-platinum-100 flex justify-between items-center">
                         <span>Deductions</span>
                         <span className="bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded text-[10px]">Debit</span>
                     </h4>
                     
                     <div className="space-y-3">
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-grey-600 font-medium">Absent Days ({payroll.absentDays})</span>
                             <span className="font-mono font-bold text-rose-600">
                                 -{((payroll.absentDays || 0) * (payroll.perDaySalary || 0)).toLocaleString()}
                             </span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-grey-600 font-medium">Latel/Half ({payroll.lateIns + (payroll.halfDays || 0)})</span>
                             <span className="font-mono font-bold text-rose-600">
                                 -{(payroll.deductions - ((payroll.absentDays || 0) * (payroll.perDaySalary || 0))).toLocaleString()}
                             </span>
                         </div>
                    
                         <div className="flex justify-between items-center text-sm pt-3 border-t border-dashed border-platinum-200 mt-2">
                             <span className="font-bold text-gunmetal-700">Total Deductions</span>
                             <span className="font-mono font-extrabold text-rose-600">-{payroll.deductions.toLocaleString()}</span>
                         </div>
                     </div>
                 </div>
            </div>

            {/* Net Salary Highlight */}
            <div className="mt-6 bg-gunmetal-900 rounded-xl p-5 text-white shadow-lg flex justify-between items-center">
                <div>
                     <p className="text-xs font-bold text-gunmetal-300 uppercase tracking-wide">Net Payable Amount</p>
                     <p className="text-xs text-gunmetal-400 mt-0.5">Transferrable salary after all adjustments</p>
                </div>
                <div className="text-right">
                    <span className="font-mono text-3xl font-extrabold tracking-tight">
                        PKR {((payroll.netSalary) + (payroll.extraPayments?.reduce((a:any, b:any) => a + b.amount, 0) || 0)).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Additional Details */}
            {(formattedAbsentDates.length > 0 || payroll.processedOn) && (
                <div className="mt-6 pt-4 border-t border-platinum-200 space-y-3">
                    {formattedAbsentDates.length > 0 && (
                        <div>
                            <span className="text-xs font-bold text-slate-grey-400 uppercase block mb-2">Absent Dates</span>
                            <div className="flex flex-wrap gap-2">
                                {formattedAbsentDates.map((date, i) => (
                                    <span key={i} className="px-2 py-1 bg-red-50 text-red-600 border border-red-100 rounded text-xs font-mono font-medium">
                                        {date}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-platinum-200 bg-white rounded-b-xl flex justify-between items-center">
             <div className="text-xs text-slate-grey-400 font-medium">
                 {payroll.processedOn ? `Processed: ${new Date(payroll.processedOn).toLocaleDateString()}` : "Not Processed"}
             </div>
             <button
                onClick={onClose}
                className="px-6 py-2 bg-alabaster-grey-50 border border-platinum-200 text-gunmetal-700 font-bold rounded-lg hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm text-sm"
            >
                Close View
            </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetailModal;
