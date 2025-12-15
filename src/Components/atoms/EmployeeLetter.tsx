import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { FaSpinner, FaFileSignature, FaBriefcase } from "react-icons/fa";
import EmploymentLetterPDF, {
  EmploymentCertificateProps,
} from "../../html/EmploymentLetterPDF";
import useUser from "../../hooks/useUser";

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
        companyName: "NEXUS Pvt. Ltd.",
        jobTitle: user.personalDetails?.fullJobTitle || "",
        startDate: formattedStartDate,
        signatoryName: "Amjad Ali",
        signatoryTitle: "Chief Executive Officer",
      });
    }
  }, [userLoading, user]);

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 mb-8 overflow-hidden">
      {/* Header */}
      <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
            <FaFileSignature className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Employment Letter
            </h2>
            <p className="text-sm text-slate-grey-500">
              Generate and view your official employment certificate.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 bg-alabaster-grey-50/30">
        {userLoading || !formData ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-platinum-200 border-dashed">
            <FaSpinner
              size={32}
              className="animate-spin text-gunmetal-500 mb-4"
              aria-hidden="true"
            />
            <p className="text-slate-grey-500 font-medium">
              Generating document...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Info Card - Optional context */}
            <div className="bg-white p-4 rounded-xl border border-platinum-200 shadow-sm flex items-start gap-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <FaBriefcase size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gunmetal-900">
                  Document Ready
                </h4>
                <p className="text-xs text-slate-grey-500 mt-1">
                  This certificate verifies your current employment status and
                  role at <strong>NEXUS Pvt. Ltd.</strong> You can download or
                  print it directly from the viewer below.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-platinum-200 shadow-lg shadow-platinum-200/50 bg-white">
              <PDFViewer
                style={{ width: "100%", height: "700px" }}
                className="w-full border-none"
                showToolbar={true}
              >
                <EmploymentLetterPDF data={formData} />
              </PDFViewer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeLetter;
