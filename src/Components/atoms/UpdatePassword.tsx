import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UpdatePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    repeatPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { oldPassword, newPassword, repeatPassword } = formData;

    if (newPassword !== repeatPassword) {
      setErrorMessage('New Password and Repeat Password do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axiosInstance.put(
        '/users/password',
        { oldPassword, newPassword, repeatPassword }
      );

      console.log(data);

      toast.success('Password updated successfully!');

      setFormData({
        oldPassword: '',
        newPassword: '',
        repeatPassword: '',
      });
    } catch (error: any) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-8xl mx-auto my-8 p-6 border border-gray-300 shadow rounded bg-white">
      <h2 className="text-lg font-semibold mb-4">Change Password</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>

        <div className="flex flex-col">
          <label htmlFor="oldPassword" className="mb-2 font-semibold">
            Old Password<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="newPassword" className="mb-2 font-semibold">
            New Password<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="repeatPassword" className="mb-2 font-semibold">
            Repeat Password<span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-purple-700 text-white font-semibold px-5 py-2 rounded focus:outline-none ${
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-purple-800 transition-colors'
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Change Password'}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-5 py-2 rounded focus:outline-none transition-colors"
            onClick={() => {
              setFormData({
                oldPassword: '',
                newPassword: '',
                repeatPassword: '',
              });
            }}
          >
            Cancel
          </button>
        </div>
      </form>
      
      <ToastContainer position="top-center" />
    </div>
  );
};

export default UpdatePassword;