// src/components/Modal.tsx

import React, { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const SupportingModal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close Modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default SupportingModal;
