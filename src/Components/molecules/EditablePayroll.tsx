import React, { useState } from "react";
import { AiOutlineSave, AiOutlineClose } from "react-icons/ai";
import { FaUser, FaBriefcase, FaMoneyBillWave } from "react-icons/fa";

interface PayrollDetails {
  name: string;
  jobTitle: string;
  jobType: string;
  from: string;
  to: string;
  basicSalary: number;
  medicalAllowance: number;
  mobileAllowance: number;
  fuelAllowance: number;
  grossSalary: number;
  additions: number;
  deductions: {
    tax: number;
    eobi: number;
    pfContribution: number;
  };
}

interface EditablePayrollProps {
  payrollData: PayrollDetails;
  onSave: (updatedPayroll: PayrollDetails) => void;
  onCancel: () => void;
}

const EditablePayroll: React.FC<EditablePayrollProps> = ({
  payrollData,
  onSave,
  onCancel,
}) => {
  const [editableData, setEditableData] = useState<PayrollDetails>(payrollData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    nestedField?: string
  ) => {
    if (nestedField) {
      setEditableData((prev) => ({
        ...prev,
        [field]: {
          ...(prev[field as keyof PayrollDetails] as object),
          [nestedField]: e.target.value,
        },
      }));
    } else {
      setEditableData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    }
  };

  const handleSave = () => {
    onSave(editableData);
  };

  return (
    <div className="p-6 bg-white rounded-lg max-w-full mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Edit Payroll
      </h2>

      {/* Personal Details Section */}
      <section className="mb-6">
        <div className="flex items-center bg-purple-900 text-white px-4 py-3 rounded-t-md">
          <FaUser className="mr-2" />
          <h3 className="text-lg font-semibold">Personal Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 rounded-b-md">
          {[
            { label: "Name", field: "name", value: editableData.name },
            {
              label: "Job Title",
              field: "jobTitle",
              value: editableData.jobTitle,
            },
            {
              label: "Job Type",
              field: "jobType",
              value: editableData.jobType,
            },
          ].map(({ label, field, value }) => (
            <div key={field}>
              <label className="block font-medium text-gray-700">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(e, field)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center bg-purple-900 text-white px-4 py-3 rounded-t-md">
          <FaMoneyBillWave className="mr-2" />
          <h3 className="text-lg font-semibold">Salary Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 rounded-b-md">
          {[
            {
              label: "Basic Salary",
              field: "basicSalary",
              value: editableData.basicSalary,
            },
            {
              label: "Medical Allowance",
              field: "medicalAllowance",
              value: editableData.medicalAllowance,
            },
            {
              label: "Mobile Allowance",
              field: "mobileAllowance",
              value: editableData.mobileAllowance,
            },
            {
              label: "Fuel Allowance",
              field: "fuelAllowance",
              value: editableData.fuelAllowance,
            },
            {
              label: "Gross Salary",
              field: "grossSalary",
              value: editableData.grossSalary,
            },
          ].map(({ label, field, value }) => (
            <div key={field}>
              <label className="block font-medium text-gray-700">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleInputChange(e, field)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Deductions Section */}
      <section className="mb-6">
        <div className="flex items-center bg-purple-900 text-white px-4 py-3 rounded-t-md">
          <FaBriefcase className="mr-2" />
          <h3 className="text-lg font-semibold">Deductions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 rounded-b-md">
          {[
            { label: "Tax", nestedField: "tax", value: editableData.deductions.tax },
            { label: "EOBI", nestedField: "eobi", value: editableData.deductions.eobi },
            {
              label: "PF Contribution",
              nestedField: "pfContribution",
              value: editableData.deductions.pfContribution,
            },
          ].map(({ label, nestedField, value }) => (
            <div key={nestedField}>
              <label className="block font-medium text-gray-700">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) =>
                  handleInputChange(e, "deductions", nestedField!)
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <AiOutlineSave />
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <AiOutlineClose />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditablePayroll;