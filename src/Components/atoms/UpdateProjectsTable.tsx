import React, { useState } from 'react';

export interface Project {
  _id: string;
  projectName: string;
  category: string;
  completion: string;
  projectStatus: string;
  deadline: string;
  invoice: boolean;
  riForm: string;
  projectDetails?: string;
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

const UpdatedProjectTable: React.FC<UpdatedProjectTableProps> = ({ projects, columns, onProjectTitleClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(3);

  const indexOfLastProject = currentPage * entriesPerPage;
  const indexOfFirstProject = indexOfLastProject - entriesPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / entriesPerPage);

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

  const totalColumns = 1 + columns.length + (onProjectTitleClick ? 1 : 0);

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
                  key={column.key}
                  className={`px-2 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider border-b ${
                    column.key === 'projectName' ? 'w-1/3' : ''
                  }`}
                >
                  {column.label}
                </th>
              ))}
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
                  {columns.map((column) => (
                    <td key={column.key} className="px-2 py-4 whitespace-nowrap text-sm md:text-base text-gray-800 text-left">
                      {column.key === 'deadline' ? (
                        new Date(project.deadline).toLocaleDateString()
                      ) : column.key === 'invoice' ? (
                        project.invoice ? 'Yes' : 'No'
                      ) : (
                        project[column.key]
                      )}
                    </td>
                  ))}
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
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
          Showing {Math.min(indexOfLastProject, projects.length)} of {projects.length} entries
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

export default UpdatedProjectTable;