import React from 'react';
import { useNavigate } from 'react-router';
import ProfileImage from '../atoms/ProfileCard/ProfileImage';
import ProfileInfo from '../atoms/ProfileCard/ProfileInfo';

interface ProfileCardProps {
  name: string;
  title: string;
  imageSrc: string;
}

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
