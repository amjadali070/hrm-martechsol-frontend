import React, { useState } from "react";
import { Pie, Doughnut, Line, Bar } from "react-chartjs-2";
import {
  FaMoneyBillWave,
  FaUsers,
  FaChartPie,
  FaChartLine,
  FaChartBar,
} from "react-icons/fa";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

interface PayrollSummaryProps {
  totalPayrolls: number;
  totalEmployees: number;
  pieChartData: any;
  lineChartData: any;
  barChartData: any;
}

const PayrollSummary: React.FC<PayrollSummaryProps> = ({
  totalPayrolls,
  totalEmployees,
  pieChartData,
  lineChartData,
  barChartData,
}) => {
  const [chartType, setChartType] = useState("pie");

  const renderChart = () => {
    const chartProps = {
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" as const },
          title: {
            display: true,
            text: "Payroll Distribution",
            font: { size: 16 },
          },
        },
      },
    };

    switch (chartType) {
      case "pie":
        return <Pie data={pieChartData} {...chartProps} />;
      case "doughnut":
        return <Doughnut data={pieChartData} {...chartProps} />;
      case "line":
        return <Line data={lineChartData} {...chartProps} />;
      case "bar":
        return <Bar data={barChartData} {...chartProps} />;
      default:
        return <Pie data={pieChartData} {...chartProps} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaMoneyBillWave className="mr-3 text-blue-600" />
          Comprehensive Payroll Insights
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Statistics Cards */}
        <div className="col-span-1 space-y-4">
          <div className="bg-blue-50 p-5 rounded-xl">
            <div className="flex items-center mb-2">
              <FaMoneyBillWave className="mr-3 text-blue-600 text-xl" />
              <span className="font-semibold text-gray-700">
                Total Payrolls
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-800">{totalPayrolls}</p>
          </div>

          <div className="bg-green-50 p-5 rounded-xl">
            <div className="flex items-center mb-2">
              <FaUsers className="mr-3 text-green-600 text-xl" />
              <span className="font-semibold text-gray-700">
                Total Employees
              </span>
            </div>
            <p className="text-3xl font-bold text-green-800">
              {totalEmployees}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl flex justify-between">
            <button
              onClick={() => setChartType("pie")}
              className={`p-2 rounded-lg ${
                chartType === "pie"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <FaChartPie />
            </button>
            <button
              onClick={() => setChartType("doughnut")}
              className={`p-2 rounded-lg ${
                chartType === "doughnut"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <FaChartBar />
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`p-2 rounded-lg ${
                chartType === "line"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <FaChartLine />
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`p-2 rounded-lg ${
                chartType === "bar"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <FaChartBar />
            </button>
          </div>
        </div>

        {/* Dynamic Chart */}
        <div className="col-span-2 bg-gray-50 p-6 rounded-xl ">
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default PayrollSummary;
