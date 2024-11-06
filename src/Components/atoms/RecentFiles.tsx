import React from 'react';

interface Project {
  projectName: string;
  projectDetails: string;
  uploadedArticles?: { filepath: string; filename: string }[];
  uploadedBusinessPlan?: { filepath: string; filename: string };
  uploadedProposal?: { filepath: string; filename: string };
}

const RecentFiles: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">{project.projectName}</h2>
      <p className="mb-4">{project.projectDetails}</p>
      {project.uploadedArticles && project.uploadedArticles.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">Uploaded Articles:</h3>
          <ul className="list-disc list-inside">
            {project.uploadedArticles.map((article, index) => (
              <li key={index}>
                <a href={article.filepath} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {article.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.uploadedBusinessPlan && (
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">Uploaded Business Plan:</h3>
          <a href={project.uploadedBusinessPlan.filepath} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {project.uploadedBusinessPlan.filename}
          </a>
        </div>
      )}
      {/* Display Uploaded Proposal */}
      {project.uploadedProposal && (
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">Uploaded Proposal:</h3>
          <a href={project.uploadedProposal.filepath} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {project.uploadedProposal.filename}
          </a>
        </div>
      )}
      {/* Other project details */}
    </div>
  );
};

export default RecentFiles;
