// frontend/src/atoms/InputMessage.tsx

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure react-toastify is installed and configured
import { AuthContext } from '../organisms/AuthContext';

interface Receiver {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  projectName: string;
  projectDetails: string;
  category: string;
  completion: string;
  projectStatus: string;
  deadline: string;
  // Include other fields as necessary
}

const InputMessage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [receiverId, setReceiverId] = useState<string>('');
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingReceivers, setLoadingReceivers] = useState<boolean>(true);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [errorReceivers, setErrorReceivers] = useState<string | null>(null);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);
  const [sending, setSending] = useState<boolean>(false); // New state for sending

  const { user } = useContext(AuthContext);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchReceivers = async () => {
      try {
        if (user?.role === 'superAdmin') {
          // Super Admins send messages to Normal Users
          const response = await axios.get(`${backendUrl}/api/superadmin/users`, { withCredentials: true });
          setReceivers(response.data);
        } else {
          // Normal Users send messages to Super Admins
          const response = await axios.get(`${backendUrl}/api/users/superadmins`, { withCredentials: true });
          setReceivers(response.data);
        }
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || 'Failed to fetch receivers.';
        setErrorReceivers(errorMsg);
        toast.error(errorMsg); // Using toast for error notifications
      } finally {
        setLoadingReceivers(false);
      }
    };

    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        let response;

        if (user?.role === 'superAdmin') {
          // Fetch projects using superAdmin API
          response = await axios.get(`${backendUrl}/api/superadmin/projects`, { withCredentials: true });
          console.log('SuperAdmin Projects Response:', response.data);
          // Since the response is an array, setProjects directly
          if (Array.isArray(response.data)) {
            setProjects(response.data);
          } else {
            // Handle unexpected response structure
            setErrorProjects('Invalid projects data format received.');
            setProjects([]);
            toast.error('Invalid projects data format received.');
          }
        } else {
          // Fetch projects using standard API
          response = await axios.get(`${backendUrl}/api/projects`, { withCredentials: true });
          console.log('Standard Projects Response:', response.data);
          // Assuming standard API returns { projects: [...], page: ..., pages: ..., total: ... }
          if (response.data && Array.isArray(response.data.projects)) {
            setProjects(response.data.projects);
          } else {
            // Handle unexpected response structure
            setErrorProjects('Invalid projects data format received.');
            setProjects([]);
            toast.error('Invalid projects data format received.');
          }
        }
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || 'Failed to fetch projects.';
        setErrorProjects(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchReceivers();
    fetchProjects();
  }, [user?.role, backendUrl]);

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(event.target.value);
  };

  const handleReceiverChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setReceiverId(event.target.value);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!receiverId) {
      toast.error('Please select a receiver.');
      return;
    }

    if (!message.trim()) {
      toast.error('Please enter a message.');
      return;
    }

    const formData = new FormData();
    formData.append('receiverId', receiverId);
    formData.append('message', message);
    if (selectedProject) formData.append('projectId', selectedProject);
    if (file) formData.append('file', file);

    try {
      setSending(true); // Start sending
      const response = await axios.post(`${backendUrl}/api/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log('Message sent:', response.data);
      toast.success('Message sent successfully.');

      // Reset form
      setSelectedProject('');
      setReceiverId('');
      setMessage('');
      setFile(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to send message.';
      console.error('Error sending message:', errorMsg);
      toast.error(errorMsg);
    } finally {
      setSending(false); // End sending
    }
  };

  return (
    <div className="max-w-8xl mx-auto my-8 p-6 border border-gray-300 shadow rounded bg-white">
      <h2 className="text-lg font-semibold mb-4">Write Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Receiver Selection */}
        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="receiver">
            Receiver
          </label>
          <select
            id="receiver"
            value={receiverId}
            onChange={handleReceiverChange}
            className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none"
            required
          >
            <option value="">Select Receiver</option>
            {loadingReceivers ? (
              <option disabled>Loading Receivers...</option>
            ) : errorReceivers ? (
              <option disabled>{errorReceivers}</option>
            ) : receivers.length > 0 ? (
              receivers.map((receiver) => (
                <option key={receiver._id} value={receiver._id}>
                  {receiver.name} ({receiver.email})
                </option>
              ))
            ) : (
              <option disabled>No Receivers Available</option>
            )}
          </select>
        </div>

        {/* Project Selection */}
        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="project">
            Project
          </label>
          <select
            id="project"
            value={selectedProject}
            onChange={handleProjectChange}
            className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none"
          >
            <option value="">Select Project (Optional)</option>
            {loadingProjects ? (
              <option disabled>Loading Projects...</option>
            ) : errorProjects ? (
              <option disabled>{errorProjects}</option>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.projectName}
                </option>
              ))
            ) : (
              <option disabled>No Projects Available</option>
            )}
          </select>
        </div>

        {/* Message Input */}
        <div className="flex items-start">
          <label className="w-1/4 text-gray-700" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            rows={4}
            className="w-3/4 p-2 border border-gray-300 rounded focus:outline-none"
            required
          ></textarea>
        </div>

        {/* File Upload */}
        <div className="flex items-center">
          <label className="w-1/4 text-gray-700" htmlFor="file">
            Upload File (Optional)
          </label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            className="w-1/4"
          />
          <span className="w-2/4 pl-4 text-gray-600">
            {file ? file.name : 'No File Selected'}
          </span>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-purple-700 rounded hover:bg-purple-800 disabled:bg-purple-400"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputMessage;