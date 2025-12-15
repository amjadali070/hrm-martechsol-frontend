import { useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaBriefcase, 
  FaCalendarAlt, 
  FaUserShield,
  FaSpinner,
  FaBuilding,
  FaLayerGroup
} from "react-icons/fa";

const AddNewEmployee: React.FC = () => {
  const departments: { [key: string]: string[] } = {
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
    "Lead Generation": ["Digital Marketing", "Book Marketing"],
    Administration: [],
  };

  const jobTitles = [
    "Executive",
    "Senior Executive",
    "Assistant Manager",
    "Associate Manager",
    "Manager",
    "Senior Manager",
    "Assistant Vice President",
    "Associate Vice President",
    "Vice President",
    "Senior Vice President",
    "President",
    "Head of Department",
    "Head Of Project Management",
    "Cheif Executive Officer",
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: Object.keys(departments)[0],
    jobCategory: departments[Object.keys(departments)[0]][0] || "",
    jobTitle: jobTitles[0],
    jobType: "Full-Time",
    role: "normal",
    joiningDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as {
      name: keyof typeof formData;
      value: string;
    };

    if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        jobCategory: departments[value][0] || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
      department,
      jobCategory,
      jobTitle,
      jobType,
      role,
      joiningDate,
    } = formData;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !department ||
      !jobTitle ||
      !jobType ||
      !role ||
      !joiningDate
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (departments[department].length > 0 && !jobCategory) {
      setErrorMessage("Please select a job category for this department.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const payload = {
        name,
        email,
        password,
        department,
        jobTitle,
        jobType,
        role,
        joiningDate,
        ...(departments[department].length > 0 && { jobCategory }),
      };

      await axiosInstance.post(
        `${backendUrl}/api/users/register`,
        payload,
        config
      );

      toast.success("Employee added successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: Object.keys(departments)[0],
        jobCategory: departments[Object.keys(departments)[0]][0] || "",
        jobTitle: jobTitles[0],
        jobType: "Full-Time",
        role: "normal",
        joiningDate: "",
      });
    } catch (error: any) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Failed to add employee. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for Input Groups
  const InputGroup = ({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) => (
      <div className="mb-4">
          <label className="block text-xs font-bold text-slate-grey-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Icon className="text-gunmetal-500" /> {label} <span className="text-red-500">*</span>
          </label>
          {children}
      </div>
  );

  return (
    <div className="min-h-screen bg-alabaster-grey-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-platinum-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gunmetal-900 px-8 py-6 text-white text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Onboard New Talent</h2>
            <p className="text-platinum-400 mt-2 text-sm uppercase">Create a new employee profile and access credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
            {/* Section: Personal Info */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gunmetal-900 border-b border-platinum-200 pb-2 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Full Name" icon={FaUser}>
                         <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gunmetal-500 focus:border-transparent transition-all"
                            placeholder="e.g. John Doe"
                         />
                    </InputGroup>
                    <InputGroup label="Email Address" icon={FaEnvelope}>
                         <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gunmetal-500 focus:border-transparent transition-all"
                            placeholder="e.g. john.doe@company.com"
                         />
                    </InputGroup>
                </div>
            </div>

            {/* Section: Credentials */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gunmetal-900 border-b border-platinum-200 pb-2 mb-6">Security Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <InputGroup label="Password" icon={FaLock}>
                         <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gunmetal-500 focus:border-transparent transition-all"
                            placeholder="Min. 6 characters"
                         />
                    </InputGroup>
                     <InputGroup label="Confirm Password" icon={FaLock}>
                         <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gunmetal-500 focus:border-transparent transition-all"
                            placeholder="Re-enter password"
                         />
                    </InputGroup>
                </div>
            </div>

            {/* Section: Employment Details */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gunmetal-900 border-b border-platinum-200 pb-2 mb-6">Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Department" icon={FaBuilding}>
                         <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gunmetal-500 focus:border-transparent transition-all cursor-pointer"
                         >
                             {Object.keys(departments).map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                             ))}
                         </select>
                    </InputGroup>

                    {departments[formData.department].length > 0 && (
                        <InputGroup label="Job Category" icon={FaLayerGroup}>
                            <select
                                name="jobCategory"
                                value={formData.jobCategory}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gunmetal-500 focus:border-transparent transition-all cursor-pointer"
                            >
                                {departments[formData.department].map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </InputGroup>
                    )}

                     <InputGroup label="Job Title" icon={FaBriefcase}>
                        <select
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gunmetal-500 focus:border-transparent transition-all cursor-pointer"
                        >
                            {jobTitles.map((title) => (
                                <option key={title} value={title}>{title}</option>
                            ))}
                        </select>
                    </InputGroup>

                    <InputGroup label="Job Type" icon={FaBriefcase}>
                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gunmetal-500 focus:border-transparent transition-all cursor-pointer"
                        >
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Remote">Remote</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </InputGroup>
                    
                    <InputGroup label="User Role" icon={FaUserShield}>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gunmetal-500 focus:border-transparent transition-all cursor-pointer"
                        >
                            <option value="normal">Employee (Standard)</option>
                            <option value="HR">HR Manager</option>
                            <option value="manager">Project Manager</option>
                            <option value="SuperAdmin">Super Administrator</option>
                        </select>
                    </InputGroup>

                    <InputGroup label="Joining Date" icon={FaCalendarAlt}>
                        <input
                            type="date"
                            name="joiningDate"
                            value={formData.joiningDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-alabaster-grey-50 border border-platinum-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gunmetal-500 focus:border-transparent transition-all"
                        />
                    </InputGroup>
                </div>
            </div>

            {errorMessage && (
                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm font-medium border border-red-200 animate-fadeIn">
                    {errorMessage}
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-gunmetal-900 text-white font-bold rounded-xl hover:bg-gunmetal-800 transition-all shadow-lg hover:shadow-gunmetal-500/30 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {isSubmitting ? <FaSpinner className="animate-spin text-lg" /> : <FaUser className="text-lg" />}
                    <span>{isSubmitting ? "Processing..." : "Create Employee Account"}</span>
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};

export default AddNewEmployee;
