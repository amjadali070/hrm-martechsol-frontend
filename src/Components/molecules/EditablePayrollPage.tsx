import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EditablePayroll from "./EditablePayroll";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";

interface PayrollDetails {
  _id?: string;
  payrollId: string;
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    jobType: string;
  };
  month: string;
  year: number;
  earnings: {
    allowances: {
      medicalAllowance: number;
      fuelAllowance: number;
      mobileAllowance: number;
    };
    basicSalary: number;
    overtimePay: number;
  };
  deductions: {
    tax: number;
    eobi: number;
    providentFund: {
      employeeContribution: number;
    };
  };
}

const EditablePayrollPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [payrollData, setPayrollData] = useState<PayrollDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const normalizePayrollData = (data: any): PayrollDetails => ({
    payrollId: data.payrollId || "",
    _id: data._id || "",
    user: {
      name: data.user?.name || "",
      id: data.user?.id || "",
      email: data.user?.email || "",
      department: data.user?.department || "",
      jobTitle: data.user?.jobTitle || "",
      jobType: data.user?.jobType || "",
    },
    earnings: {
      basicSalary: data.earnings?.basicSalary || 0,
      allowances: {
        medicalAllowance: data.earnings?.allowances?.medicalAllowance || 0,
        mobileAllowance: data.earnings?.allowances?.mobileAllowance || 0,
        fuelAllowance: data.earnings?.allowances?.fuelAllowance || 0,
      },
      overtimePay: data.earnings?.overtimePay || 0,
    },
    deductions: {
      tax: data.deductions?.tax || 0,
      eobi: data.deductions?.eobi || 0,
      providentFund: {
        employeeContribution:
          data.deductions?.providentFund?.employeeContribution || 0,
      },
    },
    month: data.month || "",
    year: data.year || new Date().getFullYear(),
  });

  useEffect(() => {
    const fetchPayrollDetails = async () => {
      try {
        const stateData = location.state?.payroll;

        if (stateData) {
          setPayrollData(normalizePayrollData(stateData));
          setLoading(false);
          return;
        }
        if (!id) {
          throw new Error("No payroll ID found");
        }

        const response = await axiosInstance.get(
          `${backendUrl}/api/payrolls/${id}`,
          {
            withCredentials: true,
          }
        );

        setPayrollData(normalizePayrollData(response.data));
      } catch (err: any) {
        console.error("Error fetching payroll details:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch payroll data"
        );
        toast.error("Failed to load payroll details");
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollDetails();
  }, [id, location.state, backendUrl]);

  const handleSave = async (updatedPayroll: PayrollDetails) => {
    try {
      if (!payrollData?.payrollId) {
        toast.error("No payroll ID found");
        return;
      }

      const payload = {
        basicSalary: updatedPayroll.earnings.basicSalary || 0,
        medicalAllowance:
          updatedPayroll.earnings.allowances.medicalAllowance || 0,
        mobileAllowance:
          updatedPayroll.earnings.allowances.mobileAllowance || 0,
        fuelAllowance: updatedPayroll.earnings.allowances.fuelAllowance || 0,
        overtimePay: updatedPayroll.earnings.overtimePay || 0,
        tax: updatedPayroll.deductions.tax || 0,
        eobi: updatedPayroll.deductions.eobi || 0,
        providentFundContribution:
          updatedPayroll.deductions.providentFund.employeeContribution || 0,
      };

      await axiosInstance.put(
        `${backendUrl}/api/payrolls/update-details/${payrollData.payrollId}`,
        payload,
        {
          withCredentials: true,
        }
      );

      toast.success("Payroll updated successfully");
      navigate("/organization/payroll-management");
    } catch (err: any) {
      console.error("Error updating payroll:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to update payroll"
      );
    }
  };

  const handleCancel = () => {
    navigate("/organization/payroll-management");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!payrollData) {
    return <div>Payroll data not found.</div>;
  }

  return (
    <EditablePayroll
      payrollData={payrollData}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default EditablePayrollPage;
