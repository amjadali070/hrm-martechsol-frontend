import React from 'react';

const RecentFiles: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-col justify-center px-1.5 py-1 mt-6 w-full text-lg font-medium bg-[#f6f6f6] rounded-md border border-solid border-slate-300 text-stone-900 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between px-4 py-5 w-full bg-white rounded-md border border-solid border-slate-300 max-md:max-w-full">
        <div>Product Title</div>
        <div className="flex flex-wrap gap-10 max-md:max-w-full">
          <div className="flex gap-7">
            <div className="grow">Category</div>
            <div>Completion</div>
            <div className="basis-auto">Project Status</div>
          </div>
          <div>ETA</div>
          <div className="flex gap-4">
            <div>Invoice</div>
            <div>RI Form</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentFiles;