import React, { useState } from "react";
import { FaExclamationCircle, FaTimes } from "react-icons/fa";

interface UserStatusToggleProps {
  userId: string;
  currentStatus: boolean;
  onConfirm: () => Promise<void>;
}

const UserStatusToggleConfirmation: React.FC<UserStatusToggleProps> = ({
  userId,
  currentStatus,
  onConfirm,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const action = currentStatus ? "deactivate" : "activate";
  const dialogTitle = `${
    action.charAt(0).toUpperCase() + action.slice(1)
  } User`;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      handleCloseModal();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <button
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 
              ${
                currentStatus
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } flex items-center`}
          onClick={handleOpenModal}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full 
              transform transition-transform duration-300 
              ${currentStatus ? "translate-x-[110%]" : "translate-x-0"}`}
          />
        </button>
        <span
          className={`text-sm font-medium ${
            currentStatus ? "text-green-600" : "text-red-600"
          }`}
        >
          {currentStatus ? "Active" : "Inactive"}
        </span>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <FaExclamationCircle
                  className="mr-2 text-yellow-500"
                  size={24}
                />
                <h2 className="text-lg font-semibold">{dialogTitle}</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4">
              <p className="text-gray-600">
                Are you sure you want to {action} this user?
                {currentStatus
                  ? " The user will no longer be able to access the system."
                  : " The user will regain access to the system."}
              </p>
            </div>

            <div className="flex justify-end p-4 border-t space-x-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`
                  px-4 py-2 rounded text-white
                  ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : currentStatus
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }
                `}
              >
                {isLoading ? "Processing..." : dialogTitle}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserStatusToggleConfirmation;
