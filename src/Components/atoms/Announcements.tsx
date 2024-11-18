import React from 'react';
import { IoEye } from "react-icons/io5";

interface Announcement {
  title: string;
  isHighlighted: boolean;
  date?: string;
}

interface AnnouncementsProps {
  announcements: Announcement[];
  onViewAll: () => void;
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements, onViewAll }) => {
  return (
    <section className="flex flex-col px-8 py-8 mt-8 w-full bg-white rounded-xl shadow-lg max-md:px-4 max-md:mt-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 ">
        <h2 className="text-2xl sm:text-2xl font-bold text-black">Announcements</h2>
        <button
          onClick={onViewAll}
          className="sm:mt-0 px-6 py-2 w-[15%] text-lg text-center text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors duration-300"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {announcements.map((announcement, index) => (
          <div
            key={index}
            className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-[30px] shadow ${
              announcement.isHighlighted
                ? 'bg-zinc-800 text-white'
                : 'bg-gray-100 text-zinc-700'
            }`}
          >
            <div className="flex flex-col">
              <h3 className="ml-3 text-md sm:text-md font-semibold">{announcement.title}</h3>
              {/* {announcement.date && (
                <span className="text-sm sm:text-base mt-1">{announcement.date}</span>
              )} */}
            </div>

            <div className="mt-2 sm:mt-0 mr-4">
              <IoEye size={24} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Announcements;