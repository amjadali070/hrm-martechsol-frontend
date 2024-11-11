// frontend/src/molecules/SuperAdmin/SuperAdminUsers.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const SuperAdminUsers: React.FC = () => {
  // Existing state variables
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // New state variables for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10); // Default entries per page

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/superadmin/users`, { withCredentials: true });
        setUsers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [backendUrl]);

  const deleteUser = async (userId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      setDeletingUserId(userId);
      await axios.delete(`${backendUrl}/api/superadmin/users/${userId}`, { withCredentials: true });
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));

      // Adjust currentPage if necessary after deletion
      const totalPagesAfterDeletion = Math.ceil((users.length - 1) / entriesPerPage);
      if (currentPage > totalPagesAfterDeletion && totalPagesAfterDeletion > 0) {
        setCurrentPage(totalPagesAfterDeletion);
      }

      alert('User deleted successfully.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeletingUserId(null);
    }
  };

  // Pagination calculations
  const indexOfLastUser = currentPage * entriesPerPage;
  const indexOfFirstUser = indexOfLastUser - entriesPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / entriesPerPage);

  // Handle Entries Per Page Change
  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when entries per page changes
  };

  // Handle Previous Page
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Handle Next Page
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Effect to adjust currentPage if users data changes (e.g., after deletion)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [users, currentPage, totalPages]);

  if (loading) return <div className="text-center mt-4">Loading users...</div>;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="flex flex-col px-4 pt-4 pb-4 mt-2 w-full bg-blue-50 rounded-md border border-solid border-slate-300 max-w-full">
      <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">All User(s)</h2>
      
      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full mt-4 table-auto">
          <thead>
            <tr className='bg-white divide-y divide-gray-200'>
              {/* New S.No Header */}
              <th scope="col" className="px-4 py-2">S.No</th>
              <th scope="col" className="px-4 py-2">Name</th>
              <th scope="col" className="px-4 py-2">Email</th>
              <th scope="col" className="px-4 py-2">Role</th>
              <th scope="col" className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {currentUsers.map((user, index) => (
              <tr key={user._id} className="text-center border-t">
                {/* Display S.No */}
                <td className="px-4 py-2">{indexOfFirstUser + index + 1}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                    disabled={deletingUserId === user._id}
                  >
                    {deletingUserId === user._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0">
        {/* Entries Per Page Selector */}
        <div className="flex items-center">
          <span className="text-sm">Show</span>
          <select
            value={entriesPerPage}
            onChange={handleEntriesChange}
            className="ml-2 border rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span className="ml-2 text-sm">entries</span>
        </div>

        {/* Showing X of Y entries */}
        <div className="text-sm">
          Showing {users.length === 0 ? 0 : indexOfFirstUser + 1}-
          {Math.min(indexOfLastUser, users.length)} of {users.length} entries
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`border rounded-md px-3 py-1 text-sm ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            Previous
          </button>
          <span className="border rounded-md px-3 py-1 bg-indigo-600 text-white text-sm">
            {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`border rounded-md px-3 py-1 text-sm ${
              currentPage === totalPages || totalPages === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminUsers;