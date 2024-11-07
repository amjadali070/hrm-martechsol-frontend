// frontend/src/components/UserProjects.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaDownload } from 'react-icons/fa'; // Import the download icon
import AllProjects from './Projects/AllProjects';

interface Project {
  _id: string;
  projectName: string;
  category: string;
  projectStatus: string;
  completion: string;
  revisionStatus: string;
  revisionNotes?: string;
  deadline: string;
  // File-related fields
  uploadedArticles?: { filepath: string; filename: string }[];
  uploadedBusinessPlan?: { filepath: string; filename: string };
  uploadedProposal?: { filepath: string; filename: string };
}

interface PaginatedResponse {
  projects: Project[];
  page: number;
  pages: number;
  total: number;
}

Modal.setAppElement('#root'); // For accessibility

const sanitizeFilename = (filename: string) => {
  return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
};

interface UserProjectsProps {
    onProjectClick: (projectId: string) => void;
  }

const AllProjectFiles: React.FC<UserProjectsProps> = ({ onProjectClick }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingProjectId, setApprovingProjectId] = useState<string | null>(null);
  const [reviseProjectId, setReviseProjectId] = useState<string | null>(null);
  const [revisionNotes, setRevisionNotes] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProjects, setTotalProjects] = useState<number>(0);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PaginatedResponse>(
          `${backendUrl}/api/projects`,
          {
            params: {
              page: currentPage,
              limit: entriesPerPage,
              // Optionally, you can pass a status filter if needed
              // status: 'Approved', // For example
            },
            withCredentials: true,
          }
        );

        if (Array.isArray(response.data.projects)) {
          setProjects(response.data.projects);
        } else {
          console.error('projects is not an array:', response.data.projects);
          setProjects([]);
          setError('Invalid data format received from server.');
        }

        setTotalPages(response.data.pages);
        setTotalProjects(response.data.total);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.response?.data?.message || 'Failed to fetch projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [backendUrl, currentPage, entriesPerPage]);

  const approveProject = async (projectId: string) => {
    const confirmApprove = window.confirm('Are you sure you want to approve this project?');
    if (!confirmApprove) return;

    try {
      setApprovingProjectId(projectId);
      const response = await axios.put(`${backendUrl}/api/projects/${projectId}/approve`, {}, { withCredentials: true });
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === projectId ? response.data : project
        )
      );
      alert('Project approved successfully.');
    } catch (err: any) {
      console.error('Error approving project:', err);
      alert(err.response?.data?.message || 'Failed to approve project.');
    } finally {
      setApprovingProjectId(null);
    }
  };

  const openRevisionModal = (projectId: string) => {
    setCurrentProjectId(projectId);
    setIsModalOpen(true);
  };

  const closeRevisionModal = () => {
    setIsModalOpen(false);
    setCurrentProjectId(null);
    setRevisionNotes(prev => ({ ...prev, [currentProjectId!]: '' }));
  };

  const handleRevisionNotesChange = (projectId: string, notes: string) => {
    setRevisionNotes(prev => ({ ...prev, [projectId]: notes }));
  };

  const sendToRevision = async () => {
    if (!currentProjectId) return;

    const notes = revisionNotes[currentProjectId];

    if (!notes.trim()) {
      alert('Please enter revision notes.');
      return;
    }

    try {
      setReviseProjectId(currentProjectId);
      const response = await axios.put(`${backendUrl}/api/projects/${currentProjectId}/revise`, { revisionNotes: notes }, { withCredentials: true });
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === currentProjectId ? response.data : project
        )
      );
      alert('Project sent to revision successfully.');
      closeRevisionModal();
    } catch (err: any) {
      console.error('Error sending project to revision:', err);
      alert(err.response?.data?.message || 'Failed to send project to revision.');
    } finally {
      setReviseProjectId(null);
    }
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
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

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col px-4 pt-4 pb-4 mt-2 w-full bg-blue-50 rounded-md border border-solid border-slate-300 max-w-full">
      <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">All File(s)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left uppercase">S No.</th>
              <th className="px-4 py-2 text-left uppercase">Project Title</th>
              <th className="px-4 py-2 uppercase">Category</th>
              <th className="px-4 py-2 uppercase">Status</th>
              <th className="px-4 py-2 uppercase">Completion</th>

              <th className="px-4 py-2 uppercase">Files</th>
              <th className="px-4 py-2 uppercase">Download</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-2 text-center">
                  No projects found.
                </td>
              </tr>
            )}
            {projects.map((project, index) => (
              <tr key={project._id} className="text-center border-t">
                <td className="px-4 py-2 text-left">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                <td className="px-4 py-2 text-left text-blue-500 underline cursor-pointer">
                    <button onClick={() => onProjectClick(project._id)}>{project.projectName}</button>
                </td>
                <td className="px-4 py-2">{project.category}</td>
                <td className="px-4 py-2">{project.projectStatus}</td>
                <td className="px-4 py-2">{project.completion}</td>

                <td className="px-4 py-2 text-left">
                  <div className="flex flex-col space-y-1">
                    {project.uploadedArticles && project.uploadedArticles.length > 0 && (
                      <div>
                        <strong>Articles:</strong>
                        <ul className="list-disc list-inside">
                          {project.uploadedArticles.map((article, idx) => (
                            <li key={idx}>{article.filename}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project.uploadedBusinessPlan && (
                      <div>
                        <strong>Business Plan:</strong> {project.uploadedBusinessPlan.filename}
                      </div>
                    )}
                    {project.uploadedProposal && (
                      <div>
                        <strong>Proposal:</strong> {project.uploadedProposal.filename}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-4 py-2">
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
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span className="ml-2 text-sm md:text-base">entries</span>
        </div>

        <div className="text-sm md:text-base">
          Showing {projects.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1}-
          {Math.min(currentPage * entriesPerPage, totalProjects)} of {totalProjects} entries
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeRevisionModal}
        contentLabel="Send to Revision"
        className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-semibold mb-4">Send to Revision</h2>
        <textarea
          value={currentProjectId ? revisionNotes[currentProjectId] : ''}
          onChange={(e) => handleRevisionNotesChange(currentProjectId!, e.target.value)}
          placeholder="Enter revision notes here..."
          className="w-full h-32 border rounded p-2"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={closeRevisionModal}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={sendToRevision}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={reviseProjectId === currentProjectId}
          >
            {reviseProjectId === currentProjectId ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AllProjectFiles;
