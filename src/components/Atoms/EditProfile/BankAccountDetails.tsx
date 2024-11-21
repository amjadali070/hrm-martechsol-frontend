import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import Select from 'react-select';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBankNameChange = (selectedOption: { value: string; label: string }) => {
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

  const pakistaniBanks = [
    { value: 'AlBaraka Bank (Pakistan) Limited', label: 'AlBaraka Bank (Pakistan) Limited' },
    { value: 'Allied Bank Limited', label: 'Allied Bank Limited' },
    { value: 'Askari Bank Limited', label: 'Askari Bank Limited' },
    { value: 'Bank AL Habib Limited', label: 'Bank AL Habib Limited' },
    { value: 'Bank Alfalah Limited', label: 'Bank Alfalah Limited' },
    { value: 'The Bank of Khyber', label: 'The Bank of Khyber' },
    { value: 'The Bank of Punjab', label: 'The Bank of Punjab' },
    { value: 'BankIslami Pakistan Limited', label: 'BankIslami Pakistan Limited' },
    { value: 'Citibank N.A.', label: 'Citibank N.A.' },
    { value: 'Deutsche Bank AG', label: 'Deutsche Bank AG' },
    { value: 'Dubai Islamic Bank Pakistan Limited', label: 'Dubai Islamic Bank Pakistan Limited' },
    { value: 'Faysal Bank Limited', label: 'Faysal Bank Limited' },
    { value: 'First Women Bank Limited', label: 'First Women Bank Limited' },
    { value: 'Habib Bank Limited', label: 'Habib Bank Limited' },
    { value: 'Habib Metropolitan Bank Limited', label: 'Habib Metropolitan Bank Limited' },
    { value: 'Industrial and Commercial Bank of China Limited', label: 'Industrial and Commercial Bank of China Limited' },
    { value: 'Industrial Development Bank of Pakistan', label: 'Industrial Development Bank of Pakistan' },
    { value: 'JS Bank Limited', label: 'JS Bank Limited' },
    { value: 'Meezan Bank Limited', label: 'Meezan Bank Limited' },
    { value: 'MCB Bank Limited', label: 'MCB Bank Limited' },
    { value: 'MCB Islamic Bank', label: 'MCB Islamic Bank' },
    { value: 'National Bank of Pakistan', label: 'National Bank of Pakistan' },
    { value: 'Punjab Provincial Cooperative Bank Ltd.', label: 'Punjab Provincial Cooperative Bank Ltd.' },
    { value: 'Samba Bank Limited', label: 'Samba Bank Limited' },
    { value: 'Sindh Bank Limited', label: 'Sindh Bank Limited' },
    { value: 'Silkbank Limited', label: 'Silkbank Limited' },
    { value: 'SME Bank Limited', label: 'SME Bank Limited' },
    { value: 'Soneri Bank Limited', label: 'Soneri Bank Limited' },
    { value: 'Standard Chartered Bank (Pakistan) Ltd', label: 'Standard Chartered Bank (Pakistan) Ltd' },
    { value: 'Summit Bank Limited', label: 'Summit Bank Limited' },
    { value: 'The Bank of Tokyo-Mitsubishi UFJ Ltd.', label: 'The Bank of Tokyo-Mitsubishi UFJ Ltd.' },
    { value: 'United Bank Limited', label: 'United Bank Limited' },
    { value: 'Zarai Taraqiati Bank Ltd.', label: 'Zarai Taraqiati Bank Ltd.' },
  ];

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      height: '50px',
      border: '1px solid #D1D5DB',
      borderRadius: '0.375rem',
      backgroundColor: '#F3F4F6',
      boxShadow: state.isFocused ? '0 0 0 2px #6B46C1' : 'none',
      '&:hover': {
        borderColor: '#6B46C1',
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      fontSize: '1rem',
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: '1rem',
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
                value={pakistaniBanks.find((bank) => bank.value === formData.bankName)}
                onChange={(selectedOption) =>
                  handleBankNameChange(selectedOption as { value: string; label: string })
                }
                options={pakistaniBanks}
                isDisabled={!isEditing}
                classNamePrefix="react-select"
                className="react-select-container"
                styles={customSelectStyles}
              />
            ) : (
              <div className="w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6]">
                {formData.bankName}
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
                !isEditing ? 'cursor-not-allowed' : ''
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
              !isEditing ? 'cursor-not-allowed' : ''
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
                !isEditing ? 'cursor-not-allowed' : ''
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
                !isEditing ? 'cursor-not-allowed' : ''
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