import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoEye, IoCloseCircle } from "react-icons/io5";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router";
import { FaSpinner } from "react-icons/fa";

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
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/notices`, {
          withCredentials: true,
        });

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
  }, [backendUrl]);

  const openModal = async (announcement: Announcement) => {
    try {
      const config = {
        withCredentials: true,
      };

      if (announcement.status === "Unread") {
        await axios.patch(
          `${backendUrl}/api/notices/${announcement._id}/status`,
          { status: "Read" },
          config
        );

        setAnnouncements((prev) =>
          prev.map((a) =>
            a._id === announcement._id ? { ...a, status: "Read" } : a
          )
        );
      }

      setSelectedAnnouncement(announcement);
      setHighlightedId(announcement._id);
    } catch (err) {
      console.error("Failed to update announcement status", err);
    }
  };

  const closeModal = () => {
    setSelectedAnnouncement(null);
    setHighlightedId(null);
  };

  const handleViewAll = () => navigate("/notifications");

  if (error) {
    return (
      <section className="flex flex-col w-full md:w-6/12 max-md:ml-0 max-md:w-full px-8 py-8 bg-white rounded-xl max-md:px-4 max-md:mt-6">
        <div className="text-center text-red-600">{error}</div>
      </section>
    );
  }

  return (
    <section className="flex flex-col w-full md:w-6/12 max-md:ml-0 max-md:w-full bg-white rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-2xl sm:text-2xl font-bold text-black">
          Announcements
        </h2>
        <button
          onClick={handleViewAll}
          className="mt-4 sm:mt-0 px-6 py-2 text-sm sm:text-base text-center text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors duration-300"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div
          className="flex justify-center items-center"
          style={{ height: "180px" }}
        >
          <FaSpinner className="text-blue-500 animate-spin" size={30} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {announcements.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              No announcements found.
            </div>
          )}
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              onClick={() => openModal(announcement)}
              className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-[30px] cursor-pointer ${
                highlightedId === announcement._id
                  ? "bg-zinc-800 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="flex flex-col">
                <h3 className="ml-3 text-md sm:text-md font-semibold">
                  {announcement.subject}
                </h3>
              </div>

              <div className="mt-2 sm:mt-0 mr-4">
                <IoEye
                  size={24}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(announcement);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-blue-600 hover:text-blue-500 transition duration-200"
            >
              <IoCloseCircle size={28} />
            </button>
            <p className="text-xl font-bold text-purple-900 mb-4">
              {selectedAnnouncement.subject}
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Date:</strong> {formatDate(selectedAnnouncement.date)}
            </p>
            <div
              className="text-gray-700 break-words"
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
