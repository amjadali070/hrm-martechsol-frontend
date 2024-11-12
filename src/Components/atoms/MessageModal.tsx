// frontend/src/atoms/WriteMessageModal.tsx

import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

interface WriteMessageModalProps {
  onClose: () => void;
  onSend: (replyMessage: string, replyFile: File | null) => void;
}

const WriteMessageModal: React.FC<WriteMessageModalProps> = ({ onClose, onSend }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert('Please enter a message.');
      return;
    }

    try {
      setSending(true);
      await onSend(message, file);
      setMessage('');
      setFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close Modal"
        >
          <MdClose size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Reply to Message</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your reply here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex items-center mb-4">
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 text-sm text-gray-700">Attach File:</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Attach File"
            />
            <span className="px-4 py-2 bg-[#ff6600] text-white rounded-md">
              Choose File
            </span>
          </label>
          <span className="ml-3 text-sm text-gray-600">
            {file ? file.name : 'No File Selected'}
          </span>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-[#ff6600] text-white rounded-md flex items-center ${
              sending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Reply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteMessageModal;