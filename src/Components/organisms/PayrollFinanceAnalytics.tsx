import React, { useEffect, useState } from "react";
import { FaInbox, FaChartLine, FaChartPie, FaChartBar, FaCalendarAlt } from "react-icons/fa";
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
import LoadingSpinner from "../atoms/LoadingSpinner";

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
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<MonthlyBreakdown[]>([]);
  const [filter, setFilter] = useState<string>("this_month");

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
    const currentMonth = currentDate.getMonth() + 1;

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
          borderColor: "#0f172a", // Gunmetal-900
          backgroundColor: "#0f172a",
          tension: 0.1,
          pointRadius: 4,
        },
        {
          label: "Net Salary",
          data: filteredData.map((item) => item.totalNetSalary),
          borderColor: "#10b981", // Emerald-500
          backgroundColor: "#10b981",
          tension: 0.1,
          pointRadius: 4,
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
          borderColor: "#ffffff",
          borderWidth: 2,
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
        backgroundColor: ["#f59e0b", "#10b981", "#ef4444"], // Amber, Emerald, Rose
        borderRadius: 4,
      },
    ],
  });

  if (loading) {
    return (
      <LoadingSpinner className="h-96" size="lg" text="Loading financial data..." />
    );
  }

  if (!financeData) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <FaInbox className="text-4xl text-slate-grey-300 mb-4" />
        <p className="text-slate-grey-500 font-medium">No financial data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 p-6 flex flex-col mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
             <div className="bg-gunmetal-50 p-3 rounded-xl border border-platinum-200">
               <FaChartLine className="text-gunmetal-600 text-xl" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
                    Payroll Financial Analytics
                </h2>
                <p className="text-sm text-slate-grey-500">
                    Comprehensive insights into salary trends and expenses.
                </p>
             </div>
        </div>

        {/* Filter */}
        <div className="relative group">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-grey-400" />
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-white border border-platinum-200 rounded-lg text-sm text-gunmetal-900 focus:outline-none focus:ring-2 focus:ring-gunmetal-500/20 focus:border-gunmetal-500 transition-all appearance-none cursor-pointer shadow-sm"
            >
                <option value="this_month">This Month</option>
                <option value="last_six_months">Last Six Months</option>
                <option value="this_year">This Year</option>
            </select>
        </div>
      </div>

      {/* Summary Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-alabaster-grey-50 p-6 rounded-xl border border-platinum-200">
          <h3 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider mb-2">Total Employees</h3>
          <div className="text-3xl font-bold text-gunmetal-900">{financeData.totalEmployees}</div>
        </div>

        <div className="bg-alabaster-grey-50 p-6 rounded-xl border border-platinum-200">
          <h3 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider mb-2">Total Gross Salary</h3>
          <div className="text-3xl font-bold text-gunmetal-900">
            {formatCurrency(financeData.grossSalary.total)}
          </div>
          <p className="text-xs text-slate-grey-500 mt-1 font-mono">
            Avg: {formatCurrency(financeData.grossSalary.average)}
          </p>
        </div>

        <div className="bg-alabaster-grey-50 p-6 rounded-xl border border-platinum-200">
          <h3 className="text-xs font-bold text-slate-grey-500 uppercase tracking-wider mb-2">Total Net Salary</h3>
          <div className="text-3xl font-bold text-emerald-600">
            {formatCurrency(Number(financeData.netSalary.total.toFixed(0)))}
          </div>
          <p className="text-xs text-slate-grey-500 mt-1 font-mono">
            Avg: {formatCurrency(financeData.netSalary.average)}
          </p>
        </div>
      </div>

      {/* Summary Cards Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-platinum-200 shadow-sm">
          <h3 className="text-sm font-bold text-gunmetal-800 mb-2">Basic Salary</h3>
          <div className="text-2xl font-bold text-gunmetal-900 mb-1">
            {formatCurrency(financeData.basicSalary.total)}
          </div>
          <p className="text-xs text-slate-grey-500">
            Avg: {formatCurrency(financeData.basicSalary.average)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-platinum-200 shadow-sm">
          <h3 className="text-sm font-bold text-gunmetal-800 mb-2">Allowances</h3>
          <div className="text-2xl font-bold text-gunmetal-900 mb-1">
            {formatCurrency(financeData.allowances.total)}
          </div>
          <p className="text-xs text-slate-grey-500">
            Avg: {formatCurrency(financeData.allowances.average)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-platinum-200 shadow-sm">
          <h3 className="text-sm font-bold text-gunmetal-800 mb-2">Deductions</h3>
          <div className="text-2xl font-bold text-rose-600 mb-1">
            {formatCurrency(Number(financeData.deductions.total.toFixed(0)))}
          </div>
          <p className="text-xs text-slate-grey-500">
            Avg: {formatCurrency(Number(financeData.deductions.average.toFixed(0)))}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-platinum-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gunmetal-800 mb-2">Extra Payments</h3>
          <div className="text-2xl font-bold text-amber-500">
            {formatCurrency(financeData.extraPayments)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-platinum-200 shadow-sm">
          <h3 className="text-sm font-bold text-gunmetal-800 mb-3">Attendance Stats</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-slate-grey-600">Absent Days</span>
                <span className="font-bold text-gunmetal-900">{financeData.attendance.totalAbsentDays}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-grey-600">Half Days</span>
                <span className="font-bold text-gunmetal-900">{financeData.attendance.totalHalfDays}</span>
            </div>
             <div className="flex justify-between text-sm">
                <span className="text-slate-grey-600">Late Ins</span>
                <span className="font-bold text-gunmetal-900">{financeData.attendance.totalLateIns}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-platinum-200 shadow-sm">
          <h3 className="text-sm font-bold text-gunmetal-800 mb-3">Key Ratios</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-slate-grey-600">Avg. Deduction</span>
                <span className="font-bold text-rose-600">{financeData.metrics.averageDeductionPercentage}%</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-grey-600">Net/Gross Ratio</span>
                <span className="font-bold text-emerald-600">{financeData.metrics.averageNetToGrossRatio}%</span>
            </div>
             <div className="flex justify-between text-sm">
                <span className="text-slate-grey-600">Avg. Tax</span>
                <span className="font-bold text-amber-600">{financeData.metrics.averageTaxPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-platinum-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
               <div className="bg-gunmetal-50 p-2 rounded text-gunmetal-600">
                   <FaChartLine />
               </div>
               <h3 className="text-lg font-bold text-gunmetal-900">Monthly Salary Trends</h3>
          </div>
          <div className="h-80">
            <Line
              data={getMonthlyTrendsData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                    labels: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        color: "#64748b" // slate-500
                    }
                  },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: "#64748b",
                            font: { family: "'Inter', sans-serif" }
                        }
                    },
                    y: {
                        border: { display: false },
                        grid: {
                            color: "#f1f5f9" // slate-100
                        },
                        ticks: {
                             color: "#64748b",
                             font: { family: "'Inter', sans-serif" }
                        }
                    }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-platinum-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
               <div className="bg-gunmetal-50 p-2 rounded text-gunmetal-600">
                   <FaChartPie />
               </div>
               <h3 className="text-lg font-bold text-gunmetal-900">Deductions Breakdown</h3>
          </div>
          <div className="h-80">
            <Pie
              data={getDeductionsData()}
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
                        boxWidth: 12
                    }
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Metrics Bar Chart */}
      <div className="bg-white p-6 rounded-xl border border-platinum-200 shadow-sm">
         <div className="flex items-center gap-2 mb-6">
               <div className="bg-gunmetal-50 p-2 rounded text-gunmetal-600">
                   <FaChartBar />
               </div>
               <h3 className="text-lg font-bold text-gunmetal-900">Financial Metrics Overview</h3>
          </div>
        <div className="h-80">
          <Bar
            data={getMetricsData()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                    grid: { display: false },
                     ticks: {
                        color: "#64748b",
                        font: { family: "'Inter', sans-serif", weight: 'bold' }
                    }
                },
                y: {
                  beginAtZero: true,
                  border: { display: false },
                  grid: { color: "#f1f5f9" },
                   ticks: {
                        color: "#64748b",
                        font: { family: "'Inter', sans-serif" }
                    }
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
