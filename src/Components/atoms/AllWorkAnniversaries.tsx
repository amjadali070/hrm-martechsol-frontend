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
    "Lead Generation",
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
        const joiningDate = new Date(user.personalDetails.joiningDate);
        return joiningDate.getMonth() === monthIndex;
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
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-black">
          All Work Anniversaries
        </h2>
      </div>

      <div className="flex gap-4 mb-2 flex-nowrap overflow-x-auto">
        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-none focus:outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaUsers className="text-gray-400 mr-2" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="All">All Departments</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaUserTag className="text-gray-400 mr-2" />
          <select
            value={jobTitleFilter}
            onChange={(e) => setJobTitleFilter(e.target.value)}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
          >
            <option value="All">All Job Titles</option>
            {jobTitleOptions.map((jobTitle) => (
              <option key={jobTitle} value={jobTitle}>
                {jobTitle}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300 flex-grow">
          <FaCalendarAlt className="text-gray-400 mr-2" />
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full border-none focus:outline-none text-sm text-gray-600"
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
        <div className="text-center py-4">
          <div className="flex flex-col items-center">
            <FaSpinner size={30} className="text-blue-500 mb-4 animate-spin" />
          </div>
        </div>
      ) : filteredAnniversaries.length === 0 ? (
        <div className="flex flex-col items-center">
          <FaInbox size={30} className="text-gray-400 mb-4" />
          <span className="text-lg font-medium">No anniversaries found.</span>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {filteredAnniversaries.map((user) => {
            const joiningDate = new Date(user.personalDetails.joiningDate);
            const currentYear = new Date().getFullYear();
            const anniversaryYear = currentYear - joiningDate.getFullYear() + 1;

            const options: Intl.DateTimeFormatOptions = {
              month: "long",
              day: "numeric",
            };
            const anniversaryDate = joiningDate.toLocaleDateString(
              undefined,
              options
            );

            return (
              <li
                key={user._id}
                className="flex items-center p-2 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-left w-12 h-12 bg-purple-900 rounded-lg text-white text-xl relative">
                  <div className="relative inline-block text-md font-semibold ml-3">
                    {anniversaryYear}
                    <span className="absolute top-0 left-3.5 text-xs">
                      {getOrdinalSuffix(anniversaryYear)}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex items-center flex-1">
                  <span className="mr-3 text-purple-900">
                    <CelebrateIcon width={30} height={30} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-md font-bold text-black">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      {user.personalDetails.abbreviatedJobTitle}
                    </span>
                  </div>
                </div>
                <div className="ml-auto flex items-center text-sm font-semibold text-black">
                  <span className="font-bold">{anniversaryDate}</span>
                </div>
              </li>
            );
          })}
        </ul>
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
