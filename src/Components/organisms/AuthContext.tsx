// AuthContext.tsx

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
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

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUserProfile: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  fetchUserProfile: async () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserProfile = async (): Promise<User | null> => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/users/profile`, {
        withCredentials: true,
      });
      const userData = response.data as User;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
