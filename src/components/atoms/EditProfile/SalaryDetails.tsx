import React from "react";

interface SalaryDetailsProps {
  basicSalary: number;
  medicalAllowance: number;
  mobileAllowance: number;
  fuelAllowance: number;
}

const SalaryDetails: React.FC<SalaryDetailsProps> = ({
  basicSalary,
  medicalAllowance,
  mobileAllowance,
  fuelAllowance,
}) => {
  return (
    <div className="bg-white p-10 rounded-lg w-full mx-auto">
      <h2 className="text-lg font-semibold mb-4">Salary Details</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Basic Salary
        </label>
        <p className="p-3 border border-gray-300 rounded-md bg-[#F3F4F6]">
          {basicSalary}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Medical Allowance
        </label>
        <p className="p-3 border border-gray-300 rounded-md bg-[#F3F4F6]">
          {medicalAllowance}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Allowance
        </label>
        <p className="p-3 border border-gray-300 rounded-md bg-[#F3F4F6]">
          {mobileAllowance}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fuel Allowance
        </label>
        <p className="p-3 border border-gray-300 rounded-md bg-[#F3F4F6]">
          {fuelAllowance}
        </p>
      </div>
    </div>
  );
};

export default SalaryDetails;
