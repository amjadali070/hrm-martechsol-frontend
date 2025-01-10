// src/contexts/PayrollContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

import { toast } from "react-toastify";
import axiosInstance from "../../../utils/axiosConfig";
import { getMonthNumber, getMonthName } from "../../../utils/monthUtils";

export interface ExtraPayment {
  id: string;
  description: string;
  amount: number;
}

export interface PayrollData {
  id: string;
  user: {
    name: string;
    email: string;
    department: string;
  };
  month: number;
  year: number;
  daysPresent: number;
  daysAbsent: number;
  leaves: number;
  baseSalary: number;
  deductions: number;
  bonuses: number;
  totalSalary: number;
  netSalary: number;
  status: string;
  processedOn: string | null;
  remarks: string;
  extraPayments?: ExtraPayment[];
  absentDates: string[];
}

export interface PayrollContextProps {
  payrolls: PayrollData[];
  fetchPayrolls: (month?: string, year?: number) => Promise<void>;
  addPayroll: (payroll: PayrollData) => void;
  updatePayroll: (updatedPayroll: PayrollData) => void;
  deletePayroll: (id: string) => void;
  generatePayroll: (month: string, year: number) => Promise<void>;
  processPayroll: (month: string, year: number) => Promise<void>;
  payrollSummary: any; // Define a proper type based on your summary structure
}

const PayrollContext = createContext<PayrollContextProps | undefined>(
  undefined
);

export const usePayroll = (): PayrollContextProps => {
  const context = useContext(PayrollContext);
  if (!context) {
    throw new Error("usePayroll must be used within a PayrollProvider");
  }
  return context;
};

interface PayrollProviderProps {
  children: ReactNode;
}

export const PayrollProvider: React.FC<PayrollProviderProps> = ({
  children,
}) => {
  const [payrolls, setPayrolls] = useState<PayrollData[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<any>(null); // Define a proper type
  const backendUrl = process.env.REACT_APP_BACKEND_URL || ""; // Ensure it's defined

  const fetchPayrolls = useCallback(
    async (month?: string, year?: number) => {
      try {
        const params: any = {};
        if (month) {
          const monthNumber = getMonthNumber(month);
          if (monthNumber) params.month = monthNumber;
        }
        if (year) params.year = year;

        const response = await axiosInstance.get(`${backendUrl}/api/payroll`, {
          params,
        });
        setPayrolls(response.data.payrolls);
      } catch (error: any) {
        console.error("Error fetching payrolls:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch payrolls."
        );
      }
    },
    [backendUrl]
  );

  const addPayroll = (payroll: PayrollData) => {
    setPayrolls((prev) => [...prev, payroll]);
    toast.success(`Payroll added for ${payroll.user.name}`);
  };

  const updatePayroll = (updatedPayroll: PayrollData) => {
    setPayrolls((prev) =>
      prev.map((payroll) =>
        payroll.id === updatedPayroll.id ? updatedPayroll : payroll
      )
    );
    toast.success(`Payroll updated for ${updatedPayroll.user.name}`);
  };

  const deletePayroll = async (id: string) => {
    try {
      await axiosInstance.delete(`${backendUrl}/api/payroll/${id}`);
      setPayrolls((prev) => prev.filter((payroll) => payroll.id !== id));
      toast.success("Payroll deleted successfully.");
    } catch (error: any) {
      console.error("Error deleting payroll:", error);
      toast.error(error.response?.data?.message || "Failed to delete payroll.");
    }
  };

  const generatePayroll = async (month: string, year: number) => {
    try {
      const monthNumber = getMonthNumber(month);
      if (!monthNumber) {
        throw new Error("Invalid month selected.");
      }

      await axiosInstance.post(`${backendUrl}/api/payroll/generate`, {
        month: monthNumber,
        year,
      });
      await fetchPayrolls(month, year);
      toast.success(`Payroll generated for ${month} ${year}`);
    } catch (error: any) {
      console.error("Error generating payroll:", error);
      toast.error(
        error.response?.data?.message || "Failed to generate payroll."
      );
    }
  };

  const processPayroll = async (month: string, year: number) => {
    try {
      const monthNumber = getMonthNumber(month);
      if (!monthNumber) {
        throw new Error("Invalid month selected.");
      }

      await axiosInstance.post(`${backendUrl}/api/payroll/process`, {
        month: monthNumber,
        year,
      });
      await fetchPayrolls(month, year);
      toast.success(`Payroll processed for ${month} ${year}`);
    } catch (error: any) {
      console.error("Error processing payroll:", error);
      toast.error(
        error.response?.data?.message || "Failed to process payroll."
      );
    }
  };

  const fetchPayrollSummary = async (month: string, year: number) => {
    try {
      const monthNumber = getMonthNumber(month);
      if (!monthNumber) {
        throw new Error("Invalid month selected.");
      }

      const response = await axiosInstance.get(
        `${backendUrl}/api/payroll/summary`,
        {
          params: { month: monthNumber, year },
        }
      );
      setPayrollSummary(response.data.summary);
    } catch (error: any) {
      console.error("Error fetching payroll summary:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch payroll summary."
      );
    }
  };

  useEffect(() => {
    // Fetch initial payrolls, e.g., current month
    const currentMonth = getMonthName(new Date().getMonth() + 1);
    const currentYear = new Date().getFullYear();
    fetchPayrolls(currentMonth, currentYear);
    fetchPayrollSummary(currentMonth, currentYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PayrollContext.Provider
      value={{
        payrolls,
        fetchPayrolls,
        addPayroll,
        updatePayroll,
        deletePayroll,
        generatePayroll,
        processPayroll,
        payrollSummary,
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
};
