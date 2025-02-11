import React, { useState } from "react";
import { FaCar, FaSpinner, FaDownload, FaRegIdBadge } from "react-icons/fa";

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

  const imageUrl = vehicle.vehiclePicture;

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
      <div className="flex flex-col mx-auto w-full bg-white rounded-xl">
        <div
          className="flex flex-col sm:flex-row items-center rounded-xl overflow-hidden"
          role="region"
          aria-label={`Vehicle ${vehicle.make} ${vehicle.model}`}
        >
          <div className="w-full sm:w-1/3 h-48 sm:h-auto relative ">
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
              <div className="mt-4">
                <ul className="space-y-2">
                  {vehicle.vehicleDocuments.map((doc, index) => (
                    <li key={index} className="flex items-center">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label={`Download document ${doc.substring(
                          doc.lastIndexOf("/") + 1
                        )}`}
                      >
                        <FaDownload className="mr-2" />
                        <span className="text-sm font-medium">Download</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VehicleCard;
