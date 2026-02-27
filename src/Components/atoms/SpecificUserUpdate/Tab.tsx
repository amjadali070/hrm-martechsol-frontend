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
    <div className={`flex justify-center space-x-2 md:space-x-4 mb-8 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`
            px-6 py-2.5
            text-sm 
            font-bold 
            rounded-xl
            transition-all 
            duration-300 
            focus:outline-none 
            focus:ring-2 
            focus:ring-gunmetal-200
            shadow-sm
            ${
              activeTab === tab
                ? `bg-gunmetal-900 text-white shadow-gunmetal-500/20 transform -translate-y-0.5 ${activeTabClassName}`
                : `bg-white text-slate-grey-600 border border-platinum-200 hover:bg-alabaster-grey-50 hover:text-gunmetal-700 hover:border-gunmetal-200 ${tabClassName}`
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
