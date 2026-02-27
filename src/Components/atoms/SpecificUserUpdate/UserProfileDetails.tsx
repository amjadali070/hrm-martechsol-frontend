// UserProfileDetails.tsx

import React, { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaUniversity,
  FaAddressBook,
  FaFileSignature,
  FaMoneyBillWave,
  FaFileAlt,
  FaEye,
} from "react-icons/fa";
import DocumentViewerModal from "../DocumentViewerModal";

interface Employee {
  name: string;
  department: string;
  jobTitle: string;
  jobCategory: string;
  jobType: string;
  profilePicture: string;
  shiftTimings: string;
  gender: string;
  dateOfBirth: string;
  jobStatus: string;
  joiningDate: string;
  salaryDetails: {
    basicSalary: number;
    medicalAllowance: number;
    mobileAllowance: number;
    fuelAllowance: number;
  };
  contactDetails: {
    phoneNumber1: string;
    phoneNumber2?: string;
    email: string;
    currentCity: string;
    currentAddress: string;
    permanentCity: string;
    permanentAddress: string;
  };
  education?: Array<{
    institute?: string;
    degree?: string;
    fieldOfStudy?: string;
    GPA?: string;
    yearOfCompletion?: number;
  }>;
  emergencyContacts?: Array<{
    name1: string;
    relation1: string;
    contactNumber1: string;
    name2: string;
    relation2: string;
    contactNumber2: string;
  }>;
  resume?: {
    resume?: string;
  };
  documents?: {
    NIC?: string;
    experienceLetter?: string;
    salarySlip?: string;
    academicDocuments?: string;
    NDA?: string;
  };
  bankAccountDetails?: {
    bankName?: string;
    branchName?: string;
    accountTitle?: string;
    accountNumber?: string;
    IBANNumber?: string;
  };
}

interface UserProfileDetailsProps {
  userProfile: Employee;
}

const UserProfileDetails: React.FC<UserProfileDetailsProps> = ({
  userProfile,
}) => {
  const [activeTab, setActiveTab] = useState<string>("Personal Details");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalFileUrl, setModalFileUrl] = useState<string>("");
  const [modalFileName, setModalFileName] = useState<string>("");
  const [modalFileType, setModalFileType] = useState<"image" | "pdf">("pdf");

  const handleOpenModal = (url: string, name: string) => {
    if (!url) return;

    // Determine file type based on URL extension
    const extension = url.split(".").pop()?.toLowerCase();
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
    const fileType: "image" | "pdf" =
      extension && imageExtensions.includes(extension) ? "image" : "pdf";

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const fullUrl = url.startsWith("http") ? url : `${backendUrl}${url}`;

    setModalFileUrl(fullUrl);
    setModalFileName(name);
    setModalFileType(fileType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalFileUrl("");
    setModalFileName("");
    setModalFileType("pdf");
  };

  const renderDocument = (url: string, title: string) => {
    if (!url) {
      return (
        <div className="flex items-center justify-between p-4 bg-alabaster-grey-50 rounded-xl border border-platinum-200 mb-4 opacity-60">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-platinum-100 flex items-center justify-center text-slate-grey-400">
                <FaFileAlt />
             </div>
             <div>
                <h3 className="text-sm font-bold text-gunmetal-900">{title}</h3>
                <p className="text-xs text-slate-grey-500">Not Uploaded</p>
             </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-platinum-200 mb-4 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-gunmetal-50 flex items-center justify-center text-gunmetal-600">
                <FaFileAlt />
             </div>
             <div>
                <h3 className="text-sm font-bold text-gunmetal-900">{title}</h3>
                <p className="text-xs text-slate-grey-500">Document available</p>
             </div>
          </div>
          <button
            onClick={() => handleOpenModal(url, title)}
            className="p-2 text-gunmetal-600 hover:text-gunmetal-900 hover:bg-alabaster-grey-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <FaEye /> View
          </button>
      </div>
    );
  };

  const tabs = [
    {
      name: "Personal Details",
      icon: <FaUser className="mr-2" title="Personal Details" />,
    },
    {
      name: "Contact Details",
      icon: <FaPhone className="mr-2" title="Contact Details" />,
    },
    {
      name: "Education",
      icon: <FaUniversity className="mr-2" title="Education" />,
    },
    {
      name: "Emergency Contacts",
      icon: <FaAddressBook className="mr-2" title="Emergency Contacts" />,
    },
    {
      name: "Documents",
      icon: <FaFileSignature className="mr-2" title="Documents" />,
    },
    {
      name: "Bank Account",
      icon: <FaAddressBook className="mr-2" title="Bank Account" />,
    },
    {
      name: "Salary Details",
      icon: <FaMoneyBillWave className="mr-2" title="Salary Details" />,
    },
  ];

  /* Helper for Data Rows */
  const InfoRow = ({ label, value, colSpan = 1 }: { label: string; value: string | number; colSpan?: number }) => (
      <div className={`p-4 bg-alabaster-grey-50 rounded-xl border border-platinum-200 ${colSpan > 1 ? `md:col-span-${colSpan}` : ''}`}>
          <p className="text-xs font-semibold text-slate-grey-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-sm font-bold text-gunmetal-900 break-words">{value || "--"}</p>
      </div>
  );
  
  const SectionHeader = ({ title }: { title: string }) => (
      <div className="mb-6 pb-2 border-b border-platinum-200 flex items-center gap-2">
          <div className="w-1 h-6 bg-gunmetal-900 rounded-full"></div>
          <h2 className="text-xl font-bold text-gunmetal-900">{title}</h2>
      </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Personal Details":
        return (
          <div className="p-1 animate-fadeIn">
            <SectionHeader title="Personal Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <InfoRow label="Name" value={userProfile.name} />
               <InfoRow label="Job Title" value={userProfile.jobTitle} />
               <InfoRow label="Department" value={userProfile.department} />
               <InfoRow label="Job Status" value={userProfile.jobStatus} />
               <InfoRow label="Joining Date" value={userProfile.joiningDate ? new Date(userProfile.joiningDate).toLocaleDateString() : "N/A"} />
               <InfoRow label="Gender" value={userProfile.gender} />
               <InfoRow label="Date of Birth" value={userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth).toLocaleDateString() : "N/A"} />
               <InfoRow label="Shift Timings" value={userProfile.shiftTimings} />
            </div>
          </div>
        );
      case "Contact Details":
        return (
          <div className="p-1 animate-fadeIn">
            <SectionHeader title="Contact Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Email" value={userProfile.contactDetails.email} />
                <InfoRow label="Phone Number 1" value={userProfile.contactDetails.phoneNumber1} />
                <InfoRow label="Phone Number 2" value={userProfile.contactDetails.phoneNumber2 || "Not Provided"} />
                <InfoRow label="Current City" value={userProfile.contactDetails.currentCity} />
                <InfoRow label="Current Address" value={userProfile.contactDetails.currentAddress} colSpan={2} />
                <InfoRow label="Permanent City" value={userProfile.contactDetails.permanentCity} />
                <InfoRow label="Permanent Address" value={userProfile.contactDetails.permanentAddress} colSpan={2} />
            </div>
          </div>
        );
      case "Education":
        return (
          <div className="p-1 animate-fadeIn">
            <SectionHeader title="Education Details" />
            <div className="space-y-4">
                {userProfile.education && userProfile.education.length > 0 ? (
                    userProfile.education.map((edu, index) => (
                        <div key={index} className="bg-white rounded-xl border border-platinum-200 overflow-hidden shadow-sm">
                            <div className="bg-alabaster-grey-50 px-6 py-3 border-b border-platinum-200 flex justify-between items-center">
                                <h3 className="font-bold text-gunmetal-900">{edu.degree || "Degree Name"}</h3>
                                <span className="text-xs font-semibold bg-white border border-platinum-200 px-3 py-1 rounded-full text-slate-grey-600">{edu.yearOfCompletion || "Year"}</span>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-xs text-slate-grey-500 uppercase">Field of Study</p>
                                    <p className="text-sm font-semibold text-gunmetal-900">{edu.fieldOfStudy || "--"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-grey-500 uppercase">Institute</p>
                                    <p className="text-sm font-semibold text-gunmetal-900">{edu.institute || "--"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-grey-500 uppercase">GPA/Grade</p>
                                    <p className="text-sm font-semibold text-gunmetal-900">{edu.GPA || "--"}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 bg-alabaster-grey-50 rounded-xl border border-dashed border-platinum-300">
                        <p className="text-slate-grey-500">No education details available.</p>
                    </div>
                )}
            </div>
          </div>
        );
      case "Emergency Contacts":
        return (
          <div className="p-1 animate-fadeIn">
            <SectionHeader title="Emergency Contacts" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {userProfile.emergencyContacts && userProfile.emergencyContacts.length > 0 ? (
                    userProfile.emergencyContacts.map((contact, index) => (
                        <React.Fragment key={index}>
                            <div className="bg-white rounded-xl border border-platinum-200 p-6 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaUser size={40} className="text-gunmetal-900" />
                                </div>
                                <h4 className="font-bold text-gunmetal-900 mb-4 border-b border-platinum-100 pb-2">Primary Contact</h4>
                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-grey-500">Name</span>
                                        <span className="text-sm font-semibold text-gunmetal-900">{contact.name1 || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-grey-500">Relation</span>
                                        <span className="text-sm font-semibold text-gunmetal-900">{contact.relation1 || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-grey-500">Phone</span>
                                        <span className="text-sm font-semibold text-gunmetal-900">{contact.contactNumber1 || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                             <div className="bg-white rounded-xl border border-platinum-200 p-6 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaUser size={40} className="text-gunmetal-900" />
                                </div>
                                <h4 className="font-bold text-gunmetal-900 mb-4 border-b border-platinum-100 pb-2">Secondary Contact</h4>
                                <div className="space-y-3 relative z-10">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-grey-500">Name</span>
                                        <span className="text-sm font-semibold text-gunmetal-900">{contact.name2 || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-grey-500">Relation</span>
                                        <span className="text-sm font-semibold text-gunmetal-900">{contact.relation2 || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-grey-500">Phone</span>
                                        <span className="text-sm font-semibold text-gunmetal-900">{contact.contactNumber2 || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    ))
               ) : (
                    <div className="col-span-2 text-center p-8 bg-alabaster-grey-50 rounded-xl border border-dashed border-platinum-300">
                        <p className="text-slate-grey-500">No emergency contacts available.</p>
                    </div>
               )}
            </div>
          </div>
        );
      case "Documents":
        return (
          <div className="p-1 animate-fadeIn">
            <SectionHeader title="Documents" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDocument(userProfile.resume?.resume || "", "Resume")}
                {renderDocument(userProfile.documents?.NIC || "", "NIC")}
                {renderDocument(userProfile.documents?.experienceLetter || "", "Experience Letter")}
                {renderDocument(userProfile.documents?.salarySlip || "", "Salary Slip")}
                {renderDocument(userProfile.documents?.academicDocuments || "", "Academic Documents")}
                {renderDocument(userProfile.documents?.NDA || "", "NDA")}
            </div>
          </div>
        );
      case "Bank Account":
        return (
          <div className="p-1 animate-fadeIn">
             <SectionHeader title="Bank Account Details" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Bank Name" value={userProfile.bankAccountDetails?.bankName || "N/A"} />
                <InfoRow label="Branch Name" value={userProfile.bankAccountDetails?.branchName || "N/A"} />
                <InfoRow label="Account Title" value={userProfile.bankAccountDetails?.accountTitle || "N/A"} />
                <InfoRow label="Account Number" value={userProfile.bankAccountDetails?.accountNumber || "N/A"} />
                <InfoRow label="IBAN Number" value={userProfile.bankAccountDetails?.IBANNumber || "N/A"} colSpan={2} />
            </div>
          </div>
        );
      case "Salary Details":
        return (
          <div className="p-1 animate-fadeIn">
            <SectionHeader title="Salary Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="p-6 bg-gunmetal-900 rounded-xl border border-gunmetal-800 text-white relative overflow-hidden group">
                     {/* Decorative background */}
                     <div className="absolute -right-4 -bottom-4 text-gunmetal-800 opacity-20 group-hover:opacity-30 transition-opacity">
                         <FaMoneyBillWave size={100} />
                     </div>
                     <p className="text-sm font-medium text-platinum-300 uppercase mb-2">Basic Salary</p>
                     <p className="text-2xl font-bold">
                        {userProfile.salaryDetails?.basicSalary
                         ? `PKR ${userProfile.salaryDetails.basicSalary.toLocaleString()}`
                         : "0"}
                     </p>
                 </div>

                 <InfoRow 
                    label="Medical Allowance" 
                    value={userProfile.salaryDetails?.medicalAllowance ? `PKR ${userProfile.salaryDetails.medicalAllowance.toLocaleString()}`: "0"} 
                 />
                 <InfoRow 
                    label="Mobile Allowance" 
                    value={userProfile.salaryDetails?.mobileAllowance ? `PKR ${userProfile.salaryDetails.mobileAllowance.toLocaleString()}` : "0"} 
                 />
                 <InfoRow 
                    label="Fuel Allowance" 
                    value={userProfile.salaryDetails?.fuelAllowance ? `PKR ${userProfile.salaryDetails.fuelAllowance.toLocaleString()}`: "0"} 
                 />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white flex flex-col md:flex-row rounded-2xl border border-platinum-200 shadow-xl overflow-hidden min-h-[600px]">
      <aside className="bg-alabaster-grey-50 w-full md:w-64 border-r border-platinum-200 flex-shrink-0">
        <div className="p-6">
           <h3 className="text-xs font-bold text-slate-grey-500 uppercase tracking-widest mb-4 px-2">Profile Navigation</h3>
          <nav className="flex flex-col space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none w-full text-left group ${
                  activeTab === tab.name
                    ? "bg-gunmetal-900 text-white shadow-lg shadow-gunmetal-500/20"
                    : "text-slate-grey-600 hover:bg-white hover:text-gunmetal-900 hover:shadow-sm border border-transparent hover:border-platinum-200"
                }`}
                aria-current={activeTab === tab.name ? "page" : undefined}
              >
                <span className={`mr-3 ${activeTab === tab.name ? 'text-platinum-400' : 'text-slate-grey-400 group-hover:text-gunmetal-600'}`}>
                    {tab.icon}
                </span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 p-8 bg-white overflow-y-auto max-h-[800px]">
         {renderContent()}
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        fileUrl={modalFileUrl}
        fileName={modalFileName}
        fileType={modalFileType}
      />
    </div>
  );
};

export default UserProfileDetails;
