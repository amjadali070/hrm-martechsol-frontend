import React, { useState } from 'react';
import { IoEye, IoCloseCircle } from "react-icons/io5";

interface Announcement {
  id: number;
  date: string;
  subject: string;
  status: 'Read' | 'Unread';
  paragraph: string;
}

interface AnnouncementsProps {
  announcements: Announcement[];
  onViewAll: () => void;
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements, onViewAll }) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const openModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setHighlightedId(announcement.id); // Set the clicked announcement's ID as highlighted
  };

  const closeModal = () => {
    setSelectedAnnouncement(null);
    setHighlightedId(null); // Reset the highlighted announcement
  };

  return (
    <section className="flex flex-col px-8 py-8 mt-8 w-full bg-white rounded-xl max-md:px-4 max-md:mt-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-2xl sm:text-2xl font-bold text-black">Announcements</h2>
        <button
          onClick={onViewAll}
          className="sm:mt-0 px-6 py-2 w-[15%] text-lg text-center text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors duration-300"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            onClick={() => openModal(announcement)}
            className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-[30px] cursor-pointer ${
              highlightedId === announcement.id
                ? 'bg-zinc-800 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="flex flex-col">
              <h3 className="ml-3 text-md sm:text-md font-semibold">{announcement.subject}</h3>
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

      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
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
              <strong>Date:</strong> {selectedAnnouncement.date}
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Message:</strong> {selectedAnnouncement.paragraph}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Announcements;