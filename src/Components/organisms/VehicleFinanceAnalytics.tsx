import React, { useEffect, useState, ChangeEvent } from "react";
import { FaSpinner, FaInbox, FaCar } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import axiosInstance from "../../utils/axiosConfig";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type DateFilter = "this-month" | "last-six-months" | "this-year" | "all-time";

const VehicleFinanceAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [vehicleFinances, setVehicleFinances] = useState<{
    vehicles: Array<{
      make: string;
      model: string;
      totalAmount: number;
      vehicleId: string;
      registrationNo: string;
      invoices: any[];
    }>;
    totalAmount: number;
  } | null>(null);

  interface Vehicle {
    _id: string;
    make: string;
    model: string;
    registrationNo: string;
  }
  const [vehiclesList, setVehiclesList] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all-time");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const getDateRange = (filter: DateFilter) => {
    const now = new Date();
    const startDate = new Date();

    switch (filter) {
      case "this-month":
        startDate.setDate(1);
        break;
      case "last-six-months":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "this-year":
        startDate.setMonth(0, 1);
        break;
      default:
        return null;
    }

    return {
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
    };
  };

  const fetchVehicleFinances = async () => {
    setLoading(true);
    try {
      const dateRange = getDateRange(dateFilter);
      const params = new URLSearchParams();

      if (dateRange) {
        params.append("startDate", dateRange.startDate);
        params.append("endDate", dateRange.endDate);
      }

      const response = await axiosInstance.get(
        `${backendUrl}/api/vehicles/finances?${params.toString()}`
      );
      setVehicleFinances(response.data);
    } catch (error) {
      console.error("Error fetching vehicle finances:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehiclesList = async () => {
    try {
      const response = await axiosInstance.get(`${backendUrl}/api/vehicles`);
      setVehiclesList(response.data.vehicles);
    } catch (error) {
      console.error("Error fetching vehicles list:", error);
    }
  };

  useEffect(() => {
    fetchVehicleFinances();
    fetchVehiclesList();
  }, [dateFilter]);

  const handleVehicleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const vehicleId = e.target.value;
    setSelectedVehicle(vehicleId);
    setLoading(true);

    try {
      if (vehicleId) {
        const dateRange = getDateRange(dateFilter);
        const params = new URLSearchParams();

        if (dateRange) {
          params.append("startDate", dateRange.startDate);
          params.append("endDate", dateRange.endDate);
        }

        const response = await axiosInstance.get(
          `${backendUrl}/api/vehicles/${vehicleId}/finances?${params.toString()}`
        );
        setVehicleFinances({
          vehicles: [response.data.vehicle],
          totalAmount: response.data.totalAmount,
        });
      } else {
        await fetchVehicleFinances();
      }
    } catch (error) {
      console.error("Error fetching vehicle finances:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value as DateFilter);
  };

  const formatCurrency = (value: number) => {
    return `PKR ${value.toLocaleString()}`;
  };

  const getVehicleExpenseTrendsData = () => {
    if (!vehicleFinances?.vehicles) return { labels: [], datasets: [] };

    return {
      labels: vehicleFinances.vehicles.map(
        (vehicle) => `${vehicle.make} ${vehicle.model}`
      ),
      datasets: [
        {
          label: "Total Expenses",
          data: vehicleFinances.vehicles.map((vehicle) => vehicle.totalAmount),
          backgroundColor: "#8884d8",
          borderColor: "#8884d8",
          borderWidth: 1,
        },
      ],
    };
  };

  const getExpenseDistributionData = () => {
    if (!vehicleFinances?.vehicles) return { labels: [], datasets: [] };

    return {
      labels: vehicleFinances.vehicles.map(
        (vehicle) => `${vehicle.make} ${vehicle.model}`
      ),
      datasets: [
        {
          data: vehicleFinances.vehicles.map((vehicle) => vehicle.totalAmount),
          backgroundColor: COLORS,
          borderColor: COLORS.map((color) => color),
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
        <p className="text-gray-600">Loading vehicle finance data...</p>
      </div>
    );
  }

  if (!vehicleFinances) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FaInbox className="text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600">No vehicle finance data available</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Vehicle Finance Analytics
        </h2>
        <div className="flex gap-4">
          <select
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all-time">All Time</option>
            <option value="this-month">This Month</option>
            <option value="last-six-months">Last 6 Months</option>
            <option value="this-year">This Year</option>
          </select>
          <select
            value={selectedVehicle}
            onChange={handleVehicleChange}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Vehicles</option>
            {vehiclesList.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.make} {vehicle.model} - {vehicle.registrationNo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FaCar className="text-blue-500" />
            <h3 className="text-lg font-semibold">Total Vehicles</h3>
          </div>
          <div className="text-3xl font-bold">
            {vehicleFinances.vehicles.length}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FaCar className="text-green-500" />
            <h3 className="text-lg font-semibold">Total Expenses</h3>
          </div>
          <div className="text-3xl font-bold">
            {formatCurrency(vehicleFinances.totalAmount)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FaCar className="text-purple-500" />
            <h3 className="text-lg font-semibold">Average per Vehicle</h3>
          </div>
          <div className="text-3xl font-bold">
            {formatCurrency(
              vehicleFinances.totalAmount / vehicleFinances.vehicles.length
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Expense Trends by Vehicle
          </h3>
          <div className="h-80">
            <Bar
              data={getVehicleExpenseTrendsData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Amount (PKR)",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
          <div className="h-80">
            <Pie
              data={getExpenseDistributionData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                  title: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Expenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicleFinances.vehicles.map((vehicle) => (
                <tr key={vehicle.vehicleId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vehicle.make} {vehicle.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vehicle.registrationNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(vehicle.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vehicle.invoices.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleFinanceAnalytics;
