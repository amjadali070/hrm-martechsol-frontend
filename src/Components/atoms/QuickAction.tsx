import React from 'react';
import { IconType } from 'react-icons';

interface QuickAction {
  label: string;
  icon: IconType;
  onClick: () => void;
  active?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <section className="mt-5 px-4">
      <h2 className="text-3xl font-bold text-black mb-6">Quick Actions</h2>
      <div className="flex flex-wrap justify-around gap-8 overflow-x-auto py-1 text-white">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex items-center justify-center gap-2 sm:w-44 md:w-48 px-4 py-3 rounded-full transition-colors duration-300 ${
              action.active 
                ? 'bg-purple-700 hover:bg-purple-700' 
                : 'bg-purple-900 hover:bg-purple-800'
            }`}
          >
            <action.icon size={20} />
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;