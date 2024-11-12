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

const AllClosedProjects: React.FC<UserProjectsProps> = ({ onProjectClick }) => {
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
            status: 'Approved',
          },
          withCredentials: true,
        });

        setProjects(response.data.projects);
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

  const openRevisionModal = (projectId: string) => {
    setCurrentProjectId(projectId);
    setIsModalOpen(true);
  };

  const closeRevisionModal = () => {
    setIsModalOpen(false);
    setCurrentProjectId(null);
    setRevisionNotes((prev) => ({ ...prev, [currentProjectId!]: '' }));
  };

  const handleRevisionNotesChange = (projectId: string, notes: string) => {
    setRevisionNotes((prev) => ({ ...prev, [projectId]: notes }));
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
      setProjects((prevProjects) =>
        prevProjects.map((project) => (project._id === currentProjectId ? response.data : project))
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
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col px-4 pt-4 pb-4 mt-2 w-full bg-blue-50 rounded-md border border-solid border-slate-300 max-w-full">
      <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">Closed Project(s)</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full mt-4 table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left uppercase">S No.</th>
              <th className="px-4 py-2 text-left uppercase">Project Title</th>
              <th className="px-4 py-2 uppercase">Category</th>
              <th className="px-4 py-2 uppercase">Status</th>
              <th className="px-4 py-2 uppercase">Completion</th>
              <th className="px-4 py-2 uppercase">Deadline</th>
              <th className="px-4 py-2 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-2 text-center">
                  No closed projects found.
                </td>
              </tr>
            )}
            {projects.map((project, index) => (
              <tr key={project._id} className="text-center border-t">
                <td className="px-4 py-2 text-left">
                  {(currentPage - 1) * entriesPerPage + index + 1}
                </td>
                <td className="px-4 py-2 text-left text-blue-500 underline cursor-pointer">
                  <button onClick={() => onProjectClick(project._id)}>
                    {project.projectName}
                  </button>
                </td>
                <td className="px-4 py-2">{project.category}</td>
                <td className="px-4 py-2">{project.projectStatus}</td>
                <td className="px-4 py-2">{project.completion}</td>
                <td className="px-4 py-2">
                  {new Date(project.deadline).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {project.projectStatus !== 'Pending' && (
                    <button
                      onClick={() => openRevisionModal(project._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      disabled={reviseProjectId === project._id}
                    >
                      {reviseProjectId === project._id ? 'Sending...' : 'Send to Revision'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
      </div>
    </div>
  );
};

export default AllClosedProjects;