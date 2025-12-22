// src/components/atoms/ImageModal.tsx

import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-4 rounded-lg max-w-3xl w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <AiOutlineClose size={24} />
        </button>
        <img
          src={imageUrl}
          alt="Vehicle"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;
