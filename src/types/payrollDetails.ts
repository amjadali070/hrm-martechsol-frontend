// src/types.ts

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  jobType: string;
}

export interface Earnings {
  allowances: {
    medicalAllowance: number;
    fuelAllowance: number;
    mobileAllowance: number;
  };
  basicSalary: number;
  overtimePay: number;
  extraPayments: number;
}

export interface Deductions {
  tax: number;
  eobi: number;
  providentFund: {
    employeeContribution: number;
  };
  lossOfPay: number;
  absenceDeduction: number;
  lateDeduction: number;
}

export interface PayrollDetails {
  _id?: string;
  payrollId: string;
  user: User;
  month: string;
  year: number;
  earnings: Earnings;
  deductions: Deductions;
  absentDates: Date[];
}
