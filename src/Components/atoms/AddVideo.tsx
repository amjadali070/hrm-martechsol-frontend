// src/components/AddVideo.tsx

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface AddVideoProps {
  onSuccess: () => void; // Callback to handle post-submission actions
}

const AddVideo: React.FC<AddVideoProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateURL = (url: string): boolean => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // Protocol
        "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,})" + // Domain name
        "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // Port and path
        "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // Query string
        "(\\#[-a-zA-Z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form Validation
    if (!title || !description || !videoUrl || !downloadUrl) {
      alert("Please fill in all required fields."); // Replace with toast in real implementation
      return;
    }

    if (!validateURL(videoUrl)) {
      alert("Please enter a valid Video URL."); // Replace with toast
      return;
    }

    if (!validateURL(downloadUrl)) {
      alert("Please enter a valid Download URL."); // Replace with toast
      return;
    }

    setLoading(true);

    try {
      // Dummy API Call - Replace with actual endpoint
      // Assuming POST /api/videos to add a new video
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, videoUrl, downloadUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to add video.");
      }

      alert("Video added successfully!"); // Replace with toast
      onSuccess(); // Notify parent component to refresh or take other actions
    } catch (error: any) {
      console.error("Error adding video:", error);
      alert(error.message || "Failed to add video. Please try again."); // Replace with toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaPlus className="mr-2" /> Add New Training Video
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Video Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter video title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter video description"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Video URL */}
        <div>
          <label
            htmlFor="videoUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Video URL<span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://www.youtube.com/embed/VIDEO_ID"
            required
          />
        </div>

        {/* Download URL */}
        <div>
          <label
            htmlFor="downloadUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Download URL<span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="downloadUrl"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://www.example.com/videos/video.mp4"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {loading ? "Adding..." : "Add Video"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVideo;
