import React, { useEffect, useState } from 'react';
import UpdatedProjectTable, { Project } from '../../atoms/UpdateProjectsTable';
import axiosInstance from '../../../utils/axiosConfig';

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/projects');
        setProjects(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const columns: { key: keyof Project; label: string }[] = [
    { key: 'projectName', label: 'Project Title' },
    { key: 'category', label: 'Category' },
    { key: 'projectDetails', label: 'Project Details' },
    // { key: 'completion', label: 'Completion' },
    { key: 'projectStatus', label: 'Project Status' },
    { key: 'deadline', label: 'Deadline' },
    // { key: 'invoice', label: 'Invoice' },
    // { key: 'riForm', label: 'RI Form' },
  ];

  return (
    <div className='overflow-hidden px-4 pt-2.5 bg-white rounded-3xl'>
      <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">
        All Project(s)
      </h2>
      <UpdatedProjectTable projects={projects} columns={columns} />
    </div>
  );
};

export default AllProjects;
