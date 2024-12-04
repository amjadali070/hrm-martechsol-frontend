import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import SalarySlipPDF from '../../html/SalarySlipPDF';
import useUser from '../../hooks/useUser';

interface PayrollDetails {
  user: string;
  month: string;
  year: number;
  basicSalary: number;
  earnings: {
    basicSalary: number;
    allowances: {
      medicalAllowance: number;
      fuelAllowance: number;
      mobileAllowance: number;
    };
    overtimePay: number;
  };
  deductions: {
    tax: number;
    eobi: number;
    providentFund: {
      employeeContribution: number;
      employerContribution: number;
    };
    lossOfPay: number;
  };
  netSalary: number;
  presentDays: number;
  totalWorkingDays: number;
}

const PayrollView: React.FC = () => {
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>('');
  const [payrollData, setPayrollData] = useState<PayrollDetails | null>(null);
  const [monthYearOptions, setMonthYearOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [payrollRecords, setPayrollRecords] = useState<PayrollDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL; 
  const [payrollHistory, setPayrollHistory] = useState<any[]>([]);
  const userId = user.user?._id;
  useEffect(() => {
    const fetchPayrollData = async () => {
      // Check if userId is available before making the API call
      if (!userId) {
        setIsLoading(false);
        return;
      }
  
      try {
        // Fetch payroll records for the user
        const response = await axios.get(`${backendUrl}/api/payroll`, {
          params: { userId },
          withCredentials: true,
        });
  
        const payrollRecords = response.data;
        
        // Handle case when no payroll records exist
        if (payrollRecords.length === 0) {
          setPayrollRecords([]);
          setMonthYearOptions([]);
          setPayrollData(null);
          setError('No payroll data available');
          setIsLoading(false);
          return;
        }
  
        setPayrollRecords(payrollRecords);
        
        // Generate month-year options
        const options = payrollRecords.map((record: PayrollDetails) => 
          `${record.month} ${record.year}`
        );
        setMonthYearOptions(options);
  
        // Set initial selected month-year to the most recent
        if (options.length > 0) {
          setSelectedMonthYear(options[0]);
          const selectedRecord = payrollRecords.find(
            (record: PayrollDetails) => 
              `${record.month} ${record.year}` === options[0]
          );
          setPayrollData(selectedRecord);
        }
  
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch payroll data');
        setIsLoading(false);
      }
    };
  
    // Call the function only if userId is available
    if (userId) {
      fetchPayrollData();
    }
  }, [backendUrl, userId]);

  const handleMonthYearChange = (selectedValue: string) => {
    setSelectedMonthYear(selectedValue);
    
    // Find the corresponding payroll record
    const selectedRecord = payrollRecords.find(
      (record: PayrollDetails) => 
        `${record.month} ${record.year}` === selectedValue
    ) || null;
    setPayrollData(selectedRecord);
  };

  // if (isLoading) return <div>Loading payroll data...</div>;
  // if (!payrollData || error) return <div>Error: {error}</div>;
  // if (!payrollData) return <div>No payroll data available</div>;

  // Prepare data for PDF
  const pdfData = {
    date: new Date().toLocaleDateString(),
    name: user.user?.name || '',
    designation: user.user?.personalDetails?.fullJobTitle || '',
    jobType: user.user?.personalDetails?.jobType || '',
    month: payrollData?.month || '',
    year: payrollData?.year?.toString() || '',
    basicSalary: payrollData?.basicSalary?.toLocaleString() || '0',
    medicalAllowance: payrollData?.earnings.allowances.medicalAllowance?.toLocaleString() || '0',
    fuelAllowance: payrollData?.earnings.allowances.fuelAllowance?.toLocaleString() || '0',
    mobileAllowance: payrollData?.earnings.allowances.mobileAllowance?.toLocaleString() || '0',
    grossSalary: (
      (payrollData?.basicSalary || 0) + 
      (payrollData?.earnings?.allowances?.medicalAllowance || 0) +
      (payrollData?.earnings?.allowances?.fuelAllowance || 0) +
      (payrollData?.earnings?.allowances?.mobileAllowance || 0)).toLocaleString(),
    tax: payrollData?.deductions.tax?.toLocaleString() || '0',
    eobi: payrollData?.deductions.eobi?.toLocaleString() || '0',
    pfContribution: payrollData?.deductions.providentFund.employeeContribution?.toLocaleString() || '0',
    amountPayable: payrollData?.netSalary?.toLocaleString() || '0',
  };

  const tableClass =
  'w-full border-collapse bg-white border border-gray-300 rounded-md mb-4 md:mb-6';
  const thClass =
    'bg-purple-900 text-white text-xs sm:text-sm font-semibold text-left px-2 py-2 sm:px-4 sm:py-2 border border-gray-300';
  const tdClass =
    'text-xs sm:text-sm text-gray-800 px-2 py-2 sm:px-4 sm:py-2 border border-gray-300 whitespace-nowrap';

  return (
    <div className="w-full p-3 sm:p-6 bg-white rounded-lg" id="payroll-view">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4 sm:mb-0">
          Salary Slip
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <select
            id="monthYear"
            value={selectedMonthYear}
            onChange={(e) => handleMonthYearChange(e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm mb-2 sm:mb-0"
          >
            {monthYearOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <PDFDownloadLink
            document={<SalarySlipPDF data={pdfData} />}
            fileName={`Salary_Slip_${selectedMonthYear.replace(/\s+/g, '_')}.pdf`}
            style={{
              textDecoration: 'none',
              padding: '10px 20px',
              color: '#fff',
              backgroundColor: '#1b45d5',
              borderRadius: '5px',
              display: 'inline-block',
            }}
          >
            Download PDF
          </PDFDownloadLink>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass} colSpan={2}>
                  Personal Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Name</td>
                <td className={`${tdClass} font-bold`}>{user.user?.name}</td>
              </tr>
              <tr>
                <td className={tdClass}>Designation</td>
                <td className={`${tdClass} font-bold`}>{user.user?.personalDetails?.fullJobTitle}</td>
              </tr>
              <tr>
                <td className={tdClass}>Job Type</td>
                <td className={`${tdClass} font-bold`}>{user.user?.personalDetails?.jobType}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass} colSpan={2}>
                  Salary Period
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`${tdClass} w-1/2`}>Salary for the month of</td>
                <td className={`${tdClass} font-bold w-1/2`}>{selectedMonthYear}</td>
              </tr>
              <tr>
                <td className={`${tdClass} w-1/2`}>Year</td>
                <td className={`${tdClass} font-bold w-1/2`}>{payrollData?.year}</td>
              </tr>
              <tr>
                <td className={`${tdClass} w-1/2`}>Month</td>
                <td className={`${tdClass} font-bold w-1/2`}>{payrollData?.month}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <table className={tableClass}>
        <thead>
          <tr>
            <th className={thClass} colSpan={2}>
              Salary Details
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${tdClass} w-1/2`}>Basic Salary</td>
            <td className={`${tdClass} w-1/2`}>{payrollData?.basicSalary} PKR</td>
          </tr>
          <tr>
            <td className={`${tdClass} w-1/2`}>Medical Allowance</td>
            <td className={`${tdClass} w-1/2`}>{payrollData?.earnings.allowances.medicalAllowance} PKR</td>
          </tr>
          <tr>
            <td className={`${tdClass} w-1/2`}>Mobile Allowance</td>
            <td className={`${tdClass} w-1/2`}>{payrollData?.earnings.allowances.mobileAllowance} PKR</td>
          </tr>
          <tr>
            <td className={`${tdClass} w-1/2`}>Fuel Allowance</td>
            <td className={`${tdClass} w-1/2`}>{payrollData?.earnings.allowances.fuelAllowance} PKR</td>
          </tr>
          <tr>
            <td className={`${tdClass} w-1/2`}>Gross Salary</td>
            <td className={`${tdClass} w-1/2`}>{payrollData?.earnings.basicSalary} PKR</td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass} colSpan={2}>
                Additions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdClass}>N/A</td>
              <td className={tdClass}>N/A</td>
            </tr>
          </tbody>
        </table>

        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass} colSpan={2}>
                Deductions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={tdClass}>Tax</td>
              <td className={tdClass}>{payrollData?.deductions.tax} PKR</td>
            </tr>
            <tr>
              <td className={tdClass}>EOBI</td>
              <td className={tdClass}>{payrollData?.deductions.eobi} PKR</td>
            </tr>
            <tr>
              <td className={tdClass}>PF Contribution</td>
              <td className={tdClass}>
                {payrollData?.deductions.providentFund.employeeContribution} PKR
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className={tableClass}>
        <thead>
          <tr>
            <th className={`${thClass} w-1/2`}>Amount Payable</th>
            <th className={`${tdClass} w-1/2 text-black`}>
              {payrollData?.netSalary.toFixed(2)} PKR
            </th>
          </tr>
        </thead>
      </table>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass} colSpan={2}>
                  Leave Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Casual Leave</td>
                <td className={tdClass}>
                  {payrollData.leaveDetails.casualLeaveAvailable}
                </td>
              </tr>
              <tr>
                <td className={tdClass}>Sick Leave</td>
                <td className={tdClass}>
                  {payrollData.leaveDetails.sickLeaveAvailable}
                </td>
              </tr>
              <tr>
                <td className={tdClass}>Annual Leave</td>
                <td className={tdClass}>
                  {payrollData.leaveDetails.annualLeaveAvailable}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass} colSpan={2}>
                  Provident Fund Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={tdClass}>Your Contribution</td>
                <td className={tdClass}>
                  {payrollData.providentFund.employeeContribution} PKR
                </td>
              </tr>
              <tr>
                <td className={tdClass}>Employer Contribution</td>
                <td className={tdClass}>
                  {payrollData.providentFund.employerContribution} PKR
                </td>
              </tr>
              <tr>
                <td className={tdClass}>Total Provident Fund</td>
                <td className={tdClass}>
                  {payrollData.providentFund.totalAmount} PKR
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default PayrollView;