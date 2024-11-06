import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { countries } from '../../utils/counties';

const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<{
    name: string;
    personalEmail: string;
    phoneNumber: string;
    website: string;
    otherUrl: string;
    country: { value: string; label: string } | null;
    businessAddress: string;
  }>({
    name: '',
    personalEmail: '',
    phoneNumber: '',
    website: '',
    otherUrl: '',
    country: null,
    businessAddress: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/users/profile', { withCredentials: true });
        setFormData({ ...data, country: { value: data.country, label: data.country } });
      } catch (error) {
        console.error('Error fetching profile data', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (selectedOption: any) => {
    setFormData({ ...formData, country: selectedOption });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData, country: formData.country?.value };
      const { data } = await axios.put('/api/users/profile', updatedData, { withCredentials: true });
      console.log('Profile updated:', data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="max-w-8xl mx-auto my-2 p-6 border border-gray-300 shadow rounded bg-white">
      <h2 className="text-lg font-semibold mb-4">Profile</h2>

      <form className="space-y-2" onSubmit={handleSubmit}>
        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="personalEmail">
            Personal Email
          </label>
          <input
            type="text"
            id="personalEmail"
            name="personalEmail"
            value={formData.personalEmail}
            onChange={handleChange}
            className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="website">
            Website
          </label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="otherUrl">
            Other Url
          </label>
          <input
            type="text"
            id="otherUrl"
            name="otherUrl"
            value={formData.otherUrl}
            onChange={handleChange}
            className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="country">
            Country
          </label>
          <Select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleCountryChange}
            options={countries}
            placeholder="Select Your Country"
            className="w-3/4"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="businessAddress">
            Business Address
          </label>
          <textarea
            id="businessAddress"
            name="businessAddress"
            value={formData.businessAddress}
            onChange={handleChange}
            className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none resize-none"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="bg-purple-700 text-white font-semibold px-5 py-2 rounded focus:outline-none"
          >
            Update Details
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-5 py-2 rounded focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;