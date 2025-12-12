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
        await axiosInstance.patch(`/api/notices/${announcement._id}/status`, {
          status: "Read",
        });

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
      <section className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gunmetal-900 tracking-tight">
            Notices & News
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-rose-500 font-medium text-sm bg-rose-50 px-4 py-2 rounded-lg border border-rose-100">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300 group/card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gunmetal-900 tracking-tight">
          Notices & News
        </h2>
        <button
          onClick={handleViewAll}
          className="text-xs font-semibold text-slate-grey-500 hover:text-gunmetal-800 flex items-center gap-1 uppercase tracking-wider transition-colors"
        >
          View All <FaChevronRight size={8} className="translate-y-[0.5px]" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-1 min-h-[150px]">
          <FaSpinner className="text-gunmetal-500 animate-spin" size={24} />
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto custom-scroll pr-1">
          {announcements.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 text-slate-grey-400 min-h-[100px]">
              <div className="w-10 h-10 bg-alabaster-grey-50 rounded-full flex items-center justify-center mb-2">
                <IoEye className="text-slate-grey-300" size={20} />
              </div>
              <p className="text-sm">No new announcements.</p>
            </div>
          )}
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              onClick={() => openModal(announcement)}
              className={`group flex justify-between items-start p-3.5 rounded-xl cursor-pointer transition-all duration-200 border relative overflow-hidden ${
                announcement.status === "Unread"
                  ? "bg-white border-gunmetal-200 shadow-sm"
                  : "bg-alabaster-grey-50/50 border-transparent hover:bg-white hover:border-platinum-200 hover:shadow-sm"
              }`}
            >
              {/* Vertical accent for unread */}
              {announcement.status === "Unread" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gunmetal-500 rounded-l-xl"></div>
              )}

              <div className="flex flex-col gap-1 pr-4">
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-sm font-semibold line-clamp-1 ${
                      announcement.status === "Unread"
                        ? "text-gunmetal-900"
                        : "text-slate-grey-600"
                    }`}
                  >
                    {announcement.subject}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-grey-400">
                    {formatDate(announcement.date)}
                  </span>
                  {announcement.status === "Unread" && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-rose-50 text-rose-600 uppercase tracking-wide">
                      New
                    </span>
                  )}
                </div>
              </div>

              <div className="text-slate-grey-300 group-hover:text-gunmetal-500 transition-colors pt-0.5">
                <IoEye size={18} />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-gunmetal-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-2xl w-full max-w-2xl relative shadow-2xl max-h-[85vh] overflow-y-auto custom-scroll border border-platinum-200 flex flex-col">
            <div className="flex justify-end absolute top-4 right-4 z-10">
              <button
                onClick={closeModal}
                className="text-slate-grey-400 hover:text-gunmetal-800 transition-colors bg-white rounded-full p-1"
              >
                <IoCloseCircle size={28} />
              </button>
            </div>

            <div className="mb-6 border-b border-platinum-200 pb-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 bg-gunmetal-50 text-gunmetal-700 border border-gunmetal-100 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  Internal Notice
                </span>
                <span className="text-xs font-semibold text-slate-grey-500 uppercase tracking-wide">
                  {formatDate(selectedAnnouncement.date)}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gunmetal-900 leading-tight">
                {selectedAnnouncement.subject}
              </h3>
            </div>

            <div
              className="prose prose-sm max-w-none text-slate-grey-600 leading-relaxed font-normal"
              dangerouslySetInnerHTML={{
                __html: selectedAnnouncement.paragraph,
              }}
            />

            <div className="mt-8 pt-6 border-t border-platinum-100 flex justify-end">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 bg-gunmetal-900 text-white text-sm font-semibold rounded-lg hover:bg-gunmetal-800 transition-colors"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Announcements;
