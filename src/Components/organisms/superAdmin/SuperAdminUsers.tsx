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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
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
  }, []);

  const deleteUser = async (userId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      setDeletingUserId(userId);
      await axios.delete(`${backendUrl}/api/superadmin/users/${userId}`, { withCredentials: true });
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      alert('User deleted successfully.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="overflow-hidden px-4 pt-2.5 bg-white rounded-3xl">
      <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">All Users</h2>
      <table className="min-w-full mt-4 table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th> {/* New Actions Column */}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="text-center border-t">
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
  );
};

export default SuperAdminUsers;