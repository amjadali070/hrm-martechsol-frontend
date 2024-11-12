// frontend/src/molecules/ProjectFilesAndCorrespondence/ProjectFilesAndCorrespondence.tsx

import React, { useEffect, useState } from 'react';
import {ProjectMessage, ProjectFilesAndCorrespondenceProps, ProjectFile } from '../../types/projectInfo';
import axios from 'axios';
import { toast } from 'react-toastify';
import CorrespondenceTable from './CorrespondenceTable';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { MdEdit, MdFileDownload } from 'react-icons/md';


const ProjectFilesTable = ({ files = [] }: { files: ProjectFile[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(3);

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
    <div className="border rounded-md p-4 bg-white w-auto">
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
              <td className="p-2">{new Date(file.receivedOn).toLocaleDateString()}</td>
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


const ProjectFilesAndCorrespondence: React.FC<ProjectFilesAndCorrespondenceProps> = ({ projectId, projectData }) => {
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchMessagesByProjectId = async () => {
      if (!projectId) {
        setMessages([]);
        setLoadingMessages(false);
        return;
      }

      try {
        setLoadingMessages(true);
        setErrorMessages(null);

        const response = await axios.get<ProjectMessage[]>(`${backendUrl}/api/messages/project/${projectId}`, {
          withCredentials: true, // Include cookies if necessary
        });

        setMessages(response.data);
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        setErrorMessages(error.response?.data?.message || 'Failed to fetch messages.');
        toast.error(error.response?.data?.message || 'Failed to fetch messages.');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessagesByProjectId();
  }, [backendUrl, projectId]);

  if (!projectData) {
    return (
      <div className="container mx-auto p-4 w-auto">
        No project data available
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 w-auto">
      <ProjectFilesTable files={projectData.files} />
      {loadingMessages ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : errorMessages ? (
        <div className="text-center mt-5"> No project messages available</div>
      ) : (
        <CorrespondenceTable messages={messages} />
      )}
    </div>
  );
};

export default ProjectFilesAndCorrespondence;