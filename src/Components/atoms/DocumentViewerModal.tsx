import React from "react";
import { FaTimes, FaFileAlt } from "react-icons/fa";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: "image" | "pdf";
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType,
}) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (fileType) {
      case "image":
        return (
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full max-h-[75vh] object-contain mx-auto rounded-lg shadow-sm"
          />
        );
      case "pdf":
        return (
          <iframe
            src={fileUrl}
            title={fileName}
            className="w-full h-[75vh] rounded-lg border border-platinum-200"
            frameBorder="0"
          />
        );
      default:
        return (
             <div className="flex flex-col items-center justify-center p-12 text-slate-grey-500">
                 <p>Unsupported file type</p>
             </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-gunmetal-900/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-platinum-200 shrink-0">
           <div className="flex items-center gap-3 overflow-hidden">
               <div className="bg-gunmetal-50 p-2 rounded-lg text-gunmetal-600 shrink-0">
                   <FaFileAlt />
               </div>
               <h2 className="text-lg font-bold text-gunmetal-900 truncate" title={fileName}>
                   {fileName}
               </h2>
           </div>
           
           <button
             onClick={onClose}
             className="ml-4 p-2 text-slate-grey-400 hover:text-gunmetal-900 hover:bg-platinum-50 rounded-full transition-colors"
           >
             <FaTimes size={18} />
           </button>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-alabaster-grey-50/50 flex-1 overflow-auto flex items-center justify-center">
            {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default DocumentViewerModal;
