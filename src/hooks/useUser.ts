import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import profilePlaceholder from "../assets/placeholder.png";

interface PersonalDetails {
  profilePicture?: string;
  jobTitle?: string;
  department?: string;
  jobType?: 'Full-Time' | 'Part-Time' | 'Remote' | 'Contract' | 'Internship';
  shiftTimings?: string;
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
  role: 'normal' | 'HR' | 'manager' | 'SuperAdmin';
  createdAt?: Date;
  updatedAt?: Date;
}

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await axios.get(`${backendUrl}/api/users/profile`, {
          withCredentials: true,
        });

        const processPath = (path?: string) => 
          path ? `${backendUrl}/${path.replace(/\\/g, "/")}` : null;

        const userData = {
          ...response.data,
          personalDetails: {
            ...response.data.personalDetails,
            profilePicture: processPath(response.data.personalDetails?.profilePicture) || profilePlaceholder,
          },
          resume: {
            resume: processPath(response.data.resume?.resume),
          },
          documents: {
            NIC: processPath(response.data.documents?.NIC),
            experienceLetter: processPath(response.data.documents?.experienceLetter),
            salarySlip: processPath(response.data.documents?.salarySlip),
            academicDocuments: processPath(response.data.documents?.academicDocuments),
            NDA: processPath(response.data.documents?.NDA),
            educationalDocuments: response.data.documents?.educationalDocuments?.map(processPath),
            professionalDocuments: response.data.documents?.professionalDocuments?.map(processPath),
          },
        };

        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
        setLoading(false);
        navigate("/signin");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  return { user, loading };
};

export default useUser;