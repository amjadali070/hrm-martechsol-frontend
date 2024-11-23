import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EditablePayroll from "./EditablePayroll";

const EditablePayrollPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const payrollData = location.state?.employee;

  const handleSave = (updatedPayroll: any) => {
    console.log("Saved Payroll:", updatedPayroll);
    navigate("/organization/payroll-management");
  };

  const handleCancel = () => {
    navigate("/organization/payroll-management");
  };

  if (!payrollData) {
    return <div>Employee data not found.</div>;
  }

  return (
    <div>
      <EditablePayroll
        payrollData={payrollData}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditablePayrollPage;