import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ReactComponent as CelebrateIcon } from "../../assets/celebrateIcon.svg";
import {
  FaSearch,
  FaUsers,
  FaUserTag,
  FaCalendarAlt,
  FaInbox,
  FaArrowLeft,
} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

interface User {
  _id: string;
  name: string;
  personalDetails: {
    joiningDate: string;
    abbreviatedJobTitle: string;
    department: string;
    jobTitle: string;
  };
  nextAnniversary: string;
}

const AllWorkAnniversaries: React.FC = () => {
  const navigate = useNavigate();
  const [anniversaries, setAnniversaries] = useState<User[]>([]);
  const [filteredAnniversaries, setFilteredAnniversaries] = useState<User[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [jobTitleFilter, setJobTitleFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const departmentOptions = [
    "Account Management",
    "Project Management",
    "Content Production",
    "Book Marketing",
    "Design Production",
    "SEO",
    "Creative Media",
    "Web Development",
    "Paid Advertising",
    "Software Production",
    "IT & Networking",
    "Human Resource",
    "Training & Development",
    "Admin",
    "Finance",
    "Brand Development",
    "Corporate Communication",
    "Lead Generation",
    "Administration",
  ];

  const jobTitleOptions = [
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
    "Chief Executive Officer",
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/users/work-anniversaries`,
          { withCredentials: true }
        );

        if (data.allAnniversaries) {
          setAnniversaries(data.allAnniversaries);
          setFilteredAnniversaries(data.allAnniversaries);
        } else {
          console.error("Unexpected API response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching work anniversaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [backendUrl]);

  useEffect(() => {
    let filtered = anniversaries;

    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter !== "All") {
      filtered = filtered.filter(
        (user) => user.personalDetails.department === departmentFilter
      );
    }

    if (jobTitleFilter !== "All") {
      filtered = filtered.filter(
        (user) => user.personalDetails.jobTitle === jobTitleFilter
      );
    }

    if (monthFilter !== "All") {
      const monthIndex = new Date(
        Date.parse(monthFilter + " 1, 2021")
      ).getMonth();
      filtered = filtered.filter((user) => {
        const nextAnniversary = new Date(user.nextAnniversary);
        return nextAnniversary.getMonth() === monthIndex;
      });
    }

    // Sort filtered results alphabetically by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredAnniversaries(filtered);
  }, [
    searchTerm,
    departmentFilter,
    jobTitleFilter,
    monthFilter,
    anniversaries,
  ]);

  /* 
   * Calculate Days Until Anniversary Helper 
   */
  const calculateDaysUntil = (nextAnniversary: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const anniversary = new Date(nextAnniversary);
    anniversary.setHours(0, 0, 0, 0);
    
    if (anniversary < today) {
        anniversary.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = anniversary.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const sections = React.useMemo(() => {
    const week: User[] = [];
    const month: User[] = [];
    const later: User[] = [];

    // Sort all filtered anniversaries by date first
    const sorted = [...filteredAnniversaries].sort((a, b) => {
       const dateA = new Date(a.nextAnniversary).getTime();
       const dateB = new Date(b.nextAnniversary).getTime();
       return dateA - dateB;
    });

    sorted.forEach((user) => {
        const days = calculateDaysUntil(user.nextAnniversary);
        if (days <= 7) {
            week.push(user);
        } else if (days <= 30) {
            month.push(user);
        } else {
            later.push(user);
        }
    });

    return { week, month, later };
  }, [filteredAnniversaries]);

  const renderUserCard = (user: User) => {
    const nextAnniversary = new Date(user.nextAnniversary);
    const joiningYear = new Date(user.personalDetails.joiningDate).getFullYear();
    const nextAnniversaryYear = nextAnniversary.getFullYear();
    const anniversaryYear = nextAnniversaryYear - joiningYear;

    const options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
    };
    const anniversaryDate = nextAnniversary.toLocaleDateString(undefined, options);

    const daysUntil = calculateDaysUntil(user.nextAnniversary);
    let dayLabel = "";
    if (daysUntil === 0) dayLabel = "Today";
    else if (daysUntil === 1) dayLabel = "Tomorrow";
    else dayLabel = `In ${daysUntil} days`;

    return (
        <div
        key={user._id}
        className="flex items-center p-4 bg-white border border-platinum-200 rounded-xl hover:shadow-md hover:border-gunmetal-200 transition-all group"
        >
        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-gunmetal-500 to-gunmetal-700 rounded-xl flex items-center justify-center text-white relative shadow-lg shadow-gunmetal-200/50">
            <span className="text-2xl font-bold">{anniversaryYear}</span>
            <span className="absolute top-1 right-2 text-[10px] opacity-80">
            {getOrdinalSuffix(anniversaryYear)}
            </span>
            <span className="absolute bottom-1 text-[8px] uppercase tracking-wider opacity-90">Year</span>
        </div>
        <div className="ml-4 flex-1">
            <div className="flex items-center gap-2 mb-1">
                <CelebrateIcon className="w-5 h-5 text-gunmetal-500" />
                <h3 className="text-sm font-bold text-gunmetal-900 group-hover:text-gunmetal-700 transition-colors">
                {user.name}
                </h3>
            </div>
            <p className="text-xs text-slate-grey-500 mb-2">
            {user.personalDetails.abbreviatedJobTitle}
            </p>
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gunmetal-600 bg-alabaster-grey-100 inline-block px-2 py-0.5 rounded-full border border-platinum-200">
                    {anniversaryDate}
                </span>
                {dayLabel && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        daysUntil === 0 ? "bg-green-100 text-green-700" :
                        daysUntil <= 7 ? "bg-blue-50 text-blue-600" : 
                        "bg-platinum-100 text-slate-grey-500"
                    }`}>
                        {dayLabel}
                    </span>
                 )}
            </div>
        </div>
        </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-grey-400 hover:text-gunmetal-800 hover:bg-platinum-100 rounded-lg transition-all"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gunmetal-900 tracking-tight">
            All Work Anniversaries
          </h2>
          <p className="text-sm font-medium text-slate-grey-500">
            Celebrate employee milestones and work anniversaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search Field */}
        <div className="relative group">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all placeholder:text-slate-grey-400"
          />
        </div>

        {/* Department Filter */}
        <div className="relative group">
          <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        {/* Job Title Filter */}
        <div className="relative group">
          <FaUserTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            value={jobTitleFilter}
            onChange={(e) => setJobTitleFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Job Titles</option>
            {jobTitleOptions.map((jobTitle) => (
              <option key={jobTitle} value={jobTitle}>
                {jobTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div className="relative group">
          <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400 group-focus-within:text-gunmetal-500 transition-colors" />
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-700 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Months</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 min-h-[300px]">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredAnniversaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-grey-400 border border-dashed border-platinum-200 rounded-xl bg-alabaster-grey-50/50">
          <FaInbox size={32} className="mb-3 opacity-30" />
          <span className="text-sm font-medium">No anniversaries found.</span>
        </div>
      ) : (
        <div className="space-y-8">
            {sections.week.length > 0 && (
            <div className="animate-fadeIn">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-1 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-gunmetal-900">Within a Week</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.week.map(renderUserCard)}
                </div>
            </div>
            )}

            {sections.month.length > 0 && (
            <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-1 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-gunmetal-900">Within a Month</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.month.map(renderUserCard)}
                </div>
            </div>
            )}

            {sections.later.length > 0 && (
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-1 bg-slate-400 rounded-full"></div>
                <h3 className="text-lg font-bold text-gunmetal-900">Later</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.later.map(renderUserCard)}
                </div>
            </div>
            )}
        </div>
      )}
    </div>
  );
};

export default AllWorkAnniversaries;

const getOrdinalSuffix = (num: number) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = num % 100;
  return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
};
