import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

interface PersonalDetails {
    profilePicture?: string;
    jobTitle?: string;
    department?: string;
    jobType?: 'Full-Time' | 'Part-Time' | 'Remote' | 'Contract' | 'Internship';
    shiftTimings?: string;
  }
  
  interface ContactDetails {
    phoneNumber?: string;
    personalEmail?: string;
    currentAddress?: string;
  }
  
  interface Education {
    institute?: string;
    degree?: string;
    fieldOfStudy?: string;
    GPA?: string;
    yearOfCompletion?: number;
  }
  
  interface EmergencyContact {
    name: string;
    relation: string;
    contactNumber: string;
  }
  
  interface BankAccountDetails {
    bankName?: string;
    branchName?: string;
    accountTitle?: string;
    accountNumber?: string;
    IBANNumber?: string;
  }
  
  interface Documents {
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
    mainUser?: string | null;
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

        setUser(response.data); 
        setLoading(false);
      } catch (error) {
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