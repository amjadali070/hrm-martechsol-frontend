// frontend/src/atoms/WriteMessageModal.tsx

import React, { useState } from 'react';

interface WriteMessageModalProps {
  onClose: () => void;
  onSend: (replyMessage: string, replyFile: File | null) => void;
}

const WriteMessageModal: React.FC<WriteMessageModalProps> = ({ onClose, onSend }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      alert('Please enter a message.');
      return;
    }

    onSend(message, file);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl p-6 md:p-8 lg:p-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Reply to Message</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your reply here..."
          className="w-full h-24 md:h-32 p-2 border border-gray-300 rounded mb-4 text-sm md:text-base"
        />
        <div className="flex items-center mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="mr-2 text-sm md:text-base"
          />
          <span className="text-sm md:text-base text-gray-600">
            {file ? file.name : 'No File Selected'}
          </span>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded mr-2 text-sm md:text-base"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-purple-700 text-white py-2 px-4 rounded text-sm md:text-base"
            onClick={handleSubmit}
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteMessageModal;