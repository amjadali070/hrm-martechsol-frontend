import React, { useState } from "react";
import axios from "axios";

const FormsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "feedback" | "suggestion">(
    "all"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface Form {
    _id: string;
    subject: string;
    message: string;
    formType: "feedback" | "suggestion";
    createdAt: string;
  }

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const fetchForms = async (type?: "feedback" | "suggestion") => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParam = type ? `?formType=${type}` : "";
      const response = await axios.get(`${backendUrl}/api/forms${queryParam}`, {
        withCredentials: true,
      });
      setForms(response.data);
    } catch (err) {
      console.error("Error fetching forms:", err);
      setError("Failed to load forms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredForms =
    activeTab === "all"
      ? forms
      : forms.filter((form) => form.formType === activeTab);

  const renderFormContent = (message: string) => {
    return { __html: message };
  };

  const openModal = () => {
    setIsOpen(true);
    fetchForms();
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedForm(null);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        View My Forms
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">My Submitted Forms</h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              {["all", "feedback", "suggestion"].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveTab(tab as "all" | "feedback" | "suggestion")
                  }
                  className={`flex-1 py-2 uppercase text-sm ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Loading and Error States */}
            {isLoading && (
              <div className="flex justify-center items-center flex-grow p-4">
                <p className="text-gray-600">Loading forms...</p>
              </div>
            )}

            {error && (
              <div className="flex justify-center items-center flex-grow p-4 text-red-600">
                <p>{error}</p>
              </div>
            )}

            {/* Forms List */}
            {!isLoading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-y-auto flex-grow">
                {filteredForms.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500">
                    No forms found.
                  </div>
                ) : (
                  filteredForms.map((form) => (
                    <div
                      key={form._id}
                      onClick={() => setSelectedForm(form)}
                      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold text-lg truncate">
                        {form.subject}
                      </h3>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {form.formType}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Form Details Modal */}
          {selectedForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
              <div className="bg-white rounded-lg w-11/12 max-w-md max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-xl font-bold">{selectedForm.subject}</h2>
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 overflow-y-auto">
                  <p className="text-sm text-gray-500 mb-2">
                    Submitted on:{" "}
                    {new Date(selectedForm.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-4 capitalize">
                    Type: {selectedForm.formType}
                  </p>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={renderFormContent(
                      selectedForm.message
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormsModal;
