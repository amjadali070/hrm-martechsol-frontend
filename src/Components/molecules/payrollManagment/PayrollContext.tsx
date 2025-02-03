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

export interface LeaveDate {
  date: string;
  type: string;
}

export interface PayrollData {
  id: string;
  user: {
    name: string;
    email: string;
    personalDetails: {
      department: string;
      jobTitle: string;
      abbreviatedJobTitle: string;
    };
  };
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  perDaySalary: number;
  totalSalary: number;
  deductions: number;
  netSalary: number;
  lateIns: number;
  lateInDates: string[];
  lateInDeductions: number;
  absentDays: number;
  absentDates: string[];
  halfDays: number;
  halfDayDates: string[];
  halfDayDeductions: number;
  leaveDates?: LeaveDate[];
  status: string;
  processedOn: string | null;
  remarks: string;
  extraPayments?: ExtraPayment[];
  tax: number;
  eobi: number;
  employeePF: number;
  employerPF: number;
  deductedLeavesFromLateIns?: number;
}

export interface MonthYear {
  month: number;
  year: number;
}

export interface PayrollContextProps {
  payrolls: PayrollData[];
  fetchPayrolls: (month?: string, year?: number) => Promise<PayrollData[]>;
  fetchAllMonths: () => Promise<MonthYear[]>;
  addPayroll: (payroll: PayrollData) => void;
  deletePayroll: (id: string) => void;
  generatePayroll: (month: string, year: number) => Promise<void>;
  processPayroll: (month: string, year: number) => Promise<void>;
  payrollSummary: any;
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
  const [payrollSummary, setPayrollSummary] = useState<any>(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";

  const fetchPayrolls = useCallback(
    async (month?: string, year?: number): Promise<PayrollData[]> => {
      try {
        const params: any = {};
        if (month) {
          const monthNumber = getMonthNumber(month);
          if (monthNumber) params.month = monthNumber;
        }
        if (year) {
          params.year = year;
        }

        const response = await axiosInstance.get(`${backendUrl}/api/payroll`, {
          params,
        });

        const payrollsWithId: PayrollData[] = response.data.payrolls.map(
          (payroll: any) => ({
            ...payroll,
            id: payroll._id,
            lateInDeductions:
              Math.floor(payroll.lateIns / 4) * (payroll.perDaySalary / 2),
            halfDayDeductions: payroll.halfDays * (payroll.perDaySalary / 2),
            deductedLeavesFromLateIns: payroll.deductedLeavesFromLateIns || 0,

            user: {
              ...payroll.user,
              personalDetails: {
                department: payroll.user.personalDetails.department,
                jobTitle: payroll.user.personalDetails.jobTitle,
                abbreviatedJobTitle:
                  payroll.user.personalDetails.abbreviatedJobTitle,
              },
            },
          })
        );

        setPayrolls(payrollsWithId);
        return payrollsWithId;
      } catch (error: any) {
        console.error("Error fetching payrolls:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch payrolls."
        );
        return [];
      }
    },
    [backendUrl]
  );

  const fetchAllMonths = useCallback(async (): Promise<MonthYear[]> => {
    try {
      const response = await axiosInstance.get(
        `${backendUrl}/api/payroll/all-months`
      );
      return response.data.months;
    } catch (error: any) {
      console.error("Error fetching all months:", error);
      toast.error(error.response?.data?.message || "Failed to fetch months.");
      return [];
    }
  }, [backendUrl]);

  const addPayroll = (payroll: PayrollData) => {
    setPayrolls((prev) => [...prev, payroll]);
    toast.success(`Payroll added for ${payroll.user.name}`);
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

  const generatePayroll = async (
    month: string,
    year: number
  ): Promise<void> => {
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

  const processPayroll = async (month: string, year: number): Promise<void> => {
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

  const fetchPayrollSummary = async (
    month: string,
    year: number
  ): Promise<void> => {
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
    const currentMonth = getMonthName(new Date().getMonth() + 1);
    const currentYear = new Date().getFullYear();
    fetchPayrolls(currentMonth, currentYear);
    fetchPayrollSummary(currentMonth, currentYear);
  }, []);

  return (
    <PayrollContext.Provider
      value={{
        payrolls,
        fetchPayrolls,
        fetchAllMonths,
        addPayroll,
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
