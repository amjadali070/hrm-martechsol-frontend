// PersonalDetailsUpdater.tsx

import React, { useRef, useState } from "react";
import { FaEdit, FaCamera, FaUser } from "react-icons/fa";

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
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [employee.profilePicture]);

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
    <div className="bg-white p-8 rounded-2xl flex flex-col items-center relative border border-platinum-200 shadow-sm">
      {isEditable && !isEditing && (
        <button
          onClick={handleEditClick}
          className="absolute top-6 right-6 p-2 rounded-full bg-alabaster-grey-50 text-gunmetal-600 hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm border border-platinum-200"
          aria-label="Edit User Details"
        >
          <FaEdit size={18} />
        </button>
      )}

      {/* Profile Picture Section */}
      <div className="relative group mb-10">
        <div className="relative p-1 rounded-full border-2 border-platinum-200 shadow-lg bg-alabaster-grey-50 flex items-center justify-center overflow-hidden w-40 h-40 max-md:w-32 max-md:h-32">
             {!imageError && employee.profilePicture ? (
                <img
                    src={`${(employee.profilePicture || "").replace(/\\/g, "/")}`}
                    alt="Profile"
                    onError={() => setImageError(true)}
                    className="rounded-full object-cover w-full h-full transition-transform duration-300 group-hover:scale-[1.02]"
                />
             ) : (
                <FaUser className="text-slate-grey-400 text-6xl" />
             )}
            {isEditable && (
                <div 
                    className="absolute bottom-1 right-2 w-10 h-10 bg-gunmetal-900 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-gunmetal-700 transition-colors shadow-md border-2 border-white"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <FaCamera size={16} />
                </div>
            )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Name Field */}
          <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200 flex flex-col items-center justify-center min-h-[100px]">
            <p className="text-xs font-bold uppercase text-slate-grey-500 mb-2">Employee Name</p>
            {isEditing ? (
              <input
                type="text"
                name="name"
                placeholder={employee.name || "Employee Name"}
                value={editedEmployee.name}
                onChange={handleInputChange}
                className="w-full text-center bg-white border border-platinum-200 rounded-lg p-2 text-gunmetal-900 font-medium focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all"
              />
            ) : (
              <h2 className="text-lg font-bold text-gunmetal-900">
                {employee.name}
              </h2>
            )}
          </div>

          {/* Job Title Field */}
          <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200 flex flex-col items-center justify-center min-h-[100px]">
            <p className="text-xs font-bold uppercase text-slate-grey-500 mb-2">Job Title</p>
            {isEditing ? (
              <select
                name="jobTitle"
                value={editedEmployee.jobTitle}
                onChange={handleInputChange}
                className="w-full text-center bg-white border border-platinum-200 rounded-lg p-2 text-gunmetal-900 font-medium focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all cursor-pointer"
              >
                <option value="">Select Job Title</option>
                {jobTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            ) : (
              <h2 className="text-lg font-bold text-gunmetal-900">
                {employee.jobTitle}
              </h2>
            )}
          </div>

          {/* Department Field */}
          <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200 flex flex-col items-center justify-center min-h-[100px]">
            <p className="text-xs font-bold uppercase text-slate-grey-500 mb-2">Department</p>
            {isEditing ? (
              <select
                name="department"
                value={editedEmployee.department}
                onChange={handleInputChange}
                className="w-full text-center bg-white border border-platinum-200 rounded-lg p-2 text-gunmetal-900 font-medium focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all cursor-pointer"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            ) : (
              <h2 className="text-lg font-bold text-gunmetal-900">
                {employee.department}
              </h2>
            )}
          </div>

          {/* Job Category Field */}
          <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200 flex flex-col items-center justify-center min-h-[100px]">
            <p className="text-xs font-bold uppercase text-slate-grey-500 mb-2">Job Category</p>
            {isEditing ? (
              <select
                name="jobCategory"
                value={editedEmployee.jobCategory}
                onChange={handleInputChange}
                className="w-full text-center bg-white border border-platinum-200 rounded-lg p-2 text-gunmetal-900 font-medium focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all cursor-pointer"
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
              <h2 className="text-lg font-bold text-gunmetal-900">
                {employee.jobCategory || "--"}
              </h2>
            )}
          </div>

          {/* Job Type Field */}
          <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200 flex flex-col items-center justify-center min-h-[100px]">
            <p className="text-xs font-bold uppercase text-slate-grey-500 mb-2">Job Type</p>
            {isEditing ? (
              <select
                name="jobType"
                value={editedEmployee.jobType}
                onChange={handleInputChange}
                className="w-full text-center bg-white border border-platinum-200 rounded-lg p-2 text-gunmetal-900 font-medium focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all cursor-pointer"
              >
                <option value="">Select Job Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            ) : (
              <h2 className="text-lg font-bold text-gunmetal-900">
                {employee.jobType}
              </h2>
            )}
          </div>

          {/* Job Status Field */}
          <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200 flex flex-col items-center justify-center min-h-[100px]">
            <p className="text-xs font-bold uppercase text-slate-grey-500 mb-2">Job Status</p>
            {isEditing ? (
              <select
                name="jobStatus"
                value={editedEmployee.jobStatus}
                onChange={handleInputChange}
                className="w-full text-center bg-white border border-platinum-200 rounded-lg p-2 text-gunmetal-900 font-medium focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all cursor-pointer"
              >
                <option value="">Select Job Status</option>
                <option value="Probation">Probation</option>
                <option value="Permanent">Permanent</option>
              </select>
            ) : (
              <h2 className="text-lg font-bold text-gunmetal-900">
                {employee.jobStatus}
              </h2>
            )}
          </div>

          {/* Date of Birth Field */}
          <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200 flex flex-col items-center justify-center min-h-[100px]">
            <p className="text-xs font-bold uppercase text-slate-grey-500 mb-2">Date of Birth</p>
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={editedEmployee.dateOfBirth}
                onChange={handleInputChange}
                className="w-full text-center bg-white border border-platinum-200 rounded-lg p-2 text-gunmetal-900 font-medium focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all"
              />
            ) : (
              <h2 className="text-lg font-bold text-gunmetal-900">
                {formattedDate}
              </h2>
            )}
          </div>

          {/* Gender Field */}
          <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200 flex flex-col items-center justify-center min-h-[100px]">
             <p className="text-xs font-bold uppercase text-slate-grey-500 mb-2">Gender</p>
            {isEditing ? (
              <select
                name="gender"
                value={editedEmployee.gender}
                onChange={handleInputChange}
                className="w-full text-center bg-white border border-platinum-200 rounded-lg p-2 text-gunmetal-900 font-medium focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <h2 className="text-lg font-bold text-gunmetal-900">
                {employee.gender}
              </h2>
            )}
          </div>

          {/* Shift Timings Field */}
          <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200 flex flex-col items-center justify-center min-h-[100px]">
            <p className="text-xs font-bold uppercase text-slate-grey-500 mb-2">Shift Timings</p>
            {isEditing ? (
              <select
                name="shiftTimings"
                value={editedEmployee.shiftTimings}
                onChange={handleInputChange}
                className="w-full text-center bg-white border border-platinum-200 rounded-lg p-2 text-gunmetal-900 font-medium focus:outline-none focus:ring-2 focus:ring-gunmetal-200 transition-all cursor-pointer"
              >
                <option value="">Select Shift Timing</option>
                {additionalShiftTimings.map((timing) => (
                  <option key={timing} value={timing}>
                    {timing}
                  </option>
                ))}
              </select>
            ) : (
              <h2 className="text-lg font-bold text-gunmetal-900">
                {employee.shiftTimings}
              </h2>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 flex justify-center space-x-4 animate-fadeIn">
            <button
              onClick={handleUpdate}
              className="bg-gunmetal-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gunmetal-800 transition-all shadow-lg hover:shadow-gunmetal-500/20 transform hover:-translate-y-0.5"
            >
              Update Details
            </button>
            <button
              onClick={handleCancel}
              className="bg-white text-slate-grey-600 border border-platinum-200 px-8 py-3 rounded-xl font-bold hover:bg-alabaster-grey-50 transition-all"
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
