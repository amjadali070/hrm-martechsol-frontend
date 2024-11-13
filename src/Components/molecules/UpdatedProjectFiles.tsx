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

  // // Filter projects that have at least one file
  // const projectsWithFiles = projects.filter(project =>
  //   (project.uploadedArticles && project.uploadedArticles.length > 0) ||
  //   project.uploadedBusinessPlan ||
  //   project.uploadedProposal
  // );

  const indexOfLastProject = currentPage * entriesPerPage;
  const indexOfFirstProject = indexOfLastProject - entriesPerPage;
  // const currentProjects = projectsWithFiles.slice(indexOfFirstProject, indexOfLastProject);
  // const totalPages = Math.ceil(projectsWithFiles.length / entriesPerPage);

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  // };

  // const handlePreviousPage = () => {
  //   if (currentPage > 1) setCurrentPage(currentPage - 1);
  // };

  // const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setEntriesPerPage(Number(e.target.value));
  //   setCurrentPage(1);
  // };

  const totalColumns = 1 + columns.length + (onProjectTitleClick ? 1 : 0) + 1; // Added 1 for Files column

  return (
    <div className="flex flex-col px-4 pt-4 pb-4 mt-2 w-full bg-[#f6f6f6] rounded-md border border-solid border-slate-300 max-w-full">
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

        </table>
      </div>

  
    </div>
  );
};

export default UpdatedProjectFiles;