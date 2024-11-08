import React, { useState } from 'react';
import { MdReply } from 'react-icons/md';
import { ProjectMessage } from '../../types/projectInfo';

interface CorrespondenceTableProps {
  messages: ProjectMessage[];
}

const CorrespondenceTable: React.FC<CorrespondenceTableProps> = ({ messages }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const entriesPerPage: number = 3;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const indexOfLastMessage: number = currentPage * entriesPerPage;
  const indexOfFirstMessage: number = indexOfLastMessage - entriesPerPage;
  const currentMessages: ProjectMessage[] = messages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages: number = Math.ceil(messages.length / entriesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleReplyClick = (message: string) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  return (
    <div className="border rounded-md p-4 bg-white mt-6">
      <h3 className="font-semibold mb-4">Messages</h3>
      <p className="text-sm text-gray-600 mb-3">
        All of the revisions you've requested are recorded below.
      </p>
      <table className="w-full bg-white border">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2 text-left">S.No</th>
            <th className="p-2 text-left">Message</th>
            <th className="p-2 text-left">File</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Sender</th>
            <th className="p-2 text-left">Receiver</th>
            <th className="p-2 text-left">Reply</th>
          </tr>
        </thead>
        <tbody>
          {currentMessages.length > 0 ? (
            currentMessages.map((message, index) => (
              <tr key={message._id} className="border-b">
                <td className="p-2">{indexOfFirstMessage + index + 1}</td>
                <td className="p-2 text-blue-500 underline" onClick={() => handleReplyClick(message.message)}>
                  {message.message}
                </td>
                <td className="p-2">
                  {message.file ? (
                    <a
                      href={message.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Download
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="p-2">{new Date(message.createdAt).toLocaleDateString()}</td>
                <td className="p-2">{message.sender?.name || 'Unknown'}</td>
                <td className="p-2">{message.receiver?.name || 'Unknown'}</td>
                <td className="p-2 text-center">
                  <MdReply
                    className="text-xl cursor-pointer"
                    // onClick={() => handleReplyClick(message.message)}
                    title="Reply"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-2 text-center text-gray-500">
                No correspondence available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <span>
            Showing {indexOfFirstMessage + 1} to {Math.min(indexOfLastMessage, messages.length)} of{' '}
            {messages.length} entries
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            className={`border rounded-md p-1 ${
              currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'
            }`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="border px-3 py-1 bg-blue-600 text-white">{currentPage}</span>
          <button
            onClick={handleNextPage}
            className={`border rounded-md p-1 ${
              currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Reply */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Reply to Message</h2>
            <p className="mb-4">{selectedMessage}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrespondenceTable;