import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

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
  }) => void;
}

const SalaryDetails: React.FC<SalaryDetailsProps> = ({
  basicSalary,
  medicalAllowance,
  mobileAllowance,
  fuelAllowance,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    basicSalary,
    medicalAllowance,
    mobileAllowance,
    fuelAllowance,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      basicSalary: formData.basicSalary,
      medicalAllowance: formData.medicalAllowance,
      mobileAllowance: formData.mobileAllowance,
      fuelAllowance: formData.fuelAllowance,
    });
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="bg-white p-10 rounded-lg w-full mx-auto relative">
      <button
        onClick={toggleEdit}
        className="absolute top-10 right-10 text-blue-600 hover:text-blue-500 transition-all"
        aria-label="Edit Salary Details"
      >
        <FaEdit size={24} />
      </button>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Basic Salary
          </label>
          <input
            type="text"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Allowance
              </label>
              <input
                type="text"
                name="medicalAllowance"
                value={formData.medicalAllowance}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                  !isEditing ? "cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Allowance
              </label>
              <input
                type="text"
                name="mobileAllowance"
                value={formData.mobileAllowance}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                  !isEditing ? "cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Allowance
              </label>
              <input
                type="text"
                name="formData.fuelAllowance}"
                value={formData.fuelAllowance}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                  !isEditing ? "cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-start">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-600 transition-all text-lg font-semibold"
            >
              Update
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SalaryDetails;
