import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReactComponent as CelebrateIcon } from "../../assets/celebrateIcon.svg";

interface User {
  _id: string;
  name: string;
  personalDetails: {
    joiningDate: string;
    abbreviatedJobTitle: string;
  };
}

const WorkAnniversariesCard: React.FC = () => {
  const [anniversaries, setAnniversaries] = useState<User[]>([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/users/work-anniversaries`,
          {
            withCredentials: true,
          }
        );

        if (data.allAnniversaries) {
          // Sort the anniversaries based on the upcoming date
          const sortedAnniversaries = data.allAnniversaries.sort(
            (a: User, b: User) => {
              const aDate = new Date(a.personalDetails.joiningDate);
              const bDate = new Date(b.personalDetails.joiningDate);
              const currentYear = new Date().getFullYear();

              // Calculate next anniversary dates
              const nextAnniversaryA = new Date(aDate.setFullYear(currentYear));
              const nextAnniversaryB = new Date(bDate.setFullYear(currentYear));

              // If the anniversary has already passed this year, set to next year
              if (nextAnniversaryA < new Date()) {
                nextAnniversaryA.setFullYear(currentYear + 1);
              }
              if (nextAnniversaryB < new Date()) {
                nextAnniversaryB.setFullYear(currentYear + 1);
              }

              return nextAnniversaryA.getTime() - nextAnniversaryB.getTime();
            }
          );

          setAnniversaries(sortedAnniversaries);
        } else {
          console.error("Unexpected API response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching work anniversaries:", error);
      }
    };

    fetchUsers();
  }, [backendUrl]);

  const getOrdinalSuffix = (num: number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = num % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  };

  return (
    <div className="flex flex-col w-full md:w-6/12 max-md:ml-0 max-md:w-full px-5 py-8 bg-white rounded-xl max-md:mt-6">
      <div className="flex items-center justify-between p-3">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-black">
          Upcoming Work Anniversaries
        </h2>
        <button
          aria-label="View all work anniversaries"
          className="mt-4 sm:mt-0 px-6 py-2 text-sm sm:text-base text-center text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors duration-300"
        >
          View All
        </button>
      </div>

      <ul className="divide-y divide-gray-200">
        {anniversaries.map((user) => {
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
              className="flex items-center p-3 sm:p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-left w-10 h-10 sm:w-12 sm:h-12 bg-purple-900 rounded-lg text-white text-xl sm:text-2xl relative">
                <div className="relative inline-block text-md font-semibold ml-3">
                  {anniversaryYear}
                  <span className="absolute top-0 left-3.5 text-xs">
                    {getOrdinalSuffix(anniversaryYear)}
                  </span>
                </div>
              </div>
              <div className="ml-3 sm:ml-3 flex items-center flex-1">
                <span className="mr-3 text-purple-900">
                  <CelebrateIcon width={30} height={30} />
                </span>
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
                <span className="font-bold"> {anniversaryDate} </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WorkAnniversariesCard;
