import React, { useEffect} from 'react';
import { useParams } from 'react-router-dom';
import ProjectOverview from '../molecules/ProjectOverView';
import ProjectFilesAndCorrespondence from '../molecules/ProjectFilesAndCorrespondence';

interface DashboardProps {}

const ProjectDetails: React.FC<DashboardProps> = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      console.log(`Fetching details for project ID: ${id}`);
    }
  }, [id]);

  return (
    <div className="overflow-hidden pt-2.5 bg-white rounded-3xl w-[full]">
      <div className="flex gap-3 max-md:flex-col">
        <div className="flex flex-col w-[100%] max-md:ml-0 max-md:w-[100%]">
          <div className="flex flex-col w-full max-md:mt-6 max-md:max-w-full">
            <section>
              <ProjectOverview projectId={id} />
              <ProjectFilesAndCorrespondence projectId={id} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
