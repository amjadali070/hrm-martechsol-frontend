// frontend/src/molecules/SuperAdmin/SuperAdminProjects.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

interface Project {
  _id: string;
  projectName: string;
  category: string;
  user?: {
    name: string;
    email: string;
  };
  projectStatus: string;
  completion: string;
  revisionStatus: string;
  revisionNotes?: string;
  deadline: string;
}

Modal.setAppElement('#root');

const SuperAdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null);
  const [markingRevisionId, setMarkingRevisionId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedProjectNotes, setSelectedProjectNotes] = useState<string>('');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/superadmin/projects`, { withCredentials: true });
        setProjects(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const deleteProject = async (projectId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      setDeletingProjectId(projectId);
      await axios.delete(`${backendUrl}/api/superadmin/projects/${projectId}`, { withCredentials: true });
      setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
      alert('Project deleted successfully.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete project.');
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleStatusChange = (projectId: string, newStatus: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project._id === projectId ? { ...project, projectStatus: newStatus } : project
      )
    );
  };

  const handleCompletionChange = (projectId: string, newCompletion: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project._id === projectId ? { ...project, completion: newCompletion } : project
      )
    );
  };

  const saveProjectUpdate = async (projectId: string) => {
    const project = projects.find(p => p._id === projectId);
    if (!project) return;

    try {
      setUpdatingProjectId(projectId);
      await axios.put(`${backendUrl}/api/superadmin/projects/${projectId}/status`, {
        projectStatus: project.projectStatus,
        completion: project.completion,
      }, { withCredentials: true });

      alert('Project updated successfully.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update project.');
    } finally {
      setUpdatingProjectId(null);
    }
  };

  const markRevisionCompleted = async (projectId: string) => {
    const confirmMark = window.confirm('Are you sure you want to mark this revision as completed?');
    if (!confirmMark) return;

    try {
      setMarkingRevisionId(projectId);
      const response = await axios.put(`${backendUrl}/api/superadmin/projects/${projectId}/complete-revision`, {}, { withCredentials: true });
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === projectId ? response.data : project
        )
      );
      alert('Revision marked as completed.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to mark revision as completed.');
    } finally {
      setMarkingRevisionId(null);
    }
  };

  const openModal = (notes: string) => {
    setSelectedProjectNotes(notes || 'No revision notes provided.');
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProjectNotes('');
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-hidden px-4 pt-2.5 bg-white rounded-3xl">
      <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">All Projects</h2>
      <table className="min-w-full mt-4 table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Project Title</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Owner</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Completion</th>
            <th className="px-4 py-2">Revision Status</th>
            <th className="px-4 py-2">Deadline</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project._id} className="text-center border-t">
              <td className="px-4 py-2">{project.projectName}</td>
              <td className="px-4 py-2">{project.category}</td>
              <td className="px-4 py-2">{project.user?.name || 'N/A'}</td>
              <td className="px-4 py-2">
                <select
                  value={project.projectStatus}
                  onChange={(e) => handleStatusChange(project._id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="Open">Open</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <select
                  value={project.completion}
                  onChange={(e) => handleCompletionChange(project._id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td className="px-4 py-2">
                <span 
                  className={`px-2 py-1 rounded ${
                    project.revisionStatus === 'Requested'
                      ? 'bg-yellow-200 text-yellow-800'
                      : project.revisionStatus === 'Completed'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {project.revisionStatus}
                </span>
                {project.revisionStatus === 'Requested' && (
                  <button
                    onClick={() => openModal(project.revisionNotes || 'No revision notes provided.')}
                    className="ml-2 text-blue-500 underline"
                  >
                    View Notes
                  </button>
                )}
              </td>
              <td className="px-4 py-2">{new Date(project.deadline).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => saveProjectUpdate(project._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                  disabled={updatingProjectId === project._id}
                >
                  {updatingProjectId === project._id ? 'Saving...' : 'Save'}
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => deleteProject(project._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
                  disabled={deletingProjectId === project._id}
                >
                  {deletingProjectId === project._id ? 'Deleting...' : 'Delete'}
                </button>
                {/* Conditionally Render 'Mark Revision as Completed' Button */}
                {project.revisionStatus === 'Requested' && (
                  <button
                    onClick={() => markRevisionCompleted(project._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    disabled={markingRevisionId === project._id}
                  >
                    {markingRevisionId === project._id ? 'Marking...' : 'Mark Revision as Completed'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Revision Notes */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Revision Notes"
        className="max-w-lg mx-auto mt-20 bg-white p-6 rounded shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-semibold mb-4">Revision Notes</h2>
        <p>{selectedProjectNotes}</p>
        <button
          onClick={closeModal}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default SuperAdminProjects;
