import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { FaSpinner } from "react-icons/fa"; // Loading spinner icon
import EmploymentLetterPDF, {
  EmploymentCertificateProps,
} from "../../html/EmploymentLetterPDF";
import useUser from "../../hooks/useUser"; // Import the useUser hook

const EmployeeLetter: React.FC = () => {
  const [formData, setFormData] = useState<
    EmploymentCertificateProps["data"] | null
  >(null);

  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (!userLoading && user) {
      // Format the dates to 'en-GB' locale (dd/MM/yyyy)
      const formattedDate = new Date().toLocaleDateString("en-GB");

      const formattedStartDate = new Date(
        user.personalDetails?.joiningDate || ""
      ).toLocaleDateString("en-GB");

      setFormData({
        date: formattedDate,
        employeeName: user.name || "",
        companyName: "MartechSol Pvt. Ltd.",
        jobTitle: user.personalDetails?.fullJobTitle || "",
        startDate: formattedStartDate,
        signatoryName: "Mirza Waqas Baig",
        signatoryTitle: "Chief Executive Officer",
      });
    }
  }, [userLoading, user]);

  if (userLoading || !formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <FaSpinner
          size={30}
          className="animate-spin text-purple-600 mb-6"
          aria-hidden="true"
        />
        <h1 className="text-xl font-semibold text-gray-800">
          Preparing Your Employment Letter...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="text-black py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mt-2 text-black">
          Employment Letter
        </h1>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <section className="rounded-lg">
          <div className="rounded-lg overflow-hidden">
            {formData ? (
              <PDFViewer
                style={{ width: "100%", height: "600px", maxWidth: "100%" }}
              >
                <EmploymentLetterPDF data={formData} />
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

export default EmployeeLetter;
