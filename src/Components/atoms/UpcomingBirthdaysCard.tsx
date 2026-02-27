import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { FaBirthdayCake, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  personalDetails: {
    dateOfBirth: string;
    abbreviatedJobTitle: string;
  };
  nextBirthday: string;
}

const UpcomingBirthdaysCard: React.FC = () => {
  const [birthdays, setBirthdays] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/users/upcoming-birthdays`
        );

        if (data.upcomingBirthdays) {
          setBirthdays(data.upcomingBirthdays);
        }
      } catch (error) {
        console.error("Error fetching upcoming birthdays:", error);
      }
    };

    fetchBirthdays();
  }, []);

  const topFiveBirthdays = birthdays.slice(0, 5);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gunmetal-900 tracking-tight">
          Upcoming Birthdays
        </h2>
        <button
          onClick={() => navigate("/all-upcoming-birthdays")}
          className="text-xs font-semibold text-gunmetal-600 hover:text-gunmetal-800 flex items-center gap-1 uppercase tracking-wider transition-colors"
        >
          View All <FaChevronRight size={8} />
        </button>
      </div>

      {topFiveBirthdays.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-grey-400 h-32">
          <FaBirthdayCake size={32} className="mb-3 opacity-30 text-gunmetal-300" />
          <p className="text-sm font-medium">No upcoming birthdays.</p>
        </div>
      )}

      <ul className="space-y-2">
        {topFiveBirthdays.map((user) => {
          const dateOfBirth = new Date(user.personalDetails.dateOfBirth);
          const birthdayDate = dateOfBirth.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });

          return (
            <li
              key={user._id}
              className="flex items-center p-3 rounded-lg hover:bg-alabaster-grey-50 transition-colors border border-transparent hover:border-platinum-200 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-rose-50 text-rose-500 rounded-lg shrink-0 border border-rose-100">
                <FaBirthdayCake size={16} />
              </div>
              
              <div className="ml-3 flex-1">
                <span className="text-sm font-semibold text-gunmetal-800 block">
                  {user.name}
                </span>
                <span className="text-xs text-slate-grey-500 block">
                  {user.personalDetails.abbreviatedJobTitle}
                </span>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider text-gunmetal-600 bg-white border border-platinum-200 px-2 py-1 rounded shadow-sm">
                {birthdayDate}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UpcomingBirthdaysCard;
