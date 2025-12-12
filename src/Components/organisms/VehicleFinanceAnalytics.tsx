import React, { useEffect, useState, ChangeEvent } from "react";
import { 
  FaSpinner, 
  FaInbox, 
  FaCar, 
  FaMoneyBillWave, 
  FaChartPie, 
  FaCalendarAlt, 
  FaFilter 
} from "react-icons/fa";
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

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  registrationNo: string;
}

interface VehicleFinanceData {
  vehicles: Array<{
    make: string;
    model: string;
    totalAmount: number;
    vehicleId: string;
    registrationNo: string;
    invoices: any[];
  }>;
  totalAmount: number;
}

const VehicleFinanceAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [vehicleFinances, setVehicleFinances] = useState<VehicleFinanceData | null>(null);
  const [vehiclesList, setVehiclesList] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all-time");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#f43f5e", "#8b5cf6"];
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
        return null; // For "all-time"
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
     // eslint-disable-next-line react-hooks/exhaustive-deps
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
        (vehicle) => `${vehicle.make} - ${vehicle.registrationNo}`
      ),
      datasets: [
        {
          label: "Total Expenses",
          data: vehicleFinances.vehicles.map((vehicle) => vehicle.totalAmount),
          backgroundColor: "#0f172a", // Gunmetal-900
          borderColor: "#0f172a",
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.6,
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
          borderColor: "#ffffff",
          borderWidth: 2,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FaSpinner className="animate-spin text-4xl text-gunmetal-600 mb-4" />
        <p className="text-slate-grey-500 font-medium">Loading vehicle finance data...</p>
      </div>
    );
  }

  if (!vehicleFinances) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FaInbox className="text-4xl text-slate-grey-300 mb-4" />
        <p className="text-slate-grey-500 font-medium">No vehicle finance data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
             <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
               <FaCar className="text-gunmetal-600 text-xl" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                    Vehicle Finance Analytics
                </h2>
                <p className="text-sm text-slate-grey-500">
                    Track expenses and financial metrics for fleet vehicles.
                </p>
             </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
             <div className="relative group flex-1">
                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400" />
                <select
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer shadow-sm"
                >
                    <option value="all-time">All Time</option>
                    <option value="this-month">This Month</option>
                    <option value="last-six-months">Last 6 Months</option>
                    <option value="this-year">This Year</option>
                </select>
            </div>
            
            <div className="relative group flex-1">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400" />
                 <select
                    value={selectedVehicle}
                    onChange={handleVehicleChange}
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer shadow-sm"
                >
                    <option value="">All Vehicles</option>
                    {vehiclesList.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                        {vehicle.make} {vehicle.model} ({vehicle.registrationNo})
                    </option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-alabaster-grey-50 p-6 rounded-xl border border-platinum-200">
          <div className="flex items-center gap-3 mb-3">
             <div className="bg-white p-2 rounded-lg shadow-sm text-gunmetal-600 text-sm">
                <FaCar />
             </div>
             <h3 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Total Vehicles</h3>
          </div>
          <div className="text-3xl font-bold text-gunmetal-900 pl-1">{vehicleFinances.vehicles.length}</div>
        </div>

        <div className="bg-alabaster-grey-50 p-6 rounded-xl border border-platinum-200">
           <div className="flex items-center gap-3 mb-3">
             <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600 text-sm">
                <FaMoneyBillWave />
             </div>
             <h3 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Total Expenses</h3>
          </div>
          <div className="text-3xl font-bold text-emerald-700 pl-1">
            {formatCurrency(vehicleFinances.totalAmount)}
          </div>
        </div>

        <div className="bg-alabaster-grey-50 p-6 rounded-xl border border-platinum-200">
           <div className="flex items-center gap-3 mb-3">
             <div className="bg-white p-2 rounded-lg shadow-sm text-amber-500 text-sm">
                <FaChartPie />
             </div>
             <h3 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider">Avg. Expense / Vehicle</h3>
          </div>
          <div className="text-3xl font-bold text-gunmetal-900 pl-1">
            {formatCurrency(
               vehicleFinances.vehicles.length > 0 
               ? vehicleFinances.totalAmount / vehicleFinances.vehicles.length 
               : 0
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-platinum-200 shadow-sm">
           <div className="flex items-center gap-2 mb-6">
               <h3 className="text-lg font-bold text-gunmetal-900">Expense Trends by Vehicle</h3>
          </div>
          <div className="h-80">
            <Bar
              data={getVehicleExpenseTrendsData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                },
                scales: {
                  x: {
                      grid: { display: false },
                      ticks: {
                          color: "#64748b",
                          font: { family: "'Inter', sans-serif", size: 10 },
                          maxRotation: 45,
                          minRotation: 45
                      }
                  },
                  y: {
                    beginAtZero: true,
                    border: { display: false },
                    grid: { color: "#f1f5f9" },
                     ticks: {
                        color: "#64748b",
                        font: { family: "'Inter', sans-serif" }
                    },
                    title: {
                      display: true,
                      text: "Amount (PKR)",
                      color: "#94a3b8",
                      font: { size: 12 }
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-platinum-200 shadow-sm">
           <div className="flex items-center gap-2 mb-6">
               <h3 className="text-lg font-bold text-gunmetal-900">Expense Distribution</h3>
          </div>
          <div className="h-80">
            <Pie
              data={getExpenseDistributionData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right" as const,
                     labels: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        },
                        color: "#64748b",
                         boxWidth: 12,
                         padding: 15
                    }
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              let label = context.label || '';
                              if (label) {
                                  label += ': ';
                              }
                              if (context.raw !== null) {
                                  label += formatCurrency(context.raw as number);
                              }
                              return label;
                          }
                      }
                  }
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-platinum-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-platinum-200 bg-alabaster-grey-50">
             <h3 className="text-sm font-bold text-gunmetal-900 uppercase tracking-wide">Detailed Vehicle Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-alabaster-grey-50 border-b border-platinum-200">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-grey-500 uppercase tracking-wider">
                    Invoices
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-grey-500 uppercase tracking-wider text-right">
                  Total Expenses
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-platinum-100">
              {vehicleFinances.vehicles.length > 0 ? (
                vehicleFinances.vehicles.map((vehicle) => (
                    <tr key={vehicle.vehicleId} className="hover:bg-alabaster-grey-50/50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-platinum-100 p-2 rounded-lg text-slate-grey-500">
                                <FaCar size={14} />
                            </div>
                            <span className="text-sm font-semibold text-gunmetal-900">
                                {vehicle.make} {vehicle.model}
                            </span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-sm font-mono text-slate-grey-600 bg-alabaster-grey-100 px-2 py-1 rounded border border-platinum-200">
                             {vehicle.registrationNo}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-grey-600">
                        {vehicle.invoices.length} {vehicle.invoices.length === 1 ? 'Record' : 'Records'}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-gunmetal-900">
                            {formatCurrency(vehicle.totalAmount)}
                        </span>
                    </td>
                    </tr>
                ))
              ) : (
                  <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-grey-400">
                           <div className="flex flex-col items-center">
                            <FaInbox size={32} className="opacity-50 mb-2" />
                            <span className="text-sm font-medium">No vehicle data matches your filters.</span>
                        </div>
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleFinanceAnalytics;
