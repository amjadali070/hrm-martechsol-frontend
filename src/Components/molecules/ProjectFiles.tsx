// frontend/src/components/ProjectDetails.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecentFiles from '../atoms/RecentFiles';

export interface Project {
  projectName: string;
  projectDetails: string;
  uploadedArticles?: { filepath: string; filename: string }[];
  uploadedBusinessPlan?: { filepath: string; filename: string };
  uploadedProposal?: { filepath: string; filename: string };
}

const ProjectFiles: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/api/projects/${projectId}`, { withCredentials: true });
        setProject(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return <p>Loading project details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!project) {
    return <p>No project found.</p>;
  }

  return (
    <div>
      {/* Render RecentFiles Component */}
      <RecentFiles project={project} />

      {/* Other project-related components or information can go here */}
    </div>
  );
};

export default ProjectFiles;