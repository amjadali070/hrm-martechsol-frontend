// frontend/src/components/ProjectCard.tsx

import React from 'react';
import { format } from 'date-fns';

interface Project {
  _id: string;
  projectName: string;
  category: string;
  completion: string;
  projectStatus: string;
  deadline: string;
//   invoice: boolean;
//   riForm: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="border border-gray-300 p-4 rounded shadow hover:shadow-lg transition duration-200">
      <h4 className="text-lg font-semibold mb-2">Project Name: {project.projectName}</h4>
      <p className="text-sm text-gray-600">Category: {project.category}</p>
      <p className="text-sm text-gray-600">Status: {project.projectStatus}</p>
      <p className="text-sm text-gray-600">
        Completion: {project.completion}
      </p>
      <p className="text-sm text-gray-600">
        Deadline: {format(new Date(project.deadline), 'PPP')}
      </p>
      {/* <p className="text-sm text-gray-600">
        Invoice: {project.invoice ? 'Yes' : 'No'}
      </p>
      <p className="text-sm text-gray-600">
        RI Form: {project.riForm}
      </p>
      Add more project details or actions as needed */}
    </div>
  );
};

export default ProjectCard;