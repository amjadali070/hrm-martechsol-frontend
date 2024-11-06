import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { MdEdit, MdAddCircleOutline } from 'react-icons/md';

interface Project {
  id: number;
  title: string;
  status: string;
  startDate: string;
  completionDate: string;
  completionPercentage: number;
  files: number;
  noOfWords: number;
  brief: string;
  additionalFiles: string[];
}


interface ProjectOverviewProps {

  projectId: string | undefined;

}

const ProjectDetails = ({ project }: { project: Project }) => {
  const [isBriefOpen, setIsBriefOpen] = useState(true);
  const [isFilesOpen, setIsFilesOpen] = useState(false);

  const toggleBrief = () => setIsBriefOpen(!isBriefOpen);
  const toggleFiles = () => setIsFilesOpen(!isFilesOpen);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2 w-[100%]">

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{project.title}</h2>
          <ul className="mt-2 space-y-1">
            <li><strong>Status:</strong> {project.status}</li>
            <li><strong>Start Date:</strong> {project.startDate}</li>
            <li><strong>Completion Date:</strong> {project.completionDate}</li>
            <li><strong>Completion:</strong> {project.completionPercentage} %</li>
            <li><strong>File(s):</strong> {project.files}</li>
            <li><strong>No of Words:</strong> {project.noOfWords}</li>
          </ul>
        </div>

        <div className="w-24">
          <CircularProgressbar
            value={project.completionPercentage}
            text={`${project.completionPercentage}%`}
            styles={buildStyles({
              textColor: '#FF7700',
              pathColor: '#FF7700',
              trailColor: '#eee',
            })}
          />
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={toggleBrief}>
          <h3 className="font-semibold">Project Brief</h3>
          <MdEdit className="text-xl text-gray-600" />
        </div>
        {isBriefOpen && (
          <div className="mt-3 text-gray-700">
            <p>{project.brief}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
        <div className="flex justify-between items-center cursor-pointer" onClick={toggleFiles}>
          <h3 className="font-semibold">Additional File(s)</h3>
          <MdAddCircleOutline className="text-xl text-gray-600" />
        </div>
        {isFilesOpen && (
          <div className="mt-3 text-gray-700">
            {project.additionalFiles.length > 0 ? (
              <ul className="list-disc ml-5">
                {project.additionalFiles.map((file, index) => (
                  <li key={index}>{file}</li>
                ))}
              </ul>
            ) : (
              <p>No additional files.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const sampleProject = {
  id: 1,
  title: "1 Video 60-90 seconds",
  status: "Completed",  
  startDate: "03 Oct 2024",
  completionDate: "21 Oct 2024",
  completionPercentage: 100,
  files: 1,
  noOfWords: 60,
  brief: "This project involves creating a 60-90 second video with a focus on highlighting the client’s product features.",
  additionalFiles: ["script.docx", "voiceover.mp3"]
};

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ projectId }) => {
  return (
    <div className="container mx-auto p-4 w-[auto]">
      <ProjectDetails project={sampleProject} />
    </div>
  );
};

export default ProjectOverview;
