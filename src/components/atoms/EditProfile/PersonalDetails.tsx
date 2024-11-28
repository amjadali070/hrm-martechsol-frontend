import React, { useRef, useState } from 'react';
import { FaEdit, FaUserEdit } from 'react-icons/fa';

interface PersonalDetailsProps {
  employee: {
    name: string;
    department: string;
    jobTitle: string;
    jobType: string;
    profilePicture: string;
    shiftTimings: string;
  };
  onProfilePictureChange: (file: File) => void;
  isEditable: boolean;
  onUpdate: (updatedEmployee: {
    name: string;
    department: string;
    jobTitle: string;
    jobType: string;
    profilePicture: string;
    shiftTimings: string;
  }) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  employee,
  onProfilePictureChange,
  isEditable,
  onUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(employee);

  const handleEditClick = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onProfilePictureChange(e.target.files[0]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    onUpdate(editedEmployee);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEmployee(employee);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-10 lg:p-12 rounded-xl flex flex-col items-center relative">
      {isEditable && !isEditing && (
        <button
          onClick={handleEditClick}
          className="absolute top-5 right-8 text-blue-600 hover:text-blue-500 transition-all"
          aria-label="Edit Personal Details"
        >
          <FaEdit size={24} />
        </button>
      )}

      <div className="relative border-[7px] border-blue-600 rounded-full">
        <img
          src={employee.profilePicture}
          alt="Profile"
          className="rounded-full object-cover border-[4px] border-white w-36 h-36 max-md:w-24 max-md:h-24"
        />
          <button
            onClick={() => {
              fileInputRef.current?.click();
            }}
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
            {isEditing ? (
              <input
                type="text"
                name="name"
                placeholder={employee.name || 'Employee Name'}
                value={editedEmployee.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            ) : (
              <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
                {employee.name}
              </h2>
            )}
          </div>

          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Department</p>
            {isEditing ? (
              <input
                type="text"
                name="department"
                placeholder={employee.department || 'Department'}
                value={editedEmployee.department}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            ) : (
              <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
                {employee.department}
              </h2>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-center mb-6 mt-6 w-full border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Job Title</p>
          {isEditing ? (
            <input
              type="text"
              name="jobTitle"
              placeholder={employee.jobTitle || 'Job Title'}
              value={editedEmployee.jobTitle}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          ) : (
            <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
              {employee.jobTitle}
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Job Type</p>
          {isEditing ? (
            <select
              name="jobType"
              defaultValue={employee.jobType || 'Select Job Type'} 
              value={editedEmployee.jobType}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
            >
              <option value="">Select Job Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          ) : (
            <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
              {employee.jobType}
            </h2>
          )}
          </div>

          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Shift Timings</p>
            {isEditing ? (
              <input
                type="text"
                name="shiftTimings"
                value={editedEmployee.shiftTimings}
                placeholder={employee.shiftTimings || 'Shift Timings'}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            ) : (
              <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
                {employee.shiftTimings}
              </h2>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition-colors"
          >
            Update
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalDetails;