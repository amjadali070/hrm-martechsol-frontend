// frontend/src/components/UpdatedProjectTable.jsx or UpdatedProjectTable.tsx

import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

interface Project {
  _id: string;
  projectName: string;
  deadline: string;
  invoice: boolean;
  uploadedArticles?: { filename: string; filepath: string }[];
  uploadedBusinessPlan?: { filename: string; filepath: string };
  uploadedProposal?: { filename: string; filepath: string };
}


interface Column {
  key: keyof Project;
  label: string;
}

interface UpdatedProjectTableProps {
  projects: Project[];
  columns: Column[];
  onProjectTitleClick?: (projectId: string) => void;
}

const UpdatedProjectFiles: React.FC<UpdatedProjectTableProps> = ({ projects, columns, onProjectTitleClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(3);

  // Filter projects that have at least one file
  const projectsWithFiles = projects.filter(project =>
    (project.uploadedArticles && project.uploadedArticles.length > 0) ||
    project.uploadedBusinessPlan ||
    project.uploadedProposal
  );

  const indexOfLastProject = currentPage * entriesPerPage;
  const indexOfFirstProject = indexOfLastProject - entriesPerPage;
  const currentProjects = projectsWithFiles.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projectsWithFiles.length / entriesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalColumns = 1 + columns.length + (onProjectTitleClick ? 1 : 0) + 1; // Added 1 for Files column

  return (
    <div className="flex flex-col px-4 pt-4 pb-4 mt-2 w-full bg-blue-50 rounded-md border border-solid border-slate-300 max-w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider border-b">
                S.No
              </th>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-2 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider border-b ${
                    column.key === 'projectName' ? 'w-1/3' : ''
                  }`}
                >
                  {column.label}
                </th>
              ))}
              {/* Files Column */}
              <th className="px-2 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider border-b">
                Files
              </th>
              {onProjectTitleClick && (
                <th className="px-2 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider border-b">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProjects.length > 0 ? (
              currentProjects.map((project, index) => (
                <tr key={project._id} className="hover:bg-gray-100">
                  <td className="px-2 py-4 whitespace-nowrap text-sm md:text-base text-gray-800 text-left">
                    {indexOfFirstProject + index + 1}
                  </td>
                  {/* {columns.map((column) => (
                    <td key={String(column.key)} className="px-2 py-4 whitespace-nowrap text-sm md:text-base text-gray-800 text-left">
                      {column.key === 'deadline' ? (
                        new Date(project.deadline).toLocaleDateString()
                      ) : column.key === 'invoice' ? (
                        project.invoice ? 'Yes' : 'No'
                      ) : typeof project[column.key] === 'string' ? (
                        project[column.key]
                      ) : (
                        String(project[column.key])
                      )}
                    </td>
                  ))} */}
                  
                  {/* Files Column */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm md:text-base text-gray-800">
                    <div className="flex flex-col space-y-1">
                      {project.uploadedArticles && project.uploadedArticles.length > 0 && (
                        <div>
                          <span className="font-medium">Articles:</span>
                          <ul className="list-disc list-inside ml-4">
                            {project.uploadedArticles.map((article : any, idx : any) => (
                              <li key={idx} className="flex items-center">
                                <a
                                  href={article.filepath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline mr-1"
                                >
                                  {article.filename}
                                </a>
                                <a href={article.filepath} download className="text-gray-500 hover:text-gray-700">
                                  <FaDownload />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {project.uploadedBusinessPlan && (
                        <div className="flex items-center">
                          <span className="font-medium">Business Plan:</span>
                          <a
                            href={project.uploadedBusinessPlan.filepath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline ml-2 mr-1"
                          >
                            {project.uploadedBusinessPlan.filename}
                          </a>
                          <a href={project.uploadedBusinessPlan.filepath} download className="text-gray-500 hover:text-gray-700">
                            <FaDownload />
                          </a>
                        </div>
                      )}

                      {project.uploadedProposal && (
                        <div className="flex items-center">
                          <span className="font-medium">Proposal:</span>
                          <a
                            href={project.uploadedProposal.filepath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline ml-2 mr-1"
                          >
                            {project.uploadedProposal.filename}
                          </a>
                          <a href={project.uploadedProposal.filepath} download className="text-gray-500 hover:text-gray-700">
                            <FaDownload />
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Actions Column */}
                  {onProjectTitleClick && (
                    <td className="px-2 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => onProjectTitleClick(project._id)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm md:text-base"
                      >
                        View Details
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={totalColumns} className="px-2 py-4 whitespace-nowrap text-sm md:text-base text-gray-600 text-center">
                  No projects with uploaded files found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination and Entries Control */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
        <div className="flex items-center">
          <span className="text-sm md:text-base">Show</span>
          <select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            className="ml-2 border rounded-md p-1 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
          <span className="ml-2 text-sm md:text-base">entries</span>
        </div>

        <div className="text-sm md:text-base">
          Showing {Math.min(indexOfLastProject, projectsWithFiles.length)} of {projectsWithFiles.length} entries
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
    </div>
  );
};

export default UpdatedProjectFiles;