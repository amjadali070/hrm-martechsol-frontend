import React, { useState, useMemo } from "react";
import { AiOutlineSave, AiOutlineClose } from "react-icons/ai";
import { FaUser, FaBriefcase, FaMoneyBillWave } from "react-icons/fa";
import { toast } from "react-toastify";

interface PayrollDetails {
  _id?: string;
  payrollId: string;
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    jobType: string;
  };
  month: string;
  year: number;
  earnings: {
    allowances: {
      medicalAllowance: number;
      fuelAllowance: number;
      mobileAllowance: number;
    };
    basicSalary: number;
    overtimePay: number;
  };
  deductions: {
    tax: number;
    eobi: number;
    providentFund: {
      employeeContribution: number;
    };
  };
}

interface EditablePayrollProps {
  payrollData: PayrollDetails;
  onSave: (updatedPayroll: PayrollDetails) => Promise<void>;
  onCancel: () => void;
}

const EditablePayroll: React.FC<EditablePayrollProps> = ({
  payrollData,
  onSave,
  onCancel,
}) => {
  const [editableData, setEditableData] = useState<PayrollDetails>(payrollData);
  const [loading, setLoading] = useState<boolean>(false);

  // Calculate total earnings and deductions
  const totalEarnings = useMemo(() => {
    const { basicSalary, allowances, overtimePay } = editableData.earnings;
    return (
      basicSalary +
      allowances.medicalAllowance +
      allowances.fuelAllowance +
      allowances.mobileAllowance +
      overtimePay
    );
  }, [editableData.earnings]);

  const totalDeductions = useMemo(() => {
    const { tax, eobi, providentFund } = editableData.deductions;
    return tax + eobi + providentFund.employeeContribution;
  }, [editableData.deductions]);

  const netSalary = useMemo(() => {
    return totalEarnings - totalDeductions;
  }, [totalEarnings, totalDeductions]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    category?: string,
    subCategory?: string
  ) => {
    const value = parseFloat(e.target.value) || 0;

    setEditableData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));

      if (category && subCategory) {
        updated[category][subCategory][field] = value;
      } else if (category) {
        updated[category][field] = value;
      } else {
        updated[field] = value;
      }

      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(editableData);
    } catch (err: any) {
      console.error("Error saving payroll:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg w-full mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Edit Payroll for {editableData.user.name}
      </h2>
      <section className="mb-6">
        <div className="flex items-center bg-purple-900 text-white px-4 py-3 rounded-t-md">
          <FaUser className="mr-2" />
          <h3 className="text-lg font-semibold">Personal Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 rounded-b-md">
          {[
            { label: "Name", value: editableData.user.name, disabled: true },
            {
              label: "Job Title",
              value: editableData.user.jobTitle,
              disabled: true,
            },
            {
              label: "Job Type",
              value: editableData.user.jobType,
              disabled: true,
            },
            {
              label: "Month",
              value: `${editableData.month} ${editableData.year}`,
              disabled: true,
            },
          ].map(({ label, value, disabled }) => (
            <div key={label}>
              <label className="block font-medium text-gray-700">{label}</label>
              <input
                type="text"
                value={value}
                disabled={disabled}
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-200"
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
              value: editableData.earnings.basicSalary || 0,
              disabled: true,
            },
            {
              label: "Medical Allowance",
              field: "medicalAllowance",
              value: editableData.earnings.allowances.medicalAllowance || 0,
              disabled: true,
            },
            {
              label: "Mobile Allowance",
              field: "mobileAllowance",
              value: editableData.earnings.allowances.mobileAllowance || 0,
              disabled: true,
            },
            {
              label: "Fuel Allowance",
              field: "fuelAllowance",
              value: editableData.earnings.allowances.fuelAllowance || 0,
              disabled: true,
            },
            {
              label: "Overtime Pay",
              field: "overtimePay",
              value: editableData.earnings.overtimePay || 0,
              category: "earnings",
            },
          ].map(({ label, field, value, category, disabled }) => (
            <div key={field}>
              <label className="block font-medium text-gray-700">{label}</label>
              <input
                type="number"
                value={value}
                onChange={
                  !disabled
                    ? (e) => handleInputChange(e, field, category)
                    : undefined
                }
                disabled={disabled}
                className={`w-full border border-gray-300 rounded-lg p-2 
                  ${
                    disabled
                      ? "bg-gray-200"
                      : "focus:ring-2 focus:ring-purple-500"
                  }`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center bg-purple-900 text-white px-4 py-3 rounded-t-md">
          <FaBriefcase className="mr-2" />
          <h3 className="text-lg font-semibold">Deductions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 rounded-b-md">
          {[
            {
              label: "Tax",
              field: "tax",
              value: editableData.deductions.tax || 0,
              category: "deductions",
            },
            {
              label: "EOBI",
              field: "eobi",
              value: editableData.deductions.eobi || 0,
              category: "deductions",
            },
            {
              label: "PF Contribution",
              field: "employeeContribution",
              value:
                editableData.deductions.providentFund.employeeContribution || 0,
              category: "deductions",
              subCategory: "providentFund",
            },
          ].map(({ label, field, value, category, subCategory }) => (
            <div key={field}>
              <label className="block font-medium text-gray-700">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) =>
                  handleInputChange(e, field, category, subCategory)
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center bg-purple-900 text-white px-4 py-3 rounded-t-md">
          <FaMoneyBillWave className="mr-2" />
          <h3 className="text-lg font-semibold">Salary Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 rounded-b-md">
          <div>
            <label className="block font-medium text-gray-700">
              Total Earnings
            </label>
            <input
              type="text"
              value={`${totalEarnings.toLocaleString()} PKR`}
              disabled
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-200"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Total Deductions
            </label>
            <input
              type="text"
              value={`${totalDeductions.toLocaleString()} PKR`}
              disabled
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-200"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-between border-purple-900 rounded-lg p-3 bg-purple-900 ">
            <label className="font-medium text-white text-xl">Net Salary</label>

            <label className="font-bold text-white text-xl">{`${netSalary.toLocaleString()} PKR`}</label>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          <AiOutlineSave />
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
        >
          <AiOutlineClose />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditablePayroll;
