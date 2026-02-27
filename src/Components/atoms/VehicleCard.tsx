import React, { useState } from "react";
import { FaCar, FaDownload, FaTimes } from "react-icons/fa";

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
      <div className="flex gap-4 items-center rounded-xl p-4 border border-platinum-200 bg-alabaster-grey-50/50 hover:bg-white hover:shadow-sm transition-all duration-300">
        <div className="w-20 h-20 shrink-0">
          {imageUrl && !hasError ? (
            <img
              src={imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover rounded-lg border border-platinum-100"
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="w-full h-full bg-platinum-100 rounded-lg flex items-center justify-center border border-platinum-200">
              <FaCar className="text-slate-grey-400 w-8 h-8" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gunmetal-900 truncate tracking-tight">
            {vehicle.make} {vehicle.model}
          </h2>
          <p className="text-sm text-slate-grey-500 mb-2">
            <span className="font-mono bg-white border border-platinum-200 px-2 py-0.5 rounded text-xs font-medium text-gunmetal-700 shadow-sm">
              {vehicle.registrationNo}
            </span>
          </p>

          {vehicle.vehicleDocuments.length > 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-semibold text-gunmetal-600 hover:text-gunmetal-900 flex items-center gap-1.5 uppercase tracking-wide transition-colors"
            >
              <FaDownload size={10} />
              Documents ({vehicle.vehicleDocuments.length})
            </button>
          )}
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
