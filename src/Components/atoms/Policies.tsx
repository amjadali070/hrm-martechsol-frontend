import React from 'react';

const Policies: React.FC = () => {
  return (
    <div className="w-full p-6 rounded-lg mt-20 mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-black">
        Company Policies
      </h2>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Please click here to down the Employee Handbook (Updated Version)
      </p>
      <div className="flex justify-center">
        <a
          href="https://drive.google.com/uc?id=19eN4m2C8HHH6f7_e47hXauprGbjcBb-A&export=download"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all text-lg font-semibold"
        >
          Download Policies PDF
        </a>
      </div>
    </div>
  );
};

export default Policies;
