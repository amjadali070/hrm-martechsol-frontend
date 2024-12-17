import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUsers,
  FaUserTag,
  FaListUl,
  FaPlus,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";

interface Manager {
  _id: string;
  name: string;
  personalDetails: {
    department: string;
    fullJobTitle: string;
  };
}

interface TeamMember {
  _id: string;
  name: string;
  personalDetails: {
    department: string;
    fullJobTitle: string;
    Jobcategory: string; // Added category property
  };
}

const TeamManagement: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [dummyTeamMembers, setDummyTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    managerId?: string;
  }>({ isOpen: false });
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    managerId?: string;
  }>({ isOpen: false });
  const [loading, setLoading] = useState<boolean>(true);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Fetch managers
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/users/managers`, {
          withCredentials: true,
        });
        setManagers(response.data || []);
      } catch (error) {
        console.error("Error fetching managers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [backendUrl]);

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/users/normal`, {
          withCredentials: true,
        });
        const users = response.data; // Adjust based on your API response structure
        setDummyTeamMembers(users || []);
        setFilteredMembers(users || []); // Initialize filtered members
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [backendUrl]);

  // Handle search term change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = dummyTeamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(term) ||
        member.personalDetails.fullJobTitle.toLowerCase().includes(term) ||
        member.personalDetails.department.toLowerCase().includes(term) ||
        member.personalDetails.Jobcategory.toLowerCase().includes(term) // Added category filter
    );
    setFilteredMembers(filtered);
  };

  const handleViewTeamMembers = (managerId: string) => {
    setViewModal({ isOpen: true, managerId });
  };

  const handleAssignTeamMembers = (managerId: string) => {
    setAssignModal({ isOpen: true, managerId });
    setSelectedMembers([]); // Reset selected members when opening the modal
  };

  const closeModals = () => {
    setViewModal({ isOpen: false });
    setAssignModal({ isOpen: false });
    setSearchTerm(""); // Reset search term on close
    setFilteredMembers(dummyTeamMembers); // Reset filtered members
  };

  const handleAssign = async (managerId: string) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/users/assign`,
        { managerId, userIds: selectedMembers },
        { withCredentials: true }
      );

      console.log(response.data.message); // Handle success message
      closeModals(); // Close the modal after assignment
    } catch (error) {
      console.error("Error assigning team member:", error);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-purple-900">
                <th className="py-3 px-4 text-left text-sm font-medium text-white">
                  S.No
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white">
                  Department
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-white">
                  Job Title
                </th>
                {/* <th className="py-3 px-4 text-left text-sm font-medium text-white">Category</th> New Category Column */}
                <th className="py-3 px-4 text-left text-sm font-medium text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(managers) && managers.length > 0 ? (
                managers.map((manager, index) => (
                  <tr key={manager._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {manager.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {manager.personalDetails.department}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {manager.personalDetails.fullJobTitle}
                    </td>
                    {/* <td className="py-3 px-4 text-sm text-gray-800">{manager.personalDetails.Jobcategory}</td> Display Category */}
                    <td className="py-3 px-4 text-sm text-gray-800 flex gap-2">
                      <button
                        className="px-3 py-1 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                        onClick={() => handleViewTeamMembers(manager._id)}
                      >
                        <FaListUl className="inline mr-2" /> View Team
                      </button>
                      <button
                        className="px-3 py-1 text-white bg-green-600 rounded-full hover:bg-green-700"
                        onClick={() => handleAssignTeamMembers(manager._id)}
                      >
                        <FaPlus className="inline mr-2" /> Assign Members
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-3 px-4 text-sm text-gray-800 text-center"
                  >
                    No managers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Team Modal */}
      {viewModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Team Members</h3>
              <button
                onClick={closeModals}
                className="text-gray-700 hover:text-gray-900"
              >
                <FaTimes />
              </button>
            </div>
            <ul className="space-y-2">
              {Array.isArray(dummyTeamMembers) &&
              dummyTeamMembers.length > 0 ? (
                dummyTeamMembers.map((member) => (
                  <li key={member._id} className="p-2 bg-gray-100 rounded">
                    {member.name}
                  </li>
                ))
              ) : (
                <li className="p-2 bg-gray-100 rounded">
                  No team members found.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Assign Members Modal */}
      {assignModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[60%] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Assign Team Members</h3>
              <button
                onClick={closeModals}
                className="text-gray-700 hover:text-gray-900"
              >
                <FaTimes />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search by name, job title, department, or category"
              value={searchTerm}
              onChange={handleSearchChange}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <ul className="space-y-2">
              {Array.isArray(filteredMembers) && filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <li
                    key={member._id}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded"
                  >
                    <div>
                      <strong>{member.name}</strong>
                      <p className="text-sm text-gray-600">
                        {member.personalDetails.department}
                      </p>
                      <p className="text-sm text-gray-600">
                        {member.personalDetails.fullJobTitle}
                      </p>
                      <p className="text-sm text-gray-600">
                        {member.personalDetails.Jobcategory}
                      </p>{" "}
                      {/* Display Category */}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member._id)}
                      onChange={() => {
                        if (selectedMembers.includes(member._id)) {
                          setSelectedMembers(
                            selectedMembers.filter((id) => id !== member._id)
                          );
                        } else {
                          setSelectedMembers([...selectedMembers, member._id]);
                        }
                      }}
                    />
                  </li>
                ))
              ) : (
                <li className="p-2 bg-gray-100 rounded">
                  No team members found.
                </li>
              )}
            </ul>
            <button
              onClick={() => handleAssign(assignModal.managerId!)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Assign Selected Members
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
