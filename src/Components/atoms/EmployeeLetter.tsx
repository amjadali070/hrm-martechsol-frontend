import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { FaSpinner } from 'react-icons/fa'; // Loading spinner icon
import EmploymentLetterPDF, { EmploymentCertificateProps } from '../../html/EmploymentLetterPDF';

const EmployeeLetter: React.FC = () => {
  const [formData, setFormData] = useState<EmploymentCertificateProps['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFormData({
        date: new Date().toLocaleDateString('en-GB'),
        employeeName: 'John Doe',
        companyName: 'MartechSol',
        jobTitle: 'Senior Software Engineer',
        startDate: 'January 2022',
        signatoryName: 'Jane Smith',
        signatoryTitle: 'HR Manager'
      });
      setLoading(false);
    }, 1000);
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
    <div className="min-h-screen bg-white">
      <header className="text-black py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mt-2 text-black">Employment Letter</h1>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <section className="rounded-lg">
          <div className="rounded-lg overflow-hidden">
            {formData ? (
              <PDFViewer style={{ width: '100%', height: '600px', maxWidth: '100%' }}>
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