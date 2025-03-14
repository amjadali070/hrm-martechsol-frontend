// src/components/TeamManagement.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaInbox,
  FaListUl,
  FaPlus,
  FaSpinner,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import useUser from "../../hooks/useUser";
import { ToastContainer, toast } from "react-toastify"; // Importing Toastify
import "react-toastify/dist/ReactToastify.css"; // Importing Toastify CSS

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
  email: string; // Added email field
  personalDetails: {
    department: string;
    fullJobTitle: string;
    Jobcategory: string; // Added category property
  };
}

const TeamManagement: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    managerId?: string;
  }>({
    isOpen: false,
  });
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    managerId?: string;
  }>({
    isOpen: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [assignedUsers, setAssignedUsers] = useState<TeamMember[]>([]);
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const { user } = useUser();
  const role = user?.role;

  useEffect(() => {
    if (user) {
      setUserLoading(false);
    }
  }, [user]);

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
        toast.error("Failed to fetch managers.");
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [backendUrl]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/users/normal`, {
          withCredentials: true,
        });
        const users = response.data;
        setTeamMembers(users || []);
        setFilteredMembers(users || []);
      } catch (error) {
        console.error("Error fetching team members:", error);
        toast.error("Failed to fetch team members.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [backendUrl]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = teamMembers.filter((member) => {
      const nameMatch = member.name?.toLowerCase().includes(term);
      const jobTitleMatch = member.personalDetails.fullJobTitle
        ?.toLowerCase()
        .includes(term);
      const departmentMatch = member.personalDetails.department
        ?.toLowerCase()
        .includes(term);
      const categoryMatch =
        member.personalDetails.Jobcategory?.toLowerCase().includes(term);

      return nameMatch || jobTitleMatch || departmentMatch || categoryMatch;
    });
    setFilteredMembers(filtered);
  };

  const handleViewTeamMembers = async (managerId: string) => {
    setViewModal({ isOpen: true, managerId });
    setViewLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/users/assigned/${managerId}`,
        {
          withCredentials: true,
        }
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        setAssignedUsers(response.data);
      } else {
        // If no data or empty array returned
        setAssignedUsers([]);
      }
    } catch (error) {
      // console.error("Error fetching assigned users:", error);
      // toast.error("Failed to fetch assigned team members.");
      setAssignedUsers([]);
    } finally {
      setViewLoading(false);
    }
  };

  const handleAssignTeamMembers = (managerId: string) => {
    setAssignModal({ isOpen: true, managerId });
    setSelectedMembers([]);
  };

  const closeModals = () => {
    setViewModal({ isOpen: false });
    setAssignModal({ isOpen: false });
    setSearchTerm("");
    setFilteredMembers(teamMembers);
  };

  const handleAssign = async (managerId: string) => {
    try {
      await axios.put(
        `${backendUrl}/api/users/assign`,
        { managerId, userIds: selectedMembers },
        { withCredentials: true }
      );

      toast.success("Team members assigned successfully!");
      closeModals();
    } catch (error) {
      console.error("Error assigning team member:", error);
      toast.error("Failed to assign team members.");
    }
  };

  const handleUnassign = async (userId: string, managerId: string) => {
    try {
      await axios.put(
        `${backendUrl}/api/users/unassign`,
        { userId },
        { withCredentials: true }
      );
      toast.success("Team member unassigned successfully!"); // Toast notification
      setAssignedUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error unassigning team member:", error);
      toast.error("Failed to unassign team member.");
    }
  };

  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <FaSpinner
          size={40}
          className="animate-spin text-indigo-500 mb-4"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-gray-50 rounded-lg mb-8">
      <ToastContainer position="top-center" />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          Team Management
        </h2>
        {/* Optional: Add a global action button if needed */}
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner size={30} className="animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-purple-900 text-white">
                <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                  S.No
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                  Department
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                  Job Title
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(managers) && managers.length > 0 ? (
                managers.map((manager, index) => (
                  <tr
                    key={manager._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {manager.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {manager.personalDetails.department}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {manager.personalDetails.fullJobTitle}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 flex space-x-3">
                      <button
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        onClick={() => handleViewTeamMembers(manager._id)}
                      >
                        <FaListUl className="mr-2" />
                        View Team
                      </button>
                      {role !== "manager" && (
                        <button
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                          onClick={() => handleAssignTeamMembers(manager._id)}
                        >
                          <FaPlus className="mr-2" />
                          Assign Members
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 px-6 text-sm text-gray-700 text-center"
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white p-8 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-screen overflow-y-auto relative">
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
              aria-label="Close View Team Modal"
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Assigned Team Members
            </h3>
            {viewLoading ? (
              <div className="flex justify-center items-center h-32">
                <FaSpinner size={30} className="animate-spin text-indigo-500" />
              </div>
            ) : (
              <ul className="space-y-4">
                {assignedUsers.length > 0 ? (
                  assignedUsers.map((member) => (
                    <li
                      key={member._id}
                      className="flex justify-between items-center p-4 bg-gray-100 rounded-md"
                    >
                      <div>
                        <p className="text-md font-semibold text-gray-800">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.personalDetails.fullJobTitle}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                      {role !== "manager" && (
                        <button
                          onClick={() =>
                            handleUnassign(member._id, viewModal.managerId!)
                          }
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Unassign ${member.name}`}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-600">
                    <div className="flex flex-col items-center">
                      <FaInbox size={30} className="text-gray-400 mb-4" />
                      <span className="text-lg font-medium">
                        No assigned team members found.
                      </span>
                    </div>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
      {/* Assign Team Members Modal */}
      {assignModal.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white p-8 rounded-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-screen overflow-y-auto relative">
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
              aria-label="Close Assign Team Members Modal"
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Assign Team Members
            </h3>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search team members by name, job title, department..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Search Team Members"
              />
              {/* Department Filter */}
              <select
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  const department = e.target.value;
                  const filtered = teamMembers.filter((member) =>
                    department
                      ? member.personalDetails.department === department
                      : true
                  );
                  setFilteredMembers(filtered);
                }}
                aria-label="Filter by Department"
              >
                <option value="">All Departments</option>
                {Array.from(
                  new Set(teamMembers.map((m) => m.personalDetails.department))
                ).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {/* Job Title Filter */}
              <select
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  const jobTitle = e.target.value;
                  const filtered = teamMembers.filter((member) =>
                    jobTitle
                      ? member.personalDetails.fullJobTitle === jobTitle
                      : true
                  );
                  setFilteredMembers(filtered);
                }}
                aria-label="Filter by Job Title"
              >
                <option value="">All Job Titles</option>
                {Array.from(
                  new Set(
                    teamMembers.map((m) => m.personalDetails.fullJobTitle)
                  )
                ).map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
            {/* Team Member List */}
            <div className="max-h-96 overflow-y-auto mb-6">
              <ul className="space-y-3">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <li
                      key={member._id}
                      className="flex items-center justify-between p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member._id)}
                          onChange={() => {
                            if (selectedMembers.includes(member._id)) {
                              setSelectedMembers(
                                selectedMembers.filter(
                                  (id) => id !== member._id
                                )
                              );
                            } else {
                              setSelectedMembers([
                                ...selectedMembers,
                                member._id,
                              ]);
                            }
                          }}
                          className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          aria-label={`Select ${member.name}`}
                        />
                        <div>
                          <p className="text-md font-semibold text-gray-800">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {member.personalDetails.fullJobTitle} |{" "}
                            {member.personalDetails.department} |{" "}
                            {member.personalDetails.Jobcategory}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-600">
                    No team members found.
                  </li>
                )}
              </ul>
            </div>
            {/* Assign Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleAssign(assignModal.managerId!)}
                className={`px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition ${
                  selectedMembers.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={selectedMembers.length === 0}
              >
                Assign Selected Members
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default TeamManagement;
