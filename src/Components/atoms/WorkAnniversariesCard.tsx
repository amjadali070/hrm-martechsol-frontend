import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

interface User {
  _id: string;
  name: string;
  personalDetails: {
    joiningDate: string;
    abbreviatedJobTitle: string;
  };
  nextAnniversary: string;
}

const WorkAnniversariesCard: React.FC = () => {
  const [anniversaries, setAnniversaries] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/users/work-anniversaries`
        );

        if (data.allAnniversaries) {
          const sortedAnniversaries = data.allAnniversaries.sort(
            (a: User, b: User) => {
              const aDate = new Date(a.nextAnniversary);
              const bDate = new Date(b.nextAnniversary);
              return aDate.getTime() - bDate.getTime();
            }
          );
          setAnniversaries(sortedAnniversaries.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching work anniversaries:", error);
      }
    };

    fetchUsers();
  }, []);

  const getOrdinalSuffix = (num: number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = num % 100;
    if (value >= 11 && value <= 13) return "th";
    return suffixes[value % 10] || "th";
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gunmetal-900 tracking-tight">
          Work Anniversaries
        </h2>
        <button
          onClick={() => navigate("/all-anniversaries")}
          className="text-xs font-semibold text-gunmetal-600 hover:text-gunmetal-800 flex items-center gap-1 uppercase tracking-wider transition-colors"
        >
          View All <FaChevronRight size={8} />
        </button>
      </div>

      {anniversaries.length === 0 && (
         <div className="flex flex-col items-center justify-center flex-1 text-slate-grey-400 h-32">
            <span className="text-3xl mb-3 opacity-30 text-gunmetal-300">🎉</span>
            <p className="text-sm font-medium">No upcoming anniversaries.</p>
         </div>
      )}

      <ul className="space-y-2">
        {anniversaries.map((user) => {
          const nextAnniversary = new Date(user.nextAnniversary);
          const joiningYear = new Date(user.personalDetails.joiningDate).getFullYear();
          const nextAnniversaryYear = nextAnniversary.getFullYear();
          const anniversaryYear = nextAnniversaryYear - joiningYear;
          const anniversaryDate = nextAnniversary.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });

          return (
            <li
              key={user._id}
              className="flex items-center p-3 rounded-lg hover:bg-alabaster-grey-50 transition-colors border border-transparent hover:border-platinum-200 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-amber-100 to-amber-50 text-amber-600 rounded-lg relative shrink-0 border border-amber-200 shadow-sm">
                <div className="text-sm font-bold flex items-start leading-none">
                  {anniversaryYear}
                  <span className="text-[8px] font-bold ml-[1px] -mt-[2px]">{getOrdinalSuffix(anniversaryYear)}</span>
                </div>
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
                {anniversaryDate}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WorkAnniversariesCard;
