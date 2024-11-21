import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../molecules/Sidebar';
import Header from '../atoms/Header';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#efefef] max-md:flex-col">
      <Sidebar />
      <main className="flex flex-col flex-1 ml-5 overflow-auto max-md:ml-0 mt-3">
        <Header />
        <div className="flex flex-col mt-8 w-full max-md:mt-10 max-md:max-w-full pl-3 pr-8 pb-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;