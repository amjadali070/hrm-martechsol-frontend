// frontend/src/components/SummaryCard.tsx

import React from 'react';
import { IconType } from 'react-icons';
import clsx from 'clsx';

interface SummaryCardProps {
  title: string;
  count: number | string;
  icon: IconType;
  bgColor: string; // e.g., 'indigo', 'green', 'yellow'
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, icon: Icon, bgColor }) => {
  const bgColorClasses: { [key: string]: string } = {
    green: 'green',
    yellow: 'yellow',
    red: 'red',
    blue: 'blue',
    purple: 'purple',
  };

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
      <div
        className={clsx(
          'p-3 rounded-full text-white bg-[#ff6600]',
        )}
      >
        <Icon size={24} />
      </div>
      <div className="ml-4">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <p className="text-xl font-semibold text-gray-800">{count}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
