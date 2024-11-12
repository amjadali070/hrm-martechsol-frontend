import React, { useState } from 'react';
import UpdatedProjectTable, { Project } from '../../atoms/UpdateProjectsTable';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ManageSubscriptionProps {
  onAddSubscription: () => void;
}

interface Column {
  key: keyof Project;
  label: string;
}

const columns: Column[] = [
  { key: 'projectName', label: 'Project Title' },
  { key: 'category', label: 'Category' },
  { key: 'completion', label: 'Completion' },
  { key: 'projectStatus', label: 'Project Status' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'invoice', label: 'Invoice' },
];

const ManageSubscription: React.FC<ManageSubscriptionProps> = ({ onAddSubscription }) => {

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [cardDetails, setCardDetails] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/payment/update`, cardDetails, { withCredentials: true });
      console.log(response.data);
      toast.success('Payment details updated successfully!');
      closeModal();
      setCardDetails({
        cardHolderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update payment details.');
    }
  };


  return (
    <div className="overflow-hidden px-4 pt-2.5 bg-white rounded-3xl">
      <div className="flex flex-col gap-5 md:flex-row max-md:flex-col">
        <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
          <div className="flex flex-col w-full mb-5">
            <div className="flex justify-end space-x-2 mb-1">

              <button
                onClick={openModal}
                className="bg-[#ff6600] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#ff6600] transition duration-200"
                aria-label="Update Payment Details"
              >
                Update Payment Details
              </button>

              <button
                onClick={onAddSubscription}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                aria-label="Add New Subscription"
              >
                Add New Subscription
              </button>
            </div>

            <section>
              <h2 className="text-start text-xl font-medium text-zinc-800">
                Active Subscription(s)
              </h2>
              <UpdatedProjectTable projects={[]} columns={columns} />
            </section>

            <section>
              <h2 className="text-start mt-3 text-xl font-medium text-zinc-800">
                Inactive Subscription(s)
              </h2>
              <UpdatedProjectTable projects={[]} columns={columns} />
            </section>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close Modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 id="modal-title" className="text-2xl font-semibold mb-4 text-center">
              Update Payment Details
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">

              {/* Card Holder Name */}
              <div>
                <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700">
                  Card Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cardHolderName"
                  name="cardHolderName"
                  value={cardDetails.cardHolderName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="As it appears on the card"
                />
              </div>

              {/* Card Number */}
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleInputChange}
                  required
                  pattern="\d{16}"
                  title="Please enter a 16-digit card number."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              {/* Expiry Date and CVV */}
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">

                {/* Expiry Date */}
                <div className="w-full sm:w-1/2">
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                    Expiry Date (MM/YY) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleInputChange}
                    required
                    pattern="(0[1-9]|1[0-2])\/\d{2}"
                    title="Please enter a valid expiry date in MM/YY format."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MM/YY"
                  />
                </div>


                {/* CVV */}
                <div className="w-full sm:w-1/2">
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    required
                    pattern="\d{3}"
                    title="Please enter a 3-digit CVV."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ff6600] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#ff6600] transition duration-200"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default ManageSubscription;