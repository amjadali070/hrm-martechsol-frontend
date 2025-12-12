import React from 'react';
import { IconType } from 'react-icons';
import { FaChevronRight } from 'react-icons/fa';

export interface QuickActionItem {
  label: string;
  onClick: () => void;
  tooltip?: string;
  icon?: IconType;
  color?: string; // Optional color override
}

interface QuickActionsProps {
  actions: QuickActionItem[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold text-surface-900">Quick Actions</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              title={action.tooltip}
              className="group flex flex-col items-center justify-center p-6 bg-white border border-surface-200 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-300 text-center"
            >
              <div className={`p-4 rounded-xl mb-3 transition-colors duration-300 ${action.color || 'bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white'}`}>
                {Icon ? <Icon size={24} /> : <FaChevronRight size={20} />}
              </div>
              <span className="text-sm font-semibold text-surface-700 group-hover:text-surface-900">{action.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
