import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBirthdayCake } from "react-icons/fa";

interface User {
  _id: string;
  name: string;
  personalDetails: {
    dateOfBirth: string;
    abbreviatedJobTitle: string;
  };
}

const UpcomingBirthdaysCard: React.FC = () => {
  const [birthdays, setBirthdays] = useState<User[]>([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/users/upcoming-birthdays`,
          {
            withCredentials: true,
          }
        );

        if (data.upcomingBirthdays) {
          setBirthdays(data.upcomingBirthdays);
        } else {
          console.error("Unexpected API response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching upcoming birthdays:", error);
      }
    };

    fetchBirthdays();
  }, [backendUrl]);

  return (
    <div className="flex flex-col w-full md:w-6/12 max-md:ml-0 max-md:w-full px-5 py-8 bg-white rounded-xl max-md:mt-6">
      <div className="flex items-center justify-between p-3">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-black">
          Upcoming Birthdays
        </h2>
        <button
          aria-label="View all work anniversaries"
          className="mt-4 sm:mt-0 px-6 py-2 text-sm sm:text-base text-center text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors duration-300"
        >
          View All
        </button>
      </div>

      <ul className="divide-y divide-gray-200">
        {birthdays.map((user) => {
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
              className="flex items-center p-3 sm:p-4 hover:bg-gray-50 transition"
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
                <span className="font-bold"> {birthdayDate} </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UpcomingBirthdaysCard;
