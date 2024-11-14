import React from 'react';

interface ProfileImageProps {
  src: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src }) => {
  return (
    <div className="flex flex-col w-[21%] max-md:ml-0 max-md:w-full">
      <img 
        loading="lazy" 
        src={src} 
        alt="Profile" 
        className="object-contain shrink-0 max-w-full rounded-none aspect-square w-[139px] max-md:mt-9" 
      />
    </div>
  );
};

export default ProfileImage;