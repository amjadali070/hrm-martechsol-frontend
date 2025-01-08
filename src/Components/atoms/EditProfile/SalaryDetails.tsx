// SalaryDetails.tsx

import React, { useState } from "react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedSalary, setEditedSalary] = useState({
    basicSalary,
    medicalAllowance,
    mobileAllowance,
    fuelAllowance,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedSalary((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSave = async () => {
    await onUpdate(editedSalary);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedSalary({
      basicSalary,
      medicalAllowance,
      mobileAllowance,
      fuelAllowance,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-10 rounded-lg w-full mx-auto">
      <h2 className="text-lg font-semibold mb-4">Salary Details</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Basic Salary
        </label>
        {isEditing ? (
          <input
            type="number"
            name="basicSalary"
            value={editedSalary.basicSalary}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        ) : (
          <p className="p-3 border border-gray-300 rounded-md bg-[#F3F4F6]">
            {basicSalary}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Medical Allowance
        </label>
        {isEditing ? (
          <input
            type="number"
            name="medicalAllowance"
            value={editedSalary.medicalAllowance}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        ) : (
          <p className="p-3 border border-gray-300 rounded-md bg-[#F3F4F6]">
            {medicalAllowance}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mobile Allowance
        </label>
        {isEditing ? (
          <input
            type="number"
            name="mobileAllowance"
            value={editedSalary.mobileAllowance}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        ) : (
          <p className="p-3 border border-gray-300 rounded-md bg-[#F3F4F6]">
            {mobileAllowance}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fuel Allowance
        </label>
        {isEditing ? (
          <input
            type="number"
            name="fuelAllowance"
            value={editedSalary.fuelAllowance}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        ) : (
          <p className="p-3 border border-gray-300 rounded-md bg-[#F3F4F6]">
            {fuelAllowance}
          </p>
        )}
      </div>

      {/* Edit/Save Buttons
      <div className="flex space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-colors"
          >
            Edit
          </button>
        )}
      </div> */}
    </div>
  );
};

export default SalaryDetails;
