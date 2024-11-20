import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TicketStatus from './TicketStatus';

const AdminTicket: React.FC = () => {
  const [formData, setFormData] = useState({
    issueType: '',
    subject: '',
    details: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDetailsChange = (value: string) => {
    setFormData({ ...formData, details: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin Ticket Submitted:', formData);
  };

  const issueTypes = [
    'System Access Request',
    'Hardware Issue',
    'Software Installation',
    'Other',
  ];

  return (
    <>
    <div className="w-full max-full mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-black">
            Submit Admin Ticket
        </h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type
                </label>
                <select
                    id="issueType"
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                >
                    <option value="">-- Select Issue Type --</option>
                    {issueTypes.map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter the subject"
                    required />
            </div>

            <div className="mb-6">
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                    Details
                </label>
                <ReactQuill
                    value={formData.details}
                    onChange={handleDetailsChange}
                    theme="snow"
                    placeholder="Provide detailed information about the issue..."
                    className="bg-white rounded-md"
                    style={{
                        height: '200px',
                    }} />
            </div>

            <div className="flex justify-start mt-14">
                <button
                    type="submit"
                    className="px-6 py-2 bg-purple-900 text-white rounded-full hover:bg-purple-900 transition-all w-auto font-semibold"
                >
                    Submit
                </button>
            </div>
        </form>
      </div>
      <TicketStatus />
      </>
  );
};

export default AdminTicket;