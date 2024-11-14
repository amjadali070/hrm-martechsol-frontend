import React from 'react';

interface QuickAction {
  label: string;
}

const quickActions: QuickAction[] = [
  { label: "Apply for Leave" },
  { label: "View Payslip" },
  { label: "View Attendance" },
  { label: "Create a Ticket" },
  { label: "View Policies" },
];

const QuickActions: React.FC = () => {
  return (
    <section className="mt-10">
      <h2 className="self-start mt-10 text-3xl font-bold text-black">Quick Actions</h2>
      <div className="flex flex-wrap gap-5 justify-between mt-6 text-2xl text-center text-white max-md:mr-2">
        {quickActions.map((action, index) => (
          <button key={index} className="px-10 py-4 bg-purple-900 rounded-[30px] max-md:px-5">
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;