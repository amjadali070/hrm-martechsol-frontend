import React from "react";
import { useNavigate } from "react-router";

interface ProfileImageProps {
  src: string;
}

interface ProfileCardProps {
  name: string;
  jobTitle: string;
  imageSrc: string;
  userShift: string;
}

interface ProfileInfoProps {
  name: string;
  jobTitle: string;
  userShift: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ src }) => {
  return (
    <div className="flex justify-center object-cover w-1/5 max-md:w-24 max-sm:w-1/3">
      <img
        src={src}
        alt="Profile"
        className="rounded-full object-cover border-[6px] border-white w-36 h-36 max-md:w-24 max-md:h-24"
      />
    </div>
  );
};

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  name,
  jobTitle,
  userShift,
}) => {
  return (
    <div className="flex flex-col ml-5 w-4/5 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">{name}</h1>
        <h2 className="mt-2 text-xl sm:text-xl">{jobTitle}</h2>
        <span className="mt-2 text-sm text-white">Shift: {userShift}</span>
      </div>
    </div>
  );
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  jobTitle,
  imageSrc,
  userShift,
}) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-8 bg-sky-500 rounded-[28px] max-w-full">
      <div className="flex flex-col md:flex-row items-center w-full">
        <ProfileImage src={imageSrc} />
        <ProfileInfo name={name} jobTitle={jobTitle} userShift={userShift} />
      </div>
      <button
        onClick={handleEditProfile}
        className="w-[18%] px-6 py-3 my-auto mr-5 font-semibold text-black bg-white rounded-[30px] hover:bg-gray-100 transition-colors duration-300 max-md:w-3/4 max-md:px-4 max-md:py-2 mt-4 md:mt-11"
      >
        Edit Profile
      </button>
    </section>
  );
};

export default ProfileCard;
