import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactComponent as CelebrateIcon } from "../../assets/celebrateIcon.svg";
import {
  FaSearch,
  FaUsers,
  FaUserTag,
  FaCalendarAlt,
  FaSpinner,
  FaInbox,
} from "react-icons/fa";

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

  return (
    <div className="flex flex-col w-full px-5 py-5 bg-white rounded-xl">
      <div className="flex items-center justify-between p-3">
        <h2 className="text-2xl font-extrabold tracking-wide text-gray-800">
          All Work Anniversaries
        </h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Field */}
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 flex-grow min-w-[200px]">
          <FaSearch className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-sm text-gray-700 placeholder-gray-500"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 flex-grow min-w-[200px]">
          <FaUsers className="text-gray-500 mr-3" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
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
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 flex-grow min-w-[200px]">
          <FaUserTag className="text-gray-500 mr-3" />
          <select
            value={jobTitleFilter}
            onChange={(e) => setJobTitleFilter(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
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
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 flex-grow min-w-[200px]">
          <FaCalendarAlt className="text-gray-500 mr-3" />
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-sm text-gray-700"
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
        <div className="flex justify-center items-center py-10">
          <FaSpinner size={40} className="text-blue-500 animate-spin" />
        </div>
      ) : filteredAnniversaries.length === 0 ? (
        <div className="flex flex-col items-center py-10">
          <FaInbox size={40} className="text-gray-400 mb-4" />
          <span className="text-lg font-medium text-gray-600">
            No anniversaries found.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAnniversaries.map((user) => {
            const nextAnniversary = new Date(user.nextAnniversary);
            const joiningYear = new Date(
              user.personalDetails.joiningDate
            ).getFullYear();
            const nextAnniversaryYear = nextAnniversary.getFullYear();
            const anniversaryYear = nextAnniversaryYear - joiningYear;

            const options: Intl.DateTimeFormatOptions = {
              month: "long",
              day: "numeric",
            };
            const anniversaryDate = nextAnniversary.toLocaleDateString(
              undefined,
              options
            );

            return (
              <div
                key={user._id}
                className="flex items-center p-4 bg-gray-100 rounded-lg"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center text-white text-2xl font-semibold relative">
                  <span>{anniversaryYear}</span>
                  <span className="absolute top-4 right-3 text-sm">
                    {getOrdinalSuffix(anniversaryYear)}
                  </span>
                </div>
                <div className="ml-4 flex-1 flex items-center">
                  <CelebrateIcon className="w-8 h-8 text-purple-900 mr-4" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {user.personalDetails.abbreviatedJobTitle}
                    </p>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm font-semibold text-gray-700">
                    {anniversaryDate}
                  </p>
                </div>
              </div>
            );
          })}
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
