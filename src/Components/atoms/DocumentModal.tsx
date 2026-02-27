// src/components/atoms/DocumentModal.tsx

import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentName: string;
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentName,
}) => {
  if (!isOpen) return null;

  // Determine file type for embedding
  const fileExtension = documentUrl.split(".").pop()?.toLowerCase();

  const isPDF = fileExtension === "pdf";
  const isImage = ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
    fileExtension || ""
  );

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-4 rounded-lg max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <AiOutlineClose size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-4">{documentName}</h2>
        <div className="w-full h-auto">
          {isPDF ? (
            <iframe
              src={documentUrl}
              title={documentName}
              className="w-full h-96"
            ></iframe>
          ) : isImage ? (
            <img
              src={documentUrl}
              alt={documentName}
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Download {documentName}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
