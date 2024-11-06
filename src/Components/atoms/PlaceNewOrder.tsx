/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

const PlaceNewOrder: React.FC = () => {
  const [selectedService, setSelectedService] = useState('Articles');

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(event.target.value);
  };

  return (
    <div className="max-w-8xl mx-auto my-8 p-6 border border-gray-300 shadow rounded bg-white">
      <h2 className="text-lg font-semibold mb-4">Place New Order</h2>
      <p className="mb-4 text-gray-600">
        You may place your new order using the services below. If you need a
        quote/proposal for your new project, please{' '}
        <a href="#" className="text-blue-500 underline">
          Click here
        </a>.
      </p>

      <form className="space-y-4">
        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="service">
            Select Service
          </label>
          <select
            id="service"
            value={selectedService}
            onChange={handleServiceChange}
            className="w-2/4 p-2 border border-gray-300 rounded focus:outline-none"
          >
            <option value="Articles">Articles</option>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="SEO">SEO</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default PlaceNewOrder;