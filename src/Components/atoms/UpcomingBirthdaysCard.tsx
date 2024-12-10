import React from "react";
import { FaBirthdayCake } from "react-icons/fa";

interface Birthday {
  id: number;
  name: string;
  title: string;
  birthdayDate: string;
}

const birthdays: Birthday[] = [
  {
    id: 1,
    name: "Syed Hamza Ahmed Naqvi",
    title: "1st",
    birthdayDate: "January 15",
  },
  { id: 2, name: "Sameer Wali", title: "2nd", birthdayDate: "February 20" },
  { id: 3, name: "Hammad Faheem", title: "3rd", birthdayDate: "March 10" },
  { id: 4, name: "Rameez Abbas", title: "4th", birthdayDate: "April 5" },
  { id: 5, name: "Amjad Ali", title: "5th", birthdayDate: "May 25" },
];

const UpcomingBirthdaysCard: React.FC = () => {
  return (
    <div className="w-full mx-auto bg-white rounded-lg border border-gray-300 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-purple-900">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-white">
          Upcoming Birthdays
        </h2>
        <button className="bg-white text-purple-900 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-gray-100 transition">
          View All
        </button>
      </div>

      <ul className="divide-y divide-gray-300">
        {birthdays.map((item) => (
          <li
            key={item.id}
            className="flex items-center p-3 sm:p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-900 rounded-full text-white text-xl sm:text-2xl">
              <FaBirthdayCake />
            </div>

            <div className="ml-3 sm:ml-4 flex-1">
              <p className="text-sm sm:text-md font-bold text-gray-800">
                {item.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">{item.title}</p>
            </div>

            <div className="ml-auto text-sm sm:text-lg font-semibold text-gray-800">
              {item.birthdayDate}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingBirthdaysCard;
