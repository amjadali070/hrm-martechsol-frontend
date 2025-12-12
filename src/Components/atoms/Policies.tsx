import React, { useState } from "react";
import { FaDownload, FaQuestionCircle, FaFileContract, FaSpinner } from "react-icons/fa";

interface PolicyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PolicyInfoModal: React.FC<PolicyInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gunmetal-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden">
         <div className="bg-alabaster-grey-50 px-6 py-4 border-b border-platinum-200">
             <h3 className="text-lg font-bold text-gunmetal-900">Policy Information</h3>
         </div>
        <div className="p-6">
            <p className="text-slate-grey-600 mb-6 text-sm leading-relaxed">
            Our employee handbook provides comprehensive guidelines and policies
            to ensure a supportive and productive work environment. Please review it carefully.
            </p>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-blue-700">
                <FaQuestionCircle size={20} className="shrink-0 mt-0.5" />
                <span className="text-sm font-medium">Need more information? Contact <strong className="text-blue-800">HR Support</strong>.</span>
            </div>
            
            <button
                onClick={onClose}
                className="w-full mt-6 py-2.5 bg-gunmetal-900 text-white rounded-lg text-sm font-bold hover:bg-gunmetal-800 transition-colors"
                >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

const Policies: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.open(
        "https://drive.google.com/uc?id=19eN4m2C8HHH6f7_e47hXauprGbjcBb-A&export=download",
        "_blank"
      );
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-platinum-200 mb-8 overflow-hidden">
       {/* Header */}
       <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-xl border border-platinum-200 shadow-sm">
            <FaFileContract className="text-gunmetal-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">
              Company Policies
            </h2>
            <p className="text-sm text-slate-grey-500">
               Official employee handbook and guidelines.
            </p>
          </div>
        </div>
        
        <button
            onClick={handleDownload}
            disabled={isLoading}
            className={`
            flex items-center justify-center gap-2
            px-5 py-2.5 
            bg-white border border-platinum-200 
            text-gunmetal-700 text-sm font-bold 
            rounded-lg shadow-sm 
            hover:bg-gunmetal-50 hover:text-gunmetal-900 hover:border-gunmetal-300
            transition-all
            ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
            `}
        >
            {isLoading ? (
            <>
                <FaSpinner className="animate-spin text-gunmetal-600" />
                <span>Preparing...</span>
            </>
            ) : (
            <>
                <FaDownload className="text-gunmetal-500" />
                <span>Download Handbook</span>
            </>
            )}
        </button>
      </div>

      <div className="p-8">
          <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-gunmetal-900 flex items-center gap-2">
                   Employee Handbook <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Updated</span>
               </h3>
               <button 
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline"
               >
                 <FaQuestionCircle /> Policy Info
               </button>
          </div>

          <div className="w-full h-[700px] rounded-xl overflow-hidden border border-platinum-200 shadow-inner bg-slate-100">
            <iframe
              src="https://drive.google.com/file/d/19eN4m2C8HHH6f7_e47hXauprGbjcBb-A/preview"
              title="Employee Handbook"
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
            />
          </div>

           <div className="mt-6 flex items-center justify-center">
             <div className="bg-alabaster-grey-50 border border-platinum-200 rounded-lg py-3 px-6 text-center">
                <p className="text-xs text-slate-grey-500 leading-relaxed">
                By accessing this document, you acknowledge that you have read and understood the company policies.
                <br/>For clarifications, contact <strong className="text-gunmetal-700">HR Department</strong>.
                </p>
             </div>
          </div>
      </div>

      <PolicyInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Policies;
