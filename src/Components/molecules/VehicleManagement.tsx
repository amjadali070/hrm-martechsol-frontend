import React, { useState, useEffect } from "react";
import { AiOutlineUpload, AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import {
  FaCar,
  FaInbox,
  FaSpinner,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaFileInvoice,
  FaPlus,
  FaHashtag,
  FaUser,
} from "react-icons/fa";
import { MdEditSquare } from "react-icons/md";
import AddVehicleModal from "./AddVehicleModal";
import AssignVehicleModal from "./AssignVehicleModal";
import UpdateVehicleModal from "./UpdateVehicleModal";
import ViewVehicleModal from "./ViewVehicleModal";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosConfig";
import ConfirmDialog from "../atoms/ConfirmDialog";
import ImageModal from "../atoms/ImageModal";
import DocumentModal from "../atoms/DocumentModal";
import AddInvoiceModal from "../atoms/AddInvoiceModal";
import InvoicesModal from "../atoms/VehicleInvoices";

interface AssignedTo {
  _id: string;
  name: string;
  email: string;
  personalDetails: {
    fullJobTitle: string;
  };
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  registrationNo: string;
  vehiclePicture: string | null;
  vehicleDocuments: string[];
  assignedTo?: AssignedTo;
}

const VehicleManagement: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicleForView, setSelectedVehicleForView] =
    useState<Vehicle | null>(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [isDocumentModalOpen, setIsDocumentModalOpen] =
    useState<boolean>(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [isAddInvoiceModalOpen, setIsAddInvoiceModalOpen] =
    useState<boolean>(false);
  const [selectedVehicleForInvoice, setSelectedVehicleForInvoice] = useState<
    string | null
  >(null);

  const [isInvoicesModalOpen, setIsInvoicesModalOpen] =
    useState<boolean>(false);
  const [selectedVehicleForInvoices, setSelectedVehicleForInvoices] = useState<
    string | null
  >(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${backendUrl}/api/vehicles`, {
        params: {
          limit: 1000, 
        },
      });
      setVehicles(response.data.vehicles);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching vehicles:", err);
      setError(err.response?.data?.message || "Failed to fetch vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openAssignModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsAssignModalOpen(true);
  };
  const closeAssignModal = () => {
    setSelectedVehicle(null);
    setIsAssignModalOpen(false);
  };

  const openUpdateModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsUpdateModalOpen(true);
  };
  const closeUpdateModal = () => {
    setSelectedVehicle(null);
    setIsUpdateModalOpen(false);
  };

  const openViewModal = (vehicle: Vehicle) => {
    setSelectedVehicleForView(vehicle);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setSelectedVehicleForView(null);
    setIsViewModalOpen(false);
  };

  const openConfirmDialog = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setIsConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setVehicleToDelete(null);
    setIsConfirmOpen(false);
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        `${backendUrl}/api/vehicles/${vehicleToDelete}`
      );
      toast.success(response.data.message || "Vehicle deleted successfully");
      fetchVehicles();
    } catch (err: any) {
      console.error("Error deleting vehicle:", err);
      toast.error(err.response?.data?.message || "Failed to delete vehicle.");
    } finally {
      setLoading(false);
      closeConfirmDialog();
    }
  };

  const openImageModal = (url: string) => {
    setImageUrl(url);
    setIsImageModalOpen(true);
  };
  const closeImageModalHandler = () => {
    setImageUrl(null);
    setIsImageModalOpen(false);
  };

  const openDocumentModalHandler = (url: string, name: string) => {
    setDocumentUrl(url);
    setDocumentName(name);
    setIsDocumentModalOpen(true);
  };
  const closeDocumentModalHandler = () => {
    setDocumentUrl(null);
    setDocumentName(null);
    setIsDocumentModalOpen(false);
  };

  const getFileIcon = (url: string | null | undefined) => {
    if (!url) return <FaFileAlt className="w-4 h-4 text-slate-grey-500" />;

    const extension = url.split(".").pop()?.toLowerCase();
    if (extension === "pdf")
      return <FaFilePdf className="w-4 h-4 text-rose-500" />;
    if (["doc", "docx"].includes(extension || ""))
      return <FaFileWord className="w-4 h-4 text-blue-500" />;
    return <FaFileAlt className="w-4 h-4 text-slate-grey-500" />;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 mb-8 overflow-hidden">
       {/* Header */}
       <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
            <FaCar className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Vehicle Fleet
            </h2>
            <p className="text-sm text-slate-grey-500">
               Manage company vehicles, assignments, and documentation.
            </p>
          </div>
        </div>
        
        <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gunmetal-900 text-white text-sm font-bold rounded-lg hover:bg-gunmetal-800 transition-all shadow-lg shadow-gunmetal-500/20"
        >
            <FaPlus size={12} /> Add Vehicle
        </button>
      </div>

       <div className="p-8">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="animate-spin text-gunmetal-600 mb-4" size={32} />
            <p className="text-slate-grey-500 font-medium">Loading fleet data...</p>
            </div>
        ) : error ? (
            <div className="bg-rose-50 text-rose-600 p-6 rounded-xl border border-rose-100 text-center">
            <p>{error}</p>
            </div>
        ) : vehicles.length === 0 ? (
           <div className="text-center py-20 bg-alabaster-grey-50/50 rounded-xl border border-dashed border-platinum-200">
                <FaInbox size={40} className="mx-auto text-platinum-300 mb-4" />
                <h3 className="text-lg font-bold text-gunmetal-900">No vehicles found</h3>
                 <p className="text-slate-grey-500 text-sm mt-1">Add a vehicle to manage your fleet.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
                <div
                key={vehicle._id}
                className="group bg-white rounded-xl border border-platinum-200 shadow-sm hover:shadow-md hover:border-gunmetal-200 transition-all flex flex-col overflow-hidden"
                >
                <div className="relative h-48 bg-alabaster-grey-50 border-b border-platinum-200">
                    {vehicle.vehiclePicture ? (
                    <img
                        src={vehicle.vehiclePicture}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => openImageModal(vehicle.vehiclePicture!)}
                    />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center text-platinum-300">
                        <FaCar size={48} />
                    </div>
                    )}

                    <div className="absolute top-3 left-3">
                         <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border shadow-sm ${
                            vehicle.assignedTo
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${vehicle.assignedTo ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            {vehicle.assignedTo ? "Assigned" : "Available"}
                        </span>
                    </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-4">
                         <h2 className="text-lg font-bold text-gunmetal-900 line-clamp-1">
                            {vehicle.make} {vehicle.model}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-slate-grey-500 mt-1 font-mono bg-alabaster-grey-50 inline-block px-2 py-0.5 rounded border border-platinum-200 w-fit">
                             <FaHashtag size={10} className="text-slate-grey-400" />
                             {vehicle.registrationNo}
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2 text-sm">
                             <div className="mt-0.5 min-w-[16px] text-slate-grey-400"><FaUser />   </div>
                             <div>
                                 <span className="text-xs font-bold text-slate-grey-400 uppercase tracking-wide block mb-0.5">Assigned Driver</span>
                                  {vehicle.assignedTo ? (
                                    <div className="text-gunmetal-800 font-medium">
                                        {vehicle.assignedTo.name} 
                                        <span className="text-slate-grey-400 text-xs font-normal block">
                                            {vehicle.assignedTo.personalDetails.fullJobTitle}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-slate-grey-400 italic">No driver assigned</span>
                                )}
                             </div>
                        </div>

                         <div className="flex items-start gap-2 text-sm">
                             <div className="mt-0.5 min-w-[16px] text-slate-grey-400"><FaFileAlt />   </div>
                             <div className="w-full">
                                 <span className="text-xs font-bold text-slate-grey-400 uppercase tracking-wide block mb-1">Documents</span>
                                 {vehicle.vehicleDocuments && vehicle.vehicleDocuments.length > 0 ? (
                                     <div className="flex flex-wrap gap-2">
                                          {vehicle.vehicleDocuments.map((docUrl, index) => (
                                              <button
                                                key={index}
                                                onClick={() => openDocumentModalHandler(docUrl, `Document ${index + 1}`)}
                                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-alabaster-grey-50 border border-platinum-200 rounded text-xs text-gunmetal-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
                                              >
                                                  {getFileIcon(docUrl)}
                                                  <span>Doc {index + 1}</span>
                                              </button>
                                          ))}
                                     </div>
                                 ) : (
                                     <span className="text-slate-grey-400 text-xs">No documents</span>
                                 )}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-platinum-200 bg-alabaster-grey-50 grid grid-cols-3 gap-2">
                     <button
                        onClick={() => openAssignModal(vehicle)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-platinum-200 text-slate-grey-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all text-xs font-medium gap-1"
                        title="Assign Driver"
                    >
                        <AiOutlineUpload size={16} />
                        Assign
                    </button>
                    <button
                        onClick={() => openUpdateModal(vehicle)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-platinum-200 text-slate-grey-600 hover:text-amber-600 hover:border-amber-200 hover:shadow-sm transition-all text-xs font-medium gap-1"
                        title="Edit Details"
                    >
                        <MdEditSquare size={16} />
                        Edit
                    </button>
                    <button
                        onClick={() => openViewModal(vehicle)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-platinum-200 text-slate-grey-600 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-sm transition-all text-xs font-medium gap-1"
                         title="View Details"
                    >
                        <AiOutlineEye size={16} />
                        View
                    </button>
                     
                    {/* Invoice Actions Row */}
                     <button
                         onClick={() => {
                            setSelectedVehicleForInvoice(vehicle._id);
                            setIsAddInvoiceModalOpen(true);
                        }}
                        className="col-span-1.5 flex items-center justify-center p-2 rounded-lg bg-white border border-platinum-200 text-slate-grey-600 hover:text-purple-600 hover:border-purple-200 hover:shadow-sm transition-all text-xs font-medium gap-1 mt-2"
                        title="Add Invoice"
                     >
                         <FaPlus size={10} /> Invoice
                     </button>
                      <button
                         onClick={() => {
                            setSelectedVehicleForInvoices(vehicle._id);
                            setIsInvoicesModalOpen(true);
                        }}
                        className="col-span-1.5 flex items-center justify-center p-2 rounded-lg bg-white border border-platinum-200 text-slate-grey-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all text-xs font-medium gap-1 mt-2"
                        title="View Invoices"
                     >
                         <FaFileInvoice size={12} /> Invoices
                     </button>

                     <button
                        onClick={() => openConfirmDialog(vehicle._id)}
                        className="col-span-3 mt-2 flex items-center justify-center p-2 rounded-lg border border-transparent text-rose-600 hover:bg-rose-50 transition-all text-xs font-bold gap-1"
                    >
                         <AiOutlineDelete size={14} /> Remove Vehicle
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}

      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={fetchVehicles}
      />
      {selectedVehicle && (
        <>
          <AssignVehicleModal
            isOpen={isAssignModalOpen}
            onClose={closeAssignModal}
            vehicle={selectedVehicle}
            onAssign={fetchVehicles}
          />
          <UpdateVehicleModal
            isOpen={isUpdateModalOpen}
            onClose={closeUpdateModal}
            vehicle={selectedVehicle}
            onUpdate={fetchVehicles}
          />
        </>
      )}

      {isViewModalOpen && selectedVehicleForView && (
        <ViewVehicleModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          vehicle={selectedVehicleForView}
        />
      )}

      {isConfirmOpen && (
        <ConfirmDialog
          title="Delete Vehicle"
          message="Are you sure you want to delete this vehicle? This action cannot be undone."
          onConfirm={handleDeleteVehicle}
          onCancel={closeConfirmDialog}
          loading={loading}
        />
      )}

      {isImageModalOpen && imageUrl && (
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={closeImageModalHandler}
          imageUrl={imageUrl}
        />
      )}

      {isDocumentModalOpen && documentUrl && documentName && (
        <DocumentModal
          isOpen={isDocumentModalOpen}
          onClose={closeDocumentModalHandler}
          documentUrl={documentUrl}
          documentName={documentName}
        />
      )}

      {selectedVehicleForInvoice && (
        <AddInvoiceModal
          isOpen={isAddInvoiceModalOpen}
          onClose={() => {
            setIsAddInvoiceModalOpen(false);
            setSelectedVehicleForInvoice(null);
          }}
          vehicleId={selectedVehicleForInvoice}
          onInvoiceAdded={fetchVehicles}
        />
      )}

      {selectedVehicleForInvoices && (
        <InvoicesModal
          isOpen={isInvoicesModalOpen}
          onClose={() => {
            setIsInvoicesModalOpen(false);
            setSelectedVehicleForInvoices(null);
          }}
          vehicleId={selectedVehicleForInvoices}
        />
      )}
      </div>
    </div>
  );
};

export default VehicleManagement;
