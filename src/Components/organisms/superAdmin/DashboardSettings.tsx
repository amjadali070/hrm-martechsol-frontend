// frontend/src/pages/superAdmin/DashboardSettings.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultLogo from '../../../assets/logo.png';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface DashboardSettingsProps {
  setDashboardSettings: React.Dispatch<React.SetStateAction<{
    logo: string;
    title: string;
  }>>;
}

const DashboardSettings: React.FC<DashboardSettingsProps> = ({ setDashboardSettings }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [existingLogo, setExistingLogo] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch all users to allow Super Admin to select one
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/superadmin/users', { withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setMessage('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch dashboard settings for the selected user
    const fetchSettings = async () => {
      if (!selectedUserId) {
        setTitle('');
        setExistingLogo('');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`/api/superadmin/dashboard-settings/${selectedUserId}`, { withCredentials: true });
        setTitle(response.data.title);
        setExistingLogo(response.data.logo);
      } catch (error: any) {
        console.error('Error fetching dashboard settings:', error.response?.data?.message || error.message);
        setMessage('Failed to fetch dashboard settings.');
        setTitle('');
        setExistingLogo('');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [selectedUserId]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    if (!selectedUserId) {
      setMessage('Please select a user.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      const response = await axios.put(
        `/api/superadmin/dashboard-settings/${selectedUserId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('Dashboard settings updated successfully.');
      setExistingLogo(response.data.logo);
      setLogo(null); // Reset logo state after successful upload

    } catch (error: any) {
      console.error('Error updating dashboard settings:', error.response?.data?.message || error.message);
      setMessage('Failed to update dashboard settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Dashboard Settings</h2>

      {/* Display success or error message */}
      {message && (
        <p className={`mb-4 text-sm ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select User */}
        <div>
          <label htmlFor="user" className="block text-gray-700 mb-2">
            Select User <span className="text-red-500">*</span>
          </label>
          <select
            id="user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">-- Select a User --</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Dashboard Title */}
        <div>
          <label htmlFor="title" className="block text-gray-700">
            Dashboard Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter dashboard title"
          />
        </div>

        {/* Dashboard Logo */}
        <div>
          <label htmlFor="logo" className="block text-gray-700">
            Dashboard Logo
          </label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          
          {/* Display existing logo */}
          {existingLogo && (
            <div className="mt-4">
              <p className="text-gray-700 mb-2">Current Logo:</p>
              <img
                src={existingLogo === 'default-logo.png' ? defaultLogo : `/uploads/${existingLogo}`}
                alt="Existing Logo"
                className="h-16 w-auto"
              />
            </div>
          )}

          {/* Preview of the new logo */}
          {logo && (
            <div className="mt-4">
              <p className="text-gray-700 mb-2">Preview:</p>
              <img
                src={URL.createObjectURL(logo)}
                alt="New Logo Preview"
                className="h-16 w-auto"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 font-semibold text-white rounded-md shadow-sm ${
              isSubmitting
                ? 'bg-purple-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Update Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardSettings;