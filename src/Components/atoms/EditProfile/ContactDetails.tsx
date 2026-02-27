import React, { useState } from "react";
import { FaEdit, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCity } from "react-icons/fa";
import Select from "react-select";
import { City } from "country-state-city";

interface ContactDetailsProps {
  phoneNumber1: string;
  phoneNumber2?: string;
  email: string;
  currentCity: string;
  currentAddress: string;
  permanentCity: string;
  permanentAddress: string;
  onUpdate: (details: {
    phoneNumber1: string;
    phoneNumber2?: string;
    email: string;
    currentCity: string;
    currentAddress: string;
    permanentCity: string;
    permanentAddress: string;
  }) => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  phoneNumber1,
  phoneNumber2 = "",
  email,
  currentCity,
  currentAddress,
  permanentCity,
  permanentAddress,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    phoneNumber1,
    phoneNumber2,
    email,
    currentCity,
    currentAddress,
    permanentCity,
    permanentAddress,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCityChange = (
    selectedOption: { value: string; label: string },
    field: string
  ) => {
    setFormData({ ...formData, [field]: selectedOption.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const pakistanCities =
    City.getCitiesOfCountry("PK")?.map((city) => ({
      value: city.name,
      label: city.name,
    })) || [];

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
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">Contact Information</h2>
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
             {renderField("Primary Phone", <FaPhone />, 
                 isEditing ? (
                    <input
                        type="text"
                        name="phoneNumber1"
                        value={formData.phoneNumber1}
                        onChange={handleChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.phoneNumber1 || "N/A"}</p>
                 )
             )}

             {renderField("Secondary Phone", <FaPhone />, 
                 isEditing ? (
                    <input
                        type="text"
                        name="phoneNumber2"
                        value={formData.phoneNumber2}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.phoneNumber2 || "N/A"}</p>
                 )
             )}

             {renderField("Email Address", <FaEnvelope />, 
                  <p className="text-sm font-semibold text-gunmetal-800">{formData.email || "N/A"}</p>
             )}
        </div>

        <h3 className="text-sm font-bold text-gunmetal-500 uppercase tracking-wider mb-4 px-1 border-b border-platinum-100 pb-2">Current Address Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {renderField("Current City", <FaCity />, 
                 isEditing ? (
                    <Select
                        name="currentCity"
                        value={pakistanCities.find(c => c.value === formData.currentCity)}
                        onChange={(option: any) => handleCityChange(option, "currentCity")}
                        options={pakistanCities}
                        styles={customSelectStyles}
                        placeholder="Select City"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.currentCity || "N/A"}</p>
                 )
             )}

             {renderField("Current Address", <FaMapMarkerAlt />, 
                 isEditing ? (
                    <textarea
                        name="currentAddress"
                        value={formData.currentAddress}
                        onChange={handleChange}
                        rows={1}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 resize-none"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.currentAddress || "N/A"}</p>
                 )
             )}
        </div>

        <h3 className="text-sm font-bold text-gunmetal-500 uppercase tracking-wider mb-4 px-1 border-b border-platinum-100 pb-2">Permanent Address Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField("Permanent City", <FaCity />, 
                 isEditing ? (
                    <Select
                        name="permanentCity"
                        value={pakistanCities.find(c => c.value === formData.permanentCity)}
                        onChange={(option: any) => handleCityChange(option, "permanentCity")}
                        options={pakistanCities}
                        styles={customSelectStyles}
                        placeholder="Select City"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.permanentCity || "N/A"}</p>
                 )
             )}

             {renderField("Permanent Address", <FaMapMarkerAlt />, 
                 isEditing ? (
                    <textarea
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleChange}
                        rows={1}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 resize-none"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.permanentAddress || "N/A"}</p>
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

export default ContactDetails;
