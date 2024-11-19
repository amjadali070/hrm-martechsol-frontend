import React, { useState, useEffect } from 'react';

interface PayrollDetails {
  name: string;
  designation: string;
  jobType: string;
  from: string;
  to: string;
  basicSalary: number;
  medicalAllowance: number;
  mobileAllowance: number;
  fuelAllowance: number;
  grossSalary: number;
  additions: number;
  deductions: {
    tax: number;
    eobi: number;
    pfContribution: number;
  };
  providentFund: {
    employeeContribution: number;
    employerContribution: number;
    totalAmount: number;
  };
  leaveDetails: {
    casualLeaveAvailable: number;
    sickLeaveAvailable: number;
    annualLeaveAvailable: number;
  };
}

const PayrollView: React.FC = () => {
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>('October 2024');
  const [payrollData, setPayrollData] = useState<PayrollDetails | null>(null);

  const dummyData: { [key: string]: PayrollDetails } = {
    'October 2024': {
      name: 'Urwah Iftikhar',
      designation: 'Assistant Manager - Graphic Design',
      jobType: 'Full Time',
      from: 'October 01, 2024',
      to: 'October 31, 2024',
      basicSalary: 135000,
      medicalAllowance: 13564,
      mobileAllowance: 0,
      fuelAllowance: 6000,
      grossSalary: 154564,
      additions: 0,
      deductions: {
        tax: 9245,
        eobi: 370,
        pfContribution: 6239,
      },
      providentFund: {
        employeeContribution: 6239,
        employerContribution: 6239,
        totalAmount: 12478,
      },
      leaveDetails: {
        casualLeaveAvailable: 4,
        sickLeaveAvailable: 8,
        annualLeaveAvailable: 15,
      },
    },
    'September 2024': {
      name: 'Urwah Iftikhar',
      designation: 'Assistant Manager - Graphic Design',
      jobType: 'Full Time',
      from: 'September 01, 2024',
      to: 'September 30, 2024',
      basicSalary: 132000,
      medicalAllowance: 13000,
      mobileAllowance: 0,
      fuelAllowance: 5000,
      grossSalary: 150000,
      additions: 0,
      deductions: {
        tax: 9100,
        eobi: 350,
        pfContribution: 6200,
      },
      providentFund: {
        employeeContribution: 6200,
        employerContribution: 6200,
        totalAmount: 12400,
      },
      leaveDetails: {
        casualLeaveAvailable: 5,
        sickLeaveAvailable: 9,
        annualLeaveAvailable: 16,
      },
    },
  };

  useEffect(() => {
    setPayrollData(dummyData[selectedMonthYear] || null);
  }, [selectedMonthYear]);

  if (!payrollData) return <div>Loading payroll data...</div>;

  const totalDeductions =
    payrollData.deductions.tax +
    payrollData.deductions.eobi +
    payrollData.deductions.pfContribution;

  const amountPayable =
    payrollData.grossSalary + payrollData.additions - totalDeductions;

  const tableClass =
    'w-full border-collapse bg-white border border-gray-300 rounded-md shadow-sm mb-6';
  const thClass =
    'bg-purple-900 text-white text-sm font-semibold text-left px-4 py-2 border border-gray-300';
  const tdClass =
    'text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap';

  return (
    <div className="w-full p-6 bg-white rounded-lg ">
     <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Salary Slip</h1>
        <div className="flex items-center space-x-4">
            <select
            id="monthYear"
            value={selectedMonthYear}
            onChange={(e) => setSelectedMonthYear(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
            {Object.keys(dummyData).map((key) => (
                <option key={key} value={key}>
                {key}
                </option>
            ))}
            </select>
            <button
            onClick={() => console.log("Export to PDF")}
            className="px-4 py-2 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
            Export to PDF
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
                <td className={`${tdClass} font-bold`}>{payrollData.name}</td>
              </tr>
              <tr>
                <td className={tdClass}>Designation</td>
                <td className={`${tdClass} font-bold`}>{payrollData.designation}</td>
              </tr>
              <tr>
                <td className={tdClass}>Job Type</td>
                <td className={`${tdClass} font-bold`}>{payrollData.jobType}</td>
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
                <td className={`${tdClass} w-1/2`}>From</td>
                <td className={`${tdClass} font-bold w-1/2`}>{payrollData.from}</td>
              </tr>
              <tr>
                <td className={`${tdClass} w-1/2`}>To</td>
                <td className={`${tdClass} font-bold w-1/2`}>{payrollData.to}</td>
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
            <td className={`${tdClass} w-1/2`}>{payrollData.basicSalary} PKR</td>
            </tr>
            <tr>
            <td className={`${tdClass} w-1/2`}>Medical Allowance</td>
            <td className={`${tdClass} w-1/2`}>{payrollData.medicalAllowance} PKR</td>
            </tr>
            <tr>
            <td className={`${tdClass} w-1/2`}>Mobile Allowance</td>
            <td className={`${tdClass} w-1/2`}>{payrollData.mobileAllowance} PKR</td>
            </tr>
            <tr>
            <td className={`${tdClass} w-1/2`}>Fuel Allowance</td>
            <td className={`${tdClass} w-1/2`}>{payrollData.fuelAllowance} PKR</td>
            </tr>
            <tr>
            <td className={`${tdClass} w-1/2`}>Gross Salary</td>
            <td className={`${tdClass} w-1/2`}>{payrollData.grossSalary} PKR</td>
            </tr>
        </tbody>
      </table>


      <div className="grid grid-cols-2 gap-4">
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
              <td className={tdClass}>{payrollData.deductions.tax} PKR</td>
            </tr>
            <tr>
              <td className={tdClass}>EOBI</td>
              <td className={tdClass}>{payrollData.deductions.eobi} PKR</td>
            </tr>
            <tr>
              <td className={tdClass}>PF Contribution</td>
              <td className={tdClass}>
                {payrollData.deductions.pfContribution} PKR
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={`${thClass} w-1/2`}>Amount Payable:</th>
              <th className={`${tdClass} w-1/2`}>
                {amountPayable.toFixed(2)} PKR
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
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
            <tbody>
            <tr>
              <th className={thClass} colSpan={2}>
              Provident Fund Details
              </th>
            </tr>
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
      </div>

    </div>
  );
};

export default PayrollView;