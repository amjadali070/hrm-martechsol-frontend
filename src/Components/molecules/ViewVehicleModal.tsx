// src/components/ViewVehicleModal.tsx

import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaTimes, FaFilePdf, FaFileWord } from "react-icons/fa";
import DocumentViewerModal from "../atoms/DocumentViewerModal";
import { getFullUrl } from "../../utils/urlUtils";

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  registrationNo: string;
  vehiclePicture: string | null;
  vehicleDocuments: (string | null)[];
}

interface ViewVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

const ViewVehicleModal: React.FC<ViewVehicleModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    name: string;
    type: "image" | "pdf";
  } | null>(null);

  const handleDocumentClick = (docUrl: string) => {
    const fullDocUrl = getFullUrl(docUrl);
    if (!fullDocUrl) {
      toast.error("Invalid document URL.");
      return;
    }
    const fileName = fullDocUrl.split("/").pop() || "Document";
    const fileType = fileName.toLowerCase().endsWith(".pdf") ? "pdf" : "image";
    setSelectedDocument({ url: fullDocUrl, name: fileName, type: fileType });
    setIsDocumentViewerOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
        <div className="bg-white rounded-3xl p-6 w-full max-w-xl relative border border-blue-100">
          {/* Close Button */}
          <div className="absolute top-6 right-6">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-transform transform hover:scale-110"
              title="Close"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center">
            <FaEye className="mr-3 text-blue-600" />
            Vehicle Details
          </h2>

          <div className="space-y-6">
            {/* Vehicle Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Make
                </label>
                <p className="text-gray-700 font-semibold">{vehicle.make}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Model
                </label>
                <p className="text-gray-700 font-semibold">{vehicle.model}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Registration Number
                </label>
                <p className="text-gray-700 font-semibold">
                  {vehicle.registrationNo}
                </p>
              </div>
            </div>

            {/* Vehicle Picture */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Vehicle Picture
              </label>
              {vehicle.vehiclePicture ? (
                <div className="h-40 w-full flex justify-center items-center overflow-hidden">
                  <img
                    src={getFullUrl(vehicle.vehiclePicture) || ""}
                    alt="Vehicle"
                    className="h-40 object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <p className="text-gray-500 italic">
                    No vehicle picture uploaded
                  </p>
                </div>
              )}
            </div>

            {/* Vehicle Documents */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Vehicle Documents
              </label>
              {vehicle.vehicleDocuments &&
              vehicle.vehicleDocuments.length > 0 ? (
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

            {/* Close Action */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
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

export default ViewVehicleModal;
