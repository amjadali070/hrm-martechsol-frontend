import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaUsers,
  FaUserTag,
  FaCalendarAlt,
  FaBirthdayCake,
  FaSpinner,
  FaInbox,
} from "react-icons/fa";

interface User {
  _id: string;
  name: string;
  personalDetails: {
    dateOfBirth: string;
    abbreviatedJobTitle: string;
    department: string;
    jobTitle: string;
  };
  nextBirthday: string;
}

const AllUpcomingBirthdays: React.FC = () => {
  const [birthdays, setBirthdays] = useState<User[]>([]);
  const [filteredBirthdays, setFilteredBirthdays] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTitleFilter, setJobTitleFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
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

  useEffect(() => {
    const fetchBirthdays = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/users/upcoming-birthdays`,
          {
            withCredentials: true,
          }
        );

        if (data.upcomingBirthdays) {
          setBirthdays(data.upcomingBirthdays);
          setFilteredBirthdays(data.upcomingBirthdays);
          setNotFound(data.upcomingBirthdays.length === 0);
        } else {
          console.error("Unexpected API response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching upcoming birthdays:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, [backendUrl]);

  useEffect(() => {
    let filtered = birthdays;

    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (jobTitleFilter !== "All") {
      filtered = filtered.filter(
        (user) => user.personalDetails.jobTitle === jobTitleFilter
      );
    }

    if (departmentFilter !== "All") {
      filtered = filtered.filter(
        (user) => user.personalDetails.department === departmentFilter
      );
    }

    if (monthFilter !== "All") {
      filtered = filtered.filter((user) => {
        const dateOfBirth = new Date(user.personalDetails.dateOfBirth);
        const monthName = dateOfBirth.toLocaleString("default", {
          month: "long",
        });
        return monthName === monthFilter;
      });
    }

    setFilteredBirthdays(filtered);
    setNotFound(filtered.length === 0);
  }, [searchTerm, jobTitleFilter, departmentFilter, monthFilter, birthdays]);

  const sortedBirthdays = [...filteredBirthdays].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="flex flex-col w-full px-5 py-4 bg-white rounded-xl">
      <div className="flex items-center justify-between p-3">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-black">
          All Upcoming Birthdays
        </h2>
      </div>

      <div className="flex gap-4 mb-4 flex-nowrap overflow-x-auto">
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
        <div className="text-center text-gray-500">
          <div className="flex flex-col items-center">
            <FaSpinner size={30} className="text-blue-500 mb-4 animate-spin" />
          </div>
        </div>
      ) : notFound ? (
        <div className="flex flex-col items-center">
          <FaInbox size={30} className="text-gray-400 mb-4" />
          <span className="text-lg font-medium">
            No upcoming birthdays found.
          </span>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {sortedBirthdays.map((user) => {
            const dateOfBirth = new Date(user.personalDetails.dateOfBirth);
            const options: Intl.DateTimeFormatOptions = {
              month: "long",
              day: "numeric",
            };
            const birthdayDate = dateOfBirth.toLocaleDateString(
              undefined,
              options
            );

            return (
              <li
                key={user._id}
                className="flex items-center p-1 sm:p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-900 rounded-lg text-white text-xl sm:text-2xl relative">
                  <FaBirthdayCake size={25} />
                </div>
                <div className="ml-3 sm:ml-3 flex items-center flex-1">
                  <div className="flex flex-col">
                    <span className="text-md sm:text-md font-bold text-black">
                      {user.name}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {user.personalDetails.abbreviatedJobTitle}
                    </span>
                  </div>
                </div>

                <div className="ml-auto flex items-center text-sm sm:text-lg font-semibold text-black">
                  <span className="font-bold">{birthdayDate}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AllUpcomingBirthdays;
