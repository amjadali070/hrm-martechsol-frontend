import React, { useRef, useState, useEffect } from "react";
import { FaEdit, FaUserEdit, FaCamera, FaIdBadge, FaBriefcase, FaBuilding, FaClock, FaCalendarAlt, FaUser } from "react-icons/fa";
import profilePlaceholder from "../../../assets/placeholder.png";

const DEPARTMENT_CATEGORIES: { [key: string]: string[] } = {
  "Account Management": ["Digital Marketing", "Book Marketing", "Software Application", "Mobile Application"],
  "Project Management": ["Digital Marketing", "Book Marketing", "Software Application", "Mobile Application"],
  "Content Production": ["SEO Content", "Technical Content"],
  "Book Marketing": ["Book Formatting & Publishing", "Book Editing"],
  "Design Production": ["Graphic Design", "Web Design", "UI/UX Design"],
  SEO: [],
  "Creative Media": ["Infographic", "2D Animation", "Illustrator", "3D Animation", "VoiceOver"],
  "Web Development": ["CMS Development", "Frontend Development", "Backend Development"],
  "Paid Advertising": ["Digital Marketing", "Book Marketing", "Social Media Marketing", "SMS Marketing"],
  "Software Production": ["Software Development", "Game Development", "Android Development", "iOS Development"],
  "IT & Networking": [],
  "Human Resource": [],
  "Training & Development": [],
  Admin: [],
  Finance: [],
  "Brand Development": ["Digital Marketing", "Book Marketing"],
  "Corporate Communication": [],
  "Lead Generation": ["Digital Marketing", "Book Marketing"],
};

const additionalShiftTimings = [
  "9:00 AM - 5:30 PM", "10:00 AM - 6:30 PM", "11:00 AM - 7:30 PM", "12:00 PM - 8:30 PM",
  "1:00 PM - 9:30 PM", "2:00 PM - 10:30 PM", "3:00 PM - 11:30 PM", "4:00 PM - 12:30 AM",
  "5:00 PM - 1:30 AM", "6:00 PM - 2:30 AM", "6:30 PM - 3:00 AM", "7:00 PM - 3:30 AM",
  "8:00 PM - 4:30 AM", "9:00 PM - 5:30 AM",
];

interface PersonalDetailsProps {
  employee: {
    name: string;
    department: string;
    jobTitle: string;
    jobCategory: string;
    jobType: string;
    profilePicture: string;
    shiftStartTime: string;
    shiftEndTime: string;
    gender: string;
    dateOfBirth: string;
    jobStatus: string;
  };
  departments: string[];
  jobTitles: string[];
  onProfilePictureChange: (file: File) => void;
  isEditable: boolean;
  onUpdate: (updatedEmployee: any) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  employee,
  departments,
  jobTitles,
  onProfilePictureChange,
  isEditable,
  onUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({
    ...employee,
    dateOfBirth: employee.dateOfBirth
      ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
      : "",
  });

  useEffect(() => {
    setEditedEmployee({
      ...employee,
      dateOfBirth: employee.dateOfBirth
        ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
        : "",
    });
  }, [employee]);

  const handleEditClick = () => {
    if (isEditable) {
      setEditedEmployee({
        ...employee,
        dateOfBirth: employee.dateOfBirth
          ? new Date(employee.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
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
    } else if (name === "shift") {
      const [start, end] = value.split(" - ");
      setEditedEmployee((prev) => ({
        ...prev,
        shiftStartTime: start || "",
        shiftEndTime: end || "",
      }));
    } else {
      setEditedEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdate = () => {
    onUpdate(editedEmployee);
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

  const formattedDate = employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ) : "N/A";

  const renderField = (label: string, icon: React.ReactNode, content: React.ReactNode) => (
      <div className="bg-alabaster-grey-50 p-4 rounded-xl border border-platinum-200">
          <div className="flex items-center gap-2 mb-2">
              <span className="text-gunmetal-400 text-sm">{icon}</span>
              <p className="text-xs font-bold text-slate-grey-500 uppercase tracking-wide">{label}</p>
          </div>
          {content}
      </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-platinum-200 overflow-hidden relative">
        <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">Personal Information</h2>
             {isEditable && !isEditing && (
                <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-platinum-200 text-gunmetal-700 text-sm font-bold rounded-lg hover:bg-gunmetal-900 hover:text-white transition-all shadow-sm"
                >
                <FaEdit /> Edit Details
                </button>
            )}
        </div>

      <div className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
             <div className="relative group">
                <div className="w-32 h-32 rounded-full p-1 bg-white border-2 border-platinum-200 shadow-sm relative overflow-visible">
                    <img
                    src={employee.profilePicture || profilePlaceholder}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                    />
                     {isEditable && (
                         <>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-gunmetal-900 text-white p-2.5 rounded-full hover:bg-gunmetal-700 transition-all shadow-lg border-4 border-white"
                                title="Change Profile Picture"
                            >
                                <FaCamera size={14} />
                            </button>
                             <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                         </>
                    )}
                </div>
             </div>
             <div className="flex-1 text-center md:text-left pt-2">
                 <h1 className="text-3xl font-bold text-gunmetal-900 mb-1">{employee.name || "Employee Name"}</h1>
                 <p className="text-lg text-slate-grey-500 font-medium flex items-center justify-center md:justify-start gap-2">
                    <FaBriefcase className="text-gunmetal-400" /> {employee.jobTitle || "Job Title"}
                 </p>
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                     <span className="px-3 py-1 bg-alabaster-grey-50 text-gunmetal-600 text-xs font-bold rounded-full border border-platinum-200 uppercase tracking-wide">
                        {employee.department || "No Dept"}
                     </span>
                      <span className="px-3 py-1 bg-alabaster-grey-50 text-gunmetal-600 text-xs font-bold rounded-full border border-platinum-200 uppercase tracking-wide">
                        {employee.jobType || "Full-Time"}
                     </span>
                 </div>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {renderField("Full Name", <FaUser />, 
                 isEditing ? (
                    <input
                        type="text"
                        name="name"
                        value={editedEmployee.name}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                 ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{employee.name || "N/A"}</p>
                 )
             )}

             {renderField("Job Title", <FaIdBadge />, 
                  isEditing ? (
                    <select
                        name="jobTitle"
                        value={editedEmployee.jobTitle}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    >
                        <option value="">Select Job Title</option>
                        {jobTitles.map((title) => (
                        <option key={title} value={title}>{title}</option>
                        ))}
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{employee.jobTitle || "N/A"}</p>
                  )
             )}

             {renderField("Department", <FaBuilding />, 
                  isEditing ? (
                    <select
                        name="department"
                        value={editedEmployee.department}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{employee.department || "N/A"}</p>
                  )
             )}

             {renderField("Job Category", <FaBriefcase />, 
                  isEditing ? (
                    <select
                        name="jobCategory"
                        value={editedEmployee.jobCategory}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    >
                        <option value="">Select Job Category</option>
                        {getCurrentDepartmentCategories().length > 0 ? (
                            getCurrentDepartmentCategories().map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))
                        ) : (
                            <option value="">No Categories Available</option>
                        )}
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{employee.jobCategory || "N/A"}</p>
                  )
             )}

             {renderField("Job Type", <FaBriefcase />, 
                  isEditing ? (
                    <select
                        name="jobType"
                        value={editedEmployee.jobType}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    >
                        <option value="">Select Job Type</option>
                        {["Full-Time", "Part-Time", "Remote", "Contract", "Internship"].map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{employee.jobType || "N/A"}</p>
                  )
             )}

             {renderField("Job Status", <FaBriefcase />, 
                  isEditing ? (
                    <select
                        name="jobStatus"
                        value={editedEmployee.jobStatus}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    >
                        <option value="">Select Job Status</option>
                        {["Probation", "Permanent"].map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{employee.jobStatus || "N/A"}</p>
                  )
             )}

            {renderField("Date of Birth", <FaCalendarAlt />, 
                  isEditing ? (
                     <input
                        type="date"
                        name="dateOfBirth"
                        value={editedEmployee.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{formattedDate}</p>
                  )
             )}
             
             {renderField("Gender", <FaUser />, 
                  isEditing ? (
                     <select
                        name="gender"
                        value={editedEmployee.gender}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    >
                        <option value="">Select Gender</option>
                        {["Male", "Female", "Other"].map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">{employee.gender || "N/A"}</p>
                  )
             )}

              {renderField("Shift Timings", <FaClock />, 
                  isEditing ? (
                     <select
                        name="shift"
                        value={
                            editedEmployee.shiftStartTime && editedEmployee.shiftEndTime
                                ? `${editedEmployee.shiftStartTime} - ${editedEmployee.shiftEndTime}`
                                : ""
                            }
                        onChange={handleInputChange}
                        className="w-full bg-white border border-platinum-300 rounded-lg px-3 py-2 text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20"
                    >
                        <option value="">Select Shift Timings</option>
                        {additionalShiftTimings.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                  ) : (
                    <p className="text-sm font-semibold text-gunmetal-800">
                        {employee.shiftStartTime && employee.shiftEndTime
                        ? `${employee.shiftStartTime} - ${employee.shiftEndTime}`
                        : "N/A"}
                    </p>
                  )
             )}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-platinum-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 bg-white border border-platinum-200 text-slate-grey-600 rounded-lg text-sm font-bold hover:bg-alabaster-grey-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-6 py-2.5 bg-gunmetal-900 text-white rounded-lg text-sm font-bold hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDetails;
