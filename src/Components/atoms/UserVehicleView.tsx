import React, { useState, useEffect } from "react";
import VehicleCard from "./VehicleCard";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
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

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchUserVehicles = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`${backendUrl}/api/vehicles`, {
          params: {
            assignedTo: userId,
            limit: 1000,
          },
        });
        setVehicles(response.data.vehicles);
        setError(null);
        console.log("Fetched User Vehicles:", response.data.vehicles);
      } catch (err: any) {
        console.error("Error fetching user vehicles:", err);
        setError(err.response?.data?.message || "Failed to fetch vehicles.");
        toast.error(err.response?.data?.message || "Failed to fetch vehicles.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserVehicles();
  }, [backendUrl, userId]);

  return (
    <section className="flex flex-col w-full md:w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col p-6 mx-auto w-full bg-white rounded-xl">
        <h1 className="text-2xl font-semibold text-gray-800 p-4">
          My Assigned Vehicles
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-25 mb-25">
            <FaSpinner
              size={30}
              className="animate-spin text-blue-600 mb-2"
              aria-hidden="true"
            />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center">
            <FaInbox size={30} className="text-gray-400 mb-4" />
            <span className="text-lg font-medium">
              No vehicles assigned to you.
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UserVehicleView;
