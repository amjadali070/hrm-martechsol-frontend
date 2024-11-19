import React, { useState } from 'react';

const ProvidentFund: React.FC = () => {
  const userName = 'Amjad Ali';
  const memberSince = 'January 1, 2020';
  const allFundDetails = [
    {
      month: 'October 2024',
      employeeContribution: 5000,
      employerContribution: 5000,
    },
    {
      month: 'November 2024',
      employeeContribution: 6000,
      employerContribution: 6000,
    },
    {
      month: 'December 2024',
      employeeContribution: 7000,
      employerContribution: 7000,
    },
    {
      month: 'January 2023',
      employeeContribution: 4000,
      employerContribution: 4000,
    },
    {
      month: 'February 2023',
      employeeContribution: 3000,
      employerContribution: 3000,
    },
    {
      month: 'March 2023',
      employeeContribution: 3500,
      employerContribution: 3500,
    },
  ];

  const [filteredYear, setFilteredYear] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);

  const filteredFundDetails =
    filteredYear === 'All'
      ? allFundDetails
      : allFundDetails.filter((detail) => detail.month.includes(filteredYear));

  const paginatedData = filteredFundDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalBalance = allFundDetails.reduce(
    (sum, detail) => sum + detail.employeeContribution + detail.employerContribution,
    0
  );

  const totalPages = Math.ceil(filteredFundDetails.length / itemsPerPage);

  const tableClass =
    'w-full table-fixed border-collapse bg-white border border-gray-300 rounded-md shadow-sm mb-6';
  const thClass =
    'bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-center';
  const tdClass =
    'text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-center';

  return (
    <div className="w-full p-6 bg-white rounded-lg">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-black">
        Provident Fund Details
      </h2>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <tbody>
            <tr>
              <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-left font-semibold">
                User Name:
              </td>
              <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-left font-semibold">
                {userName}
              </td>
            </tr>
            <tr>
              <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-left font-semibold">
                Member Since:
              </td>
              <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-left font-semibold">
                {memberSince}
              </td>
            </tr>
            <tr>
              <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-left font-semibold">
                Total Balance:
              </td>
              <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-left font-semibold">
                {totalBalance.toLocaleString()} PKR
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-bold text-black">Monthly Contributions</h4>
        <div className="flex items-center space-x-2">
          <label htmlFor="year" className="text-sm font-medium text-gray-700">
            Filter by Year:
          </label>
          <select
            id="year"
            value={filteredYear}
            onChange={(e) => {
              setFilteredYear(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="All">All</option>
            {[2024, 2023, 2022].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <thead>
            <tr>
              <th className="bg-purple-900 text-white text-sm font-semibold px-4 py-2 border border-gray-300 text-left">
                Month
              </th>
              <th className={thClass}>Employee Contribution</th>
              <th className={thClass}>Employer Contribution</th>
              <th className={thClass}>Total</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((detail, index) => (
              <tr key={index}>
                <td className="text-sm text-gray-800 px-4 py-2 border border-gray-300 whitespace-nowrap text-left">
                  {detail.month}
                </td>
                <td className={tdClass}>
                  {detail.employeeContribution.toLocaleString()} PKR
                </td>
                <td className={tdClass}>
                  {detail.employerContribution.toLocaleString()} PKR
                </td>
                <td className={`${tdClass} text-blue-600 font-bold`}>
                  {(
                    detail.employeeContribution + detail.employerContribution
                  ).toLocaleString()}{' '}
                  PKR
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-1 border border-gray-300 rounded-md"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1 ? 'bg-gray-300' : 'bg-gray-500 text-white'
            }`}
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-600 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProvidentFund;