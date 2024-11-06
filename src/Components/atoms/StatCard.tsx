import React from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';

interface StatCardProps {
  title: string;
  count: number;
  icon: string | React.ReactElement;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon, onClick }) => {
  return (
    <div 
      className="flex flex-col items-start self-stretch py-3 pr-5 pl-5 my-auto bg-blue-50 rounded-md border border-solid border-slate-300 min-w-[240px] w-[270px] max-md:pr-5 cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex gap-10 justify-center items-center px-2.5 text-white bg-[#771EBB] h-[42px] min-h-[42px] rounded-[999px] w-[42px]">
        {typeof icon === 'string' ? (
          <img loading="lazy" src={icon} alt="" className="object-contain self-stretch my-auto w-6 aspect-square" />
        ) : (
          icon
        )}
      </div>
      <div className="flex flex-col mt-2">
        <div className="text-lg text-gray-500">{title}</div>
        <div className="text-3xl font-medium text-stone-900 text-start ml-1">{count}</div>
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