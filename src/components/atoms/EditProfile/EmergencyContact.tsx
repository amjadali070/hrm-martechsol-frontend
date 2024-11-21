import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';

interface EmergencyContactProps {
  contacts: {
    name: string;
    contactNumber: string;
    relation: string;
  }[];
  onUpdate: (updatedContacts: { name: string; contactNumber: string; relation: string }[]) => void;
}

const EmergencyContact: React.FC<EmergencyContactProps> = ({ contacts, onUpdate }) => {
  const [formData, setFormData] = useState(contacts);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof typeof contacts[0]
  ) => {
    const updatedContacts = [...formData];
    updatedContacts[index][field] = e.target.value;
    setFormData(updatedContacts);
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
    <div className="bg-white p-10 rounded-lg w-full mx-auto relative">
      <button
        onClick={toggleEdit}
        className="absolute top-10 right-10 text-blue-600 hover:text-blue-500 transition-all"
        aria-label="Edit Bank Account Details"
      >
        <FaEdit size={24} />
      </button>

      <form onSubmit={handleSubmit}>
        {formData.map((contact, index) => (
          <div key={index} className="mb-6 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => handleChange(e, index, 'name')}
                  disabled={!isEditing}
                  className={`w-full p-4 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                    !isEditing ? 'cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={contact.contactNumber}
                  onChange={(e) => handleChange(e, index, 'contactNumber')}
                  disabled={!isEditing}
                  className={`w-full p-4 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                    !isEditing ? 'cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
                <input
                  type="text"
                  value={contact.relation}
                  onChange={(e) => handleChange(e, index, 'relation')}
                  disabled={!isEditing}
                  className={`w-full p-4 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                    !isEditing ? 'cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
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

export default EmergencyContact;