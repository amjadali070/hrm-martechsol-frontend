import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import ExperienceLetterPDF from '../../html/ExperienceLetterPDF';

const ExperienceLetter: React.FC = () => {
  const [data, setData] = useState<{
    date: string;
    name: string;
    position: string;
    department: string;
    startDate: string;
    endDate: string;
  } | null>(null);

  useEffect(() => {
    setData({
      date: new Date().toLocaleDateString('en-GB'),
      name: 'Jane Doe',
      position: 'Marketing Manager',
      department: 'Marketing',
      startDate: '2019-01-01',
      endDate: '2024-01-01',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r text-black py-6 ">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold">Experience Letter</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {data && (
          <PDFViewer style={{ width: '100%', height: '600px' }}>
            <ExperienceLetterPDF data={data} />
          </PDFViewer>
        )}
      </main>
    </div>
  );
};

export default ExperienceLetter;