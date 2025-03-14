// components/ProcessPayroll.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayrollDetails } from "../molecules/PayrollManagement";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const ProcessPayroll: React.FC = () => {
  const [payrolls, setPayrolls] = useState<PayrollDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchDraftPayrolls = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/payrolls/summary?status=Draft`,
          { withCredentials: true }
        );
        setPayrolls(response.data);
      } catch (error: any) {
        console.error("Error fetching draft payrolls:", error);
        toast.error(
          error.response?.data?.message || "Error fetching draft payrolls"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDraftPayrolls();
  }, [backendUrl]);

  const handleProcess = async (payrollId: string) => {
    if (!window.confirm("Are you sure you want to process this payroll?")) {
      return;
    }

    setProcessingId(payrollId);
    try {
      const response = await axios.put(
        `${backendUrl}/api/payrolls/process/${payrollId}`,
        {},
        { withCredentials: true }
      );
      toast.success(response.data.message || "Payroll processed successfully.");
      // Refresh the payroll list
      setPayrolls((prev) => prev.filter((p) => p.payrollId !== payrollId));
    } catch (error: any) {
      console.error("Error processing payroll:", error);
      toast.error(error.response?.data?.message || "Error processing payroll.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Process Payrolls
      </h1>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <FaSpinner className="animate-spin text-blue-500" size={30} />
        </div>
      ) : payrolls.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          <span>No payrolls available for processing.</span>
        </div>
      ) : (
        <table className="min-w-full border-collapse bg-white border border-gray-300 rounded-lg">
          <thead className="bg-purple-900">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                S.No
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Month
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Year
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Net Salary
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((payroll, index) => (
              <tr key={payroll.payrollId} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{index + 1}</td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {payroll.user.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {payroll.month}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {payroll.year}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {payroll.netSalary.toLocaleString()} PKR
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 capitalize">
                  {payroll.status}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  <button
                    onClick={() => handleProcess(payroll.payrollId)}
                    className="px-3 py-1 text-white bg-green-500 rounded-full hover:bg-green-600 transition duration-300"
                    disabled={processingId === payroll.payrollId}
                  >
                    {processingId === payroll.payrollId ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      "Process"
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProcessPayroll;
