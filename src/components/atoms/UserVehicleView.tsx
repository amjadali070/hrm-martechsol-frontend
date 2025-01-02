// src/components/vehicles/UserVehicleView.tsx
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

const backendUrl = process.env.REACT_APP_BACKEND_URL || "";

const UserVehicleView: React.FC<UserVehicleViewProps> = ({ userId }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserVehicles = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`${backendUrl}/api/vehicles`, {
          params: {
            assignedTo: userId,
            limit: 1000,
          },
          withCredentials: true,
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
  }, [userId, backendUrl]);

  return (
    <section className="flex flex-col w-full md:w-6/12 max-md:w-full">
      <div className="flex flex-col p-6 mx-auto w-full bg-white rounded-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-black">
            My Assigned Vehicles
          </h2>
        </div>

        {loading ? (
          <div
            className="flex justify-center items-center"
            style={{ height: "207px" }}
          >
            <FaSpinner className="text-blue-500 animate-spin" size={30} />
          </div>
        ) : error ? (
          <div
            className="flex flex-col items-center justify-center"
            style={{ height: "207px" }}
          >
            <FaInbox size={30} className="text-gray-400 mb-2" />
            <span className="text-md font-medium text-red-500">{error}</span>
          </div>
        ) : vehicles.length > 0 ? (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center"
            style={{ height: "251px" }}
          >
            <FaInbox size={30} className="text-gray-400 mb-2" />
            <span className="text-md font-medium">
              No Vehicles Assigned to You.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserVehicleView;
