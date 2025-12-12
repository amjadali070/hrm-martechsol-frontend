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
  FaUsersCog,
  FaSearch,
  FaFilter,
  FaUserTie,
  FaUserPlus
} from "react-icons/fa";
import useUser from "../../hooks/useUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  email: string;
  personalDetails: {
    department: string;
    fullJobTitle: string;
    Jobcategory: string;
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
  const [assignedUsers, setAssignedUsers] = useState<TeamMember[]>([]);
  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const { user } = useUser();
  const role = user?.role;

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
        const response = await axios.get(`${backendUrl}/api/users/normal`, {
          withCredentials: true,
        });
        const users = response.data;
        setTeamMembers(users || []);
        setFilteredMembers(users || []);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, [backendUrl]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = teamMembers.filter((member) => {
        const name = member.name?.toLowerCase() || "";
        const jobTitle = member.personalDetails.fullJobTitle?.toLowerCase() || "";
        const department = member.personalDetails.department?.toLowerCase() || "";
        
        return name.includes(term) || jobTitle.includes(term) || department.includes(term);
    });
    setFilteredMembers(filtered);
  };

  const handleViewTeamMembers = async (managerId: string) => {
    setViewModal({ isOpen: true, managerId });
    setViewLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/users/assigned/${managerId}`,
        { withCredentials: true }
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        setAssignedUsers(response.data);
      } else {
        setAssignedUsers([]);
      }
    } catch (error) {
      setAssignedUsers([]);
    } finally {
      setViewLoading(false);
    }
  };

  const handleAssignTeamMembers = (managerId: string) => {
    setAssignModal({ isOpen: true, managerId });
    setSelectedMembers([]);
    setSearchTerm("");
    setFilteredMembers(teamMembers);
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
      toast.success("Member unassigned successfully!");
      setAssignedUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error unassigning team member:", error);
      toast.error("Failed to unassign team member.");
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      <ToastContainer position="top-center" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
             <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
               <FaUsersCog className="text-gunmetal-600 text-xl" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                   Team Management
                </h2>
                <p className="text-sm text-slate-grey-500">
                   Organize team structures and assign members to managers.
                </p>
             </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
            <FaSpinner size={32} className="animate-spin mb-3 text-gunmetal-500" />
            <p className="text-slate-grey-500 font-medium">Loading managers...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-platinum-200 shadow-sm">
          <table className="w-full text-left bg-white border-collapse">
            <thead className="bg-alabaster-grey-50 border-b border-platinum-200">
              <tr>
                <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Manager Name</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Department</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Job Title</th>
                <th className="py-3 px-6 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-platinum-100">
              {Array.isArray(managers) && managers.length > 0 ? (
                managers.map((manager) => (
                  <tr key={manager._id} className="hover:bg-alabaster-grey-50/50 transition-colors">
                    <td className="py-4 px-6">
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gunmetal-50 flex items-center justify-center text-gunmetal-600 text-xs font-bold">
                                 {manager.name.charAt(0)}
                             </div>
                             <span className="text-sm font-semibold text-gunmetal-900">{manager.name}</span>
                         </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-grey-600">
                      {manager.personalDetails.department}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-grey-600">
                      {manager.personalDetails.fullJobTitle}
                    </td>
                    <td className="py-4 px-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                           <button
                             onClick={() => handleViewTeamMembers(manager._id)}
                             className="flex items-center gap-2 px-3 py-1.5 bg-white border border-platinum-200 text-gunmetal-600 rounded-lg hover:bg-platinum-50 hover:text-gunmetal-900 transition-all font-medium text-xs shadow-sm"
                           >
                             <FaListUl />
                             View Team
                           </button>
                           {role !== "manager" && (
                             <button
                               onClick={() => handleAssignTeamMembers(manager._id)}
                               className="flex items-center gap-2 px-3 py-1.5 bg-gunmetal-900 text-white rounded-lg hover:bg-gunmetal-800 transition-all font-medium text-xs shadow-sm"
                             >
                               <FaUserPlus />
                               Assign
                             </button>
                           )}
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-grey-400">
                      <div className="flex flex-col items-center">
                        <FaInbox size={32} className="opacity-50 mb-2" />
                        <span className="text-sm font-medium">No managers found.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Team Modal */}
      {viewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl border border-platinum-200 flex flex-col max-h-[80vh]">
             <div className="flex justify-between items-center px-6 py-4 border-b border-platinum-200">
                <div className="flex items-center gap-2">
                     <FaUserTie className="text-gunmetal-600" />
                     <h3 className="font-bold text-gunmetal-900 text-lg">Assigned Team Members</h3>
                </div>
                <button
                onClick={closeModals}
                className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors bg-platinum-50 rounded-full p-2"
                >
                <FaTimes size={16} />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-alabaster-grey-50/30">
                {viewLoading ? (
                    <div className="flex flex-col items-center justify-center h-48">
                        <FaSpinner size={32} className="animate-spin mb-3 text-gunmetal-500" />
                        <span className="text-sm text-slate-grey-500">Loading team...</span>
                    </div>
                ) : (
                <ul className="space-y-3">
                    {assignedUsers.length > 0 ? (
                    assignedUsers.map((member) => (
                        <li key={member._id} className="flex justify-between items-center p-4 bg-white border border-platinum-200 rounded-xl shadow-sm hover:border-gunmetal-300 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-bold text-gunmetal-900 text-sm">{member.name}</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-slate-grey-500 bg-alabaster-grey-100 px-2 py-0.5 rounded border border-platinum-100">{member.personalDetails.fullJobTitle}</span>
                                    <span className="text-xs text-slate-grey-400">{member.email}</span>
                                </div>
                            </div>
                            {role !== "manager" && (
                                <button
                                onClick={() => handleUnassign(member._id, viewModal.managerId!)}
                                className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Remove User"
                                >
                                <FaTrash size={14} />
                                </button>
                            )}
                        </li>
                    ))
                    ) : (
                    <li className="flex flex-col items-center justify-center h-48 text-slate-grey-400">
                         <FaInbox size={32} className="opacity-50 mb-2" />
                        <span className="text-sm">No members assigned yet.</span>
                    </li>
                    )}
                </ul>
                )}
            </div>
             <div className="p-4 border-t border-platinum-200 bg-white rounded-b-xl flex justify-end">
                <button
                onClick={closeModals}
                 className="px-4 py-2 bg-white border border-platinum-200 text-slate-grey-600 font-medium rounded-lg hover:bg-platinum-50 hover:text-gunmetal-900 transition-colors text-sm"
                >
                Close
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Team Members Modal */}
      {assignModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gunmetal-900/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl border border-platinum-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-platinum-200 bg-alabaster-grey-50 rounded-t-xl">
                 <div className="flex items-center gap-2">
                     <FaPlus className="text-emerald-500" />
                     <h3 className="font-bold text-gunmetal-900 text-lg">Assign Members</h3>
                </div>
                <button
                  onClick={closeModals}
                  className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors"
                >
                  <FaTimes size={18} />
                </button>
            </div>

            <div className="p-6 space-y-4 border-b border-platinum-200">
                 {/* Search & Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                     <div className="relative group">
                         <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all"
                        />
                     </div>
                     
                     <div className="relative group">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400" />
                        <select
                            onChange={(e) => {
                                const department = e.target.value;
                                const filtered = teamMembers.filter((member) =>
                                    department ? member.personalDetails.department === department : true
                                );
                                setFilteredMembers(filtered);
                            }}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">All Departments</option>
                            {Array.from(new Set(teamMembers.map((m) => m.personalDetails.department))).map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                     </div>

                      <div className="relative group">
                        <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400" />
                        <select
                           onChange={(e) => {
                            const jobTitle = e.target.value;
                            const filtered = teamMembers.filter((member) =>
                                jobTitle ? member.personalDetails.fullJobTitle === jobTitle : true
                            );
                            setFilteredMembers(filtered);
                            }}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">All Job Titles</option>
                            {Array.from(new Set(teamMembers.map((m) => m.personalDetails.fullJobTitle))).map((title) => (
                            <option key={title} value={title}>{title}</option>
                            ))}
                        </select>
                     </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-alabaster-grey-50/50">
                 <div className="grid grid-cols-1 gap-3">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                        <label
                            key={member._id}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                selectedMembers.includes(member._id) 
                                ? "bg-gunmetal-50 border-gunmetal-300 shadow-sm" 
                                : "bg-white border-platinum-200 hover:border-gunmetal-200"
                            }`}
                        >
                                <input
                                type="checkbox"
                                checked={selectedMembers.includes(member._id)}
                                onChange={() => {
                                    if (selectedMembers.includes(member._id)) {
                                    setSelectedMembers(selectedMembers.filter((id) => id !== member._id));
                                    } else {
                                    setSelectedMembers([...selectedMembers, member._id]);
                                    }
                                }}
                                className="mt-1 w-4 h-4 text-gunmetal-600 rounded border-platinum-300 focus:ring-gunmetal-500"
                                />
                                <div>
                                    <h4 className="font-bold text-sm text-gunmetal-900">{member.name}</h4>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className="text-xs text-slate-grey-500">{member.personalDetails.fullJobTitle}</span>
                                        <span className="text-xs text-platinum-300">•</span>
                                        <span className="text-xs text-slate-grey-500">{member.personalDetails.department}</span>
                                    </div>
                                </div>
                        </label>
                        ))
                    ) : (
                         <div className="flex flex-col items-center justify-center h-48 text-slate-grey-400">
                             <FaSearch size={24} className="mb-2 opacity-50" />
                            <span className="text-sm">No members found matching criteria.</span>
                        </div>
                    )}
                 </div>
            </div>

            <div className="p-4 border-t border-platinum-200 bg-white rounded-b-xl flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-grey-600">
                    {selectedMembers.length} member{selectedMembers.length !== 1 && 's'} selected
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={closeModals}
                        className="px-4 py-2 bg-white border border-platinum-200 text-slate-grey-600 font-medium rounded-lg hover:bg-platinum-50 hover:text-gunmetal-900 transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleAssign(assignModal.managerId!)}
                        disabled={selectedMembers.length === 0}
                        className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Assignment
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
