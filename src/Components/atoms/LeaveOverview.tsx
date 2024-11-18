import React from 'react';

interface LeaveType {
  name: string;
  used: number;
  total: number;
  isCompleted: boolean;
}

const leaveTypes: LeaveType[] = [
  { name: "Annual Leaves", used: 14, total: 14, isCompleted: true },
  { name: "Sick Leaves", used: 0, total: 8, isCompleted: false },
  { name: "Casual Leaves", used: 8, total: 10, isCompleted: false },
];

const LeaveOverview: React.FC = () => {
  return (
    <section className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col p-8 mx-auto w-full bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-black">Available Leave Days</h2>
        {leaveTypes.map((leave, index) => (
          <div key={index} className="mt-7">
            <div className="flex flex-wrap gap-5 justify-between max-md:max-w-full">
              <div className="text-xl text-zinc-500">{leave.name}</div>
              <div className="text-lg text-right text-zinc-600">
                {leave.used} of {leave.total} day(s)
              </div>
            </div>
            <div className={`flex shrink-0 h-6 ${leave.isCompleted ? 'bg-purple-900' : 'bg-gray-200'} rounded-[100px] max-md:max-w-full`}>
              {!leave.isCompleted && (
                <div
                  className="flex shrink-0 h-6 bg-purple-900 rounded-[100px]"
                  style={{ width: `${(leave.used / leave.total) * 100}%` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LeaveOverview;