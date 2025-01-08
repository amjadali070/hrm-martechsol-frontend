import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import Select from "react-select";
import { pakistaniBanks } from "../../../utils/pakistaniBanks";

interface BankAccountDetailsProps {
  bankName: string;
  branchName: string;
  accountTitle: string;
  accountNumber: string;
  ibanNumber: string;
  onUpdate: (details: {
    bankName: string;
    branchName: string;
    accountTitle: string;
    accountNumber: string;
    ibanNumber: string;
  }) => void;
}

const BankAccountDetails: React.FC<BankAccountDetailsProps> = ({
  bankName,
  branchName,
  accountTitle,
  accountNumber,
  ibanNumber,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    bankName,
    branchName,
    accountTitle,
    accountNumber,
    ibanNumber,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBankNameChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setFormData({ ...formData, bankName: selectedOption.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "48px", // Match the input field height
      height: "48px",
      border: "1px solid #D1D5DB",
      borderRadius: "0.375rem",
      backgroundColor: "#F3F4F6",
      boxShadow: state.isFocused ? "0 0 0 2px #6B46C1" : "none",
      "&:hover": {
        borderColor: "#6B46C1",
      },
      padding: "0px", // Remove default padding
    }),
    valueContainer: (base: any) => ({
      ...base,
      height: "100%",
      padding: "0 12px", // Match p-3 (12px) padding
      display: "flex",
      alignItems: "center",
    }),
    input: (base: any) => ({
      ...base,
      margin: "0px",
      padding: "0px",
      height: "100%",
      boxSizing: "border-box",
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      height: "100%",
    }),
    singleValue: (base: any) => ({
      ...base,
      fontSize: "1rem",
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: "1rem",
    }),
  };

  return (
    <div className="bg-white p-10 rounded-lg w-full mx-auto relative">
      <button
        onClick={toggleEdit}
        className="absolute top-10 right-10 text-blue-600 hover:text-blue-500 transition-all"
        aria-label="Edit Bank Account Details"
      >
        <FaEdit size={24} />
      </button>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            {isEditing ? (
              <Select
                value={pakistaniBanks.find(
                  (bank) => bank.value === formData.bankName
                )}
                onChange={(selectedOption) =>
                  handleBankNameChange(
                    selectedOption as { value: string; label: string }
                  )
                }
                options={pakistaniBanks}
                isDisabled={!isEditing}
                classNamePrefix="react-select"
                className="react-select-container"
                styles={customSelectStyles}
                placeholder="Select a bank"
              />
            ) : (
              <div className="w-full border border-gray-300 rounded-md bg-[#F3F4F6] flex items-center px-3 min-h-[48px]">
                {formData.bankName ? (
                  formData.bankName
                ) : (
                  <span className="text-gray-500">No bank selected</span>
                )}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch Name
            </label>
            <input
              type="text"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                !isEditing ? "cursor-not-allowed" : ""
              }`}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Title
          </label>
          <input
            type="text"
            name="accountTitle"
            value={formData.accountTitle}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                !isEditing ? "cursor-not-allowed" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IBAN Number
            </label>
            <input
              type="text"
              name="ibanNumber"
              value={formData.ibanNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                !isEditing ? "cursor-not-allowed" : ""
              }`}
            />
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

export default BankAccountDetails;
