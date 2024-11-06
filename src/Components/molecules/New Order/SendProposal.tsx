import React from 'react';
import RequestProposal from '../../atoms/RequestProposal';

interface DashboardProps {}

const SendProposal: React.FC<DashboardProps> = () => {
  return (
    <div className="overflow-hiddenbg-white rounded-3xl">
      <div className="flex gap-3 max-md:flex-col">
        <div className="flex flex-col w-[100%] *:max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full max-md:mt-2 max-md:max-w-full">
            <section>
              <RequestProposal/>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendProposal;