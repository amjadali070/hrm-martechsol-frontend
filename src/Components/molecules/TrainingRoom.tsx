// src/components/TrainingRoom.tsx

import React, { useState } from "react";
import { FaPlay, FaDownload, FaUserShield, FaPlus } from "react-icons/fa";
import VideoModal from "../atoms/VideoModal";
import Modal from "../atoms/AddVideoModal";
import AddVideo from "../atoms/AddVideo";
import useUser from "../../hooks/useUser";

interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string; // Embed URL or direct video link
  downloadUrl: string; // Direct download link
}

const dummyVideos: Video[] = [
  {
    id: 1,
    title: "Introduction to React",
    description:
      "Learn the basics of React.js and build your first application.",
    videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA", // YouTube embed link
    downloadUrl: "https://www.example.com/videos/react-intro.mp4", // Dummy download link
  },
  {
    id: 2,
    title: "Advanced TypeScript",
    description:
      "Deep dive into advanced TypeScript features for robust applications.",
    videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs",
    downloadUrl: "https://www.example.com/videos/advanced-typescript.mp4",
  },
  {
    id: 3,
    title: "Tailwind CSS Essentials",
    description:
      "Master the fundamentals of Tailwind CSS for rapid UI development.",
    videoUrl: "https://www.youtube.com/embed/dFgzHOX84xQ",
    downloadUrl: "https://www.example.com/videos/tailwind-css.mp4",
  },
  // Add more dummy videos as needed
];

const TrainingRoom: React.FC = () => {
  const { user, loading } = useUser(); // Fetch user data
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  const [isAddVideoModalOpen, setIsAddVideoModalOpen] =
    useState<boolean>(false);

  const openVideoModal = (video: Video) => {
    setCurrentVideo(video);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setCurrentVideo(null);
    setIsVideoModalOpen(false);
  };

  const openAddVideoModal = () => {
    setIsAddVideoModalOpen(true);
  };

  const closeAddVideoModal = () => {
    setIsAddVideoModalOpen(false);
  };

  const handleAddVideoSuccess = () => {
    // Here, you can refresh the video list if fetching from an API
    // For now, we'll just close the modal
    closeAddVideoModal();
    alert("Video added successfully!"); // Replace with toast for better UX
  };

  // Determine if the user is allowed to see the "Add New Video" button
  const canAddVideo =
    !loading && user && (user.role === "HR" || user.role === "SuperAdmin");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FaUserShield className="mr-2" /> Training Room
        </h1>
        {canAddVideo && (
          <button
            onClick={openAddVideoModal}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <FaPlus className="mr-2" /> Add New Video
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
              <p className="text-gray-600 mb-4">{video.description}</p>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => openVideoModal(video)}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <FaPlay className="mr-2" /> Play
              </button>
              <a
                href={video.downloadUrl}
                download
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <FaDownload className="mr-2" /> Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {currentVideo && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={closeVideoModal}
          videoUrl={currentVideo.videoUrl}
          title={currentVideo.title}
        />
      )}

      {/* Add Video Modal */}
      <Modal
        isOpen={isAddVideoModalOpen}
        onClose={closeAddVideoModal}
        title="Add New Video"
      >
        <AddVideo onSuccess={handleAddVideoSuccess} />
      </Modal>
    </div>
  );
};

export default TrainingRoom;
