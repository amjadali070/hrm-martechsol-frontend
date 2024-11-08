// frontend/src/components/ProjectDetails.tsx

import React, { useState, useEffect } from 'react';
import ProjectOverview from '../molecules/ProjectOverView';
import ProjectFilesAndCorrespondence from '../molecules/ProjectFilesAndCorrespondence';
import { ProjectInfo } from '../../types/projectInfo';
import { toast } from 'react-toastify';

interface ProjectDetailsProps {
  projectId: string;
  onBack: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId, onBack }) => {
  const [projectData, setProjectData] = useState<ProjectInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${backendUrl}/api/projects/${projectId}`, {
          headers: {
            'Content-Type': 'application/json',
            // Add your authentication headers here if needed
          },
          credentials: 'include', // To include cookies if using withCredentials
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch project details');
        }

        const data: ProjectInfo = await response.json();
        setProjectData(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        toast.error(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [backendUrl, projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="text-center text-gray-500">
        No project found
      </div>
    );
  }

  return (
    <div className="overflow-hidden pt-2.5 bg-white rounded-3xl w-full">
      <button
        onClick={onBack}
        className="mb-4 text-blue-500 hover:underline"
      >
        &larr; Back to Dashboard
      </button>
      <div className="flex gap-3 max-md:flex-col">
        <div className="flex flex-col w-full max-md:ml-0">
          <div className="flex flex-col w-full max-md:mt-6">
            <section>
              <ProjectOverview projectId={projectId} projectData={projectData} />
              <ProjectFilesAndCorrespondence projectId={projectId} projectData={projectData} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;