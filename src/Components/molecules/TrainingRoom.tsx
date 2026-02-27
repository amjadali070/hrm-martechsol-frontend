import React, { useState } from "react";
import {
  FaPlay,
  FaDownload,
  FaChalkboardTeacher,
  FaPlus,
  FaVideo,
} from "react-icons/fa";
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
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 mb-8 overflow-hidden">
      {/* Header */}
      <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
            <FaChalkboardTeacher className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Training Room
            </h2>
            <p className="text-sm text-slate-grey-500">
              Access training materials and video tutorials.
            </p>
          </div>
        </div>

        {canAddVideo && (
          <button
            onClick={openAddVideoModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gunmetal-900 text-white text-sm font-bold rounded-lg hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20"
          >
            <FaPlus size={12} /> Add New Video
          </button>
        )}
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyVideos.map((video) => (
            <div
              key={video.id}
              className="group bg-white rounded-xl border border-platinum-200 shadow-sm hover:shadow-md hover:border-gunmetal-200 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="relative aspect-video bg-alabaster-grey-50 border-b border-platinum-200 flex items-center justify-center group-hover:bg-gunmetal-50 transition-colors">
                <FaVideo className="text-4xl text-platinum-300 group-hover:text-gunmetal-200 transition-colors" />
                <button
                  onClick={() => openVideoModal(video)}
                  className="absolute inset-0 flex items-center justify-center bg-gunmetal-900/0 group-hover:bg-gunmetal-900/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <div className="p-4 bg-white rounded-full shadow-lg text-gunmetal-900 transform scale-90 group-hover:scale-100 transition-transform">
                    <FaPlay className="pl-1" />
                  </div>
                </button>
              </div>

              <div className="p-5 flex flex-col grow">
                <h2 className="text-lg font-bold text-gunmetal-900 mb-2 line-clamp-2">
                  {video.title}
                </h2>
                <p className="text-sm text-slate-grey-500 mb-4 line-clamp-3">
                  {video.description}
                </p>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-platinum-100">
                  <button
                    onClick={() => openVideoModal(video)}
                    className="text-sm font-semibold text-gunmetal-600 hover:text-gunmetal-900 flex items-center gap-2 transition-colors"
                  >
                    <FaPlay size={12} /> Watch Now
                  </button>
                  <a
                    href={video.downloadUrl}
                    download
                    className="p-2 text-slate-grey-400 hover:text-gunmetal-600 hover:bg-platinum-50 rounded-lg transition-all"
                    title="Download Resource"
                  >
                    <FaDownload size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
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
