import React from 'react';

interface QuickAction {
  label: string;
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
      <div className="flex justify-start gap-4 overflow-x-auto py-1 text-white">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex items-center justify-center gap-2 w-full sm:w-40 md:w-48 lg:w-56 xl:w-64 px-4 py-3 rounded-full transition-colors duration-300 ${
              action.active
                ? 'bg-purple-700 hover:bg-purple-700'
                : 'bg-purple-900 hover:bg-purple-800'
            }`}
          >
            {/* Show the label only on larger screens */}
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
