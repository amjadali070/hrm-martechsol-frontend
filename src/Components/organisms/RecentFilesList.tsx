// frontend/src/components/ProjectList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// Define the Project interface
interface Project {
  _id: string;
  projectName: string;
  category: string;
  completion: string;
  deadline: string;
  projectStatus: string;
  invoice: boolean;
  riForm: string;
  projectDetails?: string;
  uploadedArticles?: { filepath: string; filename: string }[];
  uploadedBusinessPlan?: { filepath: string; filename: string };
  uploadedProposal?: { filepath: string; filename: string };
}

// Define a specific type for column keys
type ProjectColumnKey = 'projectName' | 'category' | 'completion' | 'deadline';

// Define the Column interface
interface Column {
  key: ProjectColumnKey;
  label: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);

  // const navigate = useNavigate();

  // Define the columns to display (Removed 'projectStatus', 'invoice', 'riForm')
  const columns: Column[] = [
    { key: 'projectName', label: 'Project Name' },
    { key: 'category', label: 'Category' },
    { key: 'completion', label: 'Completion' },
    { key: 'deadline', label: 'Deadline' },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/projects`, { withCredentials: true });
        setProjects(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // useEffect(() => {
  //   // Filter projects that have at least one uploaded file
  //   const projectsWithFiles = projects.filter(
  //     (project) =>
  //       (project.uploadedArticles && project.uploadedArticles.length > 0) ||
  //       project.uploadedBusinessPlan ||
  //       project.uploadedProposal
  //   );
  //   setFilteredProjects(projectsWithFiles);
  //   setCurrentPage(1); // Reset to first page on filter
  // }, [projects]);

  // Pagination calculations
  const indexOfLastProject = currentPage * entriesPerPage;
  const indexOfFirstProject = indexOfLastProject - entriesPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / entriesPerPage);

  // Handlers for pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on entries change
  };

  // Handler for viewing project details
  // const handleViewDetails = (projectId: string) => {
  //   navigate(`/projects/${projectId}`);
  // };

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleDownloadAll = async (project: Project) => {
    try {
      const response = await axios.get(`${backendUrl}/api/projects/${project._id}/download-all`, {
        withCredentials: true,
        responseType: 'blob',
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${project.projectName}-files.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to download files.');
    }
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  // if (error) {
  //   return <p className="text-red-500">{error}</p>;
  // }

  if (filteredProjects.length === 0) {
    return <p>No projects with uploaded files found.</p>;
  }

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
                  key={column.key}
                  className={`px-2 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider border-b ${
                    column.key === 'projectName' ? 'w-1/3' : ''
                  }`}
                >
                  {column.label}
                </th>
              ))}

              <th className="px-2 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider border-b">
                File Name
              </th>
              <th className="px-2 py-3 text-left text-xs md:text-sm font-medium uppercase tracking-wider border-b">
                Download
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentProjects.map((project, index) => (
              <tr key={project._id} className="hover:bg-gray-100">

                <td className="px-2 py-4 whitespace-nowrap text-sm md:text-base text-gray-800 text-left">
                  {indexOfFirstProject + index + 1}
                </td>

                {columns.map((column) => (
                  <td key={column.key} className="px-2 py-4 whitespace-nowrap text-sm md:text-base text-gray-800 text-left">
                    {column.key === 'deadline'
                      ? new Date(project.deadline).toLocaleDateString()
                      : project[column.key]}
                  </td>
                ))}

                <td className="px-2 py-4 whitespace-nowrap text-sm md:text-base text-gray-800">
                  <div className="flex flex-col space-y-1">

                    {project.uploadedArticles && project.uploadedArticles.length > 0 && (
                      <div>
                        <ul className="list-disc list-inside ml-4">
                          {project.uploadedArticles.map((article, idx) => (
                            <li key={idx} className="flex items-center">
                              <span>{article.filename}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.uploadedBusinessPlan && (
                      <div className="flex items-center">
                        <span>{project.uploadedBusinessPlan.filename}</span>
                      </div>
                    )}

                    {project.uploadedProposal && (
                      <div className="flex items-center">
                        <span>{project.uploadedProposal.filename}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-2 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleDownloadAll(project)}
                    className="text-gray-700 hover:text-blue-500 text-lg"
                    title="Download All Files"
                  >
                    <FaDownload />
                  </button>
                </td>
              </tr>
            ))}

            {currentProjects.length === 0 && (
              <tr>
                <td colSpan={columns.length + 3} className="px-2 py-4 whitespace-nowrap text-sm md:text-base text-gray-600 text-center">
                  No projects with uploaded files found.
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
          Showing {Math.min(indexOfLastProject, filteredProjects.length)} of {filteredProjects.length} entries
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

export default ProjectList;