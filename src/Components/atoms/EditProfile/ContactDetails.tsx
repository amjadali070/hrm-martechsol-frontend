import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import Select from 'react-select';
import { City } from 'country-state-city';

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
  phoneNumber2 = '',
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

  const handleCityChange = (selectedOption: { value: string; label: string }, field: string) => {
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

  const pakistanCities = City.getCitiesOfCountry('PK')?.map((city) => ({
    value: city.name,
    label: city.name,
  })) || [];

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
    <div className="bg-white p-16 rounded-lg w-full mx-auto relative">
      <button
        onClick={toggleEdit}
        className="absolute top-10 right-16 text-blue-600 hover:text-blue-500 transition-all"
        aria-label="Edit Bank Account Details"
      >
        <FaEdit size={24} />
      </button>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="phoneNumber1"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number 1
            </label>
            <input
              type="text"
              id="phoneNumber1"
              name="phoneNumber1"
              value={formData.phoneNumber1}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                !isEditing ? 'cursor-not-allowed' : ''
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber2"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number 2
            </label>
            <input
              type="text"
              id="phoneNumber2"
              name="phoneNumber2"
              value={formData.phoneNumber2}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Phone Number 2"
              className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                !isEditing ? 'cursor-not-allowed' : ''
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="currentCity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current City
            </label>
            {isEditing ? (
              <Select
                id="currentCity"
                name="currentCity"
                value={pakistanCities.find((city) => city.value === formData.currentCity)}
                onChange={(selectedOption) =>
                  handleCityChange(selectedOption as { value: string; label: string }, 'currentCity')
                }
                options={pakistanCities}
                styles={customSelectStyles}
              />
            ) : (
              <div className="p-3 border border-gray-300 rounded-md bg-[#F3F4F6]">
                {formData.currentCity || 'No City Selected'}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="currentAddress"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current Address
            </label>
            <textarea
              id="currentAddress"
              name="currentAddress"
              value={formData.currentAddress}
              onChange={handleChange}
              disabled={!isEditing}
              rows={1}
              className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                !isEditing ? 'cursor-not-allowed' : ''
              }`}
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="permanentCity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Permanent City
            </label>
            {isEditing ? (
              <Select
                id="permanentCity"
                name="permanentCity"
                value={pakistanCities.find((city) => city.value === formData.permanentCity)}
                onChange={(selectedOption) =>
                  handleCityChange(selectedOption as { value: string; label: string }, 'permanentCity')
                }
                options={pakistanCities}
                styles={customSelectStyles}
              />
            ) : (
              <div className="p-3 border border-gray-300 rounded-md bg-[#F3F4F6]">
                {formData.permanentCity || 'No City Selected'}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="permanentAddress"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Permanent Address
            </label>
            <textarea
              id="permanentAddress"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              disabled={!isEditing}
              rows={1}
              className={`w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900 ${
                !isEditing ? 'cursor-not-allowed' : ''
              }`}
            ></textarea>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-start mt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all text-lg font-semibold"
            >
              Update
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactDetails;