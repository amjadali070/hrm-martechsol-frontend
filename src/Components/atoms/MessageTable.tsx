// frontend/src/atoms/MessageTable.tsx

import React, { useState } from 'react';
import { MdReply } from 'react-icons/md';
import { FaDownload } from 'react-icons/fa';
import ViewMessageModal from './ViewMessageModal';

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
  onReply: (messageId: string) => void;
  backendUrl: string;
  messageType: 'sent' | 'received';
  currentUserId: string;
}

const MessageTable: React.FC<MessageTableProps> = ({ messages, onReply, backendUrl, messageType, currentUserId }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Filter messages based on messageType and currentUserId
  const filteredMessages = messages.filter(msg => 
    messageType === 'sent' ? msg.sender._id === currentUserId : msg.receiver._id === currentUserId
  );

  const indexOfLastMessage = currentPage * entriesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - entriesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / entriesPerPage);

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

  const sanitizeFilename = (filename: string) => {
    return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
  };

  const handleMessageTitleClick = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 border-b text-left">S.No</th>
            <th className="py-3 px-4 border-b text-left">Sender</th>
            <th className="py-3 px-4 border-b text-left">Project</th>
            <th className="py-3 px-4 border-b text-left">Message</th>
            <th className="py-3 px-4 border-b text-left">File</th>
            <th className="py-3 px-4 border-b text-left">Date</th>
            <th className="py-3 px-4 border-b text-left">Status</th>
            <th className="py-3 px-4 border-b text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentMessages.length > 0 ? (
            currentMessages.map((msg, index) => (
              <tr key={msg._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{indexOfFirstMessage + index + 1}</td>
                <td className="py-3 px-4 border-b">{msg.sender.name}</td>
                <td className="py-3 px-4 border-b">
                  {msg.project ? (
                    <button
                      onClick={() => handleMessageTitleClick(msg)}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {msg.project.projectName}
                    </button>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => handleMessageTitleClick(msg)}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {msg.message.length > 50 ? `${msg.message.substring(0, 50)}...` : msg.message}
                  </button>
                </td>
                <td className="py-3 px-4 border-b">
                  {msg.file ? (
                    <a
                      href={msg.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 flex items-center"
                    >
                      <FaDownload className="mr-1" /> View File
                    </a>
                  ) : (
                    'No File'
                  )}
                </td>
                <td className="py-3 px-4 border-b">{new Date(msg.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 border-b">
                  {msg.read ? (
                    <span className="text-green-600 font-semibold">Read</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Unread</span>
                  )}
                </td>
                <td className="py-3 px-4 border-b text-center">
                  {/* Show Reply button only for Received Messages */}
                  {messageType === 'received' && (
                    <button
                      onClick={() => onReply(msg._id)}
                      className="text-indigo-600 hover:text-indigo-800"
                      title="Reply"
                    >
                      <MdReply size={24} />
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                No messages found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
        {/* Entries Per Page Selector */}
        <div className="flex items-center">
          <span className="text-sm">Show</span>
          <select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            className="ml-2 border rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span className="ml-2 text-sm">entries</span>
        </div>

        {/* Showing X of Y entries */}
        <div className="text-sm">
          Showing {filteredMessages.length === 0 ? 0 : indexOfFirstMessage + 1}-
          {Math.min(indexOfLastMessage, filteredMessages.length)} of {filteredMessages.length} entries
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`border rounded-md px-3 py-1 text-sm ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            Previous
          </button>
          <span className="border rounded-md px-3 py-1 bg-indigo-600 text-white text-sm">
            {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`border rounded-md px-3 py-1 text-sm ${
              currentPage === totalPages || totalPages === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* View Message Modal */}
      {isModalOpen && selectedMessage && (
        <ViewMessageModal
          message={selectedMessage}
          onClose={handleCloseModal}
          backendUrl={backendUrl}
        />
      )}
    </div>
  );
};

export default MessageTable;