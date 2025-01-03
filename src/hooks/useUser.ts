// useUser.ts

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
  shiftStartTime?: string; // Made optional
  shiftEndTime?: string; // Made optional
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
  resume?: string; // Changed from Resume to string
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

      // Fetch user profile from backend
      const response = await axios.get(`${backendUrl}/api/users/profile`, {
        withCredentials: true,
      });

      // Helper function to determine if a URL is absolute
      const isFullURL = (url: string) => /^https?:\/\//i.test(url);

      // Process file paths to absolute URLs if necessary
      const processPath = (path?: string) => {
        if (!path) return null;
        return isFullURL(path)
          ? path
          : `${backendUrl.replace(/\/+$/, "")}/${path
              .replace(/\\+/g, "/")
              .replace(/^\/+/, "")}`;
      };

      // Process array of document paths
      const processDocumentPaths = (documents?: string[]) =>
        documents?.map(processPath);

      // Handle combined shiftTimings if backend hasn't split them
      let shiftStartTime: string | undefined = undefined;
      let shiftEndTime: string | undefined = undefined;

      if (response.data.personalDetails?.shiftTimings) {
        const [start, end] =
          response.data.personalDetails.shiftTimings.split(" - ");
        shiftStartTime = start?.trim();
        shiftEndTime = end?.trim();
      } else {
        shiftStartTime = response.data.personalDetails?.shiftStartTime;
        shiftEndTime = response.data.personalDetails?.shiftEndTime;
      }

      const userData: User = {
        ...response.data,
        personalDetails: {
          ...response.data.personalDetails,
          profilePicture:
            processPath(response.data.personalDetails?.profilePicture) ||
            profilePlaceholder,
          shiftStartTime: shiftStartTime || undefined,
          shiftEndTime: shiftEndTime || undefined,
        },
        resume: processPath(response.data.resume),
        documents: {
          NIC: processPath(response.data.documents?.NIC),
          experienceLetter: processPath(
            response.data.documents?.experienceLetter
          ),
          salarySlip: processPath(response.data.documents?.salarySlip),
          academicDocuments: processPath(
            response.data.documents?.academicDocuments
          ),
          NDA: processPath(response.data.documents?.NDA),
          educationalDocuments: processDocumentPaths(
            response.data.documents?.educationalDocuments
          ),
          professionalDocuments: processDocumentPaths(
            response.data.documents?.professionalDocuments
          ),
        },
        education: response.data.education?.map((edu: Education) => ({
          ...edu,
          yearOfCompletion: edu.yearOfCompletion
            ? Number(edu.yearOfCompletion)
            : undefined,
        })),
        salaryDetails: response.data.salaryDetails,
      };

      console.log("Processed user data:", userData); // Debugging log

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
