import React from 'react';

interface ProfileInfoProps {
  name: string;
  title: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ name, title }) => {
  return (
    <div className="flex flex-col ml-5 w-4/5 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">{name}</h1>
        <h2 className="mt-2 text-xl sm:text-xl">{title}</h2>
      </div>
    </div>
  );
};

export default ProfileInfo;
