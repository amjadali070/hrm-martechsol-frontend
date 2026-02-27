import React, { useState } from "react";
import { FaEdit, FaUser, FaPhoneAlt, FaHeart } from "react-icons/fa";

interface EmergencyContactProps {
  name1: string;
  relation1: string;
  contactNumber1: string;
  name2: string;
  relation2: string;
  contactNumber2: string;

  onUpdate: (updatedContacts: {
    name1: string;
    relation1: string;
    contactNumber1: string;
    name2: string;
    relation2: string;
    contactNumber2: string;
  }) => void;
}

const EmergencyContact: React.FC<EmergencyContactProps> = ({
  name1,
  relation1,
  contactNumber1,
  name2,
  relation2,
  contactNumber2,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    name1,
    relation1,
    contactNumber1,
    name2,
    relation2,
    contactNumber2,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
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
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">Emergency Contacts</h2>
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
        <h3 className="text-sm font-bold text-gunmetal-500 uppercase tracking-wider mb-4 px-1 border-b border-platinum-100 pb-2">Primary Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             {renderField("Contact Name", <FaUser />, 
                 isEditing ? (
                    <input
                        type="text"
                        value={formData.name1}
                        onChange={(e) => handleChange(e, "name1")}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.name1 || "N/A"}</p>
                 )
             )}

             {renderField("Relationship", <FaHeart />, 
                 isEditing ? (
                    <input
                        type="text"
                        value={formData.relation1}
                        onChange={(e) => handleChange(e, "relation1")}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.relation1 || "N/A"}</p>
                 )
             )}

             {renderField("Phone Number", <FaPhoneAlt />, 
                 isEditing ? (
                    <input
                        type="text"
                        value={formData.contactNumber1}
                        onChange={(e) => handleChange(e, "contactNumber1")}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.contactNumber1 || "N/A"}</p>
                 )
             )}
        </div>

        <h3 className="text-sm font-bold text-gunmetal-500 uppercase tracking-wider mb-4 px-1 border-b border-platinum-100 pb-2">Secondary Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderField("Contact Name", <FaUser />, 
                 isEditing ? (
                    <input
                        type="text"
                        value={formData.name2}
                        onChange={(e) => handleChange(e, "name2")}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.name2 || "N/A"}</p>
                 )
             )}

             {renderField("Relationship", <FaHeart />, 
                 isEditing ? (
                    <input
                        type="text"
                        value={formData.relation2}
                        onChange={(e) => handleChange(e, "relation2")}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.relation2 || "N/A"}</p>
                 )
             )}

             {renderField("Phone Number", <FaPhoneAlt />, 
                 isEditing ? (
                    <input
                        type="text"
                        value={formData.contactNumber2}
                        onChange={(e) => handleChange(e, "contactNumber2")}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formData.contactNumber2 || "N/A"}</p>
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

export default EmergencyContact;
