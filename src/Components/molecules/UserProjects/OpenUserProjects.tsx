import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

interface Project {
  _id: string;
  projectName: string;
  category: string;
  projectStatus: string;
  completion: string;
  revisionStatus: string;
  revisionNotes?: string;
  deadline: string;
}

interface PaginatedResponse {
  projects: Project[];
  page: number;
  pages: number;
  total: number;
}

Modal.setAppElement('#root');
interface UserProjectsProps {
  onProjectClick: (projectId: string) => void;
}

const AllOpenProjects: React.FC<UserProjectsProps> = ({ onProjectClick }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reviseProjectId, setReviseProjectId] = useState<string | null>(null);
  const [revisionNotes, setRevisionNotes] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProjects, setTotalProjects] = useState<number>(0);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PaginatedResponse>(`${backendUrl}/api/projects`, {
          params: {
            page: currentPage,
            limit: entriesPerPage,
            status: 'Open',
          },
          withCredentials: true,
        });

        if (Array.isArray(response.data.projects)) {
          setProjects(response.data.projects);
        } else {
          setProjects([]);
          setError('Invalid data format received from server.');
        }

        setTotalPages(response.data.pages);
        setTotalProjects(response.data.total);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [backendUrl, currentPage, entriesPerPage]);

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
      const response = await axios.put(
        `${backendUrl}/api/projects/${currentProjectId}/revise`,
        { revisionNotes: notes },
        { withCredentials: true }
      );
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === currentProjectId ? response.data : project
        )
      );
      alert('Project sent to revision successfully.');
      closeRevisionModal();
    } catch (err: any) {
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

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col px-4 pt-4 pb-6 mt-4 bg-[#f6f6f6] rounded-md border border-gray-300 max-w-full">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Open Projects</h2>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">S No.</th>
              <th className="px-4 py-2 text-left">Project Title</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Completion</th>
              <th className="px-4 py-2">Deadline</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  No open projects found.
                </td>
              </tr>
            )}
            {projects.map((project, index) => (
              <tr key={project._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                <td className="px-4 py-2 text-blue-600 cursor-pointer">
                  <button onClick={() => onProjectClick(project._id)}>{project.projectName}</button>
                </td>
                <td className="px-4 py-2">{project.category}</td>
                <td className="px-4 py-2">{project.projectStatus}</td>
                <td className="px-4 py-2">{project.completion}</td>
                <td className="px-4 py-2">{new Date(project.deadline).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {project.projectStatus !== 'Pending' && (
                    <button
                      onClick={() => openRevisionModal(project._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Send to Revision
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination and Entries Control */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-3 sm:space-y-0">
        <div className="flex items-center">
          <span className="text-sm">Show</span>
          <select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            className="ml-2 border rounded-md p-1 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div>
          Showing {projects.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1}-
          {Math.min(currentPage * entriesPerPage, totalProjects)} of {totalProjects} entries
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="p-2">
            Previous
          </button>
          <span>{currentPage}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllOpenProjects;