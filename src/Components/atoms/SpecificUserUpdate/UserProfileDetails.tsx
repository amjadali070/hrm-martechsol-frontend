import React, { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaUniversity,
  FaAddressBook,
  FaFileSignature,
  FaMoneyBillWave,
  FaFileAlt,
} from "react-icons/fa";

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

  const renderDocument = (url: string, title: string) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const fullUrl = url.startsWith("http") ? url : `${backendUrl}${url}`;

    return (
      <div className="mb-6">
        <h3 className="flex items-center text-md font-semibold mb-2 text-blue-600">
          <FaFileAlt className="mr-2" title={`${title} Icon`} />
          {title}
        </h3>
        {url ? (
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View {title}
          </a>
        ) : (
          <p className="text-gray-500">Not Provided</p>
        )}
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

  const renderContent = () => {
    switch (activeTab) {
      case "Personal Details":
        return (
          <div className="p-1">
            <h2 className="text-3xl font-bold bg-purple-900 text-white p-2 rounded-lg text-center">
              Personal Details
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
                <tbody>
                  <tr className="border-b hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Name
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Job Title
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.jobTitle}
                    </td>
                  </tr>

                  {/* Row 2: Department and Job Status */}
                  <tr className="border-b bg-gray-50 hover:bg-gray-200 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Department
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.department}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Job Status
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.jobStatus}
                    </td>
                  </tr>

                  {/* Row 3: Joining Date and Gender */}
                  <tr className="border-b hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Joining Date
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.joiningDate
                        ? new Date(userProfile.joiningDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Gender
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.gender}
                    </td>
                  </tr>

                  {/* Row 4: Date of Birth and Shift Timings */}
                  <tr className="border-b bg-gray-50 hover:bg-gray-200 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Date of Birth
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.dateOfBirth
                        ? new Date(userProfile.dateOfBirth).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Shift Timings
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.shiftTimings}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Contact Details":
        return (
          <div className="p-1">
            <h2 className="text-3xl font-bold bg-purple-900 text-white p-2 rounded-lg text-center">
              Contact Details
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
                <tbody>
                  <tr className="border-b hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Email
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.contactDetails.email}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Phone Number 1
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.contactDetails.phoneNumber1}
                    </td>
                  </tr>

                  <tr className="border-b bg-gray-50 hover:bg-gray-200 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Phone Number 2
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.contactDetails.phoneNumber2 ||
                        "Not Provided"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Current City
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.contactDetails.currentCity}
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Current Address
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.contactDetails.currentAddress}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Permanent City
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.contactDetails.permanentCity}
                    </td>
                  </tr>

                  <tr className="border-b bg-gray-50 hover:bg-gray-200 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Permanent Address
                    </td>
                    <td className="px-6 py-4 text-gray-700" colSpan={3}>
                      {userProfile.contactDetails.permanentAddress}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Education":
        return (
          <div className="p-1">
            <h2 className="text-3xl font-bold bg-purple-900 text-white p-2 rounded-lg text-center">
              Education Details
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                      Degree
                    </th>
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                      Field of Study
                    </th>
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                      Institute
                    </th>
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                      GPA
                    </th>
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                      Year of Completion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userProfile.education && userProfile.education.length > 0 ? (
                    userProfile.education.map((edu, index) => (
                      <tr
                        key={index}
                        className={`border-b ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100 transition duration-200`}
                      >
                        <td className="px-6 py-4 text-gray-700">
                          {edu.degree || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {edu.fieldOfStudy || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {edu.institute || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {edu.GPA || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {edu.yearOfCompletion || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-6 py-4 text-gray-500 text-center"
                        colSpan={5}
                      >
                        No education details available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Emergency Contacts":
        return (
          <div className="p-1">
            <h2 className="text-3xl font-bold bg-purple-900 text-white p-2 rounded-lg text-center">
              Emergency Contacts
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                      Relation
                    </th>
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">
                      Contact Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userProfile.emergencyContacts &&
                  userProfile.emergencyContacts.length > 0 ? (
                    userProfile.emergencyContacts.map((contact, index) => (
                      <>
                        <tr
                          key={index}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-gray-100 transition duration-200`}
                        >
                          <td className="px-6 py-4 text-gray-700">
                            {contact.name1 || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {contact.relation1 || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {contact.contactNumber1 || "N/A"}
                          </td>
                        </tr>
                        <tr
                          key={index}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-gray-100 transition duration-200`}
                        >
                          <td className="px-6 py-4 text-gray-700">
                            {contact.name2 || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {contact.relation2 || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {contact.contactNumber2 || "N/A"}
                          </td>
                        </tr>
                      </>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-6 py-4 text-gray-500 text-center"
                        colSpan={3}
                      >
                        No emergency contacts available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Documents":
        return (
          <div className="bg-white p-6 rounded-lg transition duration-300 ">
            {renderDocument(userProfile.resume?.resume || "", "Resume")}
            {renderDocument(userProfile.documents?.NIC || "", "NIC")}
            {renderDocument(
              userProfile.documents?.experienceLetter || "",
              "Experience Letter"
            )}
            {renderDocument(
              userProfile.documents?.salarySlip || "",
              "Salary Slip"
            )}
            {renderDocument(
              userProfile.documents?.academicDocuments || "",
              "Academic Documents"
            )}
            {renderDocument(userProfile.documents?.NDA || "", "NDA")}
          </div>
        );
      case "Bank Account":
        return (
          <div className="p-1">
            <h2 className="text-3xl font-bold bg-purple-900 text-white p-2 rounded-lg text-center">
              Bank Account Details
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
                <tbody>
                  <tr className="border-b hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Bank Name
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.bankAccountDetails?.bankName || "N/A"}
                    </td>
                  </tr>

                  <tr className="border-b bg-gray-50 hover:bg-gray-200 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Branch Name
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.bankAccountDetails?.branchName || "N/A"}
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Account Title
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.bankAccountDetails?.accountTitle || "N/A"}
                    </td>
                  </tr>

                  <tr className="border-b bg-gray-50 hover:bg-gray-200 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Account Number
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.bankAccountDetails?.accountNumber || "N/A"}
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      IBAN Number
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.bankAccountDetails?.IBANNumber || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "Salary Details":
        return (
          <div className="p-1">
            <h2 className="text-3xl font-bold bg-purple-900 text-white p-2 rounded-lg text-center">
              Salary Details
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse bg-white rounded-lg shadow-md">
                <tbody>
                  <tr className="border-b hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Basic Salary
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.salaryDetails?.basicSalary
                        ? `$${userProfile.salaryDetails.basicSalary.toLocaleString()}`
                        : "0"}
                    </td>
                  </tr>

                  <tr className="border-b bg-gray-50 hover:bg-gray-200 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Medical Allowance
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.salaryDetails?.medicalAllowance
                        ? `$${userProfile.salaryDetails.medicalAllowance.toLocaleString()}`
                        : "0"}
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Mobile Allowance
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.salaryDetails?.mobileAllowance
                        ? `$${userProfile.salaryDetails.mobileAllowance.toLocaleString()}`
                        : "0"}
                    </td>
                  </tr>
                  <tr className="border-b bg-gray-50 hover:bg-gray-200 transition duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      Fuel Allowance
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {userProfile.salaryDetails?.fuelAllowance
                        ? `$${userProfile.salaryDetails.fuelAllowance.toLocaleString()}`
                        : "0"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white flex rounded-lg">
      <aside className=" bg-white rounded-lg hidden md:block">
        <div className="p-4">
          <nav className="flex flex-col space-y-5">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-300 focus:outline-none ${
                  activeTab === tab.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                }`}
                aria-current={activeTab === tab.name ? "page" : undefined}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-2xl">
          {/* <div className="flex flex-col items-center mb-1">
            <h1 className="text-4xl font-bold text-gray-800">
              {userProfile.name}
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              {userProfile.jobTitle} &bull; {userProfile.department}
            </p>
          </div> */}

          <div className="mb-4 md:hidden">
            <nav className="flex flex-wrap gap-2 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center px-4 py-3 rounded-full font-medium text-sm ${
                    activeTab === tab.name
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                  }`}
                  aria-current={activeTab === tab.name ? "page" : undefined}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDetails;
