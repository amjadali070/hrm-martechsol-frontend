import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';

interface ReturnToHomeButtonProps {
  onReturnHome: () => void;
}

const ReturnToHomeButton: React.FC<ReturnToHomeButtonProps> = ({ onReturnHome }) => {
  return (
    <div className="flex items-center cursor-pointer" onClick={onReturnHome}>
      <div className="bg-[#ff6600] p-2 rounded-md text-white flex items-center justify-center">
        <IoIosArrowBack className="w-5 h-5" />
      </div>
      <span className="ml-2 text-[#ff6600] text-lg font-medium">Return to Home</span>
    </div>
  );
};

export default ReturnToHomeButton;
