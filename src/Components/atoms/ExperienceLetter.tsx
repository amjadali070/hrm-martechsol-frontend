import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { FaAward, FaStar} from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import ExperienceLetterPDF, {
  ExperienceLetterProps,
} from "../../html/ExperienceLetterPDF";
import useUser from "../../hooks/useUser";

const ExperienceLetter: React.FC = () => {
  const [formData, setFormData] = useState<
    ExperienceLetterProps["data"] | null
  >(null);

  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    if (!userLoading && user) {
      const formattedDate = new Date().toLocaleDateString("en-GB");
      const formattedJoiningDate = new Date(
        user.personalDetails?.joiningDate || ""
      ).toLocaleDateString("en-GB");
      const formattedEndDate = new Date().toLocaleDateString("en-GB");

      setFormData({
        date: formattedDate,
        employeeName: user.name || "",
        companyName: "NEXUS Pvt. Ltd.",
        jobTitle: user.personalDetails?.fullJobTitle || "",
        startDate: formattedJoiningDate,
        endDate: formattedEndDate,
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
            <FaAward className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Experience Letter
            </h2>
            <p className="text-sm text-slate-grey-500">
              View and download your official work experience certificate.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 bg-alabaster-grey-50/30">
        {userLoading || !formData ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-platinum-200 border-dashed">
            <LoadingSpinner size="md" />
            <p className="text-slate-grey-500 font-medium">
              Preparing document...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Info Card */}
            <div className="bg-white p-4 rounded-xl border border-platinum-200 shadow-sm flex items-start gap-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <FaStar size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gunmetal-900">
                  Certificate Preview
                </h4>
                <p className="text-xs text-slate-grey-500 mt-1">
                  This document certifies your tenure and designation at{" "}
                  <strong>NEXUS Pvt. Ltd.</strong> It includes your start date,
                  end date (if applicable), and role details.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-platinum-200 shadow-lg shadow-platinum-200/50 bg-white">
              <PDFViewer
                style={{ width: "100%", height: "700px" }}
                className="w-full border-none"
                showToolbar={true}
              >
                <ExperienceLetterPDF data={formData} />
              </PDFViewer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceLetter;
