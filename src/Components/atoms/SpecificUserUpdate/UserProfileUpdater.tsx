// UserProfileUpdater.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PersonalDetailsUpdater from "./PersonalDetailsUpdater";
import Tab from "./Tab";
import { toast } from "react-toastify";
import UserSalaryUpdater from "./UserSalaryUpdater";
import UserProfileDetails from "./UserProfileDetails";
import { FaSpinner } from "react-icons/fa";

// Define interfaces for better type safety
interface Education {
  institute?: string;
  degree?: string;
  fieldOfStudy?: string;
  GPA?: string;
  yearOfCompletion?: number;
}

interface EmergencyContact {
  name1: string;
  relation1: string;
  contactNumber1: string;
  name2: string;
  relation2: string;
  contactNumber2: string;
}

interface BankAccountDetails {
  bankName?: string;
  branchName?: string;
  accountTitle?: string;
  accountNumber?: string;
  IBANNumber?: string;
}

interface Documents {
  NIC?: string;
  experienceLetter?: string;
  salarySlip?: string;
  academicDocuments?: string;
  NDA?: string;
}

interface Resume {
  resume?: string;
}

interface PaymentDetails {
  cardHolderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

interface SalaryDetails {
  basicSalary: number;
  medicalAllowance: number;
  mobileAllowance: number;
  fuelAllowance: number;
}

interface ContactDetails {
  phoneNumber1: string;
  phoneNumber2?: string;
  email: string;
  currentCity: string;
  currentAddress: string;
  permanentCity: string;
  permanentAddress: string;
}

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
  salaryDetails: SalaryDetails;
  contactDetails: ContactDetails;
  education?: Education[];
  emergencyContacts?: EmergencyContact[];
  resume?: Resume;
  documents?: Documents;
  bankAccountDetails?: BankAccountDetails;
  companyEmail?: string;
  country?: string;
  phoneNumber?: string;
  businessAddress?: string;
  paymentDetails?: PaymentDetails;
}

const UserProfileUpdater: React.FC = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [activeTab, setActiveTab] = useState<string>("View Data");
  const [activeEditSubTab, setActiveEditSubTab] =
    useState<string>("Personal Details");

  const editSubTabs = ["Personal Details", "Salary Details"];

  const [departments] = useState<string[]>([
    "Account Management",
    "Project Management",
    "Content Production",
    "Book Marketing",
    "Design Production",
    "SEO",
    "Creative Media",
    "Web Development",
    "Paid Advertising",
    "Software Production",
    "IT & Networking",
    "Human Resource",
    "Training & Development",
    "Admin",
    "Finance",
    "Brand Development",
    "Corporate Communication",
    "Lead Generation",
    "Administration",
  ]);

  const [jobTitles] = useState<string[]>([
    "Executive",
    "Senior Executive",
    "Assistant Manager",
    "Associate Manager",
    "Manager",
    "Senior Manager",
    "Assistant Vice President",
    "Associate Vice President",
    "Vice President",
    "Senior Vice President",
    "President",
    "Head of Department",
    "Head Of Project Management",
    "Chief Executive Officer",
  ]);

  const tabs = ["View Data", "Edit Data"];

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/users/${id}/details`
        );
        const data = response.data;

        const mappedEmployee: Employee = {
          name: data.name,
          department: data.personalDetails?.department || "",
          jobTitle: data.personalDetails?.jobTitle || "",
          jobCategory: data.personalDetails?.jobCategory || "",
          jobType: data.personalDetails?.jobType || "",
          profilePicture: data.personalDetails?.profilePicture || "",
          shiftTimings:
            data.personalDetails?.shiftStartTime &&
            data.personalDetails?.shiftEndTime
              ? `${data.personalDetails.shiftStartTime} - ${data.personalDetails.shiftEndTime}`
              : "",
          gender: data.personalDetails?.gender || "",
          dateOfBirth: data.personalDetails?.dateOfBirth
            ? new Date(data.personalDetails.dateOfBirth)
                .toISOString()
                .split("T")[0]
            : "",
          jobStatus: data.personalDetails?.jobStatus || "Probation",
          joiningDate: data.personalDetails?.joiningDate
            ? new Date(data.personalDetails.joiningDate)
                .toISOString()
                .split("T")[0]
            : "",
          salaryDetails: {
            basicSalary: data.salaryDetails?.basicSalary || 0,
            medicalAllowance: data.salaryDetails?.medicalAllowance || 0,
            mobileAllowance: data.salaryDetails?.mobileAllowance || 0,
            fuelAllowance: data.salaryDetails?.fuelAllowance || 0,
          },
          contactDetails: {
            phoneNumber1: data.contactDetails?.phoneNumber1 || "",
            phoneNumber2: data.contactDetails?.phoneNumber2 || "",
            email: data.contactDetails?.email || "",
            currentCity: data.contactDetails?.currentCity || "",
            currentAddress: data.contactDetails?.currentAddress || "",
            permanentCity: data.contactDetails?.permanentCity || "",
            permanentAddress: data.contactDetails?.permanentAddress || "",
          },
          education: data.education || [],
          emergencyContacts: data.emergencyContacts || [],
          resume: data.resume || {},
          documents: data.documents || {},
          bankAccountDetails: data.bankAccountDetails || {},
        };

        setEmployee(mappedEmployee);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error("Failed to fetch employee details");
      }
    };

    fetchEmployeeData();
  }, [id, backendUrl]);

  const handleProfilePictureChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axios.put(
        `${backendUrl}/api/users/${id}/details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle response structure which might be { user: ... } or direct
      const updatedData = response.data.user || response.data;
      const newProfilePicture = updatedData.personalDetails?.profilePicture;

      if (newProfilePicture) {
        setEmployee((prev) =>
            prev
            ? {
                ...prev,
                profilePicture: newProfilePicture,
                }
            : null
        );
      }


      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    }
  };

  // Define a specific type for updated details
  interface UpdatedDetails {
    name: string;
    department: string;
    jobTitle: string;
    jobCategory: string;
    jobType: string;
    shiftTimings: string;
    gender: string;
    dateOfBirth: string;
    jobStatus: string;
    joiningDate: string;
    // Add other fields as necessary
  }

  const handleUpdateEmployeeDetails = async (
    updatedDetails: UpdatedDetails
  ) => {
    try {
      // Extract shiftTimings and split into start and end times
      const { shiftTimings, ...rest } = updatedDetails;
      let shiftStartTime = "";
      let shiftEndTime = "";

      if (shiftTimings) {
        const timings = shiftTimings.split(" - ");
        shiftStartTime = timings[0].trim();
        shiftEndTime = timings[1]?.trim() || "";
      }

      const payload = {
        personalDetails: {
          ...rest,
          shiftStartTime,
          shiftEndTime,
        },
      };

      const response = await axios.put(
        `${backendUrl}/api/users/${id}/details`,
        payload
      );

      const updatedData = response.data.user;

      const mappedEmployee: Employee = {
        ...employee!,
        ...updatedData.personalDetails,
        shiftTimings: `${updatedData.personalDetails.shiftStartTime} - ${updatedData.personalDetails.shiftEndTime}`,
        salaryDetails: employee?.salaryDetails,
      };

      setEmployee(mappedEmployee);
      toast.success("Employee details updated successfully");
    } catch (error) {
      console.error("Error updating employee data:", error);
      toast.error("Failed to update employee details");
    }
  };

  const handleUpdateSalaryDetails = async (updatedSalaryDetails: {
    basicSalary: number;
    medicalAllowance?: number;
    mobileAllowance?: number;
    fuelAllowance?: number;
  }) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/users/${id}/salary-details`,
        updatedSalaryDetails
      );

      const updatedData = response.data.salaryDetails;
      setEmployee((prev) =>
        prev
          ? {
              ...prev,
              salaryDetails: updatedData,
            }
          : null
      );

      toast.success("Salary details updated successfully");
    } catch (error) {
      console.error("Error updating salary details:", error);
      toast.error("Failed to update salary details");
    }
  };

  const renderEditTabContent = () => {
    switch (activeEditSubTab) {
      case "Personal Details":
        return (
          <PersonalDetailsUpdater
            userId={id}
            employee={employee!}
            departments={departments}
            jobTitles={jobTitles}
            onProfilePictureChange={handleProfilePictureChange}
            isEditable={true}
            onUpdate={handleUpdateEmployeeDetails}
          />
        );
      case "Salary Details":
        return (
          <UserSalaryUpdater
            userId={id}
            basicSalary={employee?.salaryDetails.basicSalary || 0}
            medicalAllowance={employee?.salaryDetails.medicalAllowance || 0}
            mobileAllowance={employee?.salaryDetails.mobileAllowance || 0}
            fuelAllowance={employee?.salaryDetails.fuelAllowance || 0}
            onUpdate={handleUpdateSalaryDetails}
          />
        );
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "View Data":
        return employee ? <UserProfileDetails userProfile={employee} /> : null;
      case "Edit Data":
        return (
          <div className="animate-fadeIn">
            <Tab
              tabs={editSubTabs}
              activeTab={activeEditSubTab}
              onTabChange={setActiveEditSubTab}
            />
            {renderEditTabContent()}
          </div>
        );
      default:
        return null;
    }
  };

  if (!employee) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-platinum-200 border-t-gunmetal-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-grey-500 font-medium text-sm animate-pulse">
          Loading Employee Profile...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-alabaster-grey-50 p-6 md:p-12">
      <div className="max-w-auto mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gunmetal-900 tracking-tight">
            User Management
          </h1>
          <p className="text-slate-grey-500 mt-2">
            View and update employee information and compensation details.
          </p>
        </div>

        <Tab tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UserProfileUpdater;
