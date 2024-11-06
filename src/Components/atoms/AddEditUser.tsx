import React, { useState, useEffect } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import axios from 'axios';

interface SubUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isSubUser: boolean;
  permissions: {
    allowSettings: boolean;
    allowNewOrders: boolean;
    allowInvoices: boolean;
  };
}

const AddEditUsers: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [subUsers, setSubUsers] = useState<SubUser[]>([]);

  useEffect(() => {
    fetchSubUsers();
  }, []);

  const fetchSubUsers = async () => {
    try {
      const response = await axios.get<SubUser[]>('/api/subusers', { withCredentials: true });
      setSubUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch sub-users:', error);
      setMessage('Failed to fetch sub-users.');
    }
  };

  const handleAddSubUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter an email address.');
      return;
    }

    try {
      const response = await axios.post(
        '/api/subusers/invite',
        { email },
        {
          withCredentials: true, // Ensure cookies are sent if needed
        }
      );
      setMessage(response.data.message);
      setEmail('');
      setIsOpen(false);
      fetchSubUsers(); // Refresh the sub-users list
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || 'Failed to send invitation.');
      } else {
        setMessage('Failed to send invitation.');
      }
    }
  };

  const handlePermissionChange = async (subUserId: string, permission: keyof SubUser['permissions'], value: boolean) => {
    try {
      const response = await axios.patch(
        `/api/subusers/${subUserId}/permissions`,
        { [permission]: value },
        {
          withCredentials: true,
        }
      );
      setMessage(response.data.message);
      // Update the subUsers state
      setSubUsers((prevSubUsers) =>
        prevSubUsers.map((user) =>
          user._id === subUserId ? { ...user, permissions: response.data.subUser.permissions } : user
        )
      );
    } catch (error) {
      console.error('Failed to update permissions:', error);
      setMessage('Failed to update permissions.');
    }
  };

  const handleDeleteSubUser = async (subUserId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this sub-user?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/api/subusers/${subUserId}`, { withCredentials: true });
      setMessage(response.data.message);
      // Remove the sub-user from the state
      setSubUsers((prevSubUsers) => prevSubUsers.filter((user) => user._id !== subUserId));
    } catch (error) {
      console.error('Failed to delete sub-user:', error);
      setMessage('Failed to delete sub-user.');
    }
  };

  return (
    <div className="max-w-8xl mx-auto my-8 p-4 sm:p-6 lg:p-8 border border-gray-300 shadow-md rounded bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">Add/Edit Users</h2>
        <AiOutlinePlusCircle
          className="text-green-600 w-8 h-8 sm:w-6 sm:h-6 cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </div>

      {/* {message && <p className="mb-4 text-red-500">{message}</p>} */}

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Add Sub-User</h2>
            <form onSubmit={handleAddSubUser}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="border border-gray-300 p-2 w-full mb-4 rounded"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-purple-700 text-white px-4 py-2 rounded mr-2 transition"
                >
                  Send Invitation
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table for displaying sub-users */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-2 sm:px-4 py-2 border-r text-sm sm:text-base">#</th>
              <th className="px-2 sm:px-4 py-2 border-r text-sm sm:text-base">Name</th>
              <th className="px-2 sm:px-4 py-2 border-r text-sm sm:text-base">Email</th>
              <th className="px-2 sm:px-4 py-2 border-r text-sm sm:text-base">Added on</th>
              <th className="px-2 sm:px-4 py-2 border-r text-sm sm:text-base">Role</th>
              <th className="px-2 sm:px-4 py-2 border-r text-sm sm:text-base">Allow Settings</th>
              <th className="px-2 sm:px-4 py-2 border-r text-sm sm:text-base">Allow to Place New Order</th>
              <th className="px-2 sm:px-4 py-2 text-sm sm:text-base">Allow Invoices</th>
              <th className="px-2 sm:px-4 py-2 text-sm sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subUsers.length === 0 ? (
              <tr>
                <td className="px-2 sm:px-4 py-2 text-center" colSpan={9}>
                  No sub-users found.
                </td>
              </tr>
            ) : (
              subUsers.map((user, index) => (
                <tr key={user._id} className="border-b">
                  <td className="px-2 sm:px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-2 sm:px-4 py-2">{user.name || 'N/A'}</td>
                  <td className="px-2 sm:px-4 py-2">{user.email}</td>
                  <td className="px-2 sm:px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-2 sm:px-4 py-2">{user.isSubUser ? 'Sub-User' : 'Main User'}</td>
                  <td className="px-2 sm:px-4 py-2">
                    <input
                      type="checkbox"
                      checked={user.permissions.allowSettings}
                      onChange={(e) => handlePermissionChange(user._id, 'allowSettings', e.target.checked)}
                    />
                  </td>
                  <td className="px-2 sm:px-4 py-2">
                    <input
                      type="checkbox"
                      checked={user.permissions.allowNewOrders}
                      onChange={(e) => handlePermissionChange(user._id, 'allowNewOrders', e.target.checked)}
                    />
                  </td>
                  <td className="px-2 sm:px-4 py-2">
                    <input
                      type="checkbox"
                      checked={user.permissions.allowInvoices}
                      onChange={(e) => handlePermissionChange(user._id, 'allowInvoices', e.target.checked)}
                    />
                  </td>
                  <td className="px-2 sm:px-4 py-2">
                    <button
                      onClick={() => handleDeleteSubUser(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddEditUsers;