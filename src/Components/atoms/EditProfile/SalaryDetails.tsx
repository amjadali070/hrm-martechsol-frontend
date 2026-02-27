import React, { useState } from "react";
import { FaMoneyBillWave, FaEdit, FaHeartbeat, FaMobileAlt, FaGasPump } from "react-icons/fa";

interface SalaryDetailsProps {
  basicSalary: number;
  medicalAllowance: number;
  mobileAllowance: number;
  fuelAllowance: number;
  onUpdate: (details: {
    basicSalary: number;
    medicalAllowance: number;
    mobileAllowance: number;
    fuelAllowance: number;
  }) => Promise<void>;
}

const SalaryDetails: React.FC<SalaryDetailsProps> = ({
  basicSalary,
  medicalAllowance,
  mobileAllowance,
  fuelAllowance,
  onUpdate,
}) => {
  const [isEditing] = useState(false); // Locked for now as per original code logic (no setIsEditing)

  // NOTE: Original code did not implement toggle editing properly (it had comments). 
  // Given user request is "redesign each and everything", I will keep it read-only for now 
  // unless I see backend support or user wants it editable. 
  // Assuming HR modifies this elsewhere or it is just a view.
  // The original file had commented out edit buttons. I will display it as premium view.

  const renderField = (label: string, icon: React.ReactNode, value: number) => (
      <div className="bg-alabaster-grey-50 p-5 rounded-xl border border-platinum-200 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gunmetal-500 shadow-sm border border-platinum-100 group-hover:text-gunmetal-900 group-hover:border-gunmetal-200 transition-colors">
                 {icon}
              </div>
              <p className="text-sm font-bold text-slate-grey-600 uppercase tracking-wide">{label}</p>
          </div>
          <p className="text-2xl font-bold text-gunmetal-900 pl-1">
            {value.toLocaleString()} <span className="text-xs text-slate-grey-400 font-normal">PKR</span>
          </p>
      </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-platinum-200 overflow-hidden relative">
      <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200">
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">Salary & Allowances</h2>
            <p className="text-sm text-slate-grey-500 mt-1">Breakdown of your current compensation package</p>
        </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField("Basic Salary", <FaMoneyBillWave />, basicSalary)}
            {renderField("Medical Allowance", <FaHeartbeat />, medicalAllowance)}
            {renderField("Mobile Allowance", <FaMobileAlt />, mobileAllowance)}
            {renderField("Fuel Allowance", <FaGasPump />, fuelAllowance)}
        </div>
        
        <div className="mt-8 p-6 bg-gunmetal-900 rounded-xl text-white flex flex-col md:flex-row justify-between items-center">
            <div>
                <p className="text-gunmetal-300 text-sm font-medium uppercase tracking-wider mb-1">Total Monthly Compensation</p>
                <p className="text-3xl font-bold">
                    {(basicSalary + medicalAllowance + mobileAllowance + fuelAllowance).toLocaleString()} 
                    <span className="text-lg text-gunmetal-400 font-normal ml-2">PKR</span>
                </p>
            </div>
            {/* Placeholder for future actions like "Download Slip" */}
        </div>
      </div>
    </div>
  );
};

export default SalaryDetails;
