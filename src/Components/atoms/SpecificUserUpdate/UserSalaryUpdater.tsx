import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

interface UserSalaryUpdaterProps {
  userId: string;
  basicSalary: number;
  medicalAllowance?: number; // Make optional
  mobileAllowance?: number; // Make optional
  fuelAllowance?: number; // Make optional
  onUpdate: (details: {
    basicSalary: number;
    medicalAllowance?: number; // Make optional
    mobileAllowance?: number; // Make optional
    fuelAllowance?: number; // Make optional
  }) => void;
}

const UserSalaryUpdater: React.FC<UserSalaryUpdaterProps> = ({
  userId,
  basicSalary,
  medicalAllowance,
  mobileAllowance,
  fuelAllowance,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    basicSalary,
    medicalAllowance: medicalAllowance ?? 0, // Default to 0 if undefined
    mobileAllowance: mobileAllowance ?? 0, // Default to 0 if undefined
    fuelAllowance: fuelAllowance ?? 0, // Default to 0 if undefined
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : parseFloat(value), // Allow empty input
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const SalaryInput = ({ label, name, value, disabled }: { label: string; name: string; value: number | undefined; disabled: boolean }) => (
      <div>
        <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-widest mb-2">
          {label}
        </label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 font-medium">PKR</span>
            <input
            type="number"
            name={name}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full pl-12 pr-4 py-3 border rounded-xl font-semibold text-gunmetal-900 bg-alabaster-grey-50 transition-all
                ${!disabled 
                    ? "border-platinum-200 focus:border-gunmetal-500 focus:ring-2 focus:ring-gunmetal-200" 
                    : "border-transparent cursor-not-allowed opacity-80"
                }
            `}
            />
        </div>
      </div>
  );

  return (
    <div className="bg-white p-8 rounded-2xl border border-platinum-200 shadow-xl max-w-4xl mx-auto relative">
      <button
        onClick={toggleEdit}
        className={`absolute top-6 right-6 p-2 rounded-full transition-all shadow-sm border border-platinum-200 flex items-center justify-center
            ${isEditing 
                ? 'bg-gunmetal-900 text-white' 
                : 'bg-alabaster-grey-50 text-gunmetal-600 hover:bg-gunmetal-900 hover:text-white'
            }
        `}
        aria-label="Edit Salary Details"
      >
        <FaEdit size={18} />
      </button>

      <div className="mb-8 border-b border-platinum-200 pb-4">
        <h2 className="text-xl font-bold text-gunmetal-900">Compensation & Benefits</h2>
        <p className="text-sm text-slate-grey-500 mt-1">Manage salary breakdown and allowances</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SalaryInput 
                label="Basic Salary" 
                name="basicSalary" 
                value={formData.basicSalary} 
                disabled={!isEditing} 
            />
            <SalaryInput 
                label="Medical Allowance" 
                name="medicalAllowance" 
                value={formData.medicalAllowance} 
                disabled={!isEditing} 
            />
             <SalaryInput 
                label="Mobile Allowance" 
                name="mobileAllowance" 
                value={formData.mobileAllowance} 
                disabled={!isEditing} 
            />
             <SalaryInput 
                label="Fuel Allowance" 
                name="fuelAllowance" 
                value={formData.fuelAllowance} 
                disabled={!isEditing} 
            />
        </div>

        {isEditing && (
          <div className="flex justify-end mt-8 pt-6 border-t border-platinum-200 animate-fadeIn">
            <button
              type="submit"
              className="px-8 py-3 bg-gunmetal-900 text-white rounded-xl hover:bg-gunmetal-800 transition-all text-sm font-bold shadow-lg hover:shadow-gunmetal-500/20 transform hover:-translate-y-0.5"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserSalaryUpdater;
