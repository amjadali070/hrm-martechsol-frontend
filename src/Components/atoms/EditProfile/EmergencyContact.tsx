import React, { useState} from 'react';
import { FaEdit } from 'react-icons/fa';
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
  onUpdate }) => {
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

  return (
    <div className="bg-white p-10 rounded-lg w-full mx-auto relative">
      <button
        onClick={toggleEdit}
        className="absolute top-10 right-10 text-blue-600 hover:text-blue-500 transition-all"
        aria-label="Edit Emergency Contacts"
      >
        <FaEdit size={24} />
      </button>

      <form onSubmit={handleSubmit}>
        <div className="mb-6 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name 1</label>
              <input
                type="text"
                value={formData.name1}
                onChange={(e) => handleChange(e, 'name1')}
                disabled={!isEditing}
                className={`w-full p-4 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                  !isEditing ? 'cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number 1</label>
              <input
                type="text"
                value={formData.contactNumber1}
                onChange={(e) => handleChange(e, 'contactNumber1')}
                disabled={!isEditing}
                className={`w-full p-4 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                  !isEditing ? 'cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relation 1</label>
              <input
                type="text"
                value={formData.relation1}
                onChange={(e) => handleChange(e, 'relation1')}
                disabled={!isEditing}
                className={`w-full p-4 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                  !isEditing ? 'cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>
        </div>

        <div className="mb-6 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name 2</label>
              <input
                type="text"
                value={formData.name2}
                onChange={(e) => handleChange(e, 'name2')}
                disabled={!isEditing}
                className={`w-full p-4 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                  !isEditing ? 'cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number 2</label>
              <input
                type="text"
                value={formData.contactNumber2}
                onChange={(e) => handleChange(e, 'contactNumber2')}
                disabled={!isEditing}
                className={`w-full p-4 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                  !isEditing ? 'cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relation 2</label>
              <input
                type="text"
                value={formData.relation2}
                onChange={(e) => handleChange(e, 'relation2')}
                disabled={!isEditing}
                className={`w-full p-4 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                  !isEditing ? 'cursor-not-allowed' : ''
                }`}
              />
            </div>
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

export default EmergencyContact;
