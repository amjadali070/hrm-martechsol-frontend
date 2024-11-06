// frontend/src/atoms/MessageTable.tsx

import React, { useState } from 'react';
import { MdReply } from 'react-icons/md';
import WriteMessageModal from './MessageModal';

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

interface MessageTableProps {
  messages: Message[];
  onProjectTitleClick: (projectId: string) => void;
  onReply: (messageId: string, replyMessage: string, replyFile: File | null) => void;
}

const MessageTable: React.FC<MessageTableProps> = ({ messages, onProjectTitleClick, onReply }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const indexOfLastMessage = currentPage * entriesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - entriesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(messages.length / entriesPerPage);

  const handleReplyClick = (messageId: string) => {
    setSelectedMessageId(messageId);
    setIsModalOpen(true);
  };

  const handleSendReply = (replyMessage: string, replyFile: File | null) => {
    if (selectedMessageId) {
      onReply(selectedMessageId, replyMessage, replyFile);
      setIsModalOpen(false);
      setSelectedMessageId(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col px-4 pt-4 pb-4 mt-2 w-full bg-blue-50 rounded-md border border-solid border-slate-300 max-w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">S.No</th>
              <th className="p-2 text-left">Sender</th>
              <th className="p-2 text-left">Project</th>
              <th className="p-2 text-left">Message</th>
              <th className="p-2 text-left">File</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentMessages.length > 0 ? (
              currentMessages.map((msg, index) => (
                <tr key={msg._id} className="hover:bg-gray-100">
                  <td className="p-2">{indexOfFirstMessage + index + 1}</td>
                  <td className="p-2">{msg.sender.name}</td>
                  <td className="p-2">
                    {msg.project ? (
                      <button
                        onClick={() => onProjectTitleClick(msg.project!._id)}
                        className="text-blue-600 underline cursor-pointer"
                      >
                        {msg.project.projectName}
                      </button>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="p-2">{msg.message}</td>
                  <td className="p-2">
                    {msg.file ? (
                      <a href={msg.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        View File
                      </a>
                    ) : (
                      'No File'
                    )}
                  </td>
                  <td className="p-2">{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    {msg.read ? (
                      <span className="text-green-600">Read</span>
                    ) : (
                      <span className="text-red-600">Unread</span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    <MdReply
                      className="text-xl cursor-pointer text-indigo-600 hover:text-indigo-800"
                      title="Reply"
                      onClick={() => handleReplyClick(msg._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-2 text-center text-gray-600">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
        <div className="flex items-center">
          <span className="text-sm md:text-base">Show</span>
          <select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            className="ml-2 border rounded-md p-1 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span className="ml-2 text-sm md:text-base">entries</span>
        </div>

        <div className="text-sm md:text-base">
          Showing {Math.min(indexOfLastMessage, messages.length)} of {messages.length} entries
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`border rounded-md p-2 text-sm md:text-base ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-100'
            }`}
          >
            Previous
          </button>
          <span className="border rounded-md px-3 py-1 bg-blue-600 text-white text-sm md:text-base">
            {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`border rounded-md p-2 text-sm md:text-base ${
              currentPage === totalPages || totalPages === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-100'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Reply Modal */}
      {isModalOpen && selectedMessageId && (
        <WriteMessageModal
          onClose={() => setIsModalOpen(false)}
          onSend={handleSendReply}
        />
      )}
    </div>
  );
};

export default MessageTable;