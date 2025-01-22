// VehicleManagement.tsx

import React, { useState, useEffect } from "react";
import { AiOutlineUpload, AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import {
  FaCar,
  FaInbox,
  FaSpinner,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
} from "react-icons/fa";
import AddVehicleModal from "./AddVehicleModal";
import AssignVehicleModal from "./AssignVehicleModal";
import UpdateVehicleModal from "./UpdateVehicleModal";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosConfig";
import ConfirmDialog from "../atoms/ConfirmDialog";
import ImageModal from "../atoms/ImageModal";
import DocumentModal from "../atoms/DocumentModal";

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

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  // New state for image and document modals
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [isDocumentModalOpen, setIsDocumentModalOpen] =
    useState<boolean>(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);

  // Fetch vehicles from backend
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${backendUrl}/api/vehicles`, {
        params: {
          limit: 1000, // Adjust as needed
        },
      });
      setVehicles(response.data.vehicles);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching vehicles:", err);
      setError(err.response?.data?.message || "Failed to fetch vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Modal handlers
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

  const openConfirmDialog = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setIsConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setVehicleToDelete(null);
    setIsConfirmOpen(false);
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        `${backendUrl}/api/vehicles/${vehicleToDelete}`
      );
      toast.success(response.data.message || "Vehicle deleted successfully");
      fetchVehicles();
    } catch (err: any) {
      console.error("Error deleting vehicle:", err);
      toast.error(err.response?.data?.message || "Failed to delete vehicle.");
    } finally {
      setLoading(false);
      closeConfirmDialog();
    }
  };

  // Handlers for image modal
  const openImageModal = (url: string) => {
    setImageUrl(url);
    setIsImageModalOpen(true);
  };
  const closeImageModalHandler = () => {
    setImageUrl(null);
    setIsImageModalOpen(false);
  };

  // Handlers for document modal
  const openDocumentModalHandler = (url: string, name: string) => {
    setDocumentUrl(url);
    setDocumentName(name);
    setIsDocumentModalOpen(true);
  };
  const closeDocumentModalHandler = () => {
    setDocumentUrl(null);
    setDocumentName(null);
    setIsDocumentModalOpen(false);
  };

  // Utility to determine file icon based on file type
  const getFileIcon = (url: string | null | undefined) => {
    if (!url) return <FaFileAlt className="w-4 h-4 text-gray-600" />; // Default or placeholder icon

    const extension = url.split(".").pop()?.toLowerCase();
    if (extension === "pdf")
      return <FaFilePdf className="w-4 h-4 text-red-600" />;
    if (["doc", "docx"].includes(extension || ""))
      return <FaFileWord className="w-4 h-4 text-blue-600" />;
    return <FaFileAlt className="w-4 h-4 text-gray-600" />; // Default icon for other types
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 rounded-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Vehicle Management</h1>
        <button
          onClick={openAddModal}
          className="mt-4 md:mt-0 px-5 py-2 bg-green-600 text-white rounded-full flex items-center space-x-2 hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Add Vehicle"
        >
          <FaCar className="w-5 h-5" />
          <span className="font-medium">Add Vehicle</span>
        </button>
      </div>

      {/* Loading, Error, or Vehicle List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20 mb-20">
          <FaSpinner
            size={40}
            className="animate-spin text-blue-600 mb-4"
            aria-hidden="true"
          />
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center">
          <FaInbox size={40} className="text-gray-400 mb-4" />
          <span className="text-xl font-medium text-gray-600">
            No vehicles found.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="rounded-lg overflow-hidden flex flex-col bg-white"
            >
              {/* Vehicle Picture */}
              <div className="relative">
                {vehicle.vehiclePicture ? (
                  <img
                    src={vehicle.vehiclePicture}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition duration-200"
                    onClick={() => openImageModal(vehicle.vehiclePicture!)}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <FaCar className="text-gray-500 w-12 h-12" />
                  </div>
                )}
                {/* Badge for Assignment Status */}
                <div
                  className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full ${
                    vehicle.assignedTo
                      ? "bg-blue-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {vehicle.assignedTo ? "Assigned" : "Unassigned"}
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800">
                  {vehicle.make} {vehicle.model}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Registration:</strong> {vehicle.registrationNo}
                </p>
                {/* Assigned To */}
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Assigned To:</strong>{" "}
                  {vehicle.assignedTo ? (
                    <>
                      {vehicle.assignedTo.name} (
                      {vehicle.assignedTo.personalDetails.fullJobTitle})
                    </>
                  ) : (
                    "Unassigned"
                  )}
                </p>

                {/* Vehicle Documents */}
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">
                    Documents:
                  </h3>
                  {vehicle.vehicleDocuments &&
                  vehicle.vehicleDocuments.length > 0 ? (
                    <ul className="space-y-1">
                      {vehicle.vehicleDocuments.map((docUrl, index) => {
                        if (!docUrl) {
                          // Handle null or undefined document URLs
                          return (
                            <li
                              key={index}
                              className="flex items-center space-x-2 text-gray-500"
                            >
                              <FaFileAlt className="w-4 h-4" />
                              <span>Invalid Document</span>
                            </li>
                          );
                        }

                        const fileName =
                          docUrl.split("/").pop() || `Document ${index + 1}`;
                        return (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            {getFileIcon(docUrl)}
                            <button
                              onClick={() =>
                                openDocumentModalHandler(docUrl, fileName)
                              }
                              className="text-blue-600 hover:underline text-sm focus:outline-none"
                            >
                              {fileName}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No documents uploaded.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 flex space-x-2">
                <button
                  onClick={() => openAssignModal(vehicle)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Assign Vehicle"
                >
                  <AiOutlineUpload className="w-5 h-5 mr-2" />
                  Assign
                </button>

                <button
                  onClick={() => openUpdateModal(vehicle)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                  aria-label="View or Update Vehicle"
                >
                  <AiOutlineEye className="w-5 h-5 mr-2" />
                  View
                </button>

                <button
                  onClick={() => openConfirmDialog(vehicle._id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Delete Vehicle"
                >
                  <AiOutlineDelete className="w-5 h-5 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
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
        </>
      )}

      {/* Confirm Delete Dialog */}
      {isConfirmOpen && (
        <ConfirmDialog
          title="Delete Vehicle"
          message="Are you sure you want to delete this vehicle? This action cannot be undone."
          onConfirm={handleDeleteVehicle}
          onCancel={closeConfirmDialog}
          loading={loading}
        />
      )}

      {/* Image Modal */}
      {isImageModalOpen && imageUrl && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={closeImageModalHandler}
          imageUrl={imageUrl}
        />
      )}

      {/* Document Modal */}
      {isDocumentModalOpen && documentUrl && documentName && (
        <DocumentModal
          isOpen={isDocumentModalOpen}
          onClose={closeDocumentModalHandler}
          documentUrl={documentUrl}
          documentName={documentName}
        />
      )}
    </div>
  );
};

export default VehicleManagement;
