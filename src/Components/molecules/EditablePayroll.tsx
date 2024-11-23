import React, { useState } from "react";

interface PayrollDetails {
  name: string;
  designation: string;
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
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Payroll</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <table className="w-full border-collapse bg-white border border-gray-300 rounded-md">
            <thead>
              <tr>
                <th className="bg-purple-900 text-white px-4 py-2 text-left">
                  Personal Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  <label className="block font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editableData.name}
                    onChange={(e) => handleInputChange(e, "name")}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  <label className="block font-medium text-gray-700">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={editableData.designation}
                    onChange={(e) => handleInputChange(e, "designation")}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  <label className="block font-medium text-gray-700">
                    Job Type
                  </label>
                  <input
                    type="text"
                    value={editableData.jobType}
                    onChange={(e) => handleInputChange(e, "jobType")}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <table className="w-full border-collapse bg-white border border-gray-300 rounded-md">
            <thead>
              <tr>
                <th className="bg-purple-900 text-white px-4 py-2 text-left">
                  Salary Period
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  From: {editableData.from}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 border border-gray-300">
                  To: {editableData.to}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <table className="w-full border-collapse bg-white border border-gray-300 rounded-md">
          <thead>
            <tr>
              <th className="bg-purple-900 text-white px-4 py-2 text-left">
                Salary Details
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                <label className="block font-medium text-gray-700">
                  Basic Salary
                </label>
                <input
                  type="number"
                  value={editableData.basicSalary}
                  onChange={(e) => handleInputChange(e, "basicSalary")}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                <label className="block font-medium text-gray-700">
                  Medical Allowance
                </label>
                <input
                  type="number"
                  value={editableData.medicalAllowance}
                  onChange={(e) => handleInputChange(e, "medicalAllowance")}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                <label className="block font-medium text-gray-700">
                  Mobile Allowance
                </label>
                <input
                  type="number"
                  value={editableData.mobileAllowance}
                  onChange={(e) => handleInputChange(e, "mobileAllowance")}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                <label className="block font-medium text-gray-700">
                  Fuel Allowance
                </label>
                <input
                  type="number"
                  value={editableData.fuelAllowance}
                  onChange={(e) => handleInputChange(e, "fuelAllowance")}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                <label className="block font-medium text-gray-700">
                  Gross Salary
                </label>
                <input
                  type="number"
                  value={editableData.grossSalary}
                  onChange={(e) => handleInputChange(e, "grossSalary")}
                  className="w-full border border-gray-300 rounded p-2"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <table className="w-full border-collapse bg-white border border-gray-300 rounded-md">
          <thead>
            <tr>
              <th className="bg-purple-900 text-white px-4 py-2 text-left">
                Deductions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                <label className="block font-medium text-gray-700">Tax</label>
                <input
                  type="number"
                  value={editableData.deductions.tax}
                  onChange={(e) =>
                    handleInputChange(e, "deductions", "tax")
                  }
                  className="w-full border border-gray-300 rounded p-2"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                <label className="block font-medium text-gray-700">EOBI</label>
                <input
                  type="number"
                  value={editableData.deductions.eobi}
                  onChange={(e) =>
                    handleInputChange(e, "deductions", "eobi")
                  }
                  className="w-full border border-gray-300 rounded p-2"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border border-gray-300">
                <label className="block font-medium text-gray-700">
                  PF Contribution
                </label>
                <input
                  type="number"
                  value={editableData.deductions.pfContribution}
                  onChange={(e) =>
                    handleInputChange(e, "deductions", "pfContribution")
                  }
                  className="w-full border border-gray-300 rounded p-2"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditablePayroll;