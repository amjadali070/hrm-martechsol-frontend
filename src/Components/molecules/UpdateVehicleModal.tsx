// src/components/UpdateVehicleModal.tsx

import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaEye,
  FaSave,
  FaTimes,
  FaTrash,
  FaCloudUploadAlt,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";
import DocumentViewerModal from "../atoms/DocumentViewerModal";
import { getFullUrl } from "../../utils/urlUtils";

interface UpdateVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onUpdate: () => void;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  registrationNo: string;
  vehiclePicture: string | null;
  vehicleDocuments: (string | null)[]; // Allowing nulls
}

const UpdateVehicleModal: React.FC<UpdateVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [make, setMake] = useState<string>(vehicle.make);
  const [model, setModel] = useState<string>(vehicle.model);
  const [registrationNo, setRegistrationNo] = useState<string>(
    vehicle.registrationNo
  );
  const [vehiclePicture, setVehiclePicture] = useState<File | null>(null);
  const [vehicleDocuments, setVehicleDocuments] = useState<FileList | null>(
    null
  );
  const [uploading, setUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(
    getFullUrl(vehicle.vehiclePicture)
  );

  const [isDocumentViewerOpen, setIsDocumentViewerOpen] =
    useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    name: string;
    type: "image" | "pdf";
  } | null>(null);

  const pictureInputRef = useRef<HTMLInputElement>(null);
  const documentsInputRef = useRef<HTMLInputElement>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    setMake(vehicle.make);
    setModel(vehicle.model);
    setRegistrationNo(vehicle.registrationNo);
    setPreview(getFullUrl(vehicle.vehiclePicture));
    setVehiclePicture(null);
    setVehicleDocuments(null);
    if (pictureInputRef.current) {
      pictureInputRef.current.value = "";
    }
    if (documentsInputRef.current) {
      documentsInputRef.current.value = "";
    }
  }, [vehicle]);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setVehiclePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
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
      await axiosInstance.put(
        `${backendUrl}/api/vehicles/${vehicle._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success("Vehicle updated successfully.");
      onUpdate();
      setIsEditing(false);
      setVehiclePicture(null);
      setVehicleDocuments(null);
      if (pictureInputRef.current) {
        pictureInputRef.current.value = "";
      }
      if (documentsInputRef.current) {
        documentsInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Error updating vehicle:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setVehiclePicture(null);
    setPreview(null);
    if (pictureInputRef.current) {
      pictureInputRef.current.value = "";
    }
  };

  const removeDocuments = () => {
    setVehicleDocuments(null);
    if (documentsInputRef.current) {
      documentsInputRef.current.value = "";
    }
  };

  const handleDocumentClick = (docUrl: string) => {
    const fullDocUrl = getFullUrl(docUrl);
    if (!fullDocUrl) {
      toast.error("Invalid document URL.");
      return;
    }
    const fileName = fullDocUrl.split("/").pop() || "Document";
    const fileType = fileName.toLowerCase().endsWith(".pdf") ? "pdf" : "image";

    setSelectedDocument({
      url: fullDocUrl,
      name: fileName,
      type: fileType,
    });
    setIsDocumentViewerOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
        <div className="bg-white rounded-3xl p-6 w-full max-w-xl relative border border-blue-100">
          <div className="absolute top-6 right-6 flex space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-110"
                title="Edit Vehicle Details"
              >
                <FaEdit className="w-6 h-6" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setMake(vehicle.make);
                    setModel(vehicle.model);
                    setRegistrationNo(vehicle.registrationNo);
                    setPreview(getFullUrl(vehicle.vehiclePicture));
                    setVehiclePicture(null);
                    setVehicleDocuments(null);
                    if (pictureInputRef.current) {
                      pictureInputRef.current.value = "";
                    }
                    if (documentsInputRef.current) {
                      documentsInputRef.current.value = "";
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-transform transform hover:scale-110"
                  title="Cancel Editing"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
                <button
                  type="submit"
                  form="vehicle-update-form"
                  disabled={uploading}
                  className="text-green-600 hover:text-green-800 transition-transform transform hover:scale-110 disabled:opacity-50"
                  title="Save Changes"
                >
                  <FaSave className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center">
            <FaEye className="mr-3 text-blue-600" />
            Vehicle Details
          </h2>

          <form
            id="vehicle-update-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Make
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                    placeholder="e.g., Toyota"
                  />
                ) : (
                  <p className="text-gray-700 font-semibold">{make}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Model
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                    placeholder="e.g., Camry"
                  />
                ) : (
                  <p className="text-gray-700 font-semibold">{model}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Registration Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                    placeholder="e.g., AB1234XY"
                  />
                ) : (
                  <p className="text-gray-700 font-semibold">
                    {registrationNo}
                  </p>
                )}
              </div>
            </div>

            {/* Vehicle Picture */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Vehicle Picture
              </label>
              <div className="relative">
                {preview ? (
                  <div className="relative group h-40 w-full flex justify-center items-center overflow-hidden ">
                    <img
                      src={preview}
                      alt="Vehicle"
                      className="h-40 object-contain rounded-lg"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        title="Remove Image"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <p className="text-gray-500 italic">
                      No vehicle picture uploaded
                    </p>
                  </div>
                )}
                {isEditing && (
                  <div className="mt-2 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <input
                      ref={pictureInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePictureChange}
                      className="hidden"
                      id="vehicle-picture-input"
                    />
                    <label
                      htmlFor="vehicle-picture-input"
                      className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition w-full sm:w-auto"
                    >
                      <FaCloudUploadAlt className="mr-2" /> Upload
                    </label>
                    {vehiclePicture && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
                        title="Remove Image"
                      >
                        <FaTrash className="mr-2" /> Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Documents */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Vehicle Documents
              </label>
              <div className="space-y-2">
                {vehicle.vehicleDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vehicle.vehicleDocuments.map((doc, idx) => {
                      if (!doc) {
                        return (
                          <div
                            key={idx}
                            className="flex items-center space-x-2 bg-red-100 p-3 rounded-lg"
                          >
                            <FaFilePdf className="text-gray-500 w-5 h-5" />
                            <span className="text-gray-500">
                              Document {idx + 1}
                            </span>
                          </div>
                        );
                      }
                      const fullDocUrl = getFullUrl(doc);
                      const fileName = `Document ${idx + 1}`;
                      const isPDF = fullDocUrl
                        ? fullDocUrl.toLowerCase().endsWith(".pdf")
                        : false;
                      const icon = isPDF ? (
                        <FaFilePdf className="text-red-500 w-5 h-5" />
                      ) : (
                        <FaFileWord className="text-blue-500 w-5 h-5" />
                      );

                      return (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition"
                          onClick={() => handleDocumentClick(doc)}
                          title={`View Document ${idx + 1}`}
                        >
                          {icon}
                          <span className="text-blue-600 hover:underline text-sm truncate flex-1">
                            {fileName}
                          </span>
                          <FaEye className="text-gray-500 ml-2 w-4 h-4" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No documents uploaded
                  </p>
                )}
              </div>
              {isEditing && (
                <div className="mt-2 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <input
                    ref={documentsInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    multiple
                    onChange={handleDocumentsChange}
                    className="hidden"
                    id="vehicle-documents-input"
                  />
                  <label
                    htmlFor="vehicle-documents-input"
                    className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition w-full sm:w-auto"
                  >
                    <FaCloudUploadAlt className="mr-2" /> Upload
                  </label>
                  {vehicleDocuments && vehicleDocuments.length > 0 && (
                    <button
                      type="button"
                      onClick={removeDocuments}
                      className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
                      title="Remove Documents"
                    >
                      <FaTrash className="mr-2" /> Remove
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!isEditing && (
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewerModal
          isOpen={isDocumentViewerOpen}
          onClose={() => setIsDocumentViewerOpen(false)}
          fileUrl={selectedDocument.url}
          fileName={selectedDocument.name}
          fileType={selectedDocument.type}
        />
      )}
    </>
  );
};

export default UpdateVehicleModal;
