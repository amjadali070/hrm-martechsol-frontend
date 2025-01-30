import React, { useEffect, useState, ChangeEvent } from "react";
import { FaSpinner, FaInbox } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { startOfMonth } from "date-fns";
import { Line, Pie, Bar } from "react-chartjs-2";
import { getMonthName } from "../../utils/monthUtils";
import axiosInstance from "../../utils/axiosConfig";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FinanceData {
  totalEmployees: number;
  basicSalary: {
    total: number;
    average: number;
  };
  grossSalary: {
    total: number;
    average: number;
  };
  netSalary: {
    total: number;
    average: number;
  };
  allowances: {
    total: number;
    average: number;
  };
  deductions: {
    total: number;
    average: number;
    breakdown: {
      tax: number;
      eobi: number;
      employeePF: number;
      employerPF: number;
      lateIns: number;
      absents: number;
      halfDays: number;
    };
  };
  extraPayments: number;
  attendance: {
    totalAbsentDays: number;
    totalHalfDays: number;
    totalLateIns: number;
  };
  metrics: {
    averageDeductionPercentage: number;
    averageNetToGrossRatio: number;
    averageTaxPercentage: number;
  };
}

interface MonthlyBreakdown {
  _id: {
    year: number;
    month: number;
  };
  totalGrossSalary: number;
  totalNetSalary: number;
  totalDeductions: number;
  employeeCount: number;
}

const PayrollFinanceAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<MonthlyBreakdown[]>(
    []
  );
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("6months");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/payroll/finance?timeRange=${selectedTimeRange}`
      );
      const data = response.data;
      setFinanceData(data.data);
      if (data.monthlyBreakdown) {
        setMonthlyBreakdown(data.monthlyBreakdown);
      }
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, [selectedTimeRange]);

  const handleTimeRangeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimeRange(e.target.value);
  };

  const formatCurrency = (value: number) => {
    return `PKR ${value.toLocaleString()}`;
  };

  const getMonthlyTrendsData = () => {
    const labels = monthlyBreakdown.map(
      (item) => `${getMonthName(item._id.month)} ${item._id.year}`
    );

    return {
      labels,
      datasets: [
        {
          label: "Gross Salary",
          data: monthlyBreakdown.map((item) => item.totalGrossSalary),
          borderColor: "#8884d8",
          tension: 0.1,
        },
        {
          label: "Net Salary",
          data: monthlyBreakdown.map((item) => item.totalNetSalary),
          borderColor: "#82ca9d",
          tension: 0.1,
        },
      ],
    };
  };

  const getDeductionsData = () => {
    if (!financeData) return { labels: [], datasets: [] };

    const deductionData = Object.entries(financeData.deductions.breakdown);
    return {
      labels: deductionData.map(
        ([key]) => key.charAt(0).toUpperCase() + key.slice(1)
      ),
      datasets: [
        {
          data: deductionData.map(([_, value]) => value),
          backgroundColor: COLORS,
        },
      ],
    };
  };

  const getMetricsData = () => ({
    labels: ["Deduction %", "Net/Gross Ratio", "Tax %"],
    datasets: [
      {
        label: "Financial Metrics",
        data: [
          financeData?.metrics.averageDeductionPercentage || 0,
          financeData?.metrics.averageNetToGrossRatio || 0,
          financeData?.metrics.averageTaxPercentage || 0,
        ],
        backgroundColor: "#8884d8",
      },
    ],
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FaSpinner className="animate-spin text-4xl text-purple-600 mb-4" />
        <p className="text-gray-600">Loading financial data...</p>
      </div>
    );
  }

  if (!financeData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FaInbox className="text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600">No financial data available</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Payroll Financial Analytics
      </h2>

      <div className="mb-6 flex justify-between items-center">
        <select
          value={selectedTimeRange}
          onChange={handleTimeRangeChange}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last 1 Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Employees</h3>
          <div className="text-3xl font-bold">{financeData.totalEmployees}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Gross Salary</h3>
          <div className="text-3xl font-bold">
            {formatCurrency(financeData.grossSalary.total)}
          </div>
          <p className="text-sm text-gray-500">
            Average: {formatCurrency(financeData.grossSalary.average)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Net Salary</h3>
          <div className="text-3xl font-bold">
            {formatCurrency(Number(financeData.netSalary.total.toFixed(0)))}
          </div>
          <p className="text-sm text-gray-500">
            Average: {formatCurrency(financeData.netSalary.average)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Salary Trends</h3>
          <div className="h-80">
            <Line
              data={getMonthlyTrendsData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Deductions Breakdown</h3>
          <div className="h-80">
            <Pie
              data={getDeductionsData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Financial Metrics</h3>
        <div className="h-80">
          <Bar
            data={getMetricsData()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top" as const,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PayrollFinanceAnalytics;
