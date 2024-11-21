import React from 'react';

const Policies: React.FC = () => {
  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-10 bg-gray-100 rounded-lg mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
        <span className="text-purple-900">MartechSol</span> Policies
      </h2>

      <p className="text-md md:text-md text-blue-600 mb-6 text-center leading-relaxed">
        Please click here to down the Employee Handbook (Updated Version)
      </p>

      <div className="flex justify-center">
        <a
          href="https://drive.google.com/uc?id=19eN4m2C8HHH6f7_e47hXauprGbjcBb-A&export=download"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all text-md font-semibold"
        >
          Download Policies PDF
        </a>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 leading-relaxed">
          If you have any questions or need further clarification, please contact 
          <span className="font-semibold text-purple-700"> HR Support</span> or refer to the
          handbook for additional details.
        </p>
      </div>
    </div>
  );
};

export default Policies;