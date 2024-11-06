import React, { useState } from 'react';
import { MdReply, MdEdit, MdFileDownload } from 'react-icons/md';
import { AiOutlineFileSearch } from 'react-icons/ai';
import WriteMessageModal from '../atoms/MessageModal';


interface File {
  fileName: string;
  fileLink: string;
  receivedOn: string;
  status: string;
}

interface ProjectFilesAndCorrespondenceProps {
  projectId?: number | string;
}

const ProjectFilesTable = ({ files }: { files: File[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(3);

  const indexOfLastFile = currentPage * entriesPerPage;
  const indexOfFirstFile = indexOfLastFile - entriesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(files.length / entriesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="border rounded-md p-4 bg-white w-[auto]">
      <h3 className="font-semibold mb-4">Project Completed File(s)</h3>
      <p className="text-sm text-gray-600 mb-3">
        All of your completed files are stored below. Please approve, request a revision in writing, or share an audio revision by clicking the relevant button next to the file.
      </p>
      <table className="w-full bg-white border">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2 text-left">S.No</th>
            <th className="p-2 text-left">File Name</th>
            <th className="p-2 text-left">Received On</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentFiles.map((file, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{indexOfFirstFile + index + 1}</td>
              <td className="p-2 text-blue-500 underline cursor-pointer">
                <a href={file.fileLink}>{file.fileName}</a>
              </td>
              <td className="p-2">{file.receivedOn}</td>
              <td className="p-2 text-orange-500">{file.status}</td>
              <td className="p-2 flex space-x-3">
                <MdEdit className="text-xl cursor-pointer" title="Request Revision" />
                <MdFileDownload className="text-xl cursor-pointer" title="Download" />
                <AiOutlineFileSearch className="text-xl cursor-pointer" title="Approve" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div>
          <span>Showing {indexOfFirstFile + 1} to {Math.min(indexOfLastFile, files.length)} of {files.length} entries</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            className={`border rounded-md p-1 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="border px-3 py-1 bg-blue-600 text-white">{currentPage}</span>
          <button
            onClick={handleNextPage}
            className={`border rounded-md p-1 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

interface Message {
  message: string;
  date: string;
  messageBy: string;
}

const CorrespondenceTable = ({ messages }: { messages: Message[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(3);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const indexOfLastMessage = currentPage * entriesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - entriesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(messages.length / entriesPerPage);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="border rounded-md p-4 bg-white mt-6">
      <h3 className="font-semibold mb-4">Correspondence</h3>
      <p className="text-sm text-gray-600 mb-3">
        All of the revisions you’ve requested are recorded below.
      </p>
      <table className="w-full bg-white border">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2 text-left">S.No</th>
            <th className="p-2 text-left">Message</th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Message By</th>
            <th className="p-2 text-left">Reply</th>
          </tr>
        </thead>
        <tbody>
          {currentMessages.map((message, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{indexOfFirstMessage + index + 1}</td>
              <td className="p-2 text-blue-500 underline cursor-pointer">
                <button className="text-blue-500 underline cursor-pointer">{message.message}</button>
              </td>
              <td className="p-2">{message.date}</td>
              <td className="p-2">{message.messageBy}</td>
              <td className="p-2 text-center">
                <MdReply
                  className="text-xl cursor-pointer"
                  onClick={() => handleReplyClick(message.message)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <div>
          <span>Showing {indexOfFirstMessage + 1} to {Math.min(indexOfLastMessage, messages.length)} of {messages.length} entries</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            className={`border rounded-md p-1 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="border px-3 py-1 bg-blue-600 text-white">{currentPage}</span>
          <button
            onClick={handleNextPage}
            className={`border rounded-md p-1 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* {isModalOpen && (
        <WriteMessageModal
          projectTitle={selectedMessage || ''}
          onClose={handleCloseModal}
        />
      )} */}
    </div>
  );
};

const filesData = [
  {
    fileName: 'Ebook promo merged_Videos_1624020.rar',
    fileLink: '#',
    receivedOn: '11 Oct 2024',
    status: 'Pending Approval',
  },
];

const messagesData = [
  { message: 'Hi,Hope you are doing well...', date: '18 Oct 2024', messageBy: 'Team' },
  { message: 'Thank you for taking the time...', date: '17 Oct 2024', messageBy: 'Team' },
  { message: 'Thank you for your feedback...', date: '16 Oct 2024', messageBy: 'Team' },
  { message: 'Hi, Thank you for your feedback...', date: '15 Oct 2024', messageBy: 'Team' },
];

const ProjectFilesAndCorrespondence: React.FC<ProjectFilesAndCorrespondenceProps> = ({ projectId }) => {
  return (
    <div className="container mx-auto p-4 w-[auto]">
      <ProjectFilesTable files={filesData} />
      <CorrespondenceTable messages={messagesData} />
    </div>
  );
};

export default ProjectFilesAndCorrespondence;