// src/components/SalarySlip.tsx
import React from 'react';
import logo from '../assets/LogoMartechSol.png';

interface SalarySlipProps {
  data: {
    date: string;
    name: string;
    designation: string;
    jobType: string;
    month: string;
    from: string;
    to: string;
    basicSalary: string;
    medicalAllowance: string;
    mobileAllowance: string;
    fuelAllowance: string;
    grossSalary: string;
    tax: string;
    eobi: string;
    pfContribution: string;
    amountPayable: string;
  };
}

const SalarySlip: React.FC<SalarySlipProps> = ({ data }) => {
  return (
    <div className="max-w-[90%] mx-auto bg-white p-5 rounded-lg shadow-lg relative">
      {/* Header */}
      <div className="text-center pb-8 border-b relative">
        <img src={logo} alt="Company Logo" className="mx-auto mb-2 w-48" />
        <h1 className="text-2xl font-bold">Salary Slip</h1>
        <p className="text-sm text-gray-600 absolute top-5 right-5">Date: {data.date}</p>
      </div>

      {/* Personal Details */}
      <div className="my-4">
        <h2 className="bg-purple-900 text-white px-3 py-1 rounded">Personal Details</h2>
        <table className="w-full table-fixed border-collapse mt-3">
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-1/3">Name</td>
              <td className="border px-4 py-2">{data.name}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Designation</td>
              <td className="border px-4 py-2">{data.designation}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Job Type</td>
              <td className="border px-4 py-2">{data.jobType}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Salary Period */}
      <div className="my-4">
        <h2 className="bg-purple-900 text-white px-3 py-1 rounded">Salary Period</h2>
        <table className="w-full table-fixed border-collapse mt-2">
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-1/3">Salary for the month of</td>
              <td className="border px-4 py-2">{data.month}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">From</td>
              <td className="border px-4 py-2">{data.from}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">To</td>
              <td className="border px-4 py-2">{data.to}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Salary Details */}
      <div className="my-4">
        <h2 className="bg-purple-900 text-white px-3 py-1 rounded">Salary Details</h2>
        <table className="w-full table-fixed border-collapse mt-2">
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-1/3">Basic Salary</td>
              <td className="border px-4 py-2">{data.basicSalary}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Medical Allowance</td>
              <td className="border px-4 py-2">{data.medicalAllowance}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Mobile Allowance</td>
              <td className="border px-4 py-2">{data.mobileAllowance}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Fuel Allowance</td>
              <td className="border px-4 py-2">{data.fuelAllowance}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-semibold">Gross Salary</td>
              <td className="border px-4 py-2">{data.grossSalary}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Deductions */}
      <div className="my-4">
        <h2 className="bg-purple-900 text-white px-3 py-1 rounded">Deductions</h2>
        <table className="w-full table-fixed border-collapse mt-2">
          <tbody>
            <tr>
              <td className="border px-4 py-2 w-1/3">Tax</td>
              <td className="border px-4 py-2">{data.tax}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">EOBI</td>
              <td className="border px-4 py-2">{data.eobi}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">PF Contribution</td>
              <td className="border px-4 py-2">{data.pfContribution}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Amount Payable */}
      <div className="my-4">
        <h2 className="bg-purple-900 text-white px-3 py-1 rounded">Amount Payable</h2>
        <table className="w-full table-fixed border-collapse mt-2">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-semibold w-1/3">Total</td>
              <td className="border px-4 py-2">{data.amountPayable}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 mt-6">
        <p className="mb-1">
          Plot# 172/P, Najeeb Corner, 3rd Floor, Main Tariq Road, P.E.C.H.S Block 2, Karachi
        </p>
        <p>+92 331 2269643 | contact@martechsol.com | www.martechsol.com</p>
      </div>
    </div>
  );
};

export default SalarySlip;