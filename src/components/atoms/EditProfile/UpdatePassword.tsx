import React, { useState } from 'react';
import axios from 'axios';

const UpdatePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New Password and Confirm Password must match!');
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `${backendUrl}/api/users/password`,
        {
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          repeatPassword: formData.confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      setMessage('Password updated successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-lg w-full mx-auto relative">
      <form onSubmit={handleSubmit}>
        {message && <div className="bg-green-100 text-green-800 p-3 rounded mb-4">{message}</div>}
        {error && <div className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</div>}

        <div className="mb-6">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            className="w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            className="w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            className="w-full p-3 border border-gray-300 rounded-md bg-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-purple-900"
            required
          />
        </div>

        <div className="flex justify-start">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-600 transition-all text-lg font-semibold"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePassword;