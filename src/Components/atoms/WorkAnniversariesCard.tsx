import React from "react";
import { MdCelebration } from "react-icons/md";

interface Anniversary {
  id: number;
  name: string;
  title: string;
  position: string;
}

const anniversaries: Anniversary[] = [
  {
    id: 1,
    name: "Syed Hamza Ahmed Naqvi",
    title: "1st",
    position: "Senior Manager",
  },
  { id: 2, name: "Sameer Wali", title: "2nd", position: "Senior Executive" },
  { id: 3, name: "Hammad Faheem", title: "3rd", position: "Manager" },
  { id: 4, name: "Rameez Abbas", title: "4th", position: "Vice President" },
  { id: 5, name: "Amjad Ali", title: "5th", position: "Assistant Manager" },
];

const WorkAnniversariesCard: React.FC = () => {
  return (
    <div className="w-full mx-auto bg-white text-black rounded-lg border border-gray-300 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-purple-900">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide text-white">
          Upcoming Work Anniversaries
        </h2>
        <button
          aria-label="View all work anniversaries"
          className="bg-white text-purple-800 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-gray-100 transition"
        >
          View All
        </button>
      </div>

      <ul className="divide-y divide-gray-200">
        {anniversaries.map((item) => (
          <li
            key={item.id}
            className="flex items-center p-3 sm:p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-900 rounded-full text-white text-xl sm:text-2xl">
              <MdCelebration />
            </div>

            <div className="ml-3 sm:ml-4 flex-1">
              <p className="text-sm sm:text-md font-bold text-black">
                {item.name}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                {item.position}
              </p>
            </div>

            <div className="ml-auto text-sm sm:text-lg font-semibold text-black">
              {item.title}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkAnniversariesCard;
