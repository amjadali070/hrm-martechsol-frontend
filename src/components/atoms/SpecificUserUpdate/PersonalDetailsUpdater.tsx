// PersonalDetailsUpdater.tsx

import React, { useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";

const DEPARTMENT_CATEGORIES: { [key: string]: string[] } = {
  "Account Management": [
    "Digital Marketing",
    "Book Marketing",
    "Software Application",
    "Mobile Application",
  ],
  "Project Management": [
    "Digital Marketing",
    "Book Marketing",
    "Software Application",
    "Mobile Application",
  ],
  "Content Production": ["SEO Content", "Technical Content"],
  "Book Marketing": ["Book Formatting & Publishing", "Book Editing"],
  "Design Production": ["Graphic Design", "Web Design", "UI/UX Design"],
  SEO: [],
  "Creative Media": [
    "Infographic",
    "2D Animation",
    "Illustrator",
    "3D Animation",
    "VoiceOver",
  ],
  "Web Development": [
    "CMS Development",
    "Frontend Development",
    "Backend Development",
  ],
  "Paid Advertising": [
    "Digital Marketing",
    "Book Marketing",
    "Social Media Marketing",
    "SMS Marketing",
  ],
  "Software Production": [
    "Software Development",
    "Game Development",
    "Android Development",
    "iOS Development",
  ],
  "IT & Networking": [],
  "Human Resource": [],
  "Training & Development": [],
  Admin: [],
  Finance: [],
  "Brand Development": ["Digital Marketing", "Book Marketing"],
  "Corporate Communication": [],
};

interface Employee {
  name: string;
  department: string;
  jobTitle: string;
  jobCategory: string;
  jobType: string;
  profilePicture: string;
  shiftTimings: string;
  gender: string;
  dateOfBirth: string;
  jobStatus: string;
  joiningDate: string;
  // ... include other necessary fields
}

interface PersonalDetailsUpdaterProps {
  userId: string;
  employee: Employee;
  departments: string[];
  jobTitles: string[];
  onProfilePictureChange: (file: File) => void;
  isEditable: boolean;
  onUpdate: (updatedEmployee: Employee) => Promise<void>;
}

const additionalShiftTimings = [
  "9:00 AM - 5:30 PM",
  "10:00 AM - 6:30 PM",
  "11:00 AM - 7:30 PM",
  "12:00 PM - 8:30 PM",
  "1:00 PM - 9:30 PM",
  "2:00 PM - 10:30 PM",
  "3:00 PM - 11:30 PM",
  "4:00 PM - 12:30 AM",
  "5:00 PM - 1:30 AM",
  "6:00 PM - 2:30 AM",
  "6:30 PM - 3:00 AM",
  "7:00 PM - 3:30 AM",
  "8:00 PM - 4:30 AM",
  "9:00 PM - 5:30 AM",
];

const PersonalDetailsUpdater: React.FC<PersonalDetailsUpdaterProps> = ({
  userId,
  employee,
  departments,
  jobTitles,
  onProfilePictureChange,
  isEditable,
  onUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(employee);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

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

    if (name === "department") {
      setEditedEmployee((prev) => ({
        ...prev,
        [name]: value,
        jobCategory: "",
      }));
    } else {
      setEditedEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Updated to handle async function
  const handleUpdate = async () => {
    await onUpdate(editedEmployee);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEmployee(employee);
    setIsEditing(false);
  };

  const getCurrentDepartmentCategories = () => {
    return (
      DEPARTMENT_CATEGORIES[
        editedEmployee.department as keyof typeof DEPARTMENT_CATEGORIES
      ] || []
    );
  };

  const formattedDate = new Date(employee.dateOfBirth).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="bg-white p-4 rounded-xl flex flex-col items-center relative">
      {isEditable && !isEditing && (
        <button
          onClick={handleEditClick}
          className="absolute top-5 right-8 text-blue-600 hover:text-blue-500 transition-all"
          aria-label="Edit User Details"
        >
          <FaEdit size={24} />
        </button>
      )}

      <div className="relative border-[7px] border-blue-600 rounded-full">
        <img
          src={`${backendUrl}/${employee.profilePicture.replace(/\\/g, "/")}`}
          alt="Profile"
          className="rounded-full object-cover border-[4px] border-white w-36 h-36 max-md:w-24 max-md:h-24"
        />

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <div className="mt-10 w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Name Field */}
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Employee Name</p>
            {isEditing ? (
              <input
                type="text"
                name="name"
                placeholder={employee.name || "Employee Name"}
                value={editedEmployee.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
                {employee.name}
              </h2>
            )}
          </div>

          {/* Job Title Field */}
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Job Title</p>
            {isEditing ? (
              <select
                name="jobTitle"
                value={editedEmployee.jobTitle}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
              >
                <option value="">Select Job Title</option>
                {jobTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            ) : (
              <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
                {employee.jobTitle}
              </h2>
            )}
          </div>

          {/* Department Field */}
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Department</p>
            {isEditing ? (
              <select
                name="department"
                value={editedEmployee.department}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            ) : (
              <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
                {employee.department}
              </h2>
            )}
          </div>

          {/* Job Category Field */}
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Job Category</p>
            {isEditing ? (
              <select
                name="jobCategory"
                value={editedEmployee.jobCategory}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
              >
                <option value="">Select Job Category</option>
                {getCurrentDepartmentCategories().length > 0 ? (
                  getCurrentDepartmentCategories().map((category: string) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))
                ) : (
                  <option value="">No Categories for this Department</option>
                )}
              </select>
            ) : (
              <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
                {employee.jobCategory}
              </h2>
            )}
          </div>

          {/* Job Type Field */}
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Job Type</p>
            {isEditing ? (
              <select
                name="jobType"
                value={editedEmployee.jobType}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
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

          {/* Job Status Field */}
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Job Status</p>
            {isEditing ? (
              <select
                name="jobStatus"
                value={editedEmployee.jobStatus}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
              >
                <option value="">Select Job Status</option>
                <option value="Probation">Probation</option>
                <option value="Permanent">Permanent</option>
              </select>
            ) : (
              <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
                {employee.jobStatus}
              </h2>
            )}
          </div>

          {/* Date of Birth Field */}
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Date of Birth</p>
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={editedEmployee.dateOfBirth}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
              />
            ) : (
              <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
                {formattedDate}
              </h2>
            )}
          </div>

          {/* Gender Field */}
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Gender</p>
            {isEditing ? (
              <select
                name="gender"
                value={editedEmployee.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
                {employee.gender}
              </h2>
            )}
          </div>

          {/* Shift Timings Field */}
          <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Shift Timings</p>
            {isEditing ? (
              <select
                name="shiftTimings"
                value={editedEmployee.shiftTimings}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
              >
                <option value="">Select Shift Timing</option>
                {additionalShiftTimings.map((timing) => (
                  <option key={timing} value={timing}>
                    {timing}
                  </option>
                ))}
              </select>
            ) : (
              <h2 className="text-lg lg:text-lg font-semibold text-gray-800">
                {employee.shiftTimings}
              </h2>
            )}
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
    </div>
  );
};

export default PersonalDetailsUpdater;
