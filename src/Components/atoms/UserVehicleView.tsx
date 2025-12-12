import React, { useState, useEffect } from "react";
import VehicleCard from "./VehicleCard";
import axiosInstance from "../../utils/axiosConfig";
import { FaInbox, FaSpinner } from "react-icons/fa";

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

interface UserVehicleViewProps {
  userId: string;
}

const UserVehicleView: React.FC<UserVehicleViewProps> = ({ userId }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserVehicles = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/vehicles`, {
          params: { assignedTo: userId, limit: 1000 },
        });
        setVehicles(response.data.vehicles);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching user vehicles:", err);
        setError(err.response?.data?.message || "Failed to fetch vehicles.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserVehicles();
  }, [userId]);

  return (
    <section className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gunmetal-900 tracking-tight">
          Assigned Vehicles
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-1 h-48">
          <FaSpinner className="text-gunmetal-500 animate-spin" size={24} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center flex-1 text-red-500 h-48">
          <FaInbox size={32} className="mb-2 opacity-50" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      ) : vehicles.length > 0 ? (
        <div className="space-y-4 overflow-auto custom-scroll flex-1">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-grey-400 h-48">
          <FaInbox size={32} className="mb-3 opacity-30 text-gunmetal-300" />
          <p className="text-sm font-medium">No vehicles assigned</p>
        </div>
      )}
    </section>
  );
};

export default UserVehicleView;
