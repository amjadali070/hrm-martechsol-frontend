// frontend/src/molecules/User/UserProjects.tsx

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

Modal.setAppElement('#root');

const ClosedUserProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingProjectId, setApprovingProjectId] = useState<string | null>(null);
  const [reviseProjectId, setReviseProjectId] = useState<string | null>(null);
  const [revisionNotes, setRevisionNotes] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects', { withCredentials: true });
        setProjects(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const approveProject = async (projectId: string) => {
    const confirmApprove = window.confirm('Are you sure you want to approve this project?');
    if (!confirmApprove) return;

    try {
      setApprovingProjectId(projectId);
      const response = await axios.put(`/api/projects/${projectId}/approve`, {}, { withCredentials: true });
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project._id === projectId ? response.data : project
        )
      );
      alert('Project approved successfully.');
    } catch (err: any) {
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
      const response = await axios.put(`/api/projects/${currentProjectId}/revise`, { revisionNotes: notes }, { withCredentials: true });
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

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-hidden px-4 pt-2.5 bg-white rounded-3xl">
      <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">Close Project(s)</h2>
      <table className="min-w-full mt-4 table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Project Title</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Completion</th>
            <th className="px-4 py-2">Deadline</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project._id} className="text-center border-t">
              <td className="px-4 py-2">{project.projectName}</td>
              <td className="px-4 py-2">{project.category}</td>
              <td className="px-4 py-2">{project.projectStatus}</td>
              <td className="px-4 py-2">{project.completion}</td>
              <td className="px-4 py-2">{new Date(project.deadline).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                {project.projectStatus !== 'Approved' && (
                  <button
                    onClick={() => approveProject(project._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                    disabled={approvingProjectId === project._id}
                  >
                    {approvingProjectId === project._id ? 'Approving...' : 'Approve'}
                  </button>
                )}
                {project.projectStatus !== 'Pending' && (
                  <button
                    onClick={() => openRevisionModal(project._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    disabled={reviseProjectId === project._id}
                  >
                    {reviseProjectId === project._id ? 'Sending...' : 'Send to Revision'}
                  </button>
                )}
                {project.projectStatus === 'Pending' && project.revisionNotes && (
                  <div className="mt-2 text-left px-4">
                    <strong>Revision Notes:</strong>
                    <p>{project.revisionNotes}</p>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default ClosedUserProjects;