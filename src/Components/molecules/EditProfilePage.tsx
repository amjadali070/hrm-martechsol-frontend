// src/components/EmployeeProfile.tsx

import React from 'react';
import { FaUserEdit } from 'react-icons/fa';

interface EmployeeProfileProps {
  employee: {
    name: string;
    department: string;
    jobTitle: string;
    jobCategory: string;
    profilePicture: string;
  };
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
  return (
    <div className="flex flex-col md:flex-row gap-5 p-8 bg-[#f0f4fc] min-h-screen ">
      <div className="bg-white w-full md:w-1/4 p-6 rounded-xl shadow-md">
        <ul className="space-y-4">
          {[
            'Personal Details',
            'Contact Details',
            'Next of Kin Details',
            'Education Qualifications',
            'Guarantor Details',
            'Family Details',
            'Job Details',
            'Financial Details',
          ].map((item, index) => (
            <li
              key={index}
              className={`py-3 px-4 rounded-lg text-left cursor-pointer ${
                index === 0 ? 'bg-purple-900 font-bold text-white' : 'bg-gray-100'
              } hover:bg-purple-900 hover:text-white transition-all duration-200`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white flex-grow p-10 rounded-xl shadow-md relative">
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={employee.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
            />
            <button className="absolute top-0 right-0 bg-gray-200 rounded-full p-2 shadow-md hover:bg-gray-300">
              <FaUserEdit size={16} />
            </button>
          </div>
        </div>
        <div className="text-center mt-6">
          <h2 className="text-2xl font-bold">{employee.name}</h2>
          <p className="text-lg mt-3">{employee.department}</p>
          <div className="flex justify-center mt-5 space-x-10">
            <div>
              <h3 className="font-semibold">Job Title</h3>
              <p className="mt-1">{employee.jobTitle}</p>
            </div>
            <div>
              <h3 className="font-semibold">Job Category</h3>
              <p className="mt-1">{employee.jobCategory}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const EditProfilePage: React.FC = () => {
  const employee = {
    name: 'selemon alemayehu',
    department: 'Design & Marketing',
    jobTitle: 'UI / UX Designer',
    jobCategory: 'Full time',
    profilePicture:
      'https://via.placeholder.com/150/000000/FFFFFF/?text=Profile+Picture',
  };

  return <EmployeeProfile employee={employee} />;
};

export default EditProfilePage;