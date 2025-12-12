import React, { useEffect, useState } from "react";
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
  const [filter, setFilter] = useState<string>("this_month"); // Default filter

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/payroll/finance`
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (value: number) => {
    return `PKR ${value.toLocaleString()}`;
  };

  const filterDataByPeriod = (data: MonthlyBreakdown[], period: string) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JS

    switch (period) {
      case "this_month":
        return data.filter(
          (item) =>
            item._id.year === currentYear && item._id.month === currentMonth
        );
      case "last_six_months":
        return data.filter((item) => {
          const itemDate = new Date(item._id.year, item._id.month - 1);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return itemDate >= sixMonthsAgo;
        });
      case "this_year":
        return data.filter((item) => item._id.year === currentYear);
      default:
        return data;
    }
  };

  const getMonthlyTrendsData = () => {
    const filteredData = filterDataByPeriod(monthlyBreakdown, filter);
    const labels = filteredData.map(
      (item) => `${getMonthName(item._id.month)} ${item._id.year}`
    );

    return {
      labels,
      datasets: [
        {
          label: "Gross Salary",
          data: filteredData.map((item) => item.totalGrossSalary),
          borderColor: "#8884d8",
          tension: 0.1,
        },
        {
          label: "Net Salary",
          data: filteredData.map((item) => item.totalNetSalary),
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

      {/* Date Filter Dropdown */}
      <div className="flex justify-end mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="this_month">This Month</option>
          <option value="last_six_months">Last Six Months</option>
          <option value="this_year">This Year</option>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Basic Salary</h3>
          <div className="text-3xl font-bold">
            {formatCurrency(financeData.basicSalary.total)}
          </div>
          <p className="text-sm text-gray-500">
            Average: {formatCurrency(financeData.basicSalary.average)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Allowances</h3>
          <div className="text-3xl font-bold">
            {formatCurrency(financeData.allowances.total)}
          </div>
          <p className="text-sm text-gray-500">
            Average: {formatCurrency(financeData.allowances.average)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Deductions</h3>
          <div className="text-3xl font-bold">
            {formatCurrency(Number(financeData.deductions.total.toFixed(0)))}
          </div>
          <p className="text-sm text-gray-500">
            Average:{" "}
            {formatCurrency(Number(financeData.deductions.average.toFixed(0)))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Extra Payments</h3>
          <div className="text-3xl font-bold">
            {formatCurrency(financeData.extraPayments)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Attendance</h3>
          <div className="text-sm text-gray-500">
            <p>Total Absent Days: {financeData.attendance.totalAbsentDays}</p>
            <p>Total Half Days: {financeData.attendance.totalHalfDays}</p>
            <p>Total Late Ins: {financeData.attendance.totalLateIns}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Metrics</h3>
          <div className="text-sm text-gray-500">
            <p>
              Average Deduction Percentage:{" "}
              {financeData.metrics.averageDeductionPercentage}%
            </p>
            <p>
              Average Net/Gross Ratio:{" "}
              {financeData.metrics.averageNetToGrossRatio}%
            </p>
            <p>
              Average Tax Percentage: {financeData.metrics.averageTaxPercentage}
              %
            </p>
          </div>
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
