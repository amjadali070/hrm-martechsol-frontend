import React, { useState, useEffect } from "react";
import {
  FaSpinner,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaTrashAlt,
  FaPen,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosConfig";
import ConfirmDialog from "./ConfirmDialog";
import { toast } from "react-toastify";

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

interface EditInvoiceState {
  isOpen: boolean;
  invoice: Partial<Invoice>;
  previewImage?: string | null;
  imageFile?: File;
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

  const [editModal, setEditModal] = useState<EditInvoiceState>({
    isOpen: false,
    invoice: {},
    previewImage: null,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState<string | null>(
    null
  );
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDelete = (invoiceId: string) => {
    setDeletingInvoiceId(invoiceId);
    setShowConfirmDialog(true);
  };

  const onConfirmDelete = async () => {
    if (!deletingInvoiceId) return;
    setLoadingDelete(true);
    try {
      await axiosInstance.delete(
        `${backendUrl}/api/vehicles/${vehicleId}/invoices/${deletingInvoiceId}`
      );
      toast.warning("Invoice deleted successfully");
      fetchInvoices();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete invoice");
    } finally {
      setLoadingDelete(false);
      setShowConfirmDialog(false);
      setDeletingInvoiceId(null);
    }
  };

  const onCancelDelete = () => {
    setShowConfirmDialog(false);
    setDeletingInvoiceId(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditModal((prev) => ({
          ...prev,
          previewImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);

      setEditModal((prev) => ({
        ...prev,
        imageFile: file,
      }));
    }
  };

  const handleUpdateInvoice = async () => {
    const { _id, date, amount, description } = editModal.invoice;

    if (!date || !amount) {
      setError("Date and Amount are required");
      return;
    }

    setLoadingUpdate(true);

    const formData = new FormData();
    formData.append("date", date!);
    formData.append("amount", amount!.toString());

    if (description) {
      formData.append("description", description);
    }

    if (editModal.imageFile) {
      formData.append("invoiceImage", editModal.imageFile);
    }

    try {
      await axiosInstance.put(
        `${backendUrl}/api/vehicles/${vehicleId}/invoices/${_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Invoice updated successfully");
      fetchInvoices();
      setEditModal({
        isOpen: false,
        invoice: {},
        previewImage: null,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update invoice");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleUpdate = (invoice: Invoice) => {
    setEditModal({
      isOpen: true,
      invoice: {
        _id: invoice._id,
        date: new Date(invoice.date).toISOString().split("T")[0],
        amount: invoice.amount,
        description: invoice.description || "",
      },
      previewImage: invoice.invoiceImage || null,
    });
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
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
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
              <div className="text-gray-600 p-4 text-center">
                No Vehicle Invoices Available
              </div>
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
                      <th className="px-4 py-3 text-left">Invoice File</th>
                      <th className="px-4 py-3 text-left">Actions</th>
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
                              View File
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleUpdate(invoice)}
                            className="text-yellow-500 hover:text-yellow-700 mr-4"
                          >
                            <FaPen />
                          </button>
                          <button
                            onClick={() => handleDelete(invoice._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
      {editModal.isOpen && (
        <div className="w-full fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() =>
              setEditModal({ isOpen: false, invoice: {}, previewImage: null })
            }
          ></div>
          <div className="bg-white rounded-lg p-6 z-50 w-[50%] relative">
            <h2 className="text-xl font-semibold mb-4">Edit Invoice</h2>

            {/* Date Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={editModal.invoice.date || ""}
                onChange={(e) =>
                  setEditModal((prev) => ({
                    ...prev,
                    invoice: { ...prev.invoice, date: e.target.value },
                  }))
                }
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                value={editModal.invoice.amount || ""}
                onChange={(e) =>
                  setEditModal((prev) => ({
                    ...prev,
                    invoice: {
                      ...prev.invoice,
                      amount: Number(e.target.value),
                    },
                  }))
                }
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={editModal.invoice.description || ""}
                onChange={(e) =>
                  setEditModal((prev) => ({
                    ...prev,
                    invoice: { ...prev.invoice, description: e.target.value },
                  }))
                }
                className="mt-1 block w-full border rounded-md px-3 py-2"
                rows={3}
              />
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Invoice File
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleImageUpload}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() =>
                  setEditModal({
                    isOpen: false,
                    invoice: {},
                    previewImage: null,
                  })
                }
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateInvoice}
                disabled={loadingUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingUpdate ? "Updating..." : "Update Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmDialog && (
        <ConfirmDialog
          title="Delete Invoice"
          message="Are you sure you want to delete this invoice?"
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
          loading={loadingDelete}
        />
      )}
    </div>
  );
};

export default InvoicesModal;
