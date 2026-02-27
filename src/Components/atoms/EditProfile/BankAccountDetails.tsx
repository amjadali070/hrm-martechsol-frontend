import React, { useState } from "react";
import { FaEdit, FaUniversity, FaCodeBranch, FaUser, FaMoneyCheck } from "react-icons/fa";
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
      height: "42px",
      borderColor: state.isFocused ? "#2A3342" : "#E2E8F0", // Gunmetal-like focus or platinum border
      borderRadius: "0.5rem",
      backgroundColor: "#FFFFFF",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(42, 51, 66, 0.2)" : "none",
      "&:hover": {
        borderColor: "#2A3342",
      },
       fontSize: "0.875rem",
    }),
    singleValue: (base: any) => ({
       ...base,
       color: "#1A202C", // gunmetal-900 like
    }),
     option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#2A3342" : state.isFocused ? "#F8FAFC" : "white",
      color: state.isSelected ? "white" : "#1A202C",
        fontSize: "0.875rem",
     }),
  };
  
    const renderField = (label: string, icon: React.ReactNode, content: React.ReactNode) => (
      <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200">
          <div className="flex items-center gap-2 mb-2">
              <span className="text-gunmetal-400 text-sm">{icon}</span>
              <p className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide">{label}</p>
          </div>
          {content}
      </div>
    );


  return (
    <div className="bg-white rounded-xl shadow-sm border border-platinum-200 overflow-hidden relative">
      <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">Bank Information</h2>
            {!isEditing && (
                <button
                onClick={toggleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-platinum-200 text-gunmetal-700 text-sm font-bold rounded-lg hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm"
                >
                <FaEdit /> Edit Details
                </button>
            )}
        </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             {renderField("Bank Name", <FaUniversity />, 
                 isEditing ? (
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
                        styles={customSelectStyles}
                        placeholder="Select a bank"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.bankName || "No bank selected"}</p>
                 )
             )}

             {renderField("Branch Name/Code", <FaCodeBranch />, 
                 isEditing ? (
                    <input
                        type="text"
                        name="branchName"
                        value={formData.branchName}
                        onChange={handleChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.branchName || "N/A"}</p>
                 )
             )}

             {renderField("Account Title", <FaUser />, 
                 isEditing ? (
                    <input
                        type="text"
                         name="accountTitle"
                        value={formData.accountTitle}
                        onChange={handleChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.accountTitle || "N/A"}</p>
                 )
             )}
        </div>

        <h3 className="text-sm font-bold text-gunmetal-500 uppercase tracking-wider mb-4 px-1 border-b border-platinum-100 pb-2">Account Identifiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField("Account Number", <FaMoneyCheck />, 
                 isEditing ? (
                    <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800 tracking-wider">{formData.accountNumber || "N/A"}</p>
                 )
             )}

             {renderField("IBAN Number", <FaMoneyCheck />, 
                 isEditing ? (
                    <input
                        type="text"
                        name="ibanNumber"
                        value={formData.ibanNumber}
                        onChange={handleChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800 tracking-widest">{formData.ibanNumber || "N/A"}</p>
                 )
             )}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-platinum-200">
             <button
              type="button"
              onClick={toggleEdit}
              className="px-6 py-2.5 bg-white border border-platinum-200 text-slate-grey-600 rounded-lg text-sm font-bold hover:bg-alabaster-grey-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gunmetal-900 text-white rounded-lg text-sm font-bold hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20"
            >
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BankAccountDetails;
