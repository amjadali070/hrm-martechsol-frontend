import React from 'react';

interface ProfileInfoProps {
  name: string;
  title: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ name, title }) => {
  return (
    <div className="flex flex-col ml-5 w-[79%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col self-stretch my-auto text-white max-md:mt-10 max-md:max-w-full">
        <h1 className="self-start text-4xl font-bold">{name}</h1>
        <h2 className="mt-10 text-3xl max-md:max-w-full">{title}</h2>
      </div>
    </div>
  );
};

export default ProfileInfo;