import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import EditablePayroll from "./EditablePayroll";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";

const EditablePayrollPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const [payrollData, setPayrollData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayrollDetails = async () => {
      try {
        const stateData = location.state?.payroll;
        
        if (stateData) {
          setPayrollData(stateData);
          setLoading(false);
          return;
        }
        if (!id) {
          throw new Error('No payroll ID found');
        }

        const response = await axiosInstance.get(`${backendUrl}/api/payrolls/${id}`, {
          withCredentials: true,
        });

        setPayrollData(response.data);
      } catch (err: any) {
        console.error('Error fetching payroll details:', err);
        setError(
          err.response?.data?.message || 
          err.message || 
          'Failed to fetch payroll data'
        );
        toast.error('Failed to load payroll details');
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollDetails();
  }, [id, location.state, backendUrl]);

  const handleSave = async (updatedPayroll: any) => {
    try {
      if (!payrollData?._id) {
        toast.error("No payroll ID found");
        return;
      }
      const payload = {
        ...updatedPayroll,
        user: undefined,
        name: undefined,
        jobTitle: undefined,
        jobType: undefined,
      };

      await axiosInstance.put(`${backendUrl}/api/payrolls/${payrollData._id}`, payload, {
        withCredentials: true,
      });

      toast.success('Payroll updated successfully');
      navigate("/organization/payroll-management");
    } catch (err: any) {
      console.error('Error updating payroll:', err);
      toast.error(
        err.response?.data?.message || 
        err.message || 
        'Failed to update payroll'
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