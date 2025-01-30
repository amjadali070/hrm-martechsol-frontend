import React, { useState, useEffect } from "react";
import {
  FaSpinner,
  FaFileInvoice,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";

interface Invoice {
  _id: string;
  date: string;
  amount: number;
  description?: string;
  invoiceImage?: string;
}

interface VehicleInfo {
  id: string;
  registrationNo: string;
  make: string;
  model: string;
}

interface Summary {
  totalAmount: number;
  averageAmount: number;
  numberOfInvoices: number;
}

interface InvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
}

const InvoicesModal = ({ isOpen, onClose, vehicleId }: InvoicesModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/vehicles/${vehicleId}/view-invoices`,
        {
          params: {
            page,
            limit: 10,
            sortBy,
            sortOrder,
            ...dateRange,
          },
        }
      );

      setInvoices(response.data.invoices);
      setVehicleInfo(response.data.vehicleInfo);
      setSummary(response.data.summary);
      setTotalPages(response.data.pagination.totalPages);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
  }, [isOpen, page, sortBy, sortOrder, dateRange]);

  const handleSort = (field: "date" | "amount") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (field: "date" | "amount") => {
    if (sortBy !== field) return <FaSort className="ml-1" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden  transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-800">
                Vehicle Invoices
                {vehicleInfo && (
                  <span className="block text-sm text-gray-600 mt-1">
                    {vehicleInfo.make} {vehicleInfo.model} -{" "}
                    {vehicleInfo.registrationNo}
                  </span>
                )}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
              >
                ×
              </button>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="End Date"
              />
            </div>

            {/* Summary */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">
                    Total Amount
                  </h3>
                  <p className="text-2xl font-semibold text-blue-900">
                    PKR {summary.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">
                    Average Amount
                  </h3>
                  <p className="text-2xl font-semibold text-green-900">
                    PKR {summary.averageAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">
                    Total Invoices
                  </h3>
                  <p className="text-2xl font-semibold text-purple-900">
                    {summary.numberOfInvoices}
                  </p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin text-blue-600 text-2xl" />
              </div>
            ) : error ? (
              <div className="text-red-600 p-4 text-center">{error}</div>
            ) : (
              <div className="overflow-x-auto bg-gray-100 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("date")}
                          className="flex items-center font-semibold text-gray-700 hover:text-gray-900"
                        >
                          Date {getSortIcon("date")}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("amount")}
                          className="flex items-center font-semibold text-gray-700 hover:text-gray-900"
                        >
                          Amount {getSortIcon("amount")}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-left">Invoice Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          PKR {invoice.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          {invoice.description || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {invoice.invoiceImage ? (
                            <a
                              href={invoice.invoiceImage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Image
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesModal;
