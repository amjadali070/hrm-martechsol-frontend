import React from 'react';
import AddEditUsers from '../../atoms/AddEditUser';

interface DashboardProps {}

const UpdateUsers: React.FC<DashboardProps> = () => {
  return (
    <div className="overflow-hidden px-4 pt-2.5 bg-white rounded-3xl">
      <div className="flex gap-3 max-md:flex-col">
        <div className="flex flex-col w-[100%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full max-md:mt-6 max-md:max-w-full">
            <section>
              <AddEditUsers/>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUsers;