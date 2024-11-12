import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProjectCard from './projects/ProjectCard';
import FileCard from './projects/FileCard';

interface Project {
  _id: string;
  projectName: string;
  category: string;
  completion: string;
  projectStatus: string;
  deadline: string;
  invoice: boolean;
  riForm: string;
  filePath: string;
}

interface File {
  _id: string;
  fileName: string;
  project: {
    _id: string;
    projectName: string;
  };
  filePath: string;
}

const Search: React.FC = () => {
  const [searchOption, setSearchOption] = useState<string>('projectTitle');
  const [searchInput, setSearchInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchCompleted, setSearchCompleted] = useState<boolean>(false); // New state to track search completion

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const handleSearchOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchOption(event.target.value);
    // Clear previous results and errors when changing search options
    setProjects([]);
    setFiles([]);
    setError(null);
    setSearchCompleted(false); // Reset the search completed flag when changing the option
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchClick = async () => {
    if (!searchInput.trim()) {
      toast.error('Please enter a search query.');
      return;
    }

    setLoading(true);
    setError(null);
    setProjects([]);
    setFiles([]);
    setSearchCompleted(false); // Reset search completion status when starting a new search

    try {
      let response;

      if (searchOption === 'projectTitle') {
        // Search Projects by Title
        response = await axios.get(`${backendUrl}/api/search/projects?q=${encodeURIComponent(searchInput)}`, {
          withCredentials: true,
        });
        setProjects(response.data);
      } else if (searchOption === 'fileTitle') {
        // Search Files by Title
        response = await axios.get(`${backendUrl}/api/search/files?q=${encodeURIComponent(searchInput)}`, {
          withCredentials: true,
        });
        setFiles(response.data);
      }

      setSearchCompleted(true); // Mark search as completed

      // Provide feedback based on results
      if (
        (searchOption === 'projectTitle' && response?.data?.length === 0) ||
        (searchOption === 'fileTitle' && response?.data?.length === 0)
      ) {
        // Optionally show a toast here for no results
        // toast.info('No results found.');
      } else {
        // Optionally show a success message after successful search
        // toast.success('Search completed successfully.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred during the search.');
      toast.error(err.response?.data?.message || 'An error occurred during the search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-8xl mx-auto my-8 p-6 border border-gray-300 shadow-md rounded bg-white">
      <h2 className="text-lg font-semibold mb-4">Search</h2>
      <div className="flex items-center space-x-4 mb-4">
        <label>
          <input
            type="radio"
            value="projectTitle"
            checked={searchOption === 'projectTitle'}
            onChange={handleSearchOptionChange}
            className="mr-2"
          />
          Search by Project Title
        </label>
        <label>
          <input
            type="radio"
            value="fileTitle"
            checked={searchOption === 'fileTitle'}
            onChange={handleSearchOptionChange}
            className="mr-2"
          />
          Search by File Title
        </label>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          placeholder={`Enter ${searchOption === 'projectTitle' ? 'Project' : 'File'} Title`}
          value={searchInput}
          onChange={handleSearchInputChange}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSearchClick}
          className={`px-4 py-2 font-semibold text-white rounded ${
            searchOption === 'projectTitle' ? 'bg-[#ff6600] hover:bg-[#ff6600]' : 'bg-[#ff6600] hover:bg-[#ff6600]'
          }`}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Click to Search'}
        </button>
      </div>

      {error && <div className="text-gray-500">No files found based on your search.</div>}

      {searchOption === 'projectTitle' && searchCompleted && projects.length > 0 ? (
        <div>
          <h3 className="text-md font-semibold mb-2">Project Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      ) : searchOption === 'projectTitle' && searchCompleted && projects.length === 0 ? (
        <div className="text-gray-500">No projects found based on your search.</div>
      ) : null}

      {/* File Results */}
      {searchOption === 'fileTitle' && searchCompleted && files.length > 0 ? (
        <div>
          <h3 className="text-md font-semibold mb-2">File Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <FileCard key={file._id} file={file} />
            ))}
          </div>
        </div>
      ) : searchOption === 'fileTitle' && searchCompleted && files.length === 0 ? (
        <div className="text-gray-500">No files found based on your search.</div>
      ) : null}
    </div>
  );
};

export default Search;