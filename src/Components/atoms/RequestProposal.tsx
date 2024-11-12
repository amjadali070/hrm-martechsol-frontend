import React, { useState } from 'react';

const RequestProposal: React.FC = () => {
  const [selectedService, setSelectedService] = useState('Articles');
  const [message, setMessage] = useState('');

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(event.target.value);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission
    console.log('Service:', selectedService);
    console.log('Message:', message);
  };

  return (
    <div className="max-w-8xl mx-auto my-8 p-6 border border-gray-300 shadow rounded bg-white">
      <h2 className="text-lg font-semibold mb-4">Request a Proposal</h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Service Selection */}
        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="service">
            Required Service
          </label>
          <select
            id="service"
            value={selectedService}
            onChange={handleServiceChange}
            className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none"
          >
            <option value="Articles">Articles</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="SEO">SEO</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        {/* Message Textarea */}
        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none resize-none"
            rows={5}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#ff6600] text-white font-semibold px-5 py-2 rounded focus:outline-none"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestProposal;