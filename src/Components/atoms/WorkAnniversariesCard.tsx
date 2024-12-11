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
  { id: 2, name: "Rameez Abbas", title: "4th", position: "Vice President" },
  { id: 3, name: "Amjad Ali", title: "5th", position: "Assistant Manager" },
];

const WorkAnniversariesCard: React.FC = () => {
  return (
    <div className="flex flex-col w-full md:w-6/12 max-md:ml-0 max-md:w-full px-5 py-8 bg-white rounded-xl max-md:mt-6">
      <div className="flex items-center justify-between p-3 ">
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
        {anniversaries.map((item) => (
          <li
            key={item.id}
            className="flex items-center p-3 sm:p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-900 rounded-full text-white text-xl sm:text-2xl">
              <MdCelebration />
            </div>

            <div className="ml-3 sm:ml-4 flex-1">
              <p className="text-md sm:text-md font-bold text-black">
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
