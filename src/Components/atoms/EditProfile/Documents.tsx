import React, { useState } from "react";
import {
  FaFileUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaFileAlt,
  FaImage
} from "react-icons/fa";
import DocumentViewerModal from "../DocumentViewerModal";

interface DocumentProps {
  documents: {
    name: string;
    type: "image" | "pdf";
    fileUrl: string | null;
  }[];
  onUpdate: (name: string, file: File) => void;
}

const Documents: React.FC<DocumentProps> = ({ documents, onUpdate }) => {
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{
    url: string;
    name: string;
    type: "image" | "pdf";
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = (name: string) => {
    if (selectedFile) {
      onUpdate(name, selectedFile);
      setSelectedFile(null);
      setEditingDocument(null);
    }
  };

  const toggleEdit = (name: string) => {
    setEditingDocument((prev) => (prev === name ? null : name));
    setSelectedFile(null);
  };

  const handleViewDocument = (
    fileUrl: string,
    name: string,
    type: "image" | "pdf"
  ) => {
    setViewingDocument({ url: fileUrl, name, type });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-platinum-200 overflow-hidden relative">
       <div className="bg-alabaster-grey-50 px-8 py-6 border-b border-platinum-200">
            <h2 className="text-xl font-bold text-gunmetal-900 tracking-tight">Employee Documents</h2>
            <p className="text-sm text-slate-grey-500 mt-1">Manage official documents and records</p>
        </div>

      <div className="p-8 space-y-4">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-xl border border-platinum-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${doc.fileUrl ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                    {doc.type === 'pdf' ? <FaFileAlt size={20} /> : <FaImage size={20} />}
               </div>
               <div>
                    <h3 className="text-gunmetal-900 font-bold text-sm md:text-base">{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        {doc.fileUrl ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                <FaCheckCircle size={10} /> Uploaded
                            </span>
                        ) : (
                             <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                <FaTimesCircle size={10} /> Missing
                            </span>
                        )}
                        <span className="text-xs text-slate-grey-400 capitalize bg-alabaster-grey-50 px-2 py-0.5 rounded-full border border-platinum-200">{doc.type.toUpperCase()}</span>
                    </div>
               </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
              {doc.fileUrl && (
                <button
                  onClick={() =>
                    handleViewDocument(doc.fileUrl!, doc.name, doc.type)
                  }
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-alabaster-grey-50 border border-platinum-200 text-slate-grey-600 rounded-lg font-bold text-xs hover:bg-gunmetal-50 hover:text-gunmetal-900 transition-all uppercase"
                  aria-label={`View ${doc.name}`}
                >
                  <FaEye size={14} />
                  View
                </button>
              )}
              <button
                onClick={() => toggleEdit(doc.name)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gunmetal-900 text-white rounded-lg font-bold text-xs hover:bg-gunmetal-800 transition-all uppercase shadow-lg shadow-gunmetal-500/10"
                aria-label={`Upload ${doc.name}`}
              >
                <FaFileUpload size={14} />
                {doc.fileUrl ? 'Update' : 'Upload'}
              </button>
            </div>

             {/* Modal for this specific doc upload */}
            {editingDocument === doc.name && (
              <div className="fixed inset-0 bg-gunmetal-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="px-6 py-4 bg-alabaster-grey-50 border-b border-platinum-200 flex justify-between items-center">
                        <h3 className="font-bold text-gunmetal-900">Upload {doc.name}</h3>
                         <button 
                            onClick={() => setEditingDocument(null)}
                            className="text-slate-grey-400 hover:text-gunmetal-900 transition-colors"
                        >
                            <FaTimesCircle size={20} />
                        </button>
                    </div>
                  
                  <div className="p-6">
                       <div className="border-2 border-dashed border-platinum-300 rounded-xl p-8 text-center hover:bg-alabaster-grey-50 transition-colors relative mb-6">
                            <input
                                type="file"
                                accept={doc.type === "pdf" ? "application/pdf" : "image/*"}
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                             <div className="pointer-events-none">
                                {selectedFile ? (
                                    <div className="flex flex-col items-center">
                                        {doc.type === 'pdf' ?  <FaFileAlt size={32} className="text-gunmetal-400 mb-2"/> : <FaImage size={32} className="text-gunmetal-400 mb-2"/>}
                                        <span className="text-gunmetal-900 font-bold mb-1 text-sm">{selectedFile.name}</span>
                                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Ready to Upload</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-grey-500">
                                        <FaFileUpload className="text-3xl mb-3 text-platinum-400" />
                                        <span className="text-sm font-medium text-gunmetal-600">Tap to browse</span>
                                        <span className="text-xs mt-1 text-slate-grey-400 uppercase tracking-wide">{doc.type === 'pdf' ? 'PDF Only' : 'Images Only'}</span>
                                    </div>
                                )}
                            </div>
                       </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setEditingDocument(null)}
                          className="px-5 py-2.5 bg-white border border-platinum-200 rounded-lg text-slate-grey-600 font-bold text-sm hover:bg-alabaster-grey-50 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpload(doc.name)}
                          disabled={!selectedFile}
                          className={`px-5 py-2.5 bg-gunmetal-900 text-white rounded-lg font-bold text-sm transition-all shadow-lg ${!selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gunmetal-800 shadow-gunmetal-500/20'}`}
                        >
                          Confirm Upload
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {viewingDocument && (
        <DocumentViewerModal
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
          fileUrl={viewingDocument.url}
          fileName={viewingDocument.name}
          fileType={viewingDocument.type}
        />
      )}
    </div>
  );
};

export default Documents;
