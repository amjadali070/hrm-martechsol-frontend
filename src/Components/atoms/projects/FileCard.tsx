// frontend/src/components/FileCard.tsx

import React from 'react';

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
  return (
    <div className="border border-gray-300 p-4 rounded shadow hover:shadow-lg transition duration-200">
      <h4 className="text-lg font-semibold mb-2">File Name: {file.fileName}</h4>
      <p className="text-md text-gray-600">Project: {file.project.projectName}</p>

      <a
        href={file.filePath}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        View File
      </a>
    </div>
  );
};

export default FileCard;