import React, { useState } from 'react';

const NotificationSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    projectUpdate: 'email',
    projectCompletion: 'email',
    projectClosed: 'email',
    marketingEmails: 'yes',
    preferredModeOfCommunication: 'email',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Updated Notification Settings:', formData);
  };

  return (
    <div className="max-w-8xl mx-auto my-8 p-6 border border-gray-300 shadow rounded bg-white">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <h3 className="text-md font-semibold">Project Notifications</h3>
        <div className="flex justify-between">
          <div className="border border-gray-300 p-4 rounded w-[30%]">
            <label className="block font-semibold mb-2">Project Update</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="projectUpdate"
                  value="email"
                  checked={formData.projectUpdate === 'email'}
                  onChange={handleChange}
                />
                Email
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="projectUpdate"
                  value="emailAndSms"
                  checked={formData.projectUpdate === 'emailAndSms'}
                  onChange={handleChange}
                />
                Email and SMS
              </label>
            </div>
          </div>


          <div className="border border-gray-300 p-4 rounded w-[30%]">
            <label className="block font-semibold mb-2">Project Completion</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="projectCompletion"
                  value="email"
                  checked={formData.projectCompletion === 'email'}
                  onChange={handleChange}
                />
                Email
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="projectCompletion"
                  value="emailAndSms"
                  checked={formData.projectCompletion === 'emailAndSms'}
                  onChange={handleChange}
                />
                Email and SMS
              </label>
            </div>
          </div>

          {/* Project Closed/Feedback */}
          <div className="border border-gray-300 p-4 rounded w-[30%]">
            <label className="block font-semibold mb-2">Project Closed/Feedback</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="projectClosed"
                  value="email"
                  checked={formData.projectClosed === 'email'}
                  onChange={handleChange}
                />
                Email
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="projectClosed"
                  value="emailAndSms"
                  checked={formData.projectClosed === 'emailAndSms'}
                  onChange={handleChange}
                />
                Email and SMS
              </label>
            </div>
          </div>
        </div>

        {/* Marketing Emails */}
        <div className="flex items-center">
          <label className="w-1/4 font-semibold">Marketing Emails</label>
          <div className="flex items-center space-x-6">
            <label>
              <input
                type="radio"
                name="marketingEmails"
                value="yes"
                checked={formData.marketingEmails === 'yes'}
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="marketingEmails"
                value="no"
                checked={formData.marketingEmails === 'no'}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>

        {/* Preferred Mode of Communication */}
        <div className="flex items-center">
          <label className="w-1/4 font-semibold">Preferred Mode of Communication</label>
          <div className="flex items-center space-x-6">
            <label>
              <input
                type="radio"
                name="preferredModeOfCommunication"
                value="phone"
                checked={formData.preferredModeOfCommunication === 'phone'}
                onChange={handleChange}
              />
              Phone
            </label>
            <label>
              <input
                type="radio"
                name="preferredModeOfCommunication"
                value="email"
                checked={formData.preferredModeOfCommunication === 'email'}
                onChange={handleChange}
              />
              Email
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="bg-[#ff6600] text-white font-semibold px-5 py-2 rounded focus:outline-none"
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

export default NotificationSettings;