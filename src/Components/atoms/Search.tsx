// frontend/src/components/Search.tsx

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

  const handleSearchOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchOption(event.target.value);
    // Clear previous results and errors when changing search options
    setProjects([]);
    setFiles([]);
    setError(null);
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

    try {
      let response;

      if (searchOption === 'projectTitle') {
        // Search Projects by Title
        response = await axios.get(`/api/search/projects?q=${encodeURIComponent(searchInput)}`, {
          withCredentials: true,
        });
        setProjects(response.data);
      } else if (searchOption === 'fileTitle') {
        // Search Files by Title
        response = await axios.get(`/api/search/files?q=${encodeURIComponent(searchInput)}`, {
          withCredentials: true,
        });
        setFiles(response.data);
      }

      // Provide feedback based on results
      if (
        (searchOption === 'projectTitle' && response?.data?.length === 0) ||
        (searchOption === 'fileTitle' && response?.data?.length === 0)
      ) {
        // toast.info('No results found.');
      } else {
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
            searchOption === 'projectTitle' ? 'bg-purple-700 hover:bg-purple-900' : 'bg-purple-700 hover:bg-purple-900'
          }`}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Click to Search'}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Display Search Results */}
      {searchOption === 'projectTitle' && projects.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mb-2">Project Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      )}

      {searchOption === 'fileTitle' && files.length > 0 && (
        <div>
          <h3 className="text-md font-semibold mb-2">File Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <FileCard key={file._id} file={file} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;