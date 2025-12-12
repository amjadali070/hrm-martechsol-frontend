import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { IoEye, IoCloseCircle } from "react-icons/io5";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router";
import { FaSpinner, FaChevronRight } from "react-icons/fa";

interface Announcement {
  _id: string;
  date: string;
  subject: string;
  status: "Read" | "Unread";
  paragraph: string;
}

const Announcements: React.FC = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/notices`);

        const sortedAnnouncements = response.data.notices
          .sort(
            (a: Announcement, b: Announcement) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 3);

        setAnnouncements(sortedAnnouncements);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch announcements");
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const openModal = async (announcement: Announcement) => {
    try {
      if (announcement.status === "Unread") {
        await axiosInstance.patch(
          `/api/notices/${announcement._id}/status`,
          { status: "Read" }
        );

        setAnnouncements((prev) =>
          prev.map((a) =>
            a._id === announcement._id ? { ...a, status: "Read" } : a
          )
        );
      }

      setSelectedAnnouncement(announcement);
    } catch (err) {
      console.error("Failed to update announcement status", err);
    }
  };

  const closeModal = () => {
    setSelectedAnnouncement(null);
  };

  const handleViewAll = () => navigate("/notifications");

  if (error) {
    return (
      <section className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col h-full">
        <div className="text-center text-red-600 font-medium text-sm">{error}</div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gunmetal-900 tracking-tight">
          Notices & News
        </h2>
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-gunmetal-600 hover:text-gunmetal-800 flex items-center gap-1 uppercase tracking-wider transition-colors"
        >
          View All <FaChevronRight size={8} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-1 min-h-[150px]">
          <FaSpinner className="text-gunmetal-500 animate-spin" size={24} />
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1">
          {announcements.length === 0 && (
            <div className="text-center text-slate-grey-400 my-auto text-sm">
              No new announcements.
            </div>
          )}
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              onClick={() => openModal(announcement)}
              className={`group flex justify-between items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                announcement.status === "Unread"
                  ? "bg-white border-gunmetal-200 shadow-sm"
                  : "bg-alabaster-grey-50 border-transparent hover:bg-white hover:border-platinum-200 hover:shadow-sm"
              }`}
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                   {announcement.status === "Unread" && (
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                   )}
                   <h3 className={`text-sm font-semibold ${
                     announcement.status === "Unread" ? "text-gunmetal-900" : "text-slate-grey-600"
                   }`}>
                     {announcement.subject}
                   </h3>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-medium text-slate-grey-400 ml-0 sm:ml-4">{formatDate(announcement.date)}</span>
              </div>

              <div className="text-slate-grey-400 group-hover:text-gunmetal-600 transition-colors">
                <IoEye size={18} />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-carbon-black-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn border border-platinum-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-grey-400 hover:text-gunmetal-800 transition duration-200"
            >
              <IoCloseCircle size={24} />
            </button>
            <span className="inline-block px-3 py-1 bg-gunmetal-50 text-gunmetal-700 border border-gunmetal-100 rounded-md text-[10px] font-bold uppercase tracking-wider mb-4">
              Internal Notice
            </span>
            <h3 className="text-2xl font-bold text-gunmetal-900 mb-2 font-display">
              {selectedAnnouncement.subject}
            </h3>
            <p className="text-xs text-slate-grey-500 mb-6 border-b border-platinum-100 pb-4 font-medium uppercase tracking-wide">
              Posted on {formatDate(selectedAnnouncement.date)}
            </p>
            <div
              className="prose prose-sm max-w-none text-gunmetal-700"
              dangerouslySetInnerHTML={{
                __html: selectedAnnouncement.paragraph,
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Announcements;
