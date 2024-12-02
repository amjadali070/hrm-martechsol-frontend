import React, { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { LeaveRequest } from "../../types/LeaveRequest";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditLeaveRequestModal: React.FC<{
  selectedRequest: LeaveRequest | null;
  closeModal: () => void;
  updateLeaveRequests: (updatedRequest: LeaveRequest) => void;
}> = ({ selectedRequest, closeModal, updateLeaveRequests }) => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    lastDayToWork: "",
    returnToWork: ""
  });

  useEffect(() => {
    if (selectedRequest) {
      setFormData({
        leaveType: selectedRequest.leaveType,
        startDate: selectedRequest.startDate.split('T')[0],
        endDate: selectedRequest.endDate.split('T')[0],
        lastDayToWork: selectedRequest.lastDayToWork 
          ? selectedRequest.lastDayToWork.split('T')[0] 
          : '',
        returnToWork: selectedRequest.returnToWork 
          ? selectedRequest.returnToWork.split('T')[0] 
          : ''
      });
    }
  }, [selectedRequest]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRequest) {
      toast.error('No leave request selected');
      return;
    }

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/leave-applications/${selectedRequest._id}`, 
        formData,
        { 
          withCredentials: true
        }
      );

      toast.success('Leave request updated successfully');
      updateLeaveRequests(data);
      closeModal();
    } catch (error: any) {
      console.error('Error updating leave request', error);
      toast.error(error.response?.data?.message || 'Failed to update leave request');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Leave Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
              required
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Annual Leave">Annual Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Day at Work</label>
              <input
                type="date"
                name="lastDayToWork"
                value={formData.lastDayToWork}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Return to Work</label>
              <input
                type="date"
                name="returnToWork"
                value={formData.returnToWork}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Leave Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeaveRequestModal;