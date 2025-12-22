// src/components/AddVehicleModal.tsx

import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosConfig";
import LoadingSpinner from "../atoms/LoadingSpinner";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [make, setMake] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [registrationNo, setRegistrationNo] = useState<string>("");
  const [vehiclePicture, setVehiclePicture] = useState<File | null>(null);
  const [vehicleDocuments, setVehicleDocuments] = useState<FileList | null>(
    null
  );
  const [uploading, setUploading] = useState<boolean>(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Handler for vehicle picture change
  const handleVehiclePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Optional: Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed for vehicle picture.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Vehicle picture must be less than 5MB.");
        return;
      }
      setVehiclePicture(file);
    }
  };

  // Handler for vehicle documents change
  const handleVehicleDocumentsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      // Optional: Validate each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          !(file.type === "application/pdf" || file.type.startsWith("image/"))
        ) {
          toast.error(
            "Only PDF and image files are allowed for vehicle documents."
          );
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          // 10MB per document
          toast.error("Each vehicle document must be less than 10MB.");
          return;
        }
      }
      setVehicleDocuments(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!make || !model || !registrationNo) {
      toast.error("Make, Model, and Registration Number are required.");
      return;
    }

    const formData = new FormData();
    formData.append("make", make);
    formData.append("model", model);
    formData.append("registrationNo", registrationNo);

    if (vehiclePicture) {
      formData.append("vehiclePicture", vehiclePicture);
    }

    if (vehicleDocuments) {
      Array.from(vehicleDocuments).forEach((file) => {
        formData.append("vehicleDocuments", file);
      });
    }

    try {
      setUploading(true);
      await axiosInstance.post(`${backendUrl}/api/vehicles`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Vehicle added successfully.");
      onAdd();
      onClose();
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      toast.error(error.response?.data?.message || "Failed to add vehicle.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1050] overflow-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Add New Vehicle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Make
            </label>
            <input
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registration Number
            </label>
            <input
              type="text"
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vehicle Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleVehiclePictureChange}
              className="mt-1 block w-full"
            />
            {vehiclePicture && (
              <p className="mt-1 text-sm text-gray-500">
                Selected file: {vehiclePicture.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vehicle Documents
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              multiple
              onChange={handleVehicleDocumentsChange}
              className="mt-1 block w-full"
            />
            {vehicleDocuments && vehicleDocuments.length > 0 && (
              <ul className="mt-1 text-sm text-gray-500 list-disc list-inside">
                {Array.from(vehicleDocuments).map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className={`px-4 py-2 text-white rounded-full ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Uploading...</span>
                </div>
              ) : (
                "Add Vehicle"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
