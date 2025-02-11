import React, { useState } from "react";
import {
  FaCar,
  FaSpinner,
  FaRegIdBadge,
  FaDownload,
  FaTimes,
} from "react-icons/fa";

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

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const imageUrl = vehicle.vehiclePicture;

  // Download a single document using an anchor element
  const handleDownload = (documentUrl: string) => {
    const link = document.createElement("a");
    link.href = documentUrl;
    const filename = documentUrl.substring(documentUrl.lastIndexOf("/") + 1);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="flex flex-col w-full">
      <div className="flex flex-col mx-auto w-full p-6">
        <div
          className="flex flex-col sm:flex-row items-center rounded-xl overflow-hidden"
          role="region"
          aria-label={`Vehicle ${vehicle.make} ${vehicle.model}`}
        >
          <div className="w-full sm:w-1/3 h-48 sm:h-auto relative">
            {imageUrl && !hasError ? (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <FaSpinner className="animate-spin text-blue-600 w-8 h-8" />
                  </div>
                )}
                <img
                  src={imageUrl}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className={`w-full h-full object-cover rounded-xl ${
                    isLoading ? "hidden" : "block"
                  }`}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                  }}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                <FaCar className="text-white w-12 h-12" />
              </div>
            )}
          </div>

          <div className="w-full sm:w-2/3 p-6 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {vehicle.make} {vehicle.model}
            </h2>
            <p className="flex items-center text-gray-600 mb-2">
              <FaRegIdBadge className="mr-2 text-blue-500" />
              <span>
                <strong>Reg No:</strong> {vehicle.registrationNo}
              </span>
            </p>

            {vehicle.vehicleDocuments.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
                  aria-label="Download All Documents"
                >
                  <FaDownload size={16} className="mr-2" />
                  <span className="text-sm font-medium">
                    Download All Documents
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-60"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="bg-white rounded-lg shadow-2xl p-8 z-10 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-2xl font-semibold text-gray-800">
                Download Documents
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Close Modal"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <ul className="space-y-4">
              {vehicle.vehicleDocuments.map((doc, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-100 transition"
                >
                  <span className="text-gray-700 font-medium">{`Document ${
                    index + 1
                  }`}</span>
                  <button
                    onClick={() => {
                      handleDownload(doc);
                      setShowModal(false);
                    }}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
                    aria-label={`Download Document ${index + 1}`}
                  >
                    <FaDownload size={16} className="mr-2" />
                    <span className="text-sm">Download</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default VehicleCard;
