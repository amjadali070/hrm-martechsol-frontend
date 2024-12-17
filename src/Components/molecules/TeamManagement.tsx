import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUsers,
  FaUserTag,
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
  }>({ isOpen: false });
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    managerId?: string;
  }>({ isOpen: false });
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
      setAssignedUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching assigned users:", error);
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
      const response = await axios.put(
        `${backendUrl}/api/users/assign`,
        { managerId, userIds: selectedMembers },
        { withCredentials: true }
      );

      console.log(response.data.message);
      toast.success("Team members assigned successfully!"); // Toast notification
      closeModals();
    } catch (error) {
      console.error("Error assigning team member:", error);
    }
  };

  const handleUnassign = async (userId: string, managerId: string) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/users/unassign`,
        { userId },
        { withCredentials: true }
      );

      console.log(response.data.message);
      toast.success("Team member unassigned successfully!"); // Toast notification
      setAssignedUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error unassigning team member:", error);
    }
  };

  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 mb-20">
        <FaSpinner
          size={30}
          className="animate-spin text-blue-600 mb-2"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <ToastContainer position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
      </div>
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
                    <td className="py-3 px-4 text-sm text-gray-800 flex gap-2">
                      {role === "manager" ? (
                        <button
                          className="px-3 py-1 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                          onClick={() => handleViewTeamMembers(manager._id)}
                        >
                          <FaListUl className="inline mr-2" /> View Team
                        </button>
                      ) : (
                        <>
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
                        </>
                      )}
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
              <h3 className="text-xl font-bold">Assigned Team Members</h3>
              <button
                onClick={closeModals}
                className="text-gray-700 hover:text-gray-900"
              >
                <FaTimes />
              </button>
            </div>
            {viewLoading ? (
              <div className="flex justify-center items-center">
                <FaSpinner className="animate-spin" />
              </div>
            ) : (
              <ul className="space-y-2">
                {assignedUsers.length > 0 ? (
                  assignedUsers.map((member) => (
                    <li
                      key={member._id}
                      className="flex justify-between p-2 bg-gray-100 rounded"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{member.name}</span>
                        <span className="text-xs text-gray-500">
                          {member.personalDetails.fullJobTitle}
                        </span>
                      </div>
                      {role !== "manager" && (
                        <button
                          onClick={() =>
                            handleUnassign(member._id, viewModal.managerId!)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="p-2 bg-gray-100 rounded">
                    No assigned team members found.
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
      {assignModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[60%] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Assign Team Members</h3>
              <button
                onClick={closeModals}
                className="text-gray-700 hover:text-gray-900 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search team members by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 border border-gray-300 rounded w-full md:w-1/3"
              />

              {/* Department Filter */}
              <select
                className="p-2 border border-gray-300 rounded w-full md:w-1/4"
                onChange={(e) => {
                  const department = e.target.value;
                  const filtered = teamMembers.filter((member) =>
                    department
                      ? member.personalDetails.department === department
                      : true
                  );
                  setFilteredMembers(filtered);
                }}
              >
                <option value="">Filter by Department</option>
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
                className="p-2 border border-gray-300 rounded w-full md:w-1/4"
                onChange={(e) => {
                  const jobTitle = e.target.value;
                  const filtered = teamMembers.filter((member) =>
                    jobTitle
                      ? member.personalDetails.fullJobTitle === jobTitle
                      : true
                  );
                  setFilteredMembers(filtered);
                }}
              >
                <option value="">Filter by Job Title</option>
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
            <div className="overflow-y-auto custom-scrollbar max-h-[60vh]">
              <ul className="space-y-2">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <li
                      key={member._id}
                      className="flex justify-between items-center p-3 bg-gray-100 rounded hover:bg-gray-200 transition"
                    >
                      <div>
                        <p className="text-sm font-semibold">{member.name}</p>
                        <p className="text-xs text-gray-500">
                          {member.personalDetails.department} |{" "}
                          {member.personalDetails.fullJobTitle} |{" "}
                          {member.personalDetails.Jobcategory}
                        </p>
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
                            setSelectedMembers([
                              ...selectedMembers,
                              member._id,
                            ]);
                          }
                        }}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </li>
                  ))
                ) : (
                  <li className="p-3 bg-gray-100 text-center text-gray-700 rounded">
                    No team members found.
                  </li>
                )}
              </ul>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => handleAssign(assignModal.managerId!)}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Assign Selected Members
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 0; /* Hides scrollbar */
  }
  .custom-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`}</style>
    </div>
  );
};

export default TeamManagement;
