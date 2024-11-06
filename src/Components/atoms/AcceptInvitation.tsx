import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const AcceptInvitation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get('token') || '';

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const handleAcceptInvitation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !password || !confirmPassword) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/subusers/accept`, {
        token,
        name,
        password,
      });

      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || 'An error occurred.');
      } else {
        setMessage('An error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Accept Invitation</h2>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        <form onSubmit={handleAcceptInvitation}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter a password"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800 transition"
          >
            Accept Invitation
          </button>
        </form>
      </div>
    </div>
  );
};

export default AcceptInvitation