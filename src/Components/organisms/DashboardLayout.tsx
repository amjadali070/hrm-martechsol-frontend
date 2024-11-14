import React from 'react';
import Announcements from '../atoms/Announcements';
import AttendanceOverview from '../atoms/AttendanceOverview';
import Header from '../atoms/Header';
import LeaveOverview from '../atoms/LeaveOverview';
import QuickActions from '../atoms/QuickAction';
import ProfileCard from '../molecules/ProfileCard';
import Sidebar from '../molecules/Sidebar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex flex-col rounded-none">
      <div className="pr-8 w-full bg-zinc-100 max-md:pr-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <Sidebar />
          <main className="flex flex-col ml-5 w-[78%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col mt-14 w-full max-md:mt-10 max-md:max-w-full">
              <Header />
              <ProfileCard name={'Amjad Ali'} title={'Full Stack Developer'} imageSrc={''}/>
              <QuickActions />
              <Announcements />
              <div className="mt-8 max-md:mr-2 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col">
                  <LeaveOverview />
                  <AttendanceOverview />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;