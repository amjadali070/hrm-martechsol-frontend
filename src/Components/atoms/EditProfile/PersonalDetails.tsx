import React, { useRef } from 'react';
import { FaUserEdit } from 'react-icons/fa';

interface PersonalDetailsProps {
  employee: {
    name: string;
    department: string;
    jobTitle: string;
    jobCategory: string;
    profilePicture: string;
    shiftTimings: string; // Added shift timings
  };
  onProfilePictureChange: (file: File) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ employee, onProfilePictureChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onProfilePictureChange(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white p-10 lg:p-12 rounded-xl flex flex-col items-center">
      <div className="relative">
        <img
          src={employee.profilePicture}
          alt="Profile"
          className="w-40 h-40 lg:w-40 lg:h-40 rounded-full border-4 border-blue-600"
        />
        <button
          onClick={handleEditClick}
          className="absolute bottom-0 right-0 bg-black text-white border-4 border-white rounded-full p-2 hover:bg-zinc-700 transition-all"
          aria-label="Edit Profile Picture"
        >
          <FaUserEdit size={20} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      <div className="mt-10 w-full max-w-3xl">
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Employee Name</p>
            <h2 className="text-xl lg:text-xl font-semibold text-gray-800">{employee.name}</h2>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Department</p>
            <h2 className="text-xl lg:text-xl font-semibold text-gray-800">{employee.department}</h2>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-center mb-6 mt-6 w-full border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Job Title</p>
          <h2 className="text-xl lg:text-xl font-semibold text-gray-800">{employee.jobTitle}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Job Category</p>
            <h2 className="text-xl lg:text-xl font-semibold text-gray-800">{employee.jobCategory}</h2>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Shift Timings</p>
            <h2 className="text-xl lg:text-xl font-semibold text-gray-800">{employee.shiftTimings}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;