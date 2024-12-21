import React from "react";
import { FaTimes } from "react-icons/fa";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: "image" | "pdf";
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
}) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (fileType) {
      case "image":
        return (
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-[80vh] object-contain mx-auto"
          />
        );
      case "pdf":
        return (
          <iframe
            src={fileUrl}
            title={fileName}
            className="w-full h-[80vh]"
            frameBorder="0"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-60 text-gray-700 hover:text-black"
          aria-label="Close"
        >
          <FaTimes size={24} />
        </button>

        <div className="p-4 bg-gray-100 rounded-t-lg border-b mt-1">
          <h2 className="text-xl font-semibold text-left ml-3">{fileName}</h2>
        </div>

        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;
