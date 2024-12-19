import React, { useState } from "react";
import { FaCar, FaSpinner, FaDownload } from "react-icons/fa";

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
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const formatImagePath = (path: string): string => {
    let formattedPath = path.replace(/\\/g, "/");
    if (!formattedPath.startsWith("/")) {
      formattedPath = `/${formattedPath}`;
    }
    return formattedPath;
  };

  const formatDocumentPath = (path: string): string => {
    let formattedPath = path.replace(/\\/g, "/");
    if (!formattedPath.startsWith("/")) {
      formattedPath = `/${formattedPath}`;
    }
    return formattedPath;
  };

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = vehicle.vehiclePicture
    ? `${backendUrl}${formatImagePath(vehicle.vehiclePicture)}`
    : null;

  const handleDownload = (documentPath: string) => {
    const formattedPath = formatDocumentPath(documentPath);
    const downloadUrl = `${backendUrl}${formattedPath}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    const filename = formattedPath.substring(
      formattedPath.lastIndexOf("/") + 1
    );
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
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
              className={`w-full h-full object-cover ${
                isLoading ? "hidden" : "block"
              }`}
              onLoad={() => {
                setIsLoading(false);
              }}
              onError={(e) => {
                setHasError(true);
                setIsLoading(false);
                e.currentTarget.src = "/images/default-vehicle.jpg";
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
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Registration No:</span>{" "}
          {vehicle.registrationNo}
        </p>

        {vehicle.vehicleDocuments.length > 0 && (
          <div className="mt-auto">
            <ul className="space-y-2">
              {vehicle.vehicleDocuments.map((doc, index) => {
                return (
                  <li key={index} className="flex items-center">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg"
                      aria-label={`Download document ${doc.substring(
                        doc.lastIndexOf("/") + 1
                      )}`}
                    >
                      <FaDownload size={20} className="mr-2" />
                      Download Document
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
