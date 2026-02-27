import React from "react";
import { useNavigate } from "react-router";
import profilePlaceholder from "../../assets/placeholder.png";
import { FaClock, FaBriefcase, FaEdit } from "react-icons/fa";

interface ProfileCardProps {
  name: string;
  jobTitle: string;
  imageSrc: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  jobTitle,
  imageSrc,
  shiftStartTime,
  shiftEndTime,
}) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const formatShift = () => {
    if (shiftStartTime && shiftEndTime) {
      return `${shiftStartTime} - ${shiftEndTime}`;
    }
    return "Not Assigned";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-brand-900 shadow-xl text-white p-8 animate-fadeIn">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 rounded-full p-1 bg-white/20 backdrop-blur-sm">
            <img
              src={imageSrc || profilePlaceholder}
              alt={name}
              onError={(e) => {
                e.currentTarget.src = profilePlaceholder;
              }}
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-accent-500 border-4 border-brand-800 rounded-full"></div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2 tracking-tight">
            {name}
          </h1>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-brand-100 text-sm font-medium">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <FaBriefcase className="text-accent-400" />
              <span>{jobTitle}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <FaClock className="text-accent-400" />
              <span>Shift: {formatShift()}</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={handleEditProfile}
          className="shrink-0 flex items-center gap-2 bg-white text-brand-700 px-6 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-colors shadow-lg shadow-black/10"
        >
          <FaEdit />
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
