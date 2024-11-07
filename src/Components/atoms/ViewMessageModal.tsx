// frontend/src/atoms/ViewMessageModal.tsx

import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaDownload } from 'react-icons/fa';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  receiver: {
    _id: string;
    name: string;
    email: string;
  };
  project?: {
    _id: string;
    projectName: string;
  };
  message: string;
  file: string;
  read: boolean;
  createdAt: string;
}

interface ViewMessageModalProps {
  message: Message;
  onClose: () => void;
  backendUrl: string;
}

const ViewMessageModal: React.FC<ViewMessageModalProps> = ({ message, onClose, backendUrl }) => {
  const [isRead, setIsRead] = useState<boolean>(message.read);
  const [markingRead, setMarkingRead] = useState<boolean>(false);

  useEffect(() => {
    const markMessageAsRead = async () => {
      if (!isRead) {
        try {
          setMarkingRead(true);
          const response = await axios.put(`${backendUrl}/api/messages/${message._id}/read`, {}, {
            withCredentials: true,
          });
          setIsRead(response.data.read);
          toast.success('Message marked as read.');
        } catch (error: any) {
          console.error('Error marking message as read:', error.response?.data?.message || error.message);
          toast.error('Failed to mark message as read.');
        } finally {
          setMarkingRead(false);
        }
      }
    };

    markMessageAsRead();
  }, [isRead, backendUrl, message._id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close Modal"
        >
          <MdClose size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Message Details</h2>
        <div className="space-y-4">
          <div>
            <span className="font-medium">From:</span> {message.sender.name} ({message.sender.email})
          </div>
          <div>
            <span className="font-medium">To:</span> {message.receiver.name} ({message.receiver.email})
          </div>
          {message.project && (
            <div>
              <span className="font-medium">Project:</span> {message.project.projectName}
            </div>
          )}
          <div>
            <span className="font-medium">Message:</span>
            <p className="mt-1">{message.message}</p>
          </div>
          {message.file && (
            <div>
              <span className="font-medium">Attachment:</span>
              <a
                href={message.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline flex items-center mt-1"
              >
                <FaDownload className="mr-1" /> View File
              </a>
            </div>
          )}
          <div>
            <span className="font-medium">Date:</span> {new Date(message.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Status:</span> {isRead ? 'Read' : 'Unread'}
            {markingRead && <span className="ml-2 text-sm text-gray-500">Updating...</span>}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMessageModal;