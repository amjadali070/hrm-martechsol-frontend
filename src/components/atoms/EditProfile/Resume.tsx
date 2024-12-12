import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

interface ResumeProps {
  resumeUrl: string | null;
  onUpdate: (file: File) => void;
}

const Resume: React.FC<ResumeProps> = ({ resumeUrl, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onUpdate(selectedFile);
      setSelectedFile(null);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-lg w-full mx-auto relative">
      {resumeUrl ? (
        <>
          <button
            onClick={toggleEdit}
            className="absolute top-5 right-10 text-blue-600 hover:text-blue-500 transition-all"
            aria-label="Edit Resume"
          >
            <FaEdit size={24} />
          </button>

          <div className="mb-3 mt-3">
            <object
              data={resumeUrl}
              type="application/pdf"
              className="w-full h-[500px] border rounded-md"
            >
              <p>
                Your browser doesn't support PDF viewing.
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  Download the PDF
                </a>
              </p>
            </object>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-700 mb-4">
          <p>No resume uploaded</p>
          <button
            onClick={toggleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all mt-4"
          >
            Upload Resume
          </button>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Upload New Resume
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="resumeUpload"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Choose PDF File
                </label>
                <input
                  type="file"
                  id="resumeUpload"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-900"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all"
                  disabled={!selectedFile}
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resume;
