import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { FaSpinner } from "react-icons/fa";
import ExperienceLetterPDF, {
  ExperienceLetterProps,
} from "../../html/ExperienceLetterPDF";

const ExperienceLetter: React.FC = () => {
  const [formData, setFormData] = useState<
    ExperienceLetterProps["data"] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFormData({
        date: new Date().toLocaleDateString("en-GB"),
        employeeName: "John Doe",
        companyName: "MartechSol",
        jobTitle: "Software Engineer",
        startDate: "2022-01-01",
        endDate: "2024-11-26",
        signatoryName: "Jane Smith",
        signatoryTitle: "HR Manager",
      });
      setLoading(false);
    }, 1000); // Simulate network delay
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <FaSpinner
          size={30}
          className="animate-spin text-purple-600 mb-6"
          aria-hidden="true"
        />
        <h1 className="text-xl font-semibold text-gray-800">
          Preparing Your Experience Letter...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="text-black py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mt-2 text-black">
          Experience Letter
        </h1>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <section className="rounded-lg">
          <div className="rounded-lg overflow-hidden">
            {formData ? (
              <PDFViewer
                style={{ width: "100%", height: "600px", maxWidth: "100%" }}
              >
                <ExperienceLetterPDF data={formData} />
              </PDFViewer>
            ) : (
              <p className="text-center text-gray-500">
                No data available to preview
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExperienceLetter;
