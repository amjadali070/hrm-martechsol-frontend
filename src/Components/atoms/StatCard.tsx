// frontend/src/atoms/StatCard.tsx

import React from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

interface StatCardProps {
  title: string;
  count: number | null; // Allow null to represent loading state
  icon: string | React.ReactElement;
  onClick: () => void;
  loading?: boolean;
  error?: string | null;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon, onClick, loading = false, error = null }) => {
  return (
    <div 
      className="flex flex-col items-start self-stretch py-3 pr-5 pl-5 my-auto bg-blue-50 rounded-md border border-solid border-slate-300 min-w-[240px] w-[270px] max-md:pr-5 cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="flex gap-10 justify-center items-center px-2.5 text-white bg-[#ff6600] h-[42px] min-h-[42px] rounded-[999px] w-[42px]">
        {typeof icon === 'string' ? (
          <img loading="lazy" src={icon} alt="" className="object-contain self-stretch my-auto w-6 aspect-square" />
        ) : (
          icon
        )}
      </div>
      <div className="flex flex-col mt-2">
        <div className="text-lg text-gray-500">{title}</div>
        <div className="text-3xl font-medium text-stone-900 text-start ml-1">
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : error ? (
            <span className="text-red-500">Error</span>
          ) : (
            count
          )}
        </div>
      </div>
      <hr className="w-full mt-4 border-t border-gray-300" />
 
      <button className="flex items-center justify-between w-full mt-3 text-gray-500 font-medium" onClick={onClick}>
        <span>View Details</span>
        <MdKeyboardArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default StatCard;