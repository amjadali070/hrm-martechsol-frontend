import React, { useState } from "react";
import {
  AiOutlineUpload,
  AiOutlineDownload,
  AiOutlineEye,
} from "react-icons/ai";
import { FaCar } from "react-icons/fa";

const UploadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onUpload: (file: File) => void;
  uploadType: "photo" | "document";
}> = ({ isOpen, onClose, title, onUpload, uploadType }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <input
          type="file"
          accept={uploadType === "photo" ? "image/*" : ".pdf,.doc,.docx"}
          onChange={handleFileChange}
          className="mb-4 w-full"
        />
        {selectedFile && (
          <p className="text-sm text-gray-600 mb-4">
            Selected file: {selectedFile.name}
          </p>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`px-4 py-2 text-white rounded-full ${
              selectedFile
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState([
    {
      name: "Syed Hamza Ahmed Naqvi",
      role: "Manager - Web Development",
      vehicleModel: "Toyota Corolla Altis 1.8",
      plate: "BHM - 499",
      photo: null as File | null,
      document: null as File | null,
    },
    {
      name: "Ali Raza",
      role: "Senior Developer",
      vehicleModel: "Honda Civic 1.5",
      plate: "LHR - 123",
      photo: null as File | null,
      document: null as File | null,
    },
    {
      name: "Ayesha Khan",
      role: "UI/UX Designer",
      vehicleModel: "Suzuki Swift 1.3",
      plate: "KHI - 789",
      photo: null as File | null,
      document: null as File | null,
    },
  ]);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "photo" | "document";
    index: number;
  }>({
    isOpen: false,
    type: "photo",
    index: -1,
  });

  const handleFileUpload = (
    index: number,
    type: "photo" | "document",
    file: File
  ) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index][type] = file;
    setVehicles(updatedVehicles);
  };

  const openModal = (index: number, type: "photo" | "document") => {
    setModalState({
      isOpen: true,
      type,
      index,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: "photo",
      index: -1,
    });
  };

  return (
    <div className="bg-white flex rounded-lg items-center justify-center p-4">
      <div className="p-6 w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Vehicle Management
        </h1>
        <div className="space-y-4">
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg p-4"
            >
              <div className="flex-1 pr-40">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-600 flex items-center justify-center rounded-full mr-4">
                    <FaCar className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">
                      {vehicle.name}
                    </h2>
                    <p className="text-sm text-gray-500">{vehicle.role}</p>
                  </div>
                </div>
              </div>
              <div className="border-r border-gray-300 h-16 mx-4"></div>
              <div className="flex-1 px-4">
                <h3 className="text-md font-medium text-gray-800">
                  {vehicle.vehicleModel}
                </h3>
                <p className="text-sm text-gray-500">{vehicle.plate}</p>
              </div>
              <div className="flex-1 place-items-end">
                <div className="flex space-x-4">
                  <button
                    onClick={() => openModal(index, "photo")}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-full"
                  >
                    {vehicle.photo ? (
                      <AiOutlineEye className="w-5 h-5" />
                    ) : (
                      <AiOutlineUpload className="w-5 h-5" />
                    )}
                    <span>{vehicle.photo ? "Picture" : "Picture"}</span>
                  </button>
                  <button
                    onClick={() => openModal(index, "document")}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full"
                  >
                    {vehicle.document ? (
                      <AiOutlineEye className="w-5 h-5" />
                    ) : (
                      <AiOutlineDownload className="w-5 h-5" />
                    )}
                    <span>{vehicle.document ? "Document" : "Document"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <UploadModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={`Upload ${modalState.type === "photo" ? "Photo" : "Document"}`}
        uploadType={modalState.type}
        onUpload={(file) =>
          handleFileUpload(modalState.index, modalState.type, file)
        }
      />
    </div>
  );
};

export default VehicleManagement;
