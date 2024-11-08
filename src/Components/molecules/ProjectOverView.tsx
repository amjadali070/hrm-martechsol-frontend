import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { MdEdit, MdAddCircleOutline } from 'react-icons/md';
import { ProjectInfo, ProjectOverviewProps } from '../../types/projectInfo';

const ProjectInformation: React.FC<{ project: ProjectInfo }> = ({ project }) => {
  const [isBriefOpen, setIsBriefOpen] = useState<boolean>(true);
  const [isFilesOpen, setIsFilesOpen] = useState<boolean>(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || '';

  const toggleBrief = () => setIsBriefOpen(!isBriefOpen);
  const toggleFiles = () => setIsFilesOpen(!isFilesOpen);

  const getProgressValue = () => {
    switch (project.completion) {
      case 'Not Started':
        return 0;
      case 'In Progress':
        return 50;
      case 'Completed':
        return 100;
      default:
        return 0;
    }
  };



  // Utility function to sanitize filenames
  const sanitizeFilename = (filename: string) => {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  };
  
  const handleDownloadAll = async (project: ProjectInfo) => {
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
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            <strong>Project Name:</strong> {project.projectName}
          </h2>
          <ul className="mt-2 space-y-1">
            <li>
              <strong>Status:</strong> {project.projectStatus}
            </li>
            <li>
              <strong>Start Date:</strong> {new Date(project.createdAt).toLocaleDateString()}
            </li>
            <li>
              <strong>Completion:</strong> {project.completion}
            </li>
            <li>
              <strong>File(s):</strong> {project.uploadedArticles.length}
            </li>
            <li>
              <strong>No of Words:</strong> {project.numberOfWords}
            </li>
          </ul>
        </div>

        <div className="w-24">
          <CircularProgressbar
            value={getProgressValue()}
            text={`${getProgressValue()}%`}
            styles={buildStyles({
              textColor: '#FF7700',
              pathColor: '#FF7700',
              trailColor: '#eee',
            })}
          />
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={toggleBrief}>
          <h3 className="font-semibold">Project Brief</h3>
          <MdEdit className="text-xl text-gray-600" />
        </div>
        {isBriefOpen && <div className="mt-3 text-gray-700">{project.projectDetails}</div>}
      </div>

      <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={toggleFiles}>
          <h3 className="font-semibold">Additional File(s)</h3>
          <MdAddCircleOutline className="text-xl text-gray-600" />
        </div>
        {isFilesOpen && (
          <div className="mt-3 text-gray-700">
            {project.uploadedArticles.length > 0 ? (
              <ul className="list-disc list-inside">
                {project.uploadedArticles.map((file) => (
                  <li key={file._id}>
                    <button
                      onClick={() => handleDownloadAll(project)}
                      className="text-blue-500 underline"
                    >
                      {file.filename}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No additional files.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ projectData }) => {
  if (!projectData) {
    return <div>No project data available</div>;
  }

  return (
    <div className="container mx-auto p-4 w-auto">
      <ProjectInformation project={projectData} />
    </div>
  );
};

export default ProjectOverview;