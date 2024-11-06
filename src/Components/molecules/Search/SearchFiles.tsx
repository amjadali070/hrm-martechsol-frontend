import React from 'react';
import Search from '../../atoms/Search';

interface DashboardProps {}

const SearchFiles: React.FC<DashboardProps> = () => {
  return (
    <div className="overflow-hidden px-4 pt-2.5 bg-white rounded-3xl">
      <div className="flex gap-3 max-md:flex-col">
 
        <div className="flex flex-col w-[100%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full max-md:mt-6 max-md:max-w-full">
   
            <div className="flex justify-between items-center mt-4 w-full text-lg text-gray-500 max-md:max-w-full">
            </div>
            <section>
              <Search/>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFiles;