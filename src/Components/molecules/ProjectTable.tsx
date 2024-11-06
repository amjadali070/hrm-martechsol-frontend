import React, { useState } from 'react';

interface Project {
  title: string;
  category: string;
  completion: string;
  status: string;
  eta: string;
  invoice: string;
  riForm: string;
  imageUrl: string;
}

interface ProjectTableProps {
  projects: Project[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const indexOfLastProject = currentPage * entriesPerPage;
  const indexOfFirstProject = indexOfLastProject - entriesPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / entriesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col px-1.5 pt-1.5 pb-4 mt-2 w-full text-lg bg-blue-50 rounded-md border border-solid border-slate-300 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between px-4 py-5 w-full font-medium bg-white rounded-md border border-solid border-slate-300 text-stone-900 max-md:max-w-full">
        <div>Project Title</div>
        <div className="flex flex-wrap gap-10 max-md:max-w-full">
          <div className="flex gap-7">
            <div className="grow">Category</div>
            <div>Completion</div>
            <div className="basis-auto">Project Status</div>
          </div>
          <div>ETA</div>
          <div className="flex gap-4">
            <div>Invoice</div>
            <div>RI Form</div>
          </div>
        </div>
      </div>

      {currentProjects.length === 0 ? (
        <div className="flex justify-center items-center w-full h-10 mt-5 text-gray-500">
          No data available
        </div>
      ) : (
        currentProjects.map((project, index) => (
          <><div key={index} className="flex flex-wrap gap-5 justify-between py-2.5 pr-11 pl-4 mt-1.5 w-full text-gray-500 bg-white rounded-md border border-solid border-slate-300 max-md:pr-5 max-md:max-w-full">
            <div className="flex gap-2.5">
              <img
                loading="lazy"
                src={project.imageUrl}
                alt={project.title}
                className="object-contain shrink-0 rounded-none aspect-square w-[41px]" />
              <div className="my-auto basis-auto">{project.title}</div>
            </div>
            <div className="flex gap-12 items-center my-auto max-md:max-w-full">
              <div className="flex gap-1 items-center self-stretch whitespace-nowrap">
                <div className="gap-2.5 self-stretch px-2.5 py-1 my-auto bg-indigo-100 rounded-md min-h-[30px]">
                  {project.category}
                </div>
              </div>
              <div className="gap-2.5 self-stretch px-2.5 py-1 text-green-600 whitespace-nowrap bg-emerald-100 rounded-md border border-green-600 border-solid min-h-[30px]">
                {project.status}
              </div>
              <div className="self-stretch my-auto">{project.completion}</div>
              <div className="self-stretch my-auto font-medium">{project.eta}</div>
              <div className="self-stretch my-auto">{project.invoice}</div>
              <div className="self-stretch my-auto">{project.riForm}</div>
            </div>
          </div><div className="flex justify-between items-center mt-4 px-4 w-full">
              <div className="flex items-center gap-2">
                <label htmlFor="entries">Show</label>
                <select
                  id="entries"
                  value={entriesPerPage}
                  onChange={handleEntriesChange}
                  className="border border-gray-300 rounded-md p-1"
                >
                  <option value={1}>1</option>
                  <option value={3}>3</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                </select>
                <span>entries</span>
              </div>

              <div>
                Showing {projects.length === 0 ? 0 : indexOfFirstProject + 1} to{' '}
                {Math.min(indexOfLastProject, projects.length)} of {projects.length} entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  className={`border border-gray-300 rounded-md p-1 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="border border-gray-300 rounded-md px-2 py-1 bg-blue-600 text-white">
                  {currentPage}
                </span>
                <button
                  onClick={handleNextPage}
                  className={`border border-gray-300 rounded-md p-1 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div></>



        ))
      )}

     
    </div>
  );
};

export default ProjectTable;