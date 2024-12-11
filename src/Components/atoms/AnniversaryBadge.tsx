import React from "react";
import { MdCelebration } from "react-icons/md";

// Utility function to add ordinal suffix
const getOrdinalSuffix = (year: number) => {
  const j = year % 10,
    k = year % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

interface AnniversaryBadgeProps {
  anniversaryYear: number;
}

const AnniversaryBadge: React.FC<AnniversaryBadgeProps> = ({
  anniversaryYear,
}) => {
  return (
    <div
      className="relative flex flex-col items-center"
      aria-label={`Celebration for ${anniversaryYear}${getOrdinalSuffix(
        anniversaryYear
      )}`}
    >
      <div
        className="flex items-center justify-center w-20 h-20 
        bg-gradient-to-br from-purple-700 to-purple-900 
        rounded-full text-white 
        shadow-lg border-4 border-purple-600 
        relative overflow-hidden"
      >
        {/* Main content */}
        <div className="z-10 flex items-center justify-center text-center">
          <span className="font-bold text-3xl sm:text-4xl">
            {anniversaryYear}
            <sup className="text-sm">{getOrdinalSuffix(anniversaryYear)}</sup>
          </span>
          <MdCelebration className="ml-2 text-yellow-300 text-3xl" />
        </div>

        {/* Subtle background effect */}
        <div className="absolute inset-0 bg-purple-800 opacity-20 rounded-full"></div>

        {/* Decorative elements */}
        <div className="absolute -top-3 -left-3 w-4 h-4 bg-yellow-300 rounded-full"></div>
        <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-yellow-300 rounded-full"></div>
      </div>

      {/* Tooltip */}
      <div className="mt-2 bg-black text-white text-xs px-2 py-1 rounded">
        Celebration Badge
      </div>
    </div>
  );
};

export default AnniversaryBadge;
