import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosConfig";
import { FaFileInvoice, FaSpinner } from "react-icons/fa";

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  onInvoiceAdded: () => void;
}

const AddInvoiceModal: React.FC<AddInvoiceModalProps> = ({
  isOpen,
  onClose,
  vehicleId,
  onInvoiceAdded,
}) => {
  const [date, setDate] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [invoiceImage, setInvoiceImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !amount) {
      toast.error("Date and amount are required.");
      return;
    }

    const formData = new FormData();
    formData.append("date", date);
    formData.append("amount", amount.toString());
    formData.append("description", description);
    if (invoiceImage) {
      formData.append("invoiceImage", invoiceImage);
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${backendUrl}/api/vehicles/${vehicleId}/invoices`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Invoice added successfully");
      onInvoiceAdded();
      onClose();
    } catch (error: any) {
      console.error("Error adding invoice:", error);
      toast.error(error.response?.data?.message || "Failed to add invoice.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaFileInvoice className="mr-2" />
          Add Invoice
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Image (Optional)
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setInvoiceImage(e.target.files ? e.target.files[0] : null)
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                accept="image/*"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaFileInvoice className="mr-2" />
              )}
              Add Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvoiceModal;
