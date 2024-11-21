import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaNetworkWired, FaUserTie, FaTools } from 'react-icons/fa';

const SubmitATicket: React.FC = () => {
  const navigate = useNavigate();

  const ticketOptions = [
    { label: 'Network Ticket', route: '/tickets/network', icon: <FaNetworkWired size={24} /> },
    { label: 'HR Ticket', route: '/tickets/hr', icon: <FaUserTie size={24} /> },
    { label: 'Admin Ticket', route: '/tickets/admin', icon: <FaTools size={24} /> },
  ];

  return (
    <div className="w-full mx-auto p-8 bg-white rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Submit a Ticket
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {ticketOptions.map((option, index) => (
          <div
            key={index}
            onClick={() => navigate(option.route)}
            className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-all"
          >
            <div className="text-blue-600 mb-3">{option.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              {option.label}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmitATicket;