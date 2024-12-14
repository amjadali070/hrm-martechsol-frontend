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

  return (
    <div className="bg-white p-6 rounded-lg w-full mx-auto relative">
      <button
        onClick={toggleEdit}
        className="absolute top-4 right-4 text-blue-600 hover:text-blue-500 transition-all"
        aria-label="Edit Salary Details"
      >
        <FaEdit size={24} />
      </button>

      <h2 className="text-lg font-semibold mb-4">Salary Details</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Allowance
              </label>
              <input
                type="number"
                name="medicalAllowance"
                value={formData.medicalAllowance} // No need for empty string check
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
                type="number"
                name="mobileAllowance"
                value={formData.mobileAllowance} // No need for empty string check
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
                type="number"
                name="fuelAllowance"
                value={formData.fuelAllowance} // No need for empty string check
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
          <div className="flex justify-start mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all text-lg font-semibold"
            >
              Update
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserSalaryUpdater;
