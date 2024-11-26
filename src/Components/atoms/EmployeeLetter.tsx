import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { FaSpinner } from 'react-icons/fa'; // Loading spinner icon
import EmploymentLetterPDF from '../../html/EmploymentLetterPDF';

const EmployeeLetter: React.FC = () => {
  const [formData, setFormData] = useState<{
    date: string;
    name: string;
    position: string;
    department: string;
    startDate: string;
    salary: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a backend call with dummy data
    setTimeout(() => {
      setFormData({
        date: new Date().toLocaleDateString('en-GB'),
        name: 'John Doe',
        position: 'Software Engineer',
        department: 'Engineering',
        startDate: '2024-12-01',
        salary: '200,000 PKR',
      });
      setLoading(false);
    }, 1000); // Simulate network delay
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-purple-600 text-5xl mb-6" aria-hidden="true" />
        <h1 className="text-xl font-semibold text-gray-800">Preparing Your Employment Letter...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Header */}
      <header className="bg-gradient-to-r  text-black py-6 ">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold">Employment Letter</h1>
          {/* <p className="text-sm mt-2">Generate, preview, and download your employment letter seamlessly</p> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Employee Details Card
        <section className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Employee Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 text-sm">
                <strong className="block text-black">Date:</strong> {formData?.date}
              </p>
            </div>
            <div>
              <p className="text-gray-700 text-sm">
                <strong className="block text-black">Name:</strong> {formData?.name}
              </p>
            </div>
            <div>
              <p className="text-gray-700 text-sm">
                <strong className="block text-black">Position:</strong> {formData?.position}
              </p>
            </div>
            <div>
              <p className="text-gray-700 text-sm">
                <strong className="block text-black">Department:</strong> {formData?.department}
              </p>
            </div>
            <div>
              <p className="text-gray-700 text-sm">
                <strong className="block text-black">Start Date:</strong> {formData?.startDate}
              </p>
            </div>
            <div>
              <p className="text-gray-700 text-sm">
                <strong className="block text-black">Salary:</strong> {formData?.salary}
              </p>
            </div>
          </div>
        </section> */}

        {/* PDF Preview Section */}
        <section className="bg-white rounded-lg p-6">
          {/* <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Employment Letter Preview</h2> */}
          <div className="rounded-lg overflow-hidden">
            {formData ? (
              <PDFViewer style={{ width: '100%', height: '600px' }}>
                <EmploymentLetterPDF data={formData} />
              </PDFViewer>
            ) : (
              <p className="text-center text-gray-500">No data available to preview</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmployeeLetter;