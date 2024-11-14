import React from 'react';
import EditButton from '../atoms/ProfileCard/EditButton';
import ProfileImage from '../atoms/ProfileCard/ProfileImage';
import ProfileInfo from '../atoms/ProfileCard/ProfileInfo';

interface ProfileCardProps {
  name: string;
  title: string;
  imageSrc: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, title, imageSrc }) => {
  return (
    <section className="flex flex-wrap gap-10 px-12 py-14 mt-11 max-w-full bg-sky-500 rounded-[30px] w-[1294px] max-md:px-5 max-md:mt-10 max-md:mr-1.5">
      <div className="flex-auto max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <ProfileImage src={imageSrc} />
          <ProfileInfo name={name} title={title} />
        </div>
      </div>
      <EditButton />
    </section>
  );
};

export default ProfileCard;