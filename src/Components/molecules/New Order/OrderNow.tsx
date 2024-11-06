import React from 'react';
import PlaceNewOrder from '../../atoms/PlaceNewOrder';
import ProjectForm from '../../organisms/ProjectForm';

interface DashboardProps {}

const OrderNow: React.FC<DashboardProps> = () => {
  return (
    <div className="overflow-hidden bg-white rounded-3xl">
      <div className="flex gap-3 max-md:flex-col">
        <div className="flex flex-col ml-5 w-[100%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full max-md:mt-2 max-md:max-w-full">
            <section>
              {/* <PlaceNewOrder/> */}
              <ProjectForm />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderNow;
