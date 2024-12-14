import React from "react";

interface TabProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
  activeTabClassName?: string;
  tabClassName?: string;
}

const Tab: React.FC<TabProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  activeTabClassName = "",
  tabClassName = "",
}) => {
  return (
    <div className={`flex justify-center space-x-4 mb-4 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`
            px-6 py-2 
            text-sm 
            font-semibold 
            rounded-full
            transition-all 
            duration-300 
            focus:outline-none 
            focus:ring-2 
            w-full
            focus:ring-blue-400
            hover:bg-blue-100 hover:text-blue-700
            ${
              activeTab === tab
                ? `bg-blue-600 text-white  ${activeTabClassName}`
                : `bg-gray-200 text-gray-700 ${tabClassName}`
            }
          `}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tab;
