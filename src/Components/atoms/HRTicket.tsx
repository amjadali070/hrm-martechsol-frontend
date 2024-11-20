import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const HRTicket: React.FC = () => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMessageChange = (value: string) => {
    setFormData({ ...formData, message: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('HR Ticket Submitted:', formData);
  };

  const categories = ['Leave Request', 'Salary Issue', 'Grievance', 'Other'];

  return (
    <div className="w-full max-full mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-black">
        Submit HR Ticket
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
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
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <ReactQuill
            value={formData.message}
            onChange={handleMessageChange}
            theme="snow"
            placeholder="Write your message here..."
            className="bg-white rounded-md"
            style={{
              height: '200px',
            }}
          />
        </div>

        <div className="flex justify-start mt-14">
          <button
            type="submit"
            className="px-6 py-2 bg-purple-900 text-white rounded-full shadow-md hover:bg-purple-900 transition-all w-auto font-semibold"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default HRTicket;