import React from 'react';
import { useNavigate } from 'react-router';
interface ProfileImageProps {
  src: string;
}

interface ProfileCardProps {
  name: string;
  title: string;
  imageSrc: string;
}


interface ProfileInfoProps {
  name: string;
  title: string;
}


const ProfileImage: React.FC<ProfileImageProps> = ({ src }) => {
  return (
    <div className="flex justify-center object-cover w-1/5 max-md:w-full">
      <img 
        src={src} 
        alt="Profile" 
        className="rounded-full object-cover border-[6px] border-white  w-36 h-36 max-md:w-24 max-md:h-24"
      />
    </div>
  );
};

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


const ProfileCard: React.FC<ProfileCardProps> = ({ name, title, imageSrc }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-8 bg-sky-500 rounded-[28px] max-w-full">
      <div className="flex flex-col md:flex-row items-center w-full">
        <ProfileImage src={imageSrc} />
        <ProfileInfo name={name} title={title} />
      </div>
      <button
        onClick={handleEditProfile}
        className="w-[18%] px-6 py-3 my-auto font-semibold text-black bg-white rounded-[30px] hover:bg-gray-100 transition-colors duration-300 max-md:px-4 max-md:py-2 mr-5"
      >
        Edit Profile
      </button>
    </section>
  );
};

export default ProfileCard;
