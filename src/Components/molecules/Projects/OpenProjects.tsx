import React, { useEffect, useState } from 'react';
import UpdatedProjectTable, { Project } from '../../atoms/UpdateProjectsTable';
import axiosInstance from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

const OpenProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchOpenProjects = async () => {
      try {
        const response = await axiosInstance.get('/projects');
        // Filter projects with status 'Working'
        const openProjects = response.data.filter((project: Project) => project);
        setProjects(openProjects);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch open projects');
        toast.error(err.response?.data?.message || 'Failed to fetch open projects');
      } finally {
        setLoading(false);
      }
    };

    fetchOpenProjects();
  }, []);

  if (loading) {
    return <p>Loading open projects...</p>;
  }

  // if (error) {
  //   return <p className="text-red-500">{error}</p>;
  // }

  const columns: { key: keyof Project; label: string }[] = [
    { key: 'projectName', label: 'Project Title' },
    { key: 'category', label: 'Category' },
    { key: 'completion', label: 'Completion' },
    // { key: 'projectStatus', label: 'Project Status' },
    { key: 'deadline', label: 'Deadline' },
    // { key: 'invoice', label: 'Invoice' },
    // { key: 'riForm', label: 'RI Form' },
  ];

  return (
    <div className='overflow-hidden px-4 pt-2.5 bg-white rounded-3xl'>
      <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">
        Open Project(s)
      </h2>
      <UpdatedProjectTable projects={projects} columns={columns} />
    </div>
  );
};

export default OpenProjects;