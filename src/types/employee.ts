// types.ts

export interface PersonalDetails {
  department: string;
  jobCategory: string;
  jobTitle: string;
  fullJobTitle?: string;
  abbreviatedJobTitle?: string;
  jobType: string;
  jobStatus: string;
  shiftStartTime: string;
  shiftEndTime: string;
  gender: string;
  dateOfBirth: string;
  joiningDate: string;
}

export interface SalaryDetails {
  basicSalary: number;
  medicalAllowance: number;
  mobileAllowance: number;
  fuelAllowance: number;
}

export interface ContactDetails {
  phoneNumber1: string;
  phoneNumber2?: string;
  email: string;
  currentCity: string;
  currentAddress: string;
  permanentCity: string;
  permanentAddress: string;
}

export interface Education {
  institute?: string;
  degree?: string;
  fieldOfStudy?: string;
  GPA?: string;
  yearOfCompletion?: number;
}

export interface EmergencyContact {
  name1: string;
  relation1: string;
  contactNumber1: string;
  name2: string;
  relation2: string;
  contactNumber2: string;
}

export interface Documents {
  NIC?: string;
  experienceLetter?: string;
  salarySlip?: string;
  academicDocuments?: string;
  NDA?: string;
}

export interface BankAccountDetails {
  bankName?: string;
  branchName?: string;
  accountTitle?: string;
  accountNumber?: string;
  IBANNumber?: string;
}

export interface Resume {
  resume?: string;
}

export interface Employee {
  _id: string;
  name: string;
  email: string;
  personalDetails: PersonalDetails;
  profilePicture: string;
  salaryDetails: SalaryDetails;
  contactDetails: ContactDetails;
  education?: Education[];
  emergencyContacts?: EmergencyContact[];
  resume?: Resume;
  documents?: Documents;
  bankAccountDetails?: BankAccountDetails;
  businessAddress?: string;
  createdAt: string;
  updatedAt: string;
}
