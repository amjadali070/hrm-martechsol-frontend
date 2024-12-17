import React, { useState, useEffect } from "react";
import { AiOutlineUpload, AiOutlineEye } from "react-icons/ai";
import { FaCar } from "react-icons/fa";
import AddVehicleModal from "./AddVehicleModal";
import AssignVehicleModal from "./AssignVehicleModal";
import UpdateVehicleModal from "./UpdateVehicleModal";
import UpdateAssignmentModal from "./UpdateAssignmentModal";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosConfig";

interface AssignedTo {
  _id: string;
  name: string;
  email: string;
  personalDetails: {
    fullJobTitle: string;
  };
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  registrationNo: string;
  vehiclePicture: string | null;
  vehicleDocuments: string[];
  assignedTo?: AssignedTo;
}

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isUpdateAssignmentModalOpen, setIsUpdateAssignmentModalOpen] =
    useState<boolean>(false);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${backendUrl}/api/vehicles`, {
        params: {
          limit: 1000,
        },
      });
      setVehicles(response.data.vehicles);
      setError(null);
      console.log("Fetched Vehicles:", response.data.vehicles);
    } catch (err: any) {
      console.error("Error fetching vehicles:", err);
      setError(err.response?.data?.message || "Failed to fetch vehicles.");
      toast.error(err.response?.data?.message || "Failed to fetch vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Handlers to open modals
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openAssignModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsAssignModalOpen(true);
  };
  const closeAssignModal = () => {
    setSelectedVehicle(null);
    setIsAssignModalOpen(false);
  };

  const openUpdateModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => {
    setSelectedVehicle(null);
    setIsUpdateModalOpen(false);
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;
    try {
      await axiosInstance.delete(`${backendUrl}apis/vehicles/${vehicleId}`);
      setVehicles(vehicles.filter((v) => v._id !== vehicleId));
      toast.success("Vehicle deleted successfully.");
    } catch (err: any) {
      console.error("Error deleting vehicle:", err);
      toast.error(err.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Vehicle Management
      </h1>

      <button
        onClick={openAddModal}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-full flex items-center space-x-2 hover:bg-green-700"
      >
        <FaCar className="w-5 h-5" />
        <span>Add Vehicle</span>
      </button>

      {loading ? (
        <p>Loading vehicles...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg p-4"
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-600 flex items-center justify-center rounded-full mr-4">
                    <FaCar className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">
                      {vehicle.assignedTo
                        ? vehicle.assignedTo.name
                        : "Unassigned"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {vehicle.assignedTo
                        ? vehicle.assignedTo.personalDetails.fullJobTitle
                        : "No user assigned"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-r border-gray-300 h-16 mx-4"></div>
              <div className="flex-1 px-4">
                <h3 className="text-md font-medium text-gray-800">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-sm text-gray-500">
                  Registration No: {vehicle.registrationNo}
                </p>
              </div>
              <div className="flex-1 flex justify-end space-x-2">
                <button
                  onClick={() => openAssignModal(vehicle)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700"
                >
                  <AiOutlineUpload className="w-4 h-4" />
                  <span>Assign</span>
                </button>
                <button
                  onClick={() => openUpdateModal(vehicle)}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700"
                >
                  <AiOutlineEye className="w-4 h-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle._id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700"
                >
                  <AiOutlineUpload className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={fetchVehicles}
      />
      {selectedVehicle && (
        <>
          <AssignVehicleModal
            isOpen={isAssignModalOpen}
            onClose={closeAssignModal}
            vehicle={selectedVehicle}
            onAssign={fetchVehicles}
          />
          <UpdateVehicleModal
            isOpen={isUpdateModalOpen}
            onClose={closeUpdateModal}
            vehicle={selectedVehicle}
            onUpdate={fetchVehicles}
          />
          {/* <UpdateAssignmentModal
            isOpen={isUpdateAssignmentModalOpen}
            onClose={closeUpdateAssignmentModal}
            vehicle={selectedVehicle}
            onUpdateAssignment={fetchVehicles}
          /> */}
        </>
      )}
    </div>
  );
};

export default VehicleManagement;
