import React from 'react';

interface ProfileImageProps {
  src: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src }) => {
  return (
    <div className="flex justify-center w-1/5 max-md:w-full">
      <img 
        loading="lazy" 
        src={src} 
        alt="Profile" 
        className="object-cover rounded-full w-36 h-36 max-md:w-24 max-md:h-24"
      />
    </div>
  );
};

export default ProfileImage;
