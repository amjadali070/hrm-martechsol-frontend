import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import profilePlaceholder from "../assets/placeholder.png";

interface PersonalDetails {
  profilePicture?: string;
  department: string;
  jobCategory?: string;
  jobTitle: string;
  fullJobTitle?: string;
  abbreviatedJobTitle?: string;
  joiningDate: string;
  jobType: "Full-Time" | "Part-Time" | "Remote" | "Contract" | "Internship";
  shiftTimings?: string;
  jobStatus: string;
  gender: string;
  dateOfBirth: string;
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
  onUpdate: (details: {
    phoneNumber1: string;
    phoneNumber2?: string;
    email: string;
    currentCity: string;
    currentAddress: string;
    permanentCity: string;
    permanentAddress: string;
  }) => void;
}

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
  educationalDocuments?: string[];
  professionalDocuments?: string[];
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

interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  personalDetails?: PersonalDetails;
  contactDetails?: ContactDetails;
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
  salaryDetails?: SalaryDetails;
  role: "normal" | "HR" | "manager" | "SuperAdmin";
  createdAt?: Date;
  updatedAt?: Date;
}

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      if (!backendUrl) throw new Error("Backend URL is not defined");

      const response = await axios.get(`${backendUrl}/api/users/profile`, {
        withCredentials: true,
      });

      // Helper function to construct the full backend URL for uploads
      const constructBackendUrl = (path?: string) => {
        if (!path) return null;

        // Convert backslashes to forward slashes and remove any leading/trailing slashes
        const normalizedPath = path
          .replace(/\\/g, "/")
          .replace(/^\/+|\/+$/g, "");

        // Extract the path after "uploads" if it exists
        const uploadPath = normalizedPath.includes("uploads/")
          ? normalizedPath.split("uploads/")[1]
          : normalizedPath;

        // Construct the complete backend URL
        return `${backendUrl}/uploads/${uploadPath}`;
      };

      const userData: User = {
        ...response.data,
        personalDetails: {
          ...response.data.personalDetails,
          profilePicture: response.data.personalDetails?.profilePicture
            ? constructBackendUrl(response.data.personalDetails.profilePicture)
            : null,
        },
        documents: {
          ...response.data.documents,
          NIC: constructBackendUrl(response.data.documents?.NIC),
          experienceLetter: constructBackendUrl(
            response.data.documents?.experienceLetter
          ),
          salarySlip: constructBackendUrl(response.data.documents?.salarySlip),
          academicDocuments: constructBackendUrl(
            response.data.documents?.academicDocuments
          ),
          NDA: constructBackendUrl(response.data.documents?.NDA),
          educationalDocuments:
            response.data.documents?.educationalDocuments?.map(
              constructBackendUrl
            ) || [],
          professionalDocuments:
            response.data.documents?.professionalDocuments?.map(
              constructBackendUrl
            ) || [],
        },
      };

      // Debug logs
      console.log("Backend URL:", backendUrl);
      console.log(
        "Original profile picture path:",
        response.data.personalDetails?.profilePicture
      );
      console.log(
        "Constructed profile picture URL:",
        userData.personalDetails?.profilePicture
      );

      setUser(userData);
      setLoading(false);
      return userData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      setLoading(false);
      navigate("/signin");
      throw error;
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return { user, loading, refetchUser: fetchUserProfile };
};

export default useUser;
