// frontend/src/components/FileCard.tsx

import React from 'react';
import { Project } from '../UpdateProjectsTable';
import axios from 'axios';
interface File {
  _id: string;
  fileName: string;
  project: {
    _id: string;
    projectName: string;
  };
  filePath: string;
}

interface FileCardProps {
  file: File;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const sanitizeFilename = (filename: string) => {
    return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
  };

  const handleDownloadAll = async (project: Project) => {
    try {
      const response = await axios.get(`${backendUrl}/api/projects/${project._id}/download-all`, {
        withCredentials: true,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${sanitizeFilename(project.projectName)}-files.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      console.error('Error downloading files:', err);
      alert(err.response?.data?.message || 'Failed to download files.');
    }
  };
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">File Name: {file.fileName}</h4>
      <p className="text-md text-gray-600">Project: {file.project.projectName}</p>
      <button
        onClick={() => handleDownloadAll({
          ...file.project,
          category: '', // Add appropriate values for these properties
          completion: '0',
          projectStatus: '',
          deadline: new Date().toISOString(),
          invoice: false,
          riForm: ''
        })}
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        View File
      </button>
    </div>
  );
};

export default FileCard;