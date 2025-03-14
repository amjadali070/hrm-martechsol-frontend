import React, { useState } from "react";
import { FaDownload, FaQuestionCircle } from "react-icons/fa";

interface PolicyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PolicyInfoModal: React.FC<PolicyInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold mb-4 text-purple-900">
          Policy Information
        </h3>
        <p className="text-gray-600 mb-4">
          Our employee handbook provides comprehensive guidelines and policies
          to ensure a supportive and productive work environment.
        </p>
        <div className="flex items-center space-x-2 text-blue-600">
          <FaQuestionCircle size={20} />
          <span>Need more information? Contact HR Support</span>
        </div>
      </div>
    </div>
  );
};

const Policies: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.open(
        "https://drive.google.com/uc?id=19eN4m2C8HHH6f7_e47hXauprGbjcBb-A&export=download",
        "_blank"
      );
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-6 md:p-10 relative">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
            <h2 className="text-3xl font-extrabold text-black">
              MartechSol Policies
            </h2>
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className={`
                flex items-center justify-center 
                mt-4 md:mt-0 
                
                hover:from-blue-700 hover:to-purple-800 
                transition-all 
                text-md 
                font-semibold
                px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-500
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Preparing...
                </>
              ) : (
                <>
                  <FaDownload className="mr-2" size={20} />
                  Download Policies PDF
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-left justify-left space-y-4 md:space-y-0 md:space-x-6 mb-8">
            <p className="text-lg text-blue-700 text-left flex items-left">
              Employee Handbook (Updated Version)
            </p>
          </div>

          <div className="w-full h-[700px] rounded-xl overflow-hidden mb-6">
            <iframe
              src="https://drive.google.com/file/d/19eN4m2C8HHH6f7_e47hXauprGbjcBb-A/preview"
              title="Employee Handbook"
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="mt-8 text-center bg-blue-50 p-4 rounded-xl">
            <p className="text-sm text-gray-700 leading-relaxed">
              Questions or need clarification? Contact{" "}
              <span className="font-bold text-purple-700">HR Support</span> for
              immediate assistance.
            </p>
          </div>
        </div>
      </div>

      <PolicyInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Policies;
